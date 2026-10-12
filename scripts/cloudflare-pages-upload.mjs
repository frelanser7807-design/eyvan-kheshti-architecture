import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { createInterface } from 'node:readline/promises';

const require = createRequire(import.meta.url);
const blake3 = require('../.npm-cache/_npx/d77349f55c2be1c0/node_modules/blake3-wasm');
const root = path.resolve(process.argv[2] || 'dist');

const mime = {
  html: 'text/html', css: 'text/css', js: 'application/javascript', mjs: 'application/javascript',
  json: 'application/json', xml: 'application/xml', txt: 'text/plain', svg: 'image/svg+xml',
  png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp', avif: 'image/avif',
  ico: 'image/x-icon', woff: 'font/woff', woff2: 'font/woff2', mp4: 'video/mp4', pdf: 'application/pdf',
};

async function walk(dir) {
  const out = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await walk(absolute));
    else if (entry.isFile()) out.push(absolute);
  }
  return out;
}

const files = [];
for (const absolute of await walk(root)) {
  const name = path.relative(root, absolute).split(path.sep).join('/');
  if (['_headers', '_redirects', '_routes.json', '_worker.js'].includes(name)) continue;
  const bytes = await fs.readFile(absolute);
  const ext = path.extname(name).slice(1).toLowerCase();
  const hash = blake3.hash(bytes.toString('base64') + ext).toString('hex').slice(0, 32);
  files.push({ name, absolute, bytes, hash, contentType: mime[ext] || 'application/octet-stream' });
}

const manifest = Object.fromEntries(files.map((file) => [`/${file.name}`, file.hash]));
await fs.writeFile('.cloudflare-upload-manifest.json', JSON.stringify(manifest));
if (process.argv.includes('--manifest-only')) {
  console.log(JSON.stringify({ files: files.length, manifest: '.cloudflare-upload-manifest.json' }));
  process.exit(0);
}

let token = process.env.CF_PAGES_UPLOAD_JWT;
if (!token && process.argv.includes('--token-stdin')) {
  const reader = createInterface({ input: process.stdin, terminal: false });
  token = String(await reader.question('')).trim();
  reader.close();
}
if (!token) throw new Error('CF_PAGES_UPLOAD_JWT is required (or pass --token-stdin)');
const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
async function api(endpoint, body) {
  let lastError;
  for (let attempt = 1; attempt <= 4; attempt += 1) {
    try {
      const response = await fetch(`https://api.cloudflare.com/client/v4${endpoint}`, {
        method: 'POST', headers, body: JSON.stringify(body),
      });
      const text = await response.text();
      const data = text ? JSON.parse(text) : null;
      if (!response.ok || data?.success === false) throw new Error(`${endpoint} ${response.status}: ${text.slice(0, 1000)}`);
      return data?.result ?? data;
    } catch (error) {
      lastError = error;
      if (attempt === 4) break;
      await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
    }
  }
  throw lastError;
}

const missing = new Set(await api('/pages/assets/check-missing', { hashes: files.map((file) => file.hash) }));
// Retry builds can leave stale cache registrations after an interrupted upload.
// Force compiled text when repairing a release; do not trust cache registration alone.
const forceText = process.argv.includes('--force-text');
const pending = files.filter((file) => missing.has(file.hash) || (forceText && /\.(html|js|mjs|css|json|xml|txt)$/.test(file.name)));
let batch = [];
let batchBytes = 0;
for (const file of pending) {
  // Asset bytes are base64-encoded inside JSON, so keep the raw payload below
  // 8 MB to stay comfortably under the Pages upload request-size ceiling.
  if (batch.length && (batch.length >= 50 || batchBytes + file.bytes.length > 8_000_000)) {
    await api('/pages/assets/upload', batch);
    batch = [];
    batchBytes = 0;
  }
  batch.push({ key: file.hash, value: file.bytes.toString('base64'), metadata: { contentType: file.contentType }, base64: true });
  batchBytes += file.bytes.length;
}
if (batch.length) await api('/pages/assets/upload', batch);
await api('/pages/assets/upsert-hashes', { hashes: files.map((file) => file.hash) });

console.log(JSON.stringify({ files: files.length, uploaded: pending.length, manifest: '.cloudflare-upload-manifest.json' }));
