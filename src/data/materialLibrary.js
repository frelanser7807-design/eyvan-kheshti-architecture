const PBR = '/assets/material-studio/pbr/';

// The launch catalog starts with a small, honest CC0 sample set. It is a data
// foundation for future manufacturer-authorized products, not a claim to a
// large commercial catalog.
export const materialCategories = [
  { id: 'wood', label: 'Wood & timber', applications: ['floor', 'wall', 'ceiling'] },
  { id: 'stone', label: 'Stone & tile', applications: ['floor', 'wall', 'countertop'] },
  { id: 'concrete', label: 'Concrete', applications: ['floor', 'wall', 'ceiling'] },
  { id: 'plaster', label: 'Plaster & paint', applications: ['wall', 'ceiling'] },
  { id: 'brick', label: 'Brick & cladding', applications: ['wall', 'exterior'] },
  { id: 'fabric', label: 'Textile & fabric', applications: ['interior'] },
  { id: 'metal', label: 'Metal', applications: ['wall', 'exterior'] },
];

export const materialApplications = [
  { id: 'floor', label: 'Floor' },
  { id: 'wall', label: 'Wall' },
  { id: 'ceiling', label: 'Ceiling' },
  { id: 'countertop', label: 'Countertop' },
  { id: 'exterior', label: 'Exterior' },
];

export const materialLibrary = [
  {
    id: 'white-plaster-02', slug: 'white-plaster-02', visualizerMaterialId: 'warm-plaster', name: 'White Plaster 02', family: 'plaster', materialFamily: 'plaster',
    familyLabel: 'Plaster', applications: ['wall', 'ceiling'], colorFamily: 'Warm neutral',
    manufacturer: null, productCode: null, interiorExterior: ['interior'], finish: null, texture: 'Fine plaster surface',
    dimensions: null, thickness: null, layingPatterns: [], origin: null, technicalAttributes: {}, certifications: [], technicalSheets: [], officialProductUrl: null, gallery: [],
    source: { name: 'Poly Haven', author: 'Rob Tuytel', url: 'https://polyhaven.com/a/white_plaster_02', license: 'CC0 1.0' },
    licenseType: 'cc0', licenseEvidence: 'https://polyhaven.com/license', attribution: 'Poly Haven · Rob Tuytel', downloadPolicy: 'Redistributable under CC0 1.0; keep this provenance record.',
    resolution: '1K sample maps', tileable: true, dimensionsMm: null, physicalDimensions: null,
    description: 'A generic seamless plaster sample for visual studies. It is not a named manufacturer product and has no verified product code or physical specification.',
    compatibleSoftware: ['Blender', 'Three.js / WebGL'], softwareTargets: ['Blender', 'Three.js / WebGL'],
    maps: { baseColor: `${PBR}wall-plaster-diff-1k.jpg`, normal: `${PBR}wall-plaster-nor_gl-1k.jpg`, roughness: `${PBR}wall-plaster-rough-1k.jpg` },
    previewMaps: { baseColor: `${PBR}wall-plaster-diff-1k.jpg`, normal: `${PBR}wall-plaster-nor_gl-1k.jpg`, roughness: `${PBR}wall-plaster-rough-1k.jpg` }, pbrMaps: { baseColor: `${PBR}wall-plaster-diff-1k.jpg`, normalOpenGL: `${PBR}wall-plaster-nor_gl-1k.jpg`, roughness: `${PBR}wall-plaster-rough-1k.jpg` },
    availableMaps: ['Base color', 'OpenGL normal', 'Roughness'], missingMaps: ['Displacement / height', 'Ambient occlusion'], relatedProducts: ['floor-tiles-02'], publicationStatus: 'published-sample', updatedAt: '2026-10-12',
  },
  {
    id: 'wood-floor', slug: 'wood-floor', visualizerMaterialId: 'smoked-oak', name: 'Wood Floor', family: 'wood', materialFamily: 'wood',
    familyLabel: 'Wood', applications: ['floor', 'wall', 'ceiling'], colorFamily: 'Natural wood',
    manufacturer: null, productCode: null, interiorExterior: ['interior'], finish: null, texture: 'Wood floor sample',
    dimensions: null, thickness: null, layingPatterns: [], origin: null, technicalAttributes: {}, certifications: [], technicalSheets: [], officialProductUrl: null, gallery: [],
    source: { name: 'Poly Haven', author: 'Dimitrios Savva', url: 'https://polyhaven.com/a/wood_floor', license: 'CC0 1.0' },
    licenseType: 'cc0', licenseEvidence: 'https://polyhaven.com/license', attribution: 'Poly Haven · Dimitrios Savva', downloadPolicy: 'Redistributable under CC0 1.0; keep this provenance record.',
    resolution: '1K sample maps', tileable: true, dimensionsMm: null, physicalDimensions: null,
    description: 'A generic seamless wood-floor sample for visual studies. Species, plank dimensions, finish and manufacturer are not verified product data.',
    compatibleSoftware: ['Blender', 'Three.js / WebGL'], softwareTargets: ['Blender', 'Three.js / WebGL'],
    maps: { baseColor: `${PBR}wood-floor-diff-1k.jpg`, normal: `${PBR}wood-floor-nor_gl-1k.jpg`, roughness: `${PBR}wood-floor-rough-1k.jpg` },
    previewMaps: { baseColor: `${PBR}wood-floor-diff-1k.jpg`, normal: `${PBR}wood-floor-nor_gl-1k.jpg`, roughness: `${PBR}wood-floor-rough-1k.jpg` }, pbrMaps: { baseColor: `${PBR}wood-floor-diff-1k.jpg`, normalOpenGL: `${PBR}wood-floor-nor_gl-1k.jpg`, roughness: `${PBR}wood-floor-rough-1k.jpg` },
    availableMaps: ['Base color', 'OpenGL normal', 'Roughness'], missingMaps: ['Displacement / height', 'Ambient occlusion'], relatedProducts: ['white-plaster-02'], publicationStatus: 'published-sample', updatedAt: '2026-10-12',
  },
  {
    id: 'floor-tiles-02', slug: 'floor-tiles-02', visualizerMaterialId: 'ivory-travertine', name: 'Floor Tiles 02', family: 'stone', materialFamily: 'stone',
    familyLabel: 'Stone & tile', applications: ['floor', 'wall'], colorFamily: 'Light neutral',
    manufacturer: null, productCode: null, interiorExterior: ['interior'], finish: null, texture: 'Tile sample',
    dimensions: null, thickness: null, layingPatterns: [], origin: null, technicalAttributes: {}, certifications: [], technicalSheets: [], officialProductUrl: null, gallery: [],
    source: { name: 'Poly Haven', author: 'Rob Tuytel', url: 'https://polyhaven.com/a/floor_tiles_02', license: 'CC0 1.0' },
    licenseType: 'cc0', licenseEvidence: 'https://polyhaven.com/license', attribution: 'Poly Haven · Rob Tuytel', downloadPolicy: 'Redistributable under CC0 1.0; keep this provenance record.',
    resolution: '1K sample maps', tileable: true, dimensionsMm: null, physicalDimensions: null,
    description: 'A generic seamless tile sample for visual studies. Tile dimensions, material composition, grout specification and manufacturer are not verified product data.',
    compatibleSoftware: ['Blender', 'Three.js / WebGL'], softwareTargets: ['Blender', 'Three.js / WebGL'],
    maps: { baseColor: `${PBR}stone-tile-floor-diff-1k.jpg`, normal: `${PBR}stone-tile-floor-nor_gl-1k.jpg`, roughness: `${PBR}stone-tile-floor-rough-1k.jpg` },
    previewMaps: { baseColor: `${PBR}stone-tile-floor-diff-1k.jpg`, normal: `${PBR}stone-tile-floor-nor_gl-1k.jpg`, roughness: `${PBR}stone-tile-floor-rough-1k.jpg` }, pbrMaps: { baseColor: `${PBR}stone-tile-floor-diff-1k.jpg`, normalOpenGL: `${PBR}stone-tile-floor-nor_gl-1k.jpg`, roughness: `${PBR}stone-tile-floor-rough-1k.jpg` },
    availableMaps: ['Base color', 'OpenGL normal', 'Roughness'], missingMaps: ['Displacement / height', 'Ambient occlusion'], relatedProducts: ['concrete-floor-worn-001'], publicationStatus: 'published-sample', updatedAt: '2026-10-12',
  },
  {
    id: 'concrete-floor-worn-001', slug: 'concrete-floor-worn-001', visualizerMaterialId: 'soft-concrete', name: 'Concrete Floor Worn 001', family: 'concrete', materialFamily: 'concrete',
    familyLabel: 'Concrete', applications: ['floor', 'wall'], colorFamily: 'Cool neutral',
    manufacturer: null, productCode: null, interiorExterior: ['interior'], finish: null, texture: 'Worn concrete sample',
    dimensions: null, thickness: null, layingPatterns: [], origin: null, technicalAttributes: {}, certifications: [], technicalSheets: [], officialProductUrl: null, gallery: [],
    source: { name: 'Poly Haven', author: 'Dimitrios Savva (photography), Rico Cilliers (processing)', url: 'https://polyhaven.com/a/concrete_floor_worn_001', license: 'CC0 1.0' },
    licenseType: 'cc0', licenseEvidence: 'https://polyhaven.com/license', attribution: 'Poly Haven · Dimitrios Savva (photography) · Rico Cilliers (processing)', downloadPolicy: 'Redistributable under CC0 1.0; keep this provenance record.',
    resolution: '1K sample maps', tileable: true, dimensionsMm: null, physicalDimensions: null,
    description: 'A generic seamless concrete sample for visual studies. It is not a tested construction finish or a named supplier product.',
    compatibleSoftware: ['Blender', 'Three.js / WebGL'], softwareTargets: ['Blender', 'Three.js / WebGL'],
    maps: { baseColor: `${PBR}concrete-floor-diff-1k.jpg`, normal: `${PBR}concrete-floor-nor_gl-1k.jpg`, roughness: `${PBR}concrete-floor-rough-1k.jpg` },
    previewMaps: { baseColor: `${PBR}concrete-floor-diff-1k.jpg`, normal: `${PBR}concrete-floor-nor_gl-1k.jpg`, roughness: `${PBR}concrete-floor-rough-1k.jpg` }, pbrMaps: { baseColor: `${PBR}concrete-floor-diff-1k.jpg`, normalOpenGL: `${PBR}concrete-floor-nor_gl-1k.jpg`, roughness: `${PBR}concrete-floor-rough-1k.jpg` },
    availableMaps: ['Base color', 'OpenGL normal', 'Roughness'], missingMaps: ['Displacement / height', 'Ambient occlusion'], relatedProducts: ['floor-tiles-02'], publicationStatus: 'published-sample', updatedAt: '2026-10-12',
  },
];

export const materialBySlug = (slug) => materialLibrary.find((item) => item.slug === slug);
