import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { articles } from '../src/data/articles.js';
import { createArticleRss, withArticleFeedLink, articleFeedLink } from '../scripts/lib/article-rss.mjs';

const sample = { slug: 'example', title: 'Light & shade <guide>', excerpt: 'A "quoted" architect\'s guide & analysis.', publishedAt: '2026-09-16', published: true };

test('RSS preserves text as XML and uses stable absolute permalinks and RFC-822 dates', () => {
  const xml = createArticleRss([sample, { ...sample, slug: 'draft', published: false }]);
  assert.match(xml, /<rss version="2\.0"/);
  assert.ok(xml.includes('<title>Light &amp; shade &lt;guide&gt;</title>'));
  assert.ok(xml.includes('<description>A &quot;quoted&quot; architect&apos;s guide &amp; analysis.</description>'));
  assert.ok(xml.includes('<pubDate>Wed, 16 Sep 2026 00:00:00 GMT</pubDate>'));
  assert.ok(xml.includes('<guid isPermaLink="true">https://worldarchjournal.com/articles/example/</guid>'));
  assert.ok(!xml.includes('/draft/'));
  assert.equal(createArticleRss([sample]), xml, 'A rebuild must not change dates or GUIDs');
});

test('RSS fails clearly for missing dates, impossible dates and duplicate public URLs', () => {
  for (const publishedAt of [undefined, 'not-a-date', '2026-02-30']) assert.throws(() => createArticleRss([{ ...sample, publishedAt }]), /valid publishedAt/);
  assert.throws(() => createArticleRss([sample, sample]), /Duplicate article URL/);
});

test('discovery injection is idempotent and retains the separate newsletter feed', () => {
  const newsletter = '<link rel="alternate" type="application/rss+xml" title="Briefing" href="https://worldarchjournal.com/newsletter/feed.xml" />';
  const html = `<html><head>${newsletter}${articleFeedLink}</head><body></body></html>`;
  const result = withArticleFeedLink(html);
  assert.equal(withArticleFeedLink(result), result);
  assert.ok(result.includes(newsletter));
  assert.equal(result.split(articleFeedLink).length - 1, 1);
});

test('built RSS contains every published article once, ordered newest first', async () => {
  const xml = await readFile(new URL('../dist/rss.xml', import.meta.url), 'utf8');
  const sitemap = await readFile(new URL('../dist/sitemap.xml', import.meta.url), 'utf8');
  assert.equal(xml, createArticleRss(articles));
  assert.ok(xml.includes('<title>World Arch Journal</title>'));
  assert.ok(xml.includes('<link>https://worldarchjournal.com/</link>'));
  assert.ok(xml.includes('<description>Practical architecture guides — facades, materials, passive cooling, daylight, villa design.</description>'));
  assert.ok(xml.includes('<language>en-us</language>'));
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((match) => match[1]);
  const published = articles.filter((article) => article.published);
  assert.equal(items.length, published.length);
  for (const article of published) {
    const url = `https://worldarchjournal.com/articles/${article.slug}/`;
    const item = items.filter((entry) => entry.includes(`<link>${url}</link>`));
    assert.equal(item.length, 1, article.slug);
    assert.ok(sitemap.includes(`<loc>${url}</loc>`));
    for (const name of ['title', 'description', 'pubDate', 'guid']) assert.match(item[0], new RegExp(`<${name}(?: [^>]*)?>[^<]+</${name}>`));
  }
  const dates = items.map((item) => Date.parse(item.match(/<pubDate>(.*?)<\/pubDate>/)[1]));
  assert.ok(dates.every((date, index) => Number.isFinite(date) && (!index || dates[index - 1] >= date)));
});

test('every built HTML head advertises the article feed, including standalone pages', async () => {
  let checked = 0;
  async function check(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const url = new URL(entry.name + (entry.isDirectory() ? '/' : ''), directory);
      if (entry.isDirectory()) await check(url);
      else if (entry.name.endsWith('.html')) {
        const html = await readFile(url, 'utf8');
        const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1] || '';
        assert.equal(head.split(articleFeedLink).length - 1, 1, url.pathname);
        checked++;
      }
    }
  }
  await check(new URL('../dist/', import.meta.url));
  assert.ok(checked > 100, `Expected the complete generated site, checked ${checked} pages`);
});
