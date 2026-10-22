import { mineralMaterials, mineralRoot } from './mineralMaterials.js';
// Shared navigation model for the library, SEO and future product families.
// Empty types are catalog structure, never advertised as available products.
export const collectionCategories = [
  { id: 'wood', name: 'Wood & timber', description: 'Explore wood and timber surfaces by type — fluted panels, flooring and veneers — then compare finishes in room studies and download 4K PBR maps.', types: [
    { id: 'fluted-panels', name: 'Fluted panels' },
    { id: 'thermally-modified-wood', name: 'Thermally modified wood' },
    { id: 'natural-wood', name: 'Natural wood' },
    { id: 'wood-flooring', name: 'Wood flooring' },
    { id: 'veneers', name: 'Wood veneers' },
    { id: 'engineered-wood', name: 'Engineered wood' },
  ] },
  { id: 'stone', name: 'Stone & tile', description: 'Stone, tile and mineral surfaces — including travertine and natural stone collections — compared in facade studies, with downloadable 4K PBR maps.', types: [{ id: 'natural-stone', name: 'Natural stone' }, { id: 'ceramic-porcelain', name: 'Ceramic & porcelain' }] },
  { id: 'concrete', name: 'Concrete', description: 'Architectural concrete finishes — boards, textures and surface treatments for interiors and facades, prepared for visualisation and specification.', types: [{ id: 'concrete-finishes', name: 'Concrete finishes' }] },
  { id: 'plaster', name: 'Plaster & paint', description: 'Decorative interior finishes — plasters, paints and wall coatings for interior visualisation, with tones and textures compared side by side.', types: [{ id: 'plaster-finishes', name: 'Plaster finishes' }] },
  { id: 'brick', name: 'Brick & cladding', description: 'Masonry and facade surfaces — brickwork, cladding and tile systems for exterior and interior visualisation, compared by finish, tone and texture.', types: [{ id: 'brickwork', name: 'Brickwork' }] },
  { id: 'metal', name: 'Metal', description: 'Architectural metal finishes — panels, meshes and coatings for facades and interiors, compared by finish, tone and reflectivity.', types: [{ id: 'metal-finishes', name: 'Metal finishes' }, { id: 'composite-panels', name: 'Aluminium composite panels' }] },
  { id: 'fabric', name: 'Textiles', description: 'Textiles for interior visualisation — upholstery, drapery and soft finishes compared by weave, tone and texture for realistic room studies.', types: [{ id: 'interior-textiles', name: 'Interior textiles' }] },
];
export const collectionProducts = [{
  id: 'fluted-wood', name: 'Original fluted wood', category: 'wood', type: 'fluted-panels',
  path: '/materials/wood/fluted-panels/fluted-wood/',
  image: '/assets/material-studio/fluted-wood/natural-oak/preview.webp',
  scene: '/assets/material-studio/fluted-scenes-v1/bedroom.png',
  description: 'Seven wood-look finish studies across a bedroom, kitchen island and TV wall, with interactive surface lighting and downloadable 4K PBR maps.',
  finishes: 7, contexts: '3 room studies', label: 'WOOD / FLUTED PANELS',
  relatedLinks: [
    { label: 'Mass timber architecture: the CLT design guide', url: '/articles/mass-timber-architecture-clt-design-guide/' },
    { label: 'Apartment acoustic design: quieter homes', url: '/articles/apartment-acoustic-design/' },
    { label: 'Sibling panel: vein-cut travertine facade studies', url: '/materials/stone/natural-stone/travertine/' },
  ],
},{
  id:'travertine',name:'Vein-cut travertine',category:'stone',type:'natural-stone',
  path:'/materials/stone/natural-stone/travertine/',
  image:'/assets/material-studio/travertine/ivory/preview.webp',
  scene:'/assets/material-studio/travertine/scenes/villa.png',
  description:'Five travertine color studies across three exterior facades, with interactive surface lighting and original 4K PBR maps.',
  finishes:5,contexts:'3 facade studies',label:'STONE / TRAVERTINE',
  relatedLinks:[
    { label: 'Climate-responsive facades and passive cooling', url: '/articles/climate-responsive-facades-cooling-design/' },
    { label: 'Rainscreen facade design and water control', url: '/articles/rainscreen-facade-design-water-control/' },
    { label: 'Project: The Voids Villa — courtyards in brick and stone', url: '/projects/the-voids-villa/' },
    { label: 'Sibling panel: original fluted wood room studies', url: '/materials/wood/fluted-panels/fluted-wood/' },
    { label: 'Sibling panel: porcelain stoneware room studies', url: '/materials/stone/ceramic-porcelain/porcelain-stoneware/' },
  ],
},{
  id:'porcelain-stoneware',name:'Scanned ceramic & stone tiles',category:'stone',type:'ceramic-porcelain',
  path:'/materials/stone/ceramic-porcelain/porcelain-stoneware/',
  image:'/assets/material-studio/ceramic-porcelain/ivory-marble/preview.jpg',
  scene:'/assets/material-studio/ceramic-porcelain/scenes/kitchen-ivory-marble.jpg',
  description:'Five real scanned tile finishes — marble, ceramic, stone and terracotta (CC0 photogrammetry) — across a kitchen, bathroom and living room, with interactive surface lighting and downloadable PBR maps up to 16K.',titleSuffix:'4K–16K PBR Maps',
  finishes:5,contexts:'3 room studies',label:'STONE / CERAMIC & PORCELAIN',
  relatedLinks:[
    { label: 'Small apartment layout: storage, privacy and daylight', url: '/articles/small-apartment-layout-storage-privacy-daylight/' },
    { label: 'Accessory dwelling units: the complete guide', url: '/articles/accessory-dwelling-units-complete-guide/' },
    { label: 'Sibling panel: vein-cut travertine facade studies', url: '/materials/stone/natural-stone/travertine/' },
    { label: 'Sibling panel: original fluted wood room studies', url: '/materials/wood/fluted-panels/fluted-wood/' },
  ],
}, ...mineralMaterials.map((material) => ({
  ...material,
  image: `${mineralRoot}${material.id}/${material.finishes[0].id}/preview.webp`,
  scene: `${mineralRoot}${material.id}/${material.finishes[0].id}/preview.webp`,
  finishes: material.finishes.length,
  contexts: 'Interactive surface studio',
  titleSuffix: '4K + 16K tiled maps',
  modifiedAt: material.id === 'aluminium-composite' ? '2026-10-22' : '2026-10-21',
  relatedLinks: material.reading,
}))];
export const categoryPath = id => `/materials/category/${id}/`;
export const typePath = (category, type) => `${categoryPath(category)}${type}/`;
export function collectionRoute(pathname) {
  const match = pathname.match(/^\/materials\/category\/([^/]+)\/(?:([^/]+)\/)?$/);
  if (!match) return null;
  const category = collectionCategories.find(item => item.id === match[1]);
  const type = category?.types.find(item => item.id === match[2]);
  if (!category || (match[2] && !type)) return { name: 'not-found' };
  const products = collectionProducts.filter(item => item.category === category.id && (!type || item.type === type.id));
  return { name: 'material-collection', category, type, products };
}

