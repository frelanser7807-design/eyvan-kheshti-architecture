import test from 'node:test';
import assert from 'node:assert/strict';
import { onRequestPost as subscribe } from '../functions/api/newsletter/subscribe.js';
import { onRequestPost as confirm } from '../functions/api/newsletter/confirm.js';
import { onRequestPost as unsubscribe } from '../functions/api/newsletter/unsubscribe.js';

function mockStore() {
  const records = new Map();
  return {
    records,
    async get(key, format) { const value = records.get(key); return format === 'json' && value ? JSON.parse(value) : value ?? null; },
    async put(key, value) { records.set(key, value); },
    async delete(key) { records.delete(key); },
  };
}

test('newsletter requires configuration and consent', async () => {
  const request = new Request('https://worldarchjournal.com/api/newsletter/subscribe', { method: 'POST', body: JSON.stringify({ email: 'reader@example.com', consent: true }) });
  assert.equal((await subscribe({ request, env: {} })).status, 503);
  const env = { NEWSLETTER_KV: mockStore(), RESEND_API_KEY: 'test', NEWSLETTER_FROM_EMAIL: 'World Arch Journal <news@worldarchjournal.com>' };
  const withoutConsent = new Request(request.url, { method: 'POST', body: JSON.stringify({ email: 'reader@example.com' }) });
  assert.equal((await subscribe({ request: withoutConsent, env })).status, 400);
});

test('opt-in email, confirmation and unsubscribe complete the lifecycle', async () => {
  const store = mockStore();
  const env = { NEWSLETTER_KV: store, RESEND_API_KEY: 'test', NEWSLETTER_FROM_EMAIL: 'World Arch Journal <news@worldarchjournal.com>' };
  const sent = [];
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (_url, options) => { sent.push(JSON.parse(options.body)); return new Response('{}', { status: 200 }); };
  try {
    const request = new Request('https://worldarchjournal.com/api/newsletter/subscribe', { method: 'POST', headers: { origin: 'https://worldarchjournal.com' }, body: JSON.stringify({ email: 'Reader@Example.com', consent: true }) });
    assert.equal((await subscribe({ request, env })).status, 200);
    assert.equal(sent.length, 1);
    assert.equal(sent[0].to[0], 'reader@example.com');
    const token = sent[0].text.match(/token=([a-f0-9]{64})/)?.[1];
    assert.ok(token);
    assert.equal((await confirm({ request: new Request('https://worldarchjournal.com/api/newsletter/confirm', { method: 'POST', body: new URLSearchParams({ token }) }), env })).status, 200);
    assert.equal([...store.records.keys()].filter((key) => key.startsWith('active:')).length, 1);
    const active = JSON.parse([...store.records].find(([key]) => key.startsWith('active:'))[1]);
    assert.equal((await unsubscribe({ request: new Request('https://worldarchjournal.com/api/newsletter/unsubscribe', { method: 'POST', body: new URLSearchParams({ token: active.unsubscribeToken }) }), env })).status, 200);
    assert.equal([...store.records.keys()].filter((key) => key.startsWith('active:')).length, 0);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
