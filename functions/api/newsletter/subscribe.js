import { configured, digest, emailPattern, randomToken, response, sendEmail, siteOrigin } from './_core.js';

export async function onRequestPost({ request, env }) {
  if (!configured(env)) return response({ error: 'newsletter-unavailable' }, 503);
  const origin = request.headers.get('origin');
  if (origin && origin !== siteOrigin(request)) return response({ error: 'forbidden' }, 403);
  let payload;
  try {
    const body = await request.text();
    if (body.length > 2048) return response({ error: 'invalid-request' }, 413);
    payload = JSON.parse(body);
  } catch { return response({ error: 'invalid-request' }, 400); }
  const email = String(payload?.email || '').trim().toLowerCase();
  if (!emailPattern.test(email) || email.length > 254 || payload?.consent !== true) return response({ error: 'invalid-request' }, 400);
  if (payload?.website) return response({ status: 'check-email' });

  const emailHash = await digest(email);
  const active = await env.NEWSLETTER_KV.get(`active:${emailHash}`);
  if (active) return response({ status: 'check-email' });
  const throttleKey = `throttle:${emailHash}`;
  if (await env.NEWSLETTER_KV.get(throttleKey)) return response({ status: 'check-email' });

  const token = randomToken();
  const tokenHash = await digest(token);
  await env.NEWSLETTER_KV.put(`pending:${tokenHash}`, JSON.stringify({ email, requestedAt: new Date().toISOString() }), { expirationTtl: 86400 });
  const confirmUrl = `${siteOrigin(request)}/api/newsletter/confirm?token=${token}`;
  try {
    await sendEmail(env, email, 'Confirm your World Arch Journal subscription', `Please confirm your subscription to occasional World Arch Journal architecture emails:\n\n${confirmUrl}\n\nThis link expires in 24 hours. If you did not request this, ignore this message.`);
  } catch {
    await env.NEWSLETTER_KV.delete(`pending:${tokenHash}`);
    return response({ error: 'email-unavailable' }, 503);
  }
  await env.NEWSLETTER_KV.put(throttleKey, '1', { expirationTtl: 300 });
  return response({ status: 'check-email' });
}
