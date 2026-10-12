import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { basename, dirname, join, resolve } from 'node:path';

const input = resolve(process.argv[2] || '');
if (!process.argv[2]) throw new Error('Pass the release file path.');
const chunkSize = Number(process.argv[3] || 7_000_000);
const output = resolve(process.argv[4] || join(dirname(input), `${basename(input)}-parts`));
const bytes = await readFile(input);
await mkdir(output, { recursive: true });
const parts = [];
for (let offset = 0, index = 1; offset < bytes.length; offset += chunkSize, index += 1) {
  const part = bytes.subarray(offset, Math.min(offset + chunkSize, bytes.length));
  const file = `${basename(input)}.part${String(index).padStart(2, '0')}`;
  await writeFile(join(output, file), part);
  parts.push({ file, size: part.length, sha256: createHash('sha256').update(part).digest('hex') });
}
const manifest = {
  version: 1,
  originalFile: basename(input),
  originalSize: bytes.length,
  originalSha256: createHash('sha256').update(bytes).digest('hex'),
  chunkSize,
  parts,
};
await writeFile(join(output, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
console.log(`Split ${basename(input)} into ${parts.length} verified parts at ${output}`);
