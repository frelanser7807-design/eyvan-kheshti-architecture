import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { newsletterIssues, editorialArticles, editorialPath } from '../src/data/newsletters.js';

const output = new URL('../dist/', import.meta.url);
const read = (name) => readFile(new URL(name, output), 'utf8');

test('public archive links each issue, editorial information and a real RSS feed', async () => {
  const archive = await read('newsletter/index.html');
  for (const target of ['/editorial-policy/', '/editorial-team/', '/newsletter/feed.xml', ...newsletterIssues.map((issue) => `/newsletter/${issue.slug}/`)]) {
    assert.ok(archive.includes(`href="${target}"`), `Missing archive link: ${target}`);
  }
  for (const issue of newsletterIssues) {
    assert.ok(archive.includes(`src="${issue.image}"`), `Missing archive image: ${issue.image}`);
    assert.ok(archive.includes(issue.analysisSummary), `Missing archive analysis: ${issue.slug}`);
  }
  const feed = await read('newsletter/feed.xml');
  assert.match(feed, /^<\?xml/);
  assert.match(feed, /<rss\b/);
  assert.equal((feed.match(/<item>/g) || []).length, newsletterIssues.length);
  for (const issue of newsletterIssues) assert.ok(feed.includes(`/newsletter/${issue.slug}/`));
  for (const issue of newsletterIssues) if (issue.feedPublishedAt) {
    assert.ok(feed.includes(`<pubDate>${new Date(issue.feedPublishedAt).toUTCString()}</pubDate>`));
    assert.ok(Date.parse(issue.feedPublishedAt) <= Date.now(), 'RSS must not invent a future publication time');
  }
});

test('each published issue exposes sources, truthful metadata and visual credit without JavaScript', async () => {
  for (const issue of [...newsletterIssues, ...editorialArticles]) {
    const html = await read(`${editorialPath(issue).slice(1)}index.html`);
    assert.ok(html.includes(issue.author));
    assert.ok(html.includes(`href="${issue.authorUrl}"`));
    assert.ok(html.includes(`<time datetime="${issue.publishedAt}">`));
    assert.ok(html.includes(`<figcaption>${issue.imageCredit}`));
    if (issue.imageAttribution) {
      assert.ok(html.includes(issue.imageAttribution.sourceUrl));
      assert.ok(html.includes(issue.imageAttribution.licenseUrl));
    }
    if (issue.editorialAnalysis) {
      assert.ok(html.includes('id="editorial-analysis"'));
      assert.ok(html.includes(issue.editorialAnalysis.thesis));
      assert.ok(html.includes('OUR ANALYSIS'));
    }
    for (const section of issue.sections) if (section.photo) {
      assert.ok(html.includes(`src="${section.photo.src}"`));
      assert.ok(html.includes(section.photo.sourceUrl));
      assert.ok(html.includes(section.photo.licenseUrl));
    }
    assert.ok(html.includes('Contact the publisher'));
    for (const source of issue.sources) assert.ok(html.includes(source.url), `Missing source: ${source.url}`);
    const schemaDocument = JSON.parse(html.match(/<script type="application\/ld\+json" data-static-schema>(.*?)<\/script>/s)[1]);
    const schema = schemaDocument['@graph']?.find((node) => ['Article', 'NewsArticle'].includes(node['@type'])) || schemaDocument;
    assert.equal(schema.author.name, issue.author);
    assert.equal(schema.datePublished.slice(0, 10), issue.publishedAt);
    assert.ok(schema.author.url.endsWith(issue.authorUrl));
  }
});

test('dated news and analysis have distinct archives, canonicals and permanent legacy redirects', async () => {
  const archive = await read('newsletter/index.html');
  const magazine = await read('magazine/index.html');
  const analysis = await read('magazine/analysis/index.html');
  const redirects = await read('_redirects');
  const sitemap = await read('sitemap.xml');
  for (const entry of editorialArticles) {
    assert.ok(!archive.includes(`href="/newsletter/${entry.slug}/"`));
    assert.ok(analysis.includes(`href="${editorialPath(entry)}"`));
    assert.ok(magazine.includes(`href="${editorialPath(entry)}"`));
    assert.ok(redirects.includes(`/newsletter/${entry.slug}/ ${editorialPath(entry)} 301`));
    assert.ok(sitemap.includes(editorialPath(entry)));
    assert.ok(!sitemap.includes(`<loc>https://worldarchjournal.com/newsletter/${entry.slug}/</loc>`));
  }
  for (const entry of newsletterIssues) {
    const html = await read(`${editorialPath(entry).slice(1)}index.html`);
    assert.ok(html.includes(`rel="canonical" href="https://worldarchjournal.com${editorialPath(entry)}"`));
    for (const section of entry.sections.filter((item) => item.kind === 'news')) {
      assert.ok(html.includes(`Source published: <time datetime="${section.sourcePublishedAt}">`));
      const age = (Date.parse(entry.publishedAt) - Date.parse(section.sourcePublishedAt)) / 86400000;
      assert.ok(age >= 0 && age <= 3);
    }
    assert.ok(html.includes(entry.imageCredit), 'Issue must display its own image credit');
  }
});

test('publisher and correction policy are actual pages, not a home-page fallback', async () => {
  assert.match(await read('editorial-policy/index.html'), /Editorial Standards &amp; Corrections/);
  assert.match(await read('editorial-team/index.html'), /About World Arch Journal/);
  const sitemap = await read('sitemap.xml');
  assert.ok(sitemap.includes('/editorial-team/'));
  assert.ok(sitemap.includes('/editorial-policy/'));
});
