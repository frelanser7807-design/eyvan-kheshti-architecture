import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../functions/newsletter-worker.js';
import { canonicalRedirect } from '../functions/lib/site-host.js';
import { searchRobots } from '../functions/lib/search-robots.js';

test('the production Worker serves explicit search permissions without depending on assets', async () => {
  const response = await worker.fetch(new Request('https://worldarchjournal.com/robots.txt'), {});
  assert.equal(response.status, 200);
  assert.equal(await response.text(), searchRobots);
  assert.match(searchRobots, /User-agent: OAI-SearchBot\nAllow: \//);
  assert.match(searchRobots, /User-agent: ChatGPT-User\nAllow: \//);
  const head = await worker.fetch(new Request('https://worldarchjournal.com/robots.txt', { method: 'HEAD' }), {});
  assert.equal(await head.text(), '');
});

test('production aliases redirect permanently to the same page and query on .com', () => {
  for (const host of ['www.worldarchjournal.com', 'world-arch-journal.pages.dev', 'world-arch-journal-by-farnaz.netlify.app']) {
    for (const method of ['GET', 'HEAD']) {
      const result = canonicalRedirect(new Request(`https://${host}/articles/example/?utm_source=test`, { method }));
      assert.equal(result.status, 301);
      assert.equal(result.headers.get('Location'), 'https://worldarchjournal.com/articles/example/?utm_source=test');
    }
  }
  assert.equal(canonicalRedirect(new Request('http://worldarchjournal.com/a/')).headers.get('Location'), 'https://worldarchjournal.com/a/');
});

test('the actual deployed worker redirects before fetching assets', async () => {
  const result = await worker.fetch(new Request('https://world-arch-journal.pages.dev/magazine/'), {
    ASSETS: { fetch() { throw new Error('must not fetch assets before redirect'); } },
  });
  assert.equal(result.status, 301);
  assert.equal(result.headers.get('Location'), 'https://worldarchjournal.com/magazine/');
});

test('preview HTML is crawlable but noindex, while canonical responses retain their policies', async () => {
  const env = { ASSETS: { fetch: async () => new Response('page', { headers: { 'X-Robots-Tag': 'noindex, nofollow' } }) } };
  const preview = await worker.fetch(new Request('https://preview-123.world-arch-journal.pages.dev/a/'), env);
  assert.equal(preview.status, 200);
  assert.equal(preview.headers.get('X-Robots-Tag'), 'noindex, follow');
  const production = await worker.fetch(new Request('https://worldarchjournal.com/downloads/articles/a.pdf'), env);
  assert.equal(production.headers.get('X-Robots-Tag'), 'noindex, nofollow');
  assert.equal(await production.text(), 'page');
});

test('canonical host, local development, and POST bodies are never redirected', () => {
  for (const url of ['https://worldarchjournal.com/a/', 'http://localhost:4173/', 'https://preview-123.world-arch-journal.pages.dev/a/']) {
    assert.equal(canonicalRedirect(new Request(url)), null);
  }
  assert.equal(canonicalRedirect(new Request('https://www.worldarchjournal.com/api/newsletter/subscribe', { method: 'POST', body: 'test' })), null);
});
