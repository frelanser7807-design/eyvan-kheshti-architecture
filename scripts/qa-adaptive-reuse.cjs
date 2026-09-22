const { chromium } = require('C:/Users/irana/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const url = 'http://127.0.0.1:4192/articles/adaptive-reuse-architecture-preserve-value/';
  const results = {};

  for (const viewport of [{ name: 'desktop', width: 1440, height: 1000 }, { name: 'mobile', width: 390, height: 844 }]) {
    const page = await browser.newPage({ viewport });
    const failures = [];
    page.on('pageerror', (error) => failures.push(error.message));
    page.on('response', (response) => response.status() >= 400 && failures.push(`${response.status()} ${response.url()}`));
    await page.goto(url, { waitUntil: 'networkidle' });
    const images = page.locator('article img');
    for (let index = 0; index < await images.count(); index += 1) {
      await images.nth(index).scrollIntoViewIfNeeded();
    }
    await page.waitForTimeout(300);
    const check = await page.evaluate(() => ({
      title: document.title,
      description: document.querySelector('meta[name="description"]')?.content,
      h1: document.querySelectorAll('h1').length,
      h2: document.querySelectorAll('article h2').length,
      figures: document.querySelectorAll('article figure').length,
      schema: [...document.querySelectorAll('script[type="application/ld+json"]')].map((node) => node.textContent).join(' ').includes('Article'),
      overflow: document.documentElement.scrollWidth - innerWidth,
      broken: [...document.querySelectorAll('article img')].filter((image) => !image.complete || !image.naturalWidth).map((image) => image.src),
    }));
    assert.equal(check.h1, 1);
    assert.equal(check.figures, 11);
    assert.equal(check.overflow, 0);
    assert.equal(check.broken.length, 0);
    assert(check.schema);
    assert.equal(failures.length, 0, failures.join('\n'));
    await page.screenshot({ path: `qa/adaptive-reuse-${viewport.name}.png`, fullPage: true });
    results[viewport.name] = { ...check, failures };
    await page.close();
  }

  fs.writeFileSync('qa/adaptive-reuse-results.json', JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
