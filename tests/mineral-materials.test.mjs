import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { mineralMaterials, mineralRoot, mineralByPath } from '../src/data/mineralMaterials.js';
import { collectionProducts } from '../src/data/materialCollections.js';
import { materialCollectionSitemap } from '../scripts/material-collection-pages.mjs';

for (const material of mineralMaterials) {
  test(`${material.id}: page, catalog, sitemap and all five verified 4K packs agree`, async () => {
    assert.equal(mineralByPath(material.path), material);
    assert.ok(collectionProducts.some((item) => item.path === material.path));
    assert.ok(materialCollectionSitemap.some((item) => item.pathname === material.path));
    const html = await readFile(`dist${material.path}index.html`, 'utf8');
    assert.ok(html.includes(`rel="canonical" href="https://worldarchjournal.com${material.path}"`));
    assert.ok(html.includes(material.description));
    assert.ok(html.includes('4096 × 4096'));
    for (const finish of material.finishes) {
      const manifest = JSON.parse(await readFile(`public${mineralRoot}${material.id}/${finish.id}/manifest.json`, 'utf8'));
      assert.equal(manifest.files.length, 4);
      for (const file of manifest.files) {
        const data = await readFile(`public${file.url}`);
        assert.equal(data.subarray(1,4).toString(), 'PNG');
        assert.equal(data.readUInt32BE(16), 4096);
        assert.equal(data.readUInt32BE(20), 4096);
        assert.equal(createHash('sha256').update(data).digest('hex'), file.sha256);
        assert.ok(data.length < 25 * 1024 * 1024, `${file.name} exceeds the hosting file limit`);
        if (file.name.startsWith('height')) assert.equal(data[24], 16);
      }
    }
  });
  test(`${material.id}: every 16K edition reconstructs verified 16384px PNGs from hosting-safe parts`, async () => {
    for (const finish of material.finishes) {
      const manifest = JSON.parse(await readFile(`public${mineralRoot}${material.id}/${finish.id}/manifest-16k.json`, 'utf8'));
      assert.deepEqual(manifest.resolution, [16384,16384]);
      assert.deepEqual(manifest.source_repeats, [4,4]);
      assert.match(manifest.edition, /no additional scan detail/);
      for (const file of manifest.files) {
        const hash = createHash('sha256');
        let count = 0, first = true;
        for (const part of file.parts) {
          const data = await readFile(`public${part.url}`);
          assert.ok(data.length <= 8 * 1024 * 1024);
          assert.equal(createHash('sha256').update(data).digest('hex'), part.sha256);
          if (first) {
            assert.equal(data.subarray(1,4).toString(), 'PNG');
            assert.equal(data.readUInt32BE(16), 16384);
            assert.equal(data.readUInt32BE(20), 16384);
            first = false;
          }
          hash.update(data); count += data.length;
        }
        assert.equal(count, file.bytes);
        assert.equal(hash.digest('hex'), file.sha256);
      }
    }
  });
}
