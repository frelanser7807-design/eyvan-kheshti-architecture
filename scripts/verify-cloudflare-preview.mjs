import fs from 'node:fs/promises';
import path from 'node:path';

const base = String(process.env.QA_SITE_URL || '').replace(/\/$/, '');
if (!base) throw new Error('QA_SITE_URL is required');
const root = path.resolve(process.env.DIST_DIR || 'dist');
const manifest = JSON.parse(await fs.readFile('.cloudflare-upload-manifest.json', 'utf8'));
const selected = Object.keys(manifest).filter((name) =>
  /\.(html|js|mjs|css|json|xml|txt)$/.test(name) ||
  name.startsWith('/downloads/articles/') ||
  name.startsWith('/assets/editorial/newsletter/briefing-2026-10-08'),
);

const failures = [];
async function fetchWithRetry(url) {
  let lastError;
  for (let attempt = 1; attempt <= 4; attempt += 1) {
    try { return await fetch(url, { redirect: 'follow' }); }
    catch (error) {
      lastError = error;
      if (attempt < 4) await new Promise((resolve) => setTimeout(resolve, attempt * 750));
    }
  }
  throw lastError;
}
for (let offset = 0; offset < selected.length; offset += 6) {
  await Promise.all(selected.slice(offset, offset + 6).map(async (name) => {
    const response = await fetchWithRetry(`${base}${name}`);
    if (!response.ok) {
      failures.push({ name, status: response.status });
      return;
    }
    const remote = Buffer.from(await response.arrayBuffer());
    const local = await fs.readFile(path.join(root, name.slice(1)));
    if (!remote.equals(local)) failures.push({ name, status: response.status, mismatch: true, local: local.length, remote: remote.length });
  }));
}

console.log(JSON.stringify({ base, checked: selected.length, failures }, null, 2));
if (failures.length) process.exitCode = 1;
