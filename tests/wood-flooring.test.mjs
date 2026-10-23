import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { woodFinishes, woodScenes, woodRoot } from '../src/data/woodFlooring.js';
import { collectionProducts, collectionRoute } from '../src/data/materialCollections.js';

const root = new URL('../public/', import.meta.url);
const exists = async path => { try { await stat(new URL(path, root)); return true; } catch { return false; } };
const dist = process.env.MATERIAL_TEST_DIST;

test('wood flooring exposes five real scanned finishes in three rooms', async () => {
  assert.deepEqual(woodFinishes.map(f => f.id), ['european-oak', 'nordic-light-oak', 'smoked-oak', 'honey-parquet', 'reclaimed-grey']);
  assert.deepEqual(woodScenes.map(s => s.id), ['living', 'bedroom', 'hallway']);
  const product = collectionProducts.find(item => item.id === 'scanned-wood-flooring');
  assert.ok(product);
  assert.equal(product.path, '/materials/wood/wood-flooring/scanned-wood-flooring/');
  assert.equal(collectionRoute('/materials/category/wood/wood-flooring/').products[0], product);
  assert.equal(await exists(`.${product.image}`), true);
  assert.equal(await exists(`.${product.scene}`), true);
  for (const finish of woodFinishes) {
    assert.equal(finish.nativeRes, 8192);
    assert.equal(finish.source.library, 'Poly Haven');
    assert.match(finish.source.license, /CC0/);
    assert.ok(finish.drive4k === null || finish.drive4k.startsWith('https://'));
    assert.ok(finish.drive16k === null || finish.drive16k.startsWith('https://'));
    for (const scene of woodScenes) assert.equal(await exists(`.${woodRoot}scenes/${scene.id}-${finish.id}.webp`), true, `${scene.id}-${finish.id}`);
    for (const extra of ['preview.webp', 'macro.webp', 'viewer-basecolor.webp', 'viewer-normal.webp', 'viewer-roughness.webp', 'manifest.json'])
      assert.equal(await exists(`.${woodRoot}${finish.id}/${extra}`), true, `${finish.id}/${extra}`);
  }
});

test('wood flooring manifests document the genuine scan packs and both Drive tiers', async () => {
  for (const finish of woodFinishes) {
    const manifest = JSON.parse(await readFile(new URL(`.${woodRoot}${finish.id}/manifest.json`, root), 'utf8'));
    assert.deepEqual(manifest.resolution, [4096, 4096]);
    assert.deepEqual(manifest.nativeResolution, [8192, 8192]);
    assert.match(manifest.source.license, /CC0/);
    assert.match(manifest.method, /16K edition/);
    assert.match(manifest.method, /no new surface detail is invented/);
    assert.match(manifest.method, /Google Drive/);
    assert.deepEqual(Object.keys(manifest.sha256).sort(), Object.values(finish.maps).sort());
    for (const hash of Object.values(manifest.sha256)) assert.match(hash, /^[0-9a-f]{64}$/);
  }
});

test('wood flooring SEO page states the studies, tiers and licence honestly', async () => {
  if (!dist) return;
  const html = await readFile(`${dist}/materials/wood/wood-flooring/scanned-wood-flooring/index.html`, 'utf8');
  for (const phrase of ['Five finish studies', 'living room', 'bedroom', 'hallway', '4K pack', '16K edition', 'Google Drive', 'CC0']) assert.match(html, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'), phrase);
  assert.doesNotMatch(html, /Native 8K/);
  assert.doesNotMatch(html, /procedural/i);
});
