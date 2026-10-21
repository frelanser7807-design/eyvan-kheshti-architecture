import { access, readFile, readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { defaultContent } from '../src/data/defaultContent.js';

const root = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const required = [
  'dist/index.html',
  'dist/manifest.webmanifest',
  'dist/sw.js',
  'dist/robots.txt',
  'dist/llms.txt',
  'dist/offline.html',
  'dist/atlas-sitemap.xml',
  'dist/article-sitemap.xml',
  'dist/video-sitemap.xml',
  'dist/assets/film/site-cinematic-score-v3.wav',
  'src/components/CinematicScene.jsx',
  'src/components/AdminPanel.jsx',
  'src/components/ExplorePanel.jsx',
  'src/components/SiteSeo.jsx',
  'src/components/EditorialSections.jsx',
  'src/components/SiteSearch.jsx',
  'src/components/ArticleReader.jsx',
  'src/components/VideoLibrary.jsx',
  'src/data/articles.js',
  'src/components/LegalPage.jsx',
  'src/components/ArticleReader.jsx',
  'src/components/MagazineReader.jsx',
  'src/components/CommandCenter.jsx',
  'public/command-center-status.json',
  'src/data/articles.js',
  'src/data/magazines.js',
  'docs/API_CONTRACT.md',
  'docs/COMMERCE_BACKEND_PLAN.md',
  'docs/SEO_PLAN.md',
];

const activeAssets = [
  'assets/candidates/office-world/scene-00-bishopsgate-tower-entry-v1.png',
  'assets/candidates/office-world/scene-04-upper-floor-atelier-v1.png',
  'assets/candidates/office-world/scene-05-client-presentation-room-v1.png',
  'assets/candidates/office-world/scene-06-material-model-lab-v1.png',
  'assets/candidates/office-world/scene-07-principal-design-desk-v3.png',
  'assets/film/lobby-to-studio-clean.mp4',
  'assets/film/chapters/05-presentation-room-clean.mp4',
  'assets/film/chapters/06-material-lab.mp4',
  'assets/film/chapters/07-design-desk.mp4',
  'assets/film/site-cinematic-score-v3.wav',
  'assets/brand/world-arch-wa-mark-v1.png',
  'assets/brand/world-arch-journal-intro.mp4',
];

for (const path of required) await access(join(root, path));
for (const path of activeAssets) {
  await access(join(root, 'public', path));
  await access(join(root, 'dist', path));
}

for (const [pageRoot, pdfRoot, routePrefix] of [
  ['dist/articles', 'dist/downloads/articles', '/downloads/articles/'],
  ['dist/newsletter', 'dist/downloads/newsletter', '/downloads/newsletter/'],
]) {
  for (const entry of await readdir(join(root, pageRoot), { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const slug = entry.name;
    const html = await readFile(join(root, pageRoot, slug, 'index.html'), 'utf8');
    const pdfPath = join(root, pdfRoot, `${slug}.pdf`);
    const pdf = await readFile(pdfPath);
    if (!html.includes(`${routePrefix}${slug}.pdf`)) throw new Error(`Downloadable PDF link missing from ${pageRoot}/${slug}.`);
    if (!pdf.subarray(0, 5).equals(Buffer.from('%PDF-'))) throw new Error(`Invalid PDF file for ${slug}.`);
  }
}

const html = await readFile(join(root, 'dist/index.html'), 'utf8');
if (!html.includes('lang="en"') || !html.includes('dir="ltr"')) throw new Error('English metadata missing');
if (!html.includes('index, follow') || !html.includes('Professional') && !html.includes('Architecture')) throw new Error('SEO shell missing');
if (defaultContent.brand.linkedin !== 'https://www.linkedin.com/in/worldarchjournal/' || defaultContent.brand.socialLinks.find((item) => item.id === 'linkedin')?.url !== defaultContent.brand.linkedin) throw new Error('LinkedIn profile URL is not consistent with the verified public profile.');
const contentAdapter = await readFile(join(root, 'src/lib/dataAdapter.js'), 'utf8');
if (!contentAdapter.includes('brand.linkedin = defaultContent.brand.linkedin') || !contentAdapter.includes("fallback.id === 'linkedin'")) throw new Error('Saved site content can still restore the obsolete LinkedIn URL.');
const staticAnalytics = await readFile(join(root, 'public/assets/site-analytics-static.js'), 'utf8');
const analyticsConsent = await readFile(join(root, 'src/components/AnalyticsConsent.jsx'), 'utf8');
for (const source of [staticAnalytics, analyticsConsent]) {
  if (!source.includes('project_navigation_click') || !source.includes('button[data-analytics-event][data-analytics-label]')) throw new Error('Project and CTA click tracking is incomplete.');
}
if (!analyticsConsent.includes("trackSiteEvent('file_download'") || !analyticsConsent.includes('/\\.(pdf|zip)$/i')) throw new Error('PDF and drawing-pack download tracking is missing from the interactive site.');
const breadcrumbArticle = await readFile(join(root, 'dist/articles/flood-resilient-home-design/index.html'), 'utf8');
const breadcrumbScript = breadcrumbArticle.match(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/);
if (!breadcrumbScript) throw new Error('Static article JSON-LD is missing.');
const breadcrumbGraph = JSON.parse(breadcrumbScript[1]);
const breadcrumbList = (breadcrumbGraph['@graph'] || [breadcrumbGraph]).find((item) => item['@type'] === 'BreadcrumbList');
if (!breadcrumbList || breadcrumbList.itemListElement.length < 2 || breadcrumbList.itemListElement.some((item) => !item.name || !item.item)) throw new Error('Static article breadcrumb contains an unnamed or incomplete item.');
if (!breadcrumbArticle.includes('worldarchjournal/')) throw new Error('Static article publisher schema is missing the verified LinkedIn profile.');

const app = await readFile(join(root, 'src/App.jsx'), 'utf8');
if (!app.includes("startsWith('#/admin')")) throw new Error('Admin route missing');
const commandCenter = await readFile(join(root, 'src/components/CommandCenter.jsx'), 'utf8');
if (!commandCenter.includes('command-center-status.json') || !commandCenter.includes('handoffText')) throw new Error('Command Center safe fallback is incomplete.');
if (!commandCenter.includes('magazineFactory') || !commandCenter.includes('/api/composio-command') || !commandCenter.includes('EXECUTE_APPROVED')) throw new Error('Independent magazine factory or supervised Composio execution is incomplete.');
const composioCommand = await readFile(join(root, 'netlify/functions/composio-command.mjs'), 'utf8');
if (!composioCommand.includes('approval_required') || !composioCommand.includes('confirmation !== \'EXECUTE_APPROVED\'') || !composioCommand.includes('/api/v3.1/tools/execute/')) throw new Error('Composio execution gate is incomplete.');
const netlifyConfig = await readFile(join(root, 'netlify.toml'), 'utf8');
if (!netlifyConfig.includes('/api/composio-command') || !netlifyConfig.includes('/.netlify/functions/composio-command')) throw new Error('Composio command route is missing.');
const commandStatus = JSON.parse(await readFile(join(root, 'public/command-center-status.json'), 'utf8'));
for (const slug of ['whatsapp', 'youtube', 'instagram', 'facebook', 'linkedin', 'pinterest', 'gmail', 'netlify']) {
  if (!commandStatus.connections.some((item) => item.slug === slug)) throw new Error(`Command Center status is missing ${slug}.`);
}

const adapter = await readFile(join(root, 'src/lib/dataAdapter.js'), 'utf8');
for (const endpoint of ['/v1/site-content', '/v1/leads', '/v1/subscribers', '/v1/checkout-sessions']) {
  if (!adapter.includes(endpoint)) throw new Error('API contract implementation missing: ' + endpoint);
}

const cinematic = await readFile(join(root, 'src/components/CinematicSite.jsx'), 'utf8');
if (!cinematic.includes('PRESENTATION_PLAYBACK_RATE = 1.05')) throw new Error('Presentation scene timing regression');
if (!cinematic.includes('site-cinematic-score-v3.wav')) throw new Error('Soundtrack integration missing');
if (!cinematic.includes("const language = 'en'") || cinematic.includes('founderName')) throw new Error('English public identity must use the journal brand.');
if (cinematic.includes('LONDON STUDIO')) throw new Error('Unverified physical studio location must not be published');

for (const key of ['projects', 'services', 'tutorials', 'insights', 'guides', 'library', 'products', 'story']) {
  if (!Array.isArray(defaultContent[key])) throw new Error('Missing content collection: ' + key);
  const ids = defaultContent[key].map((item) => item.id);
  if (ids.length !== new Set(ids).size) throw new Error('Duplicate content id in ' + key);
}
for (const sceneId of ['arrival', 'studio', 'works', 'materials', 'practice']) {
  if (!defaultContent.story.some((item) => item.id === sceneId)) throw new Error('Missing cinematic copy for ' + sceneId);
}
if (defaultContent.settings.defaultLanguage !== 'en') throw new Error('Public default language must remain English');
if (defaultContent.brand.founderName || !defaultContent.brand.founderNameFa) throw new Error('English identity must use the brand while Persian content is preserved.');
if (defaultContent.brand.name !== 'WORLD ARCH JOURNAL') throw new Error('Public brand name is incomplete');
for (const platform of ['whatsapp', 'instagram', 'youtube', 'pinterest']) {
  const channel = defaultContent.brand.socialLinks.find((item) => item.platform === platform);
  if (!channel?.enabled || !/^https:\/\//.test(channel.url)) throw new Error('Verified public channel is inactive: ' + platform);
}
if (defaultContent.monetization.adsenseEnabled !== false || defaultContent.monetization.affiliateEnabled !== false) throw new Error('Commercial integrations must be disabled in the preview.');

const legal = await readFile(join(root, 'src/data/legalPages.js'), 'utf8');
for (const route of ['/privacy/', '/terms/', '/affiliate-disclosure/', '/editorial-policy/', '/cookie-settings/']) {
  if (!legal.includes(`'${route}'`)) throw new Error('Missing legal route: ' + route);
}
if (cinematic.includes('ek-menu-trigger') || cinematic.includes('studio-menu')) throw new Error('Public hamburger menu must remain removed.');
if (!cinematic.includes("sceneIndex > 0 ? 'is-visible' : ''")) throw new Error('Floating navigation must remain hidden through video one and begin on video two.');
if (!cinematic.includes('<SiteSearch') || !cinematic.includes('sceneIndex <= 0')) throw new Error('Opening smart site search is missing.');
if (!cinematic.includes("window.location.assign('/projects/')")) throw new Error('Missing projects hub navigation target.');
for (const target of ['services', 'tutorials', 'journal', 'objects', 'atlas', 'app', 'shop']) {
  if (!cinematic.includes(`scrollToSection('${target}')`)) throw new Error('Missing floating navigation target: ' + target);
}
const editorial = await readFile(join(root, 'src/components/EditorialSections.jsx'), 'utf8');
if (!editorial.includes('beforeinstallprompt') || !editorial.includes('Add to Home Screen') || !editorial.includes('BIM Object Library')) throw new Error('Installable app guide or download library is incomplete.');
if (!editorial.includes('Architecture Magazine') || !editorial.includes('onOpenMagazine')) throw new Error('Magazine section is not connected.');
if (!editorial.includes('Read full article') || !editorial.includes('onOpenArticle')) throw new Error('Articles section is not connected.');
if (defaultContent.library.some((item) => item.url)) throw new Error('BIM library downloads must remain inactive in this preview.');
if (!defaultContent.library.some((item) => item.accessTier === 'free') || !defaultContent.library.some((item) => item.accessTier === 'premium')) throw new Error('BIM freemium tiers are incomplete.');
const articleData = await readFile(join(root, 'src/data/articles.js'), 'utf8');
const magazineSectionStart = editorial.indexOf('<section id="journal"');
const magazineArticlesStart = editorial.indexOf('articles.filter((article) => article.published)');
const followingSectionStart = editorial.indexOf('<section id="objects"');
if (magazineSectionStart < 0 || magazineArticlesStart < magazineSectionStart || magazineArticlesStart > followingSectionStart) throw new Error('Architecture articles must remain inside the Magazine section.');
if (editorial.includes('<section id="articles"')) throw new Error('A separate Articles section must not be reintroduced.');
if (!editorial.includes('className="ek-magazine-article-grid"')) throw new Error('Magazine articles must be displayed together in a dedicated grid.');
if (!articleData.includes('ARTICLE ILLUSTRATIONS PENDING')) throw new Error('Honest sample-visual boundary is missing.');
const articleReader = await readFile(join(root, 'src/components/ArticleReader.jsx'), 'utf8');
if (articleReader.includes('dangerouslySetInnerHTML') || !articleReader.includes('allowedTags')) throw new Error('Article content must use controlled rendering.');

const robots = await readFile(join(root, 'dist/robots.txt'), 'utf8');
if (!robots.includes('OAI-SearchBot') || !robots.includes('Allow: /')) throw new Error('Search crawler policy missing');

const sitemapHost = new URL(process.env.VITE_SITE_URL || 'https://worldarchjournal.com').origin;
for (const sitemapFile of ['sitemap.xml', 'article-sitemap.xml', 'video-sitemap.xml', 'atlas-sitemap.xml', 'news-sitemap.xml']) {
  if (!robots.includes(`Sitemap: ${sitemapHost}/${sitemapFile}`)) throw new Error(`robots.txt does not advertise ${sitemapFile}`);
  const xml = await readFile(join(root, 'dist', sitemapFile), 'utf8');
  if (!xml.startsWith('<?xml') || !xml.includes('<urlset')) throw new Error(`Invalid sitemap XML shell: ${sitemapFile}`);
}
const canonicalSitemapXml = await readFile(join(root, 'dist/sitemap.xml'), 'utf8');
const sitemapUrls = [...canonicalSitemapXml.matchAll(new RegExp('<loc>([^<]+)</loc>', 'g'))].map((match) => match[1]);
if (!sitemapUrls.length || sitemapUrls.length !== new Set(sitemapUrls).size) throw new Error('Main sitemap is empty or contains duplicate URLs.');
for (const pageUrl of sitemapUrls) {
  const parsedUrl = new URL(pageUrl);
  if (parsedUrl.origin !== sitemapHost || parsedUrl.search || parsedUrl.hash) throw new Error(`Noncanonical URL in sitemap: ${pageUrl}`);
  if (parsedUrl.pathname !== '/' && !parsedUrl.pathname.endsWith('/')) throw new Error(`Noncanonical trailing slash in sitemap: ${pageUrl}`);
  const htmlPath = parsedUrl.pathname === '/' ? 'dist/index.html' : `dist${decodeURIComponent(parsedUrl.pathname)}index.html`;
  const pageHtml = await readFile(join(root, htmlPath), 'utf8').catch(() => { throw new Error(`Sitemap URL lacks a static HTML page: ${pageUrl}`); });
  if (pageHtml.includes('name="robots" content="noindex') || pageHtml.includes('content="noindex') || pageHtml.includes("content='noindex")) throw new Error(`Noindex page included in sitemap: ${pageUrl}`);
  const canonicalTags = [...pageHtml.matchAll(new RegExp('<link[^>]*rel="canonical"[^>]*>', 'gi'))].map((match) => match[0]);
  if (!canonicalTags.some((tag) => tag.includes(`href="${pageUrl}"`))) throw new Error(`Missing/mismatched canonical link for sitemap page: ${pageUrl}`);
}
const llms = await readFile(join(root, 'dist/llms.txt'), 'utf8');
if (!llms.includes('https://worldarchjournal.com/magazine/') || !llms.includes('https://worldarchjournal.com/projects/')) {
  throw new Error('AI discovery file lacks canonical navigation links.');
}


const staticArticle = await readFile(join(root, 'dist/articles/courtyard-wind-house-passive-cooling/index.html'), 'utf8');
if (!staticArticle.includes('"@type":"Article"') || !staticArticle.includes('rel="canonical"') || !staticArticle.includes('og:image:alt')) throw new Error('Dedicated article SEO page is incomplete.');
if ((staticArticle.match(/<img /g) || []).length < 5 || !staticArticle.includes('Cooling is often treated')) throw new Error('Dedicated article page is missing its complete visual story or body copy.');
const staticMagazine = await readFile(join(root, 'dist/magazine/issue-00-the-house-after-the-grid/index.html'), 'utf8');
if (!staticMagazine.includes('PublicationIssue') || (staticMagazine.match(/<img /g) || []).length < 5) throw new Error('Dedicated magazine page is incomplete.');
const staticShop = await readFile(join(root, 'dist/shop/index.html'), 'utf8');
if (!staticShop.includes('CollectionPage') || !staticShop.includes('Interior Design Presentation Template')) throw new Error('Shop must expose the verified published product catalogue.');
const staticAtlas = await readFile(join(root, 'dist/atlas/index.html'), 'utf8');
if (!staticAtlas.includes('World Arch Atlas') || !staticAtlas.includes('/downloads/atlas/world-arch-atlas-istanbul-architecture-travel-guide.pdf')) throw new Error('Atlas hub must expose the city catalogue and PDF downloads.');
for (const atlasPdf of ['world-arch-atlas-istanbul-architecture-travel-guide.pdf', 'world-arch-atlas-antalya-architecture-travel-guide.pdf', 'world-arch-atlas-cappadocia-architecture-travel-guide.pdf']) {
  const pdfPath = join(root, 'dist/downloads/atlas', atlasPdf);
  const pdfStat = await stat(pdfPath);
  if (pdfStat.size < 10000) throw new Error('Atlas PDF is missing or unexpectedly small: ' + atlasPdf);
}
const staticPresentationProduct = await readFile(join(root, 'dist/shop/interior-design-presentation-template/index.html'), 'utf8');
if (!staticPresentationProduct.includes('"@type":"Product"') || !staticPresentationProduct.includes('4586743960') || !staticPresentationProduct.includes('priceCurrency":"GBP"') || !staticPresentationProduct.includes('<video')) throw new Error('Published presentation template is missing verified Etsy checkout, GBP offer schema or video preview.');
const sitemap = await readFile(join(root, 'dist/sitemap.xml'), 'utf8');
for (const expectedPath of ['/articles/courtyard-wind-house-passive-cooling/', '/articles/cross-ventilation-apartment-design/', '/articles/apartment-daylight-layout-design/', '/magazine/issue-00-the-house-after-the-grid/', '/prompts/exact-final-frame-architectural-build/', '/shop/', '/shop/interior-design-presentation-template/', '/atlas/turkiye/istanbul/']) {
  if (!sitemap.includes(expectedPath)) throw new Error('Sitemap is missing: ' + expectedPath);
}
const atlasSitemap = await readFile(join(root, 'dist/atlas-sitemap.xml'), 'utf8');
for (const expectedPath of ['/atlas/', '/atlas/turkiye/istanbul/', '/atlas/turkiye/antalya/', '/atlas/turkiye/cappadocia/']) {
  if (!atlasSitemap.includes(expectedPath)) throw new Error('Atlas sitemap is missing: ' + expectedPath);
}
if (!robots.includes('atlas-sitemap.xml')) throw new Error('Robots file must expose the dedicated Atlas sitemap.');
const videoPage = await readFile(join(root, 'dist/videos/how-stone-arches-carry-load/index.html'), 'utf8');
if (!videoPage.includes('VideoObject') || !videoPage.includes('youtube-nocookie.com/embed/0pE7K9EEYvg') || !videoPage.includes('What the sequence shows')) throw new Error('Architecture video landing page is incomplete.');
const flaggedVideoPage = await readFile(join(root, 'dist/videos/how-stone-arches-carry-load/index.html'), 'utf8');
if (!flaggedVideoPage.includes('youtube-nocookie.com/embed/') || !flaggedVideoPage.includes('<iframe') || !flaggedVideoPage.includes('rel="canonical"')) {
  throw new Error('Architecture video permalink needs an embedded, canonical, crawlable watch page.');
}
const videoSitemap = await readFile(join(root, 'dist/video-sitemap.xml'), 'utf8');
if (!videoSitemap.includes('/videos/how-stone-arches-carry-load/') || !videoSitemap.includes('<video:player_loc')) throw new Error('Video sitemap is incomplete.');
// Dedicated hosted-video watch pages must not be replaced by the SPA's 404 route.
const { watchVideoEntries, watchPagePath } = await import('../src/data/watchVideos.js');
for (const video of watchVideoEntries) {
  const videoPage = await readFile(join(root, 'dist', ...watchPagePath(video).split('/').filter(Boolean), 'index.html'), 'utf8');
  if (!videoPage.includes('<video controls playsinline') || !videoPage.includes(`src="${video.file}"`)) throw new Error(`Watch page lacks its visible playable video: ${video.slug}`);
  if (!videoPage.includes(`href="https://worldarchjournal.com${watchPagePath(video)}"`)) throw new Error(`Wrong watch canonical: ${video.slug}`);
  if (!videoPage.includes('"@type":"VideoObject"') || !videoPage.includes(video.file)) throw new Error(`Watch page lacks video structured data: ${video.slug}`);
  if (videoPage.includes('<script type="module"') || videoPage.includes('type="module" crossorigin')) throw new Error(`Watch page must not hydrate as an unknown SPA route: ${video.slug}`);
  if (!videoSitemap.includes(`https://worldarchjournal.com${watchPagePath(video)}`)) throw new Error(`Watch page omitted from video sitemap: ${video.slug}`);
}
const articleSitemap = await readFile(join(root, 'dist/article-sitemap.xml'), 'utf8');
if (!articleSitemap.includes('/articles/ai-in-architecture-2026-adoption-risks-rules/') || !articleSitemap.includes('/magazine/climate-resilient-homes/')) throw new Error('Article topic sitemap is incomplete.');
if (!robots.includes('article-sitemap.xml') || !robots.includes('video-sitemap.xml')) throw new Error('Robots file must expose article and video sitemaps.');
const promptLibrary = await readFile(join(root, 'src/components/PromptLibrary.jsx'), 'utf8');
if (!promptLibrary.includes('prompt-search-input') || !promptLibrary.includes("trackSiteEvent('prompt_copy'")) throw new Error('Prompt search or copy conversion tracking is missing.');
const promptDetail = await readFile(join(root, 'src/components/PromptDetail.jsx'), 'utf8');
if (!promptDetail.includes('Get the launch notice') || !promptDetail.includes('Related prompts')) throw new Error('PRO prompt conversion or related-prompt path is missing.');
const newsletterPage = await readFile(join(root, 'src/components/NewsletterPage.jsx'), 'utf8');
if (!newsletterPage.includes('Download PDF') || !newsletterPage.includes('newsletter_signup_success')) throw new Error('Newsletter PDF download or conversion tracking is missing.');
for (const issueSlug of ['architecture-briefing-2026-10-09', 'architecture-briefing-2026-10-08']) {
  const newsletterPdf = await stat(join(root, 'dist', 'downloads', 'newsletter', `${issueSlug}.pdf`));
  if (newsletterPdf.size < 20000) throw new Error(`Newsletter PDF is missing or unexpectedly small: ${issueSlug}`);
}
if (!cinematic.includes('FA SOON') || !cinematic.includes("preload={isIdle ? 'none' : 'metadata'}")) throw new Error('Disabled Persian tab or video preload optimisation is missing.');
if (!cinematic.includes('if (sceneIndex < scenes.length - 1)') || !cinematic.includes('setSceneIndex((value) => value + 1)')) throw new Error('Continuous one-click cinematic playback is missing.');

const serviceWorker = await readFile(join(root, 'dist/sw.js'), 'utf8');
if (!serviceWorker.includes("startsWith('/v1/')") || !serviceWorker.includes("destination === 'video'") || !serviceWorker.includes("destination === 'audio'") || !serviceWorker.includes("caches.match('/offline.html')")) {
  throw new Error('Service worker must exclude APIs and streamed media from the shell cache');
}

async function directorySize(path) {
  let total = 0;
  for (const entry of await readdir(path, { withFileTypes: true })) {
    const target = join(path, entry.name);
    total += entry.isDirectory() ? await directorySize(target) : (await stat(target)).size;
  }
  return total;
}

async function collectReleaseFiles(path) {
  const files = [];
  for (const entry of await readdir(path, { withFileTypes: true })) {
    const target = join(path, entry.name);
    if (entry.isDirectory()) files.push(...await collectReleaseFiles(target));
    else files.push({ path: target, size: (await stat(target)).size });
  }
  return files;
}

const distSizeMb = (await directorySize(join(root, 'dist'))) / (1024 * 1024);
const releaseFiles = await collectReleaseFiles(join(root, 'dist'));
const exactFinalFrameVideo = await stat(join(root, 'dist/assets/prompts/exact-final-frame-architectural-build/example-reel.mp4'));
if (exactFinalFrameVideo.size > 4 * 1024 * 1024) throw new Error('Exact final-frame prompt video exceeds the 4 MB web budget.');
if (releaseFiles.length > 20000) throw new Error(`Cloudflare Pages file limit exceeded: ${releaseFiles.length} files`);
const largestReleaseFile = releaseFiles.reduce((largest, file) => file.size > largest.size ? file : largest, { path: '', size: 0 });
if (largestReleaseFile.size > 25 * 1024 * 1024) throw new Error(`Cloudflare Pages per-file limit exceeded: ${largestReleaseFile.path} (${(largestReleaseFile.size / 1024 / 1024).toFixed(2)} MB)`);
// This release includes the directly downloadable social video, Atlas guides,
// newsletter PDFs and prompt examples. Keep a measured ceiling above the
// verified 230 MB release while enforcing Cloudflare's actual file/count caps.
// Keep the existing site budget unchanged; new on-demand material downloads
// have their own measured allowance. They are not part of initial page loading.
const materialSizeMb = (await directorySize(join(root, 'dist/assets/material-studio'))) / (1024 * 1024);
// Measured CI-generated travertine assets: 110.11 MiB; 112 MiB allowance.
const stoneSizeMb = (await directorySize(join(root, 'dist/assets/material-studio/travertine'))) / (1024 * 1024);
if (stoneSizeMb > 112) throw new Error(`Travertine assets exceed 112 MB: ${stoneSizeMb.toFixed(2)} MB`);
// Measured CI-generated ceramic porcelain assets: 76.53 MiB; 84 MiB allowance.
const ceramicSizeMb = (await directorySize(join(root, 'dist/assets/material-studio/ceramic-porcelain'))) / (1024 * 1024);
if (ceramicSizeMb > 84) throw new Error(`Ceramic porcelain assets exceed 84 MB: ${ceramicSizeMb.toFixed(2)} MB`);
// New concrete and microcement packs include on-demand 16K tiled editions.
// Keep their download budget separate from the unchanged legacy library.
const mineralSizeMb = (await directorySize(join(root, 'dist/assets/material-studio/mineral'))) / (1024 * 1024);
if (mineralSizeMb > 950) throw new Error(`Concrete/microcement downloads exceed 950 MB: ${mineralSizeMb.toFixed(2)} MB`);
if (materialSizeMb - stoneSizeMb - ceramicSizeMb - mineralSizeMb > 90) throw new Error('Existing material assets exceed their unchanged 90 MB budget');
if (distSizeMb - materialSizeMb > 235) throw new Error(`Non-material release package regressed to ${(distSizeMb - materialSizeMb).toFixed(2)} MB`);
console.log(`Material asset budget: ${materialSizeMb.toFixed(2)} MB (travertine ${stoneSizeMb.toFixed(2)} / 112 MB; ceramic porcelain ${ceramicSizeMb.toFixed(2)} / 84 MB; concrete/microcement ${mineralSizeMb.toFixed(2)} / 950 MB; existing allowance 90 MB); existing site: ${(distSizeMb - materialSizeMb).toFixed(2)} / 235 MB`);
for (const legacyAsset of ['sequence-01.mp4', 'walk-01-enter-from-exterior.mp4', 'scene-courtyard.png']) {
  try {
    await access(join(root, 'dist/assets', legacyAsset));
    throw new Error('Legacy asset leaked into release: ' + legacyAsset);
  } catch (error) {
    if (!String(error?.message || '').includes('ENOENT')) throw error;
  }
}

console.log(`Smoke checks passed: ${activeAssets.length} active media and brand files exist, release size is ${distSizeMb.toFixed(2)} MB, cinematic timing and soundtrack are intact, verified social links and the WORLD ARCH JOURNAL identity are present, the public site is English-only, Persian source fields remain available in the admin data, legal pages and API adapters are wired, commercial integrations are off, and private APIs/media are excluded from the PWA shell cache.`);

// Check rendered public copy, metadata and active media after the identity migration.
const { legalPages } = await import('../src/data/legalPages.js');
if (legalPages['/editorial-team/'].portrait.src !== '/assets/brand/world-arch-wa-mark-v1.png') throw new Error('Publisher portrait must be the journal logo.');
async function verifyBrandPages(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = join(directory, entry.name);
    if (entry.isDirectory()) await verifyBrandPages(file);
    else if (entry.name.endsWith('.html')) {
      const page = await readFile(file, 'utf8');
      // Existing external account URLs stay valid until the owner can change their handles.
      const copy = page.replace(/https?:\/\/[^\s"'<>`]+/g, '');
      if (/Farnaz|Ghaffarian/i.test(copy)) throw new Error(`Personal English name remains in ${file}`);
      if (/farnaz-professional-profile|posters\/(?:digital-founder-intro|founder-hero)/i.test(page)) throw new Error(`Portrait remains in ${file}`);
    }
  }
}
await verifyBrandPages(join(root, 'dist'));
for (const relative of ['assets/brand/farnaz-professional-profile-v6.png', 'assets/brand/farnaz-professional-profile-v6.webp', 'assets/film/00-digital-founder-intro.mp4', 'assets/film/founder-intro-plus-entrance.mp4']) {
  let exists = true;
  try { await access(join(root, 'dist', relative)); } catch { exists = false; }
  if (exists) throw new Error(`Retired personal media is still in the release: ${relative}`);
}
console.log('Public brand identity, logo replacement and retired portrait checks passed.');



