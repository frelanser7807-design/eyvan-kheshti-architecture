export const mineralRoot = '/assets/material-studio/mineral/';
export const mineralMaterials = [
  {
    id: 'exposed-concrete', name: 'Exposed concrete', category: 'concrete', type: 'concrete-finishes',
    path: '/materials/concrete/concrete-finishes/exposed-concrete/',
    label: 'CONCRETE / EXPOSED SURFACES', repeat: '1200 × 1200 mm',
    description: 'Five exposed-concrete color studies with fine pores, adjustable studio lighting and original 4K PBR maps and 16K seamless tiled editions for architectural visualisation.',
    application: 'Illustrative architectural wall and ceiling studies. The maps do not specify a concrete mix, strength, fire rating or installation system.',
    finishes: [
      { id: 'natural-grey', name: 'Natural grey', color: '#a5a49c', rgb: [165,164,156] },
      { id: 'warm-grey', name: 'Warm grey', color: '#b3aa9a', rgb: [179,170,154] },
      { id: 'light-cement', name: 'Light cement', color: '#cecec4', rgb: [206,206,196] },
      { id: 'sandstone', name: 'Sand tone', color: '#bca98c', rgb: [188,169,140] },
      { id: 'graphite', name: 'Graphite', color: '#636762', rgb: [99,103,98] },
    ],
    reading: [{ label: 'Low-carbon concrete and EPDs', url: '/articles/low-carbon-concrete-epd-guide/' }, { label: 'Brutalist architecture: history and materials', url: '/articles/brutalist-architecture-history-features-buildings/' }],
  },
  {
    id: 'microcement', name: 'Microcement', category: 'plaster', type: 'plaster-finishes',
    path: '/materials/plaster/plaster-finishes/microcement/',
    label: 'MINERAL FINISHES / MICROCEMENT', repeat: '1200 × 1200 mm',
    description: 'Five microcement color studies with subtle trowelled variation, adjustable studio lighting and original 4K PBR maps and 16K seamless tiled editions for interiors.',
    application: 'Illustrative wall and floor finish studies. Wet areas, substrates, waterproofing, slip resistance and sealers require the selected manufacturer’s tested system.',
    finishes: [
      { id: 'warm-ivory', name: 'Warm ivory', color: '#ded6c4', rgb: [222,214,196] },
      { id: 'soft-greige', name: 'Soft greige', color: '#b6afa2', rgb: [182,175,162] },
      { id: 'clay', name: 'Clay', color: '#bb9681', rgb: [187,150,129] },
      { id: 'sage', name: 'Sage', color: '#a4ad9c', rgb: [164,173,156] },
      { id: 'charcoal', name: 'Charcoal', color: '#686b67', rgb: [104,107,103] },
    ],
    reading: [{ label: 'Small apartment planning and material continuity', url: '/articles/small-apartment-layout-storage-privacy-daylight/' }, { label: 'Villa design: a considered material palette', url: '/articles/modern-villa-reimagined-7-design-principles/' }],
  },
  {
    id: 'aluminium-composite', name: 'Aluminium composite', category: 'metal', type: 'composite-panels',
    path: '/materials/metal/composite-panels/aluminium-composite/',
    label: 'FACADE FINISHES / ALUMINIUM COMPOSITE', repeat: '1200 × 1200 mm',
    description: 'Five satin-coated aluminium composite finish studies, adjustable studio lighting, original 4K PBR maps and 16K seamless tiled editions for facade visualisation.',
    application: 'Illustrative coated aluminium composite panel surfaces. These maps represent the coating only; model panel joints, folds and fixings separately. Core composition, fire classification, cavity barriers, wind loading and installation require a tested manufacturer system and project-specific design.',
    finishes: [
      { id: 'pearl-white', name: 'Pearl white', color: '#e4e3dd', rgb: [228,227,221] },
      { id: 'silver-grey', name: 'Silver grey', color: '#b8bcc0', rgb: [184,188,192] },
      { id: 'champagne', name: 'Champagne', color: '#bcae91', rgb: [188,174,145] },
      { id: 'bronze', name: 'Bronze', color: '#88705a', rgb: [136,112,90] },
      { id: 'anthracite', name: 'Anthracite', color: '#454b50', rgb: [69,75,80] },
    ],
    reading: [{ label: 'Rainscreen facades and water control', url: '/articles/rainscreen-facade-design-water-control/' }, { label: 'Climate-responsive facade design', url: '/articles/climate-responsive-facades-cooling-design/' }],
  },
];
export const mineralByPath = (pathname) => mineralMaterials.find((material) => material.path === pathname);
