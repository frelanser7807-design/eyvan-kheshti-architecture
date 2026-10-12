import { digest, html, tokenPattern } from './_core.js';

export async function onRequestGet({ request }) {
  const token = new URL(request.url).searchParams.get('token') || '';
  if (!tokenPattern.test(token)) return html('This unsubscribe link is invalid.', 400);
  return new Response(`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Unsubscribe | World Arch Journal</title><main style="max-width:36rem;margin:12vh auto;padding:2rem;font:18px/1.6 system-ui"><h1>Unsubscribe</h1><p>Stop receiving World Arch Journal emails?</p><form method="post"><input type="hidden" name="token" value="${token}"><button type="submit">Confirm unsubscribe</button></form></main></html>`, { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' } });
}

export async function onRequestPost({ request, env }) {
  if (!env.NEWSLETTER_KV) return html('Unsubscribe is temporarily unavailable.', 503);
  const form = await request.formData();
  const token = String(form.get('token') || '');
  if (!tokenPattern.test(token)) return html('This unsubscribe link is invalid.', 400);
  const tokenHash = await digest(token);
  const emailHash = await env.NEWSLETTER_KV.get(`unsubscribe:${tokenHash}`);
  if (emailHash) {
    await env.NEWSLETTER_KV.delete(`active:${emailHash}`);
    await env.NEWSLETTER_KV.delete(`unsubscribe:${tokenHash}`);
  }
  return html('You have been unsubscribed.');
}
