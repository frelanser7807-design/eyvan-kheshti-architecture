import { configured, digest, html, randomToken, tokenPattern } from './_core.js';

export async function onRequestGet({ request }) {
  const token = new URL(request.url).searchParams.get('token') || '';
  if (!tokenPattern.test(token)) return html('This confirmation link is invalid or has expired.', 400);
  return new Response(`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Confirm subscription | World Arch Journal</title><main style="max-width:36rem;margin:12vh auto;padding:2rem;font:18px/1.6 system-ui"><h1>Confirm your subscription</h1><p>Receive occasional World Arch Journal architecture emails. You can unsubscribe at any time.</p><form method="post"><input type="hidden" name="token" value="${token}"><button type="submit">Confirm subscription</button></form></main></html>`, { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' } });
}

export async function onRequestPost({ request, env }) {
  if (!env.NEWSLETTER_KV) return html('Newsletter confirmation is temporarily unavailable.', 503);
  const form = await request.formData();
  const token = String(form.get('token') || '');
  if (!tokenPattern.test(token)) return html('This confirmation link is invalid or has expired.', 400);
  const tokenHash = await digest(token);
  const pending = await env.NEWSLETTER_KV.get(`pending:${tokenHash}`, 'json');
  if (!pending?.email) return html('This confirmation link is invalid or has expired.', 400);
  const emailHash = await digest(pending.email);
  const unsubscribeToken = randomToken();
  await env.NEWSLETTER_KV.put(`active:${emailHash}`, JSON.stringify({ email: pending.email, confirmedAt: new Date().toISOString(), unsubscribeToken }));
  await env.NEWSLETTER_KV.put(`unsubscribe:${await digest(unsubscribeToken)}`, emailHash);
  await env.NEWSLETTER_KV.delete(`pending:${tokenHash}`);
  return html('Your subscription is confirmed. You can unsubscribe using the link included in every journal email.');
}
