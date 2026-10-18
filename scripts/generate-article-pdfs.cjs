const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const publicOutput = path.join(root, 'public', 'downloads', 'articles');
const distOutput = path.join(dist, 'downloads', 'articles');

const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'application/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2' };

async function targetFor(urlPath) {
  const clean = decodeURIComponent(urlPath.split('?')[0]).replace(/^\/+/, '');
  let target = path.resolve(dist, clean || 'index.html');
  if (!target.startsWith(dist)) return null;
  try { if ((await fs.stat(target)).isDirectory()) target = path.join(target, 'index.html'); }
  catch { if (!path.extname(target)) target = path.join(target, 'index.html'); }
  return target;
}

(async () => {
  const { articles } = await import('../src/data/articles.js');
  const published = articles.filter((article) => article.published);

  await fs.mkdir(publicOutput, { recursive: true });
  await fs.mkdir(distOutput, { recursive: true });

  const missing = published;
  console.log(`Generating ${missing.length} current article PDF(s).`);

  const server = http.createServer(async (request, response) => {
    try {
      const target = await targetFor(request.url || '/');
      const body = await fs.readFile(target);
      response.writeHead(200, { 'content-type': mime[path.extname(target).toLowerCase()] || 'application/octet-stream', 'cache-control': 'no-store' });
      response.end(body);
    } catch {
      response.writeHead(404, { 'content-type': 'text/plain' });
      response.end('Not found');
    }
  });

  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  const browser = await chromium.launch({ headless: true, args: process.env.CI ? ['--no-sandbox', '--disable-setuid-sandbox'] : [] });

  try {
    const page = await browser.newPage({ viewport: { width: 1320, height: 900 }, javaScriptEnabled: false });
    for (const article of missing) {
      const url = `http://127.0.0.1:${port}/articles/${article.slug}/`;
      await page.goto(url, { waitUntil: 'networkidle' });
      await page.locator('main.seo-route-fallback article').first().waitFor();
      const filename = `${article.slug}.pdf`;
      const tempPath = path.join(distOutput, filename);
      await page.pdf({ path: tempPath, format: 'A4', printBackground: true });
      await fs.copyFile(tempPath, path.join(publicOutput, filename));
    }
    console.log(`Generated ${missing.length} article PDF(s).`);
  } finally {
    await browser.close();
    server.close();
  }
})().catch((error) => {
  console.error('WARNING: article PDF generation failed (non-fatal, build continues):', error && error.message ? error.message : error);
  process.exit(process.env.PDF_STRICT === '1' ? 1 : 0);
});
