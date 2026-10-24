import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { ajorbaft } from '../src/data/ajorbaft.js';

test('Ajorbaft has crawlable content, canonical metadata, breadcrumbs and no paid download links', async () => {
  const html = await readFile('dist/projects/ajorbaft/index.html', 'utf8');
  assert.match(html, /<h1>Ajorbaft/);
  assert.match(html, /rel="canonical" href="https:\/\/worldarchjournal.com\/projects\/ajorbaft\/"/);
  assert.match(html, /Brick|brick/);
  assert.match(html, /BreadcrumbList/);
  assert.match(html, /professional verification/);
  assert.doesNotMatch(html, /href="[^"]*\.(?:pdf|zip)"/i);
  for (const image of [{ src: ajorbaft.cover }, ...ajorbaft.images]) {
    assert.ok(html.includes(image.src));
    await access(`dist${image.src}`);
  }
});

test('Projects archive and sitemap include both studio projects without removing existing tours', async () => {
  const archive = await readFile('dist/projects/index.html', 'utf8');
  const sitemap = await readFile('dist/sitemap.xml', 'utf8');
  for (const path of ['/projects/ajorbaft/', '/projects/atlas-villa/', '/projects/the-voids-villa/', '/projects/narbon-villa/']) {
    assert.ok(archive.includes(path), `Archive is missing ${path}`);
    assert.ok(sitemap.includes(path), `Sitemap is missing ${path}`);
  }
});

