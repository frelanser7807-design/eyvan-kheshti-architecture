import { rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const unusedReleaseAssets = [
  // The live article already serves this WebP through <picture>; retain one copy.
  'dist/assets/articles/bird-safe-facade-design/hero.png',
  'dist/assets/brand/farnaz-professional-profile-v6.png',
  'dist/assets/brand/farnaz-professional-profile-v6.webp',
  'dist/assets/brand/farnaz-profile-from-video-02-v1.jpg',
  'dist/assets/brand/world-arch-journal-youtube-banner-v1.jpg',
  'dist/assets/brand/world-arch-journal-youtube-banner-preview-v1.jpg',
  // The two founder films are no longer pruned: the owner-approved homepage
  // v4.4 (2026-10-22) uses them as its hero and mid-page story band.
  'dist/assets/film/posters/digital-founder-intro.jpg',
  'dist/assets/film/posters/founder-hero.jpg',
  'dist/assets/film/site-cinematic-score-v2.wav',
  'dist/assets/prompts/ai-construction-video/cover.png',
  'dist/assets/prompts/luxury-bathroom-ai-video/cover.png',
  'dist/assets/prompts/giant-hands-interior-build/instagram-reel.mp4',
  'dist/assets/articles/high-performance-glazing/high-performance-glazing-hero.png',
  'dist/assets/articles/high-performance-glazing/triple-glazing-frame-mockup.png',
  'dist/assets/articles/high-performance-glazing/electrochromic-office-glare-control.png',
  'dist/assets/articles/high-performance-glazing/cold-hot-climate-glazing.png',
  'dist/assets/articles/universal-design-homes/universal-design-homes-hero.png',
  'dist/assets/articles/universal-design-homes/level-entrance-universal-design.png',
  'dist/assets/articles/universal-design-homes/adaptable-kitchen-universal-design.png',
  'dist/assets/articles/universal-design-homes/age-friendly-bathroom.png',
];

for (const relativePath of unusedReleaseAssets) {
  await rm(path.join(root, relativePath), { force: true });
}

console.log(`Pruned ${unusedReleaseAssets.length} unused release asset(s).`);
