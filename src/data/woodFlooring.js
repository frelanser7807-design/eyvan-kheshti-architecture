// Scanned wood flooring — real photogrammetry PBR scans (Poly Haven, CC0).
// Owner rebuild 2026-10-23: scenes are living room, bedroom, hallway & entry;
// download tiers are a 4K pack and a 16K edition, both hosted on Google Drive
// (the maps below are the 4K pack contents; the panel's interactive viewer
// uses web-resolution WebP derivatives of the same scans).
export const woodPath = '/materials/wood/wood-flooring/scanned-wood-flooring/';
export const woodRoot = '/assets/material-studio/wood-flooring/';
const maps = {
  basecolor: 'basecolor-4k.jpg',
  normal: 'normal-opengl-4k.jpg',
  roughness: 'roughness-4k.jpg',
  height: 'height-4k.jpg',
};
const source = (asset, slug) => ({
  library: 'Poly Haven',
  asset: `${asset} (${slug})`,
  url: `https://polyhaven.com/a/${slug}`,
  license: 'CC0 1.0',
});
const finish = (id, name, material, coverage, asset, slug) => ({
  id, name, material, nativeRes: 8192, coverage, maps,
  source: source(asset, slug),
  drive4k: null,
  drive16k: null,
});
export const woodFinishes = [
  finish('european-oak', 'Natural European oak', 'Wide-plank European oak flooring', [2400, 2400], 'Wood Floor', 'wood_floor'),
  finish('nordic-light-oak', 'Nordic light oak', 'Light oak plank flooring', [1600, 1600], 'Laminate Floor 02', 'laminate_floor_02'),
  finish('smoked-oak', 'Smoked oak', 'Dark smoked-oak plank flooring', [2000, 2000], 'Dark Wooden Planks', 'dark_wooden_planks'),
  finish('honey-parquet', 'Honey mosaic parquet', 'Mosaic parquet flooring', [1500, 1500], 'Laminate Floor', 'laminate_floor'),
  finish('reclaimed-grey', 'Reclaimed grey oak', 'Weathered grey timber flooring', [2000, 2000], 'Rough Wood', 'rough_wood'),
];
export const woodScenes = [
  { id: 'living', name: 'Living room', surface: 'Floor' },
  { id: 'bedroom', name: 'Bedroom', surface: 'Floor' },
  { id: 'hallway', name: 'Hallway & entry', surface: 'Floor' },
];
