import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';

const manifestPath = resolve(process.argv[2] || '');
if (!process.argv[2]) throw new Error('Pass the manifest.json path.');
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const folder = dirname(manifestPath);
const chunks = [];
for (const part of manifest.parts) {
  const bytes = await readFile(join(folder, part.file));
  const hash = createHash('sha256').update(bytes).digest('hex');
  if (bytes.length !== part.size || hash !== part.sha256) throw new Error(`Part verification failed: ${part.file}`);
  chunks.push(bytes);
}
const output = resolve(process.argv[3] || join(folder, manifest.originalFile));
const combined = Buffer.concat(chunks);
if (combined.length !== manifest.originalSize || createHash('sha256').update(combined).digest('hex') !== manifest.originalSha256) {
  throw new Error('Combined release verification failed.');
}
await writeFile(output, combined);
console.log(`Restored and verified ${output}`);
