import fs from 'node:fs/promises';
import path from 'node:path';
import zlib from 'node:zlib';

// Build artifact for the already approved Composio route. Only compiled PUBLIC
// release files are transferred; .env and other local credentials are excluded.
const root = path.resolve(process.env.DIST_DIR || 'dist');
const manifest = JSON.parse(await fs.readFile('.cloudflare-upload-manifest.json', 'utf8'));
const releaseAssetPrefixes = [
  '/assets/articles/bird-safe-facade-design/',
  '/assets/articles/inclusive-wayfinding-public-buildings/',
  '/assets/editorial/newsletter/briefing-2026-10-11',
];
const releaseDownload = '/downloads/newsletter/architecture-briefing-2026-10-11.pdf';
const included = Object.entries(manifest).filter(([name]) =>
  /\.(html|js|mjs|css|json|xml|txt)$/.test(name) ||
  releaseAssetPrefixes.some((prefix) => name.startsWith(prefix)) ||
  name.startsWith('/downloads/articles/') ||
  name === releaseDownload,
);
const files = await Promise.all(included.map(async ([name, hash]) => ({
  name,
  hash,
  value: (await fs.readFile(path.join(root, name.slice(1)))).toString('base64'),
})));
const specials = await Promise.all(['_worker.js', '_routes.json', '_redirects', '_headers'].map(async (name) => {
  try { return { name, value: await fs.readFile(path.join(root, name), 'utf8') }; }
  catch (error) { if (error.code === 'ENOENT') return null; throw error; }
}));
const packet = { manifest, files, specials: specials.filter(Boolean) };
const payload = zlib.gzipSync(JSON.stringify(packet)).toString('base64');
await fs.mkdir('work', { recursive: true });
await fs.writeFile('work/cloudflare-public-transfer.b64', payload, 'ascii');
console.log(JSON.stringify({ files: files.length, specials: packet.specials.map((item) => item.name), base64Characters: payload.length, payloadPath: 'work/cloudflare-public-transfer.b64' }));
