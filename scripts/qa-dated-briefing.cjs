const { chromium } = require('C:/Users/irana/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('node:fs/promises');
let browser;

(async () => {
  const { newsletterIssues } = await import('../src/data/newsletters.js');
  const selectedIssue = process.env.QA_ISSUE_SLUG
    ? newsletterIssues.find((issue) => issue.slug === process.env.QA_ISSUE_SLUG)
    : newsletterIssues[0];
  if (!selectedIssue) throw Error('No matching newsletter issue for browser QA');
  const issueRoute = `/newsletter/${selectedIssue.slug}/`;
  const expectedSourceDates = selectedIssue.sections.filter((section) => section.kind === 'news').map((section) => section.sourcePublishedAt);
  browser = await chromium.launch({ channel: 'msedge', headless: true });
  await fs.mkdir('qa-dated-briefing', { recursive: true });
  const results = [];
  for (const [name, viewport, route] of [
    ['desktop-issue', { width: 1365, height: 900 }, issueRoute],
    ['mobile-issue', { width: 390, height: 844 }, issueRoute],
    ['mobile-archive', { width: 390, height: 844 }, '/newsletter/'],
    ['analysis-archive', { width: 1365, height: 900 }, '/magazine/analysis/']
  ]) {
    const page = await browser.newPage({ viewport });
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto((process.env.QA_SITE_URL || 'http://127.0.0.1:4187') + route, { waitUntil: 'networkidle' });
    const consent = page.getByRole('button', { name: /Essential only/i });
    if (await consent.count()) await consent.click();
    await page.locator('.wj-newsletter-page').waitFor();
    await page.screenshot({ path: `qa-dated-briefing/${name}.png` });
    const state = await page.evaluate(() => ({
      heading: document.querySelector('h1')?.textContent,
      canonical: document.querySelector('link[rel="canonical"]')?.href,
      overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
      brokenImages: [...document.querySelectorAll('.wj-newsletter-page img')].filter((img) => img.loading !== 'lazy' && (!img.complete || !img.naturalWidth)).map((img) => img.src),
      dates: [...document.querySelectorAll('.wj-newsletter-source-date time')].map((node) => node.dateTime)
    }));
    if (state.overflow || state.brokenImages.length || errors.length) throw Error(JSON.stringify({ name, state, errors }));
    if (route === issueRoute) {
      if (JSON.stringify(state.dates) !== JSON.stringify(expectedSourceDates)) throw Error('News source dates do not match the selected issue');
      if (state.heading !== selectedIssue.title) throw Error('Wrong newsletter heading');
      if (state.canonical !== `https://worldarchjournal.com${issueRoute}`) throw Error('Wrong newsletter canonical');
    }
    results.push({ name, ...state, errors });
    await page.close();
  }
  await browser.close();
  console.log(JSON.stringify(results, null, 2));
})().catch(async (error) => { console.error(error); if (browser) await browser.close(); process.exitCode = 1; });
