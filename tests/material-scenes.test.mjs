import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { materialScenes, sceneImage } from '../src/data/materialScenes.js';
import { mineralMaterials } from '../src/data/mineralMaterials.js';
import { collectionProducts } from '../src/data/materialCollections.js';
for (const id of ['exposed-concrete', 'microcement']) {
  test(`${id}: three shipped architectural images are visible in static HTML and used by the library`, async () => {
    const scenes = materialScenes[id];
    assert.equal(scenes.length, 3);
    assert.equal(new Set(scenes.map(x => x.src)).size, 3);
    const material = mineralMaterials.find(x => x.id === id);
    const html = await readFile(`dist${material.path}index.html`, 'utf8');
    for (const scene of scenes) {
      assert.ok((await stat(`public${scene.src}`)).size > 100000);
      assert.ok(html.includes(scene.src));
      for (const finish of material.finishes) {
        const path = sceneImage(scene, material, finish);
        assert.ok((await stat(`public${path}`)).size > 100000, path);
      }
    }
    assert.equal(collectionProducts.find(x => x.id === id).scene, scenes[0].src);
  });
}
