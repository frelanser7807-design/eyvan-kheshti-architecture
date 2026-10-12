const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');
const { chromium } = require('C:/Users/irana/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const publicOutput = path.join(root, 'public', 'downloads', 'newsletter');
const distOutput = path.join(dist, 'downloads', 'newsletter');
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
  const { newsletterIssues } = await import('../src/data/newsletters.js');
  await fs.mkdir(publicOutput, { recursive: true });
  await fs.mkdir(distOutput, { recursive: true });
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
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1320, height: 900 } });
    for (const issue of newsletterIssues) {
      const url = `http://127.0.0.1:${port}/newsletter/${issue.slug}/`;
      await page.goto(url, { waitUntil: 'networkidle' });
      await page.locator('.wj-newsletter-page article').waitFor();
      await page.addStyleTag({ content: `@page{size:A4;margin:16mm 14mm 18mm}html,body,.wj-newsletter-page{background:#f2eee6!important}.skip-link,.wj-newsletter-nav,.wj-newsletter-footer,.wj-newsletter-signup,.wa-consent,.wa-privacy-trigger,.wj-newsletter-byline a[download]{display:none!important}.wj-newsletter-main{width:100%!important;padding:0!important}.wj-newsletter-back{display:none!important}.wj-newsletter-kicker{margin-top:0!important}.wj-newsletter-page h1{font-size:42px!important}.wj-newsletter-page figure,.wj-newsletter-copy section,.wj-newsletter-copy aside{break-inside:avoid}.wj-newsletter-page figure img{max-height:155mm!important}.wj-newsletter-copy{width:100%!important}.wj-newsletter-copy p,.wj-newsletter-copy li{font-size:10.5pt!important;line-height:1.62!important}a{color:inherit!important}.wj-newsletter-report{border-top:1px solid #bbb;padding-top:12px}` });
      const filename = `${issue.slug}.pdf`;
      const tempPath = path.join(distOutput, filename);
      await page.pdf({ path: tempPath, format: 'A4', printBackground: true, displayHeaderFooter: true, margin: { top: '18mm', right: '14mm', bottom: '20mm', left: '14mm' }, headerTemplate: '<div style="width:100%;font:8px Arial;color:#7b6a50;padding:0 14mm;letter-spacing:.12em">WORLD ARCH JOURNAL · THE WORLD ARCH BRIEFING</div>', footerTemplate: '<div style="width:100%;display:flex;justify-content:space-between;font:8px Arial;color:#777;padding:0 14mm"><span>worldarchjournal.com</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>' });
      await fs.copyFile(tempPath, path.join(publicOutput, filename));
    }
    console.log(`Generated ${newsletterIssues.length} downloadable newsletter PDF(s).`);
  } finally {
    await browser.close();
    server.close();
  }
})().catch((error) => { console.error(error); process.exit(1); });
