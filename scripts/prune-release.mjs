import { rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const unusedReleaseAssets = [
  'dist/assets/film/site-cinematic-score-v2.wav',
];

for (const relativePath of unusedReleaseAssets) {
  await rm(path.join(root, relativePath), { force: true });
}

console.log(`Pruned ${unusedReleaseAssets.length} unused release asset(s).`);
