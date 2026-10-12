const encoder = new TextEncoder();

export const emailPattern = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,}$/;
export const tokenPattern = /^[a-f0-9]{64}$/;

export function response(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}

export function html(message, status = 200) {
  const safe = String(message).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
  return new Response(`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>World Arch Journal newsletter</title><main style="max-width:36rem;margin:12vh auto;padding:2rem;font:18px/1.6 system-ui;color:#222"><a href="/">WORLD ARCH JOURNAL</a><h1>Newsletter</h1><p>${safe}</p><a href="/">Return to site</a></main></html>`, {
    status,
    headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' },
  });
}

export function configured(env) {
  return Boolean(env.NEWSLETTER_KV && env.RESEND_API_KEY && env.NEWSLETTER_FROM_EMAIL);
}

export async function digest(value) {
  const bytes = await crypto.subtle.digest('SHA-256', encoder.encode(value));
  return Array.from(new Uint8Array(bytes), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export function randomToken() {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export async function sendEmail(env, to, subject, text) {
  const result = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' },
    body: JSON.stringify({ from: env.NEWSLETTER_FROM_EMAIL, to: [to], subject, text }),
  });
  if (!result.ok) throw new Error(`email-provider-${result.status}`);
}

export function siteOrigin(request) {
  return new URL(request.url).origin;
}
