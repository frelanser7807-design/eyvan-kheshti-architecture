import { articles } from './articles.js';

// A topic only becomes a public landing page after it has a real article.
const definitions = [
  {
    slug: 'ai-digital-practice',
    title: 'AI & Digital Practice',
    description: 'Evidence-led AI, BIM and information workflows for responsible architectural practice, with tools, risks and standards from real digital project work.',
    overview: [
      'Digital practice is not defined by software ownership. It is the disciplined movement of information through design, coordination, review, publication and handover.',
      'These guides compare real workflows, adoption evidence and professional risks. They distinguish exploratory output from verified project information and keep human accountability visible.',
    ],
    articleSlugs: ['ai-in-architecture-2026-adoption-risks-rules', 'bim-vs-cad-architects-workflow'],
  },
  {
    slug: 'architectural-history-styles',
    title: 'Architectural History & Styles',
    description: 'Built history read through material, structure, public life and critical evidence — styles, movements and landmark buildings explained for designers.',
    overview: [
      'Architectural style becomes useful when it helps us read how a building was made, occupied and understood—not when it reduces history to a visual filter.',
      'This archive uses documented buildings and licensed images to connect form with social ambition, construction, preservation and contemporary relevance.',
    ],
    articleSlugs: ['brutalist-architecture-history-features-buildings', 'art-deco-architecture-history-features-buildings', 'frank-lloyd-wright-organic-architecture-guide'],
  },
  {
    slug: 'biophilic-design',
    title: 'Biophilic Design',
    description: 'Evidence-led nature contact, wellbeing, landscape and living systems in architecture — how planting, light and natural patterns improve buildings.',
    overview: [
      'Biophilic design is more than adding plants to a finished interior. This topic examines how daylight, views, air, water, material texture and changing seasonal conditions can be built into spatial decisions from the start.',
      'Our guides separate plausible design principles from health or performance claims that still need project-specific evidence. Use this archive to compare architectural moves, research limits and practical questions for briefs, plans and post-occupancy review.',
    ],
    articleSlugs: ['biophilic-design-architecture-wellbeing'],
  },
  {
    slug: 'climate-design',
    title: 'Climate Design',
    description: 'Architecture shaped by sun, air, heat and the realities of place — passive cooling, ventilation, shading and climate-responsive facades, with evidence.',
    overview: [
      'Climate design begins before equipment selection. Orientation, shade, envelope depth, urban surfaces, ventilation paths and the sequence between inside and outside determine how much work a building asks its systems to do.',
      'This archive brings building-scale and street-scale decisions together. Each story identifies the climate assumptions behind a strategy and marks the point where modelling, engineering, code review or measured performance is still required.',
    ],
    articleSlugs: ['balcony-thermal-bridges-slab-edge', 'urban-heat-cool-streets-design', 'passive-house-vs-net-zero-architecture', 'small-courtyard-design-light-privacy-cooling', 'climate-responsive-facades-cooling-design', 'courtyard-wind-house-passive-cooling'],
  },
  {
    slug: 'climate-resilient-homes',
    title: 'Climate-Resilient Homes',
    description: 'Practical guidance for flood, wildfire, extreme heat and power disruption — resilient details, materials and planning decisions for safer homes.',
    overview: [
      'Resilience is not a single product or an image of toughness. It is the capacity of a home, its site and its occupants to anticipate hazards, limit damage and recover without creating new risks.',
      'These guides connect early design decisions with hazard-specific evidence. They remain educational: local risk maps, codes, insurance requirements and qualified engineering must govern a real project.',
    ],
    articleSlugs: ['wildfire-resilient-home-design', 'flood-resilient-home-design', 'passive-house-vs-net-zero-architecture', 'urban-heat-cool-streets-design', 'courtyard-wind-house-passive-cooling'],
  },
  {
    slug: 'low-carbon-materials',
    title: 'Low-Carbon Materials',
    description: 'Embodied-carbon decisions explained through EPDs, structural systems, envelopes and whole-life trade-offs, with practical low-carbon choices.',
    overview: [
      'A low-carbon material claim is only useful when its unit, scope, geography, strength, service life and building-level consequences are visible.',
      'This collection helps architects compare evidence without treating one product label as a complete carbon strategy. Procurement and project claims still require current, product-specific documentation.',
    ],
    articleSlugs: ['design-for-disassembly-reversible-buildings', 'low-carbon-concrete-epd-guide', 'mass-timber-architecture-clt-design-guide', 'prefab-vs-modular-homes', 'rainscreen-facade-design-water-control', 'low-e-triple-glazing-smart-glass-guide'],
  },
  {
    slug: 'healthy-adaptable-homes',
    title: 'Healthy & Adaptable Homes',
    description: 'Daylight, acoustics, accessibility, privacy and flexible planning for everyday domestic life — homes that stay healthy and adaptable for decades.',
    overview: [
      'A healthy home is shaped by ordinary spatial decisions: what can be heard, how daylight reaches deep rooms, whether circulation remains dignified and how the plan responds as daily life changes.',
      'These guides translate broad principles into room-scale questions while keeping individual needs, local standards and professional assessment in view.',
    ],
    articleSlugs: ['apartment-acoustic-design', 'small-apartment-layout-storage-privacy-daylight', 'universal-design-homes-ageing-in-place', 'biophilic-design-architecture-wellbeing', 'small-courtyard-design-light-privacy-cooling', 'accessory-dwelling-units-complete-guide'],
  },
  {
    slug: 'courtyard-design',
    title: 'Courtyard Design',
    description: 'Compact courts, passive comfort, privacy and the architecture of an open centre — courtyard houses, light wells and planted voids for dense cities.',
    overview: [
      'A courtyard can admit light, create privacy and offer a second orientation, but its proportions and openings also decide whether it becomes a useful climatic space or a heat trap. The right answer changes with latitude, humidity, wind and occupancy.',
      'These articles use plans, sections and clearly scoped concept studies to explain the trade-offs. They are intended as design guidance and critical reading, not as universal performance guarantees or construction documents.',
    ],
    articleSlugs: ['small-courtyard-design-light-privacy-cooling', 'courtyard-wind-house-passive-cooling'],
  },
  {
    slug: 'facades',
    title: 'Facades',
    description: 'Building envelopes explained through performance, detail and design — rainscreens, glazing, shading and brick systems for durable facades.',
    overview: [
      'A facade is simultaneously weather control, thermal boundary, daylight filter, maintenance surface and public face. Good design depends on how those roles meet at openings, edges, joints and changes of material.',
      'The stories in this topic translate envelope principles into decisions architects can inspect: drainage paths, cavities, shading, continuity and tolerances. Product choice and final details must still follow local codes, testing and manufacturer guidance.',
    ],
    articleSlugs: ['balcony-thermal-bridges-slab-edge', 'low-e-triple-glazing-smart-glass-guide', 'rainscreen-facade-design-water-control', 'climate-responsive-facades-cooling-design'],
  },
  {
    slug: 'inclusive-design',
    title: 'Inclusive Design',
    description: 'Universal design, accessible housing and dignified architecture for changing bodies and lives — step-free planning, wayfinding and ageing in place.',
    overview: [
      'Inclusive architecture begins with a continuous journey rather than a list of special products. Arrival, circulation, everyday rooms, controls, sensory conditions and outdoor life must work together.',
      'These guides distinguish international principles from local code requirements and known individual needs. They use original diagrams to explain adaptable planning without turning accessibility into an institutional aesthetic.',
    ],
    articleSlugs: ['universal-design-homes-ageing-in-place'],
  },
  {
    slug: 'concept-studies',
    title: 'Concept Studies',
    description: 'Original architectural ideas, with evidence and speculation clearly separated — concept studies and design propositions, honestly labelled as such.',
    overview: [
      'Concept studies are useful when they make their uncertainty visible. They can test a plan, section, material sequence or environmental idea without pretending that an unbuilt image has already proved performance.',
      'Every study in this archive states its scope, source context and next verification step. Drawings and AI-assisted visuals are editorial tools, not construction documentation, certification or evidence of a completed building.',
    ],
    articleSlugs: ['courtyard-wind-house-passive-cooling'],
  },
  {
    slug: 'adaptive-reuse',
    title: 'Adaptive Reuse',
    description: 'What existing buildings can teach us about value, materials and change — retrofit, conversion and adaptive reuse strategies that extend building life.',
    overview: [
      'Adaptive reuse starts with an existing structure, but preservation alone is not the objective. The design must decide what carries cultural, spatial and embodied value, what can change safely and what new use can sustain the building over time.',
      'Our coverage connects survey, access, fire strategy, services, material recovery and long-term flexibility. It treats reuse as a design and evidence problem rather than a visual before-and-after story.',
    ],
    articleSlugs: ['design-for-disassembly-reversible-buildings', 'adaptive-reuse-architecture-preserve-value'],
  },
  {
    slug: 'building-systems',
    title: 'Building Systems',
    description: 'How construction methods, structures and technical interfaces shape architecture — assemblies, details and systems explained for working designers.',
    overview: [
      'Building systems influence cost, programme, carbon, tolerances, transport and the freedom to change a project later. Labels such as prefab, modular or mass timber are starting points, not automatic guarantees of speed or sustainability.',
      'This topic compares systems through the decisions that matter before procurement: geometry, interfaces, local capability, certification, logistics and whole-life performance. Claims are tied to sources and their limitations.',
    ],
    articleSlugs: ['design-for-disassembly-reversible-buildings', 'prefab-vs-modular-homes', 'accessory-dwelling-units-complete-guide'],
  },
  {
    slug: 'bim-revit',
    title: 'BIM & Revit',
    description: 'Model-based design, documentation and practical digital workflows — BIM and Revit guidance, from modelling standards to coordinated drawings.',
    overview: [
      'BIM and CAD are often compared as software categories when the more useful question is how information, responsibility and revision move through a project. A model only creates value when its purpose, level of information and exchange rules are explicit.',
      'These guides focus on workflow choices, coordination risks and deliverables architects can define. They do not promise interoperability or replace project-specific BIM execution planning, standards or quality control.',
    ],
    articleSlugs: ['bim-vs-cad-architects-workflow'],
  },
];

export const publishedMagazineArticles = articles.filter((article) => article.published);

export const magazineCategories = definitions
  .map((category) => ({
    ...category,
    articles: publishedMagazineArticles.filter((article) => category.articleSlugs.includes(article.slug)),
  }))
  .filter((category) => category.articles.length > 0);

export function magazineCategoryBySlug(slug) {
  return magazineCategories.find((category) => category.slug === slug);
}
