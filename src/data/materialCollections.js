// Shared navigation model for the library, SEO and future product families.
// Empty types are catalog structure, never advertised as available products.
export const collectionCategories = [
  { id: 'wood', name: 'Wood & timber', description: 'Explore wood-look surfaces by type, then choose a product and finish.', types: [
    { id: 'fluted-panels', name: 'Fluted panels' },
    { id: 'thermally-modified-wood', name: 'Thermally modified wood' },
    { id: 'natural-wood', name: 'Natural wood' },
    { id: 'wood-flooring', name: 'Wood flooring' },
    { id: 'veneers', name: 'Wood veneers' },
    { id: 'engineered-wood', name: 'Engineered wood' },
  ] },
  { id: 'stone', name: 'Stone & tile', description: 'Stone, tile and mineral surfaces.', types: [{ id: 'natural-stone', name: 'Natural stone' }, { id: 'ceramic-porcelain', name: 'Ceramic & porcelain' }] },
  { id: 'concrete', name: 'Concrete', description: 'Architectural concrete finishes.', types: [{ id: 'concrete-finishes', name: 'Concrete finishes' }] },
  { id: 'plaster', name: 'Plaster & paint', description: 'Decorative interior finishes.', types: [{ id: 'plaster-finishes', name: 'Plaster finishes' }] },
  { id: 'brick', name: 'Brick & cladding', description: 'Masonry and facade surfaces.', types: [{ id: 'brickwork', name: 'Brickwork' }] },
  { id: 'metal', name: 'Metal', description: 'Architectural metal finishes.', types: [{ id: 'metal-finishes', name: 'Metal finishes' }] },
  { id: 'fabric', name: 'Textiles', description: 'Textiles for interior visualization.', types: [{ id: 'interior-textiles', name: 'Interior textiles' }] },
];
export const collectionProducts = [{
  id: 'fluted-wood', name: 'Original fluted wood', category: 'wood', type: 'fluted-panels',
  path: '/materials/wood/fluted-panels/fluted-wood/',
  image: '/assets/material-studio/fluted-wood/natural-oak/preview.webp',
  scene: '/assets/material-studio/fluted-scenes-v1/bedroom.png',
  description: 'Seven wood-look finish studies across a bedroom, kitchen island and TV wall, with interactive surface lighting and downloadable 4K PBR maps.',
  finishes: 7,
}];
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
