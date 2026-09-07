import { access, readFile, readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { defaultContent } from '../src/data/defaultContent.js';

const root = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const required = [
  'dist/index.html',
  'dist/manifest.webmanifest',
  'dist/sw.js',
  'dist/robots.txt',
  'dist/assets/film/site-cinematic-score-v3.wav',
  'src/components/CinematicScene.jsx',
  'src/components/AdminPanel.jsx',
  'src/components/ExplorePanel.jsx',
  'src/components/SiteSeo.jsx',
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
  'assets/film/00-digital-founder-intro.mp4',
  'assets/film/founder-intro-plus-entrance.mp4',
  'assets/film/lobby-to-studio-clean.mp4',
  'assets/film/chapters/05-presentation-room-clean.mp4',
  'assets/film/chapters/06-material-lab.mp4',
  'assets/film/chapters/07-design-desk.mp4',
  'assets/film/posters/digital-founder-intro.jpg',
  'assets/film/posters/founder-hero.jpg',
  'assets/film/site-cinematic-score-v3.wav',
];

for (const path of required) await access(join(root, path));
for (const path of activeAssets) {
  await access(join(root, 'public', path));
  await access(join(root, 'dist', path));
}

const html = await readFile(join(root, 'dist/index.html'), 'utf8');
if (!html.includes('lang="en"') || !html.includes('dir="ltr"')) throw new Error('English metadata missing');
if (!html.includes('index, follow') || !html.includes('Professional') && !html.includes('Architecture')) throw new Error('SEO shell missing');

const app = await readFile(join(root, 'src/App.jsx'), 'utf8');
if (!app.includes("startsWith('#/admin')")) throw new Error('Admin route missing');

const adapter = await readFile(join(root, 'src/lib/dataAdapter.js'), 'utf8');
for (const endpoint of ['/v1/site-content', '/v1/leads', '/v1/subscribers', '/v1/checkout-sessions']) {
  if (!adapter.includes(endpoint)) throw new Error('API contract implementation missing: ' + endpoint);
}

const cinematic = await readFile(join(root, 'src/components/CinematicSite.jsx'), 'utf8');
if (!cinematic.includes('PRESENTATION_PLAYBACK_RATE = 1.05')) throw new Error('Presentation scene timing regression');
if (!cinematic.includes('site-cinematic-score-v3.wav')) throw new Error('Soundtrack integration missing');
if (!cinematic.includes('defaultLanguage') || !cinematic.includes('founderName')) throw new Error('Bilingual founder identity missing');
if (cinematic.includes('LONDON STUDIO')) throw new Error('Unverified physical studio location must not be published');

for (const key of ['projects', 'services', 'tutorials', 'insights', 'products', 'story']) {
  if (!Array.isArray(defaultContent[key])) throw new Error('Missing content collection: ' + key);
  const ids = defaultContent[key].map((item) => item.id);
  if (ids.length !== new Set(ids).size) throw new Error('Duplicate content id in ' + key);
}
for (const sceneId of ['arrival', 'studio', 'works', 'materials', 'practice']) {
  if (!defaultContent.story.some((item) => item.id === sceneId)) throw new Error('Missing cinematic copy for ' + sceneId);
}
if (defaultContent.settings.defaultLanguage !== 'en') throw new Error('Public default language must remain English');
if (!defaultContent.brand.founderName || !defaultContent.brand.founderNameFa) throw new Error('Founder identity is incomplete');

const robots = await readFile(join(root, 'dist/robots.txt'), 'utf8');
if (!robots.includes('OAI-SearchBot') || !robots.includes('Allow: /')) throw new Error('Search crawler policy missing');

const serviceWorker = await readFile(join(root, 'dist/sw.js'), 'utf8');
if (!serviceWorker.includes("startsWith('/v1/')") || !serviceWorker.includes("destination === 'video'") || !serviceWorker.includes("destination === 'audio'")) {
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

const distSizeMb = (await directorySize(join(root, 'dist'))) / (1024 * 1024);
if (distSizeMb > 40) throw new Error(`Release package regressed to ${distSizeMb.toFixed(2)} MB`);
for (const legacyAsset of ['sequence-01.mp4', 'walk-01-enter-from-exterior.mp4', 'scene-courtyard.png']) {
  try {
    await access(join(root, 'dist/assets', legacyAsset));
    throw new Error('Legacy asset leaked into release: ' + legacyAsset);
  } catch (error) {
    if (!String(error?.message || '').includes('ENOENT')) throw error;
  }
}

console.log(`Smoke checks passed: 14 active media files exist, release size is ${distSizeMb.toFixed(2)} MB, cinematic timing and soundtrack are intact, English SEO shell and bilingual content are present, Persian admin and API adapters are wired, and private APIs/media are excluded from the PWA shell cache.`);
