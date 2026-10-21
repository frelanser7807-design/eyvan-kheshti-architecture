import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { articleClientBundle } from '../scripts/lib/article-client-bundle.mjs';
import { articles } from '../src/data/articles.js';

test('browser catalog omits article bodies and every published article has an exact, content-versioned payload', async () => {
  const plugin = articleClientBundle();
  const source = await readFile('src/data/articles.js', 'utf8');
  const result = plugin.transform(source, '/project/src/data/articles.js');
  const context = {};
  vm.runInNewContext(result.code.replaceAll('export ', '') + '\nglobalThis.catalog = articles;', context);
  const emitted = [];
  plugin.generateBundle.call({ emitFile: (file) => emitted.push(file) });
  assert.equal(emitted.length, articles.filter((article) => article.published).length);
  for (const original of articles.filter((article) => article.published)) {
    const metadata = context.catalog.find((article) => article.slug === original.slug);
    assert.equal(metadata.contentHtml, undefined);
    assert.match(metadata.contentUrl, /-[a-f0-9]{12}\.json$/);
    const payload = emitted.find((file) => `/${file.fileName}` === metadata.contentUrl);
    assert.deepEqual(JSON.parse(payload.source), original);
  }
  assert.equal(plugin.transform('unchanged', '/project/src/data/other.js'), null);
});

test('modern villa FAQ is present in crawler-visible HTML and matches its schema', async () => {
  const article = articles.find((article) => article.slug.startsWith('modern-villa-'));
  const html = await readFile(`dist/articles/${article.slug}/index.html`, 'utf8');
  const blocks = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
  const faq = blocks.flatMap((block) => block['@graph'] || [block]).find((block) => block['@type'] === 'FAQPage');
  assert.equal(faq.mainEntity.length, article.faq.length);
  for (const entry of article.faq) {
    assert.ok(html.includes(`<summary>${entry.question}</summary>`));
    assert.ok(html.includes(`<p>${entry.answer}</p>`));
  }
});
