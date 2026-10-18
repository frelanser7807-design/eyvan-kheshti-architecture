import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { articles } from '../src/data/articles.js';

const selected = articles.filter((article) => article.inlineVisuals);
for (const article of selected) {
  test(`${article.slug}: crawler-visible illustrations match their reading sections`, async () => {
    const html = await readFile(new URL(`../dist/articles/${article.slug}/index.html`, import.meta.url), 'utf8');
    assert.equal((html.match(/<h1\b/g) || []).length, 1);
    assert.ok(html.includes(`rel="canonical" href="https://worldarchjournal.com/articles/${article.slug}/"`));
    assert.ok(article.contentHtml.replace(/<[^>]+>/g, ' ').split(/\s+/).length >= 1500);
    assert.ok(article.seoTitle.length <= 60);
    assert.ok(article.metaDescription.length >= 140 && article.metaDescription.length <= 160);
    for (const visual of article.visuals) {
      await access(new URL(`../public${visual.src}`, import.meta.url));
      const imageAt = html.indexOf(`src="${visual.src}"`);
      assert.ok(imageAt > html.indexOf(`<h2 id="${article.toc[visual.afterSection][0]}"`));
      const next = article.toc[visual.afterSection + 1];
      if (next) assert.ok(imageAt < html.indexOf(`<h2 id="${next[0]}"`));
      assert.equal(html.split(`src="${visual.src}"`).length - 1, 1);
    }
    for (const match of html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) JSON.parse(match[1]);
    const sitemap = await readFile(new URL('../dist/article-sitemap.xml', import.meta.url), 'utf8');
    assert.ok(sitemap.includes(`/articles/${article.slug}/`));
    for (const match of article.contentHtml.matchAll(/href="(\/[^"#]+)"/g)) {
      await access(new URL(`../dist${match[1]}index.html`, import.meta.url));
    }
  });
}
