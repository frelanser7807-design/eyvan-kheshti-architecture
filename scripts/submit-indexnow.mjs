import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const siteUrl = String(process.env.SITE_URL || process.env.VITE_SITE_URL || 'https://worldarchjournal.com').replace(/\/$/, '');
const { hostname } = new URL(siteUrl);
const publicFiles = await readdir(path.join(root, 'public'));
const keyFile = publicFiles.find((name) => /^[a-f0-9]{32}\.txt$/i.test(name));
if (!keyFile) throw new Error('IndexNow key file was not found in public/.');

const key = keyFile.replace(/\.txt$/i, '');
const sitemapUrl = `${siteUrl}/sitemap.xml`;
const sitemapResponse = await fetch(sitemapUrl, { headers: { 'user-agent': 'WorldArchJournal-IndexNow/1.0' } });
if (!sitemapResponse.ok) throw new Error(`Unable to read ${sitemapUrl}: ${sitemapResponse.status}`);
const sitemapXml = await sitemapResponse.text();
const urlList = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((match) => match[1].trim())
  .filter((url) => {
    try { return new URL(url).hostname === hostname; } catch { return false; }
  });
if (!urlList.length) throw new Error('No same-host URLs were found in the sitemap.');

const response = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'content-type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host: hostname,
    key,
    keyLocation: `${siteUrl}/${keyFile}`,
    urlList,
  }),
});
if (![200, 202].includes(response.status)) {
  throw new Error(`IndexNow rejected the submission: ${response.status} ${(await response.text()).slice(0, 500)}`);
}
console.log(JSON.stringify({ submitted: urlList.length, status: response.status, sitemap: sitemapUrl }));
