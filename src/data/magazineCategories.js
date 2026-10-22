import { articles } from './articles.js';
import { historyStudies, historyComparisons, historyMethod, historyCaseStudy, historyFaq } from './historyAtlas.js';

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
    seoTitle: 'Architectural Styles & History — An Educational Atlas for Identifying Buildings',
    description: 'An educational atlas of architectural history: identify styles by their five signs, compare neighbouring movements side by side, and read the elements, materials and building types behind them. Documented buildings, licensed images and named institutional sources throughout.',
    overview: [
      'This is not a parade of dates. The atlas teaches a skill: how to look at a building and name what made it — the arch that carries it, the wall that lights it, the material that limits and expresses it.',
      'Every entry follows the same discipline: identification facts, the world the style grew from, five signs to check on the street, the materials and construction underneath, documented examples with their sources named, and one lesson worth carrying into contemporary design.',
    ],
    articleSlugs: ['brutalist-architecture-history-features-buildings', 'art-deco-architecture-history-features-buildings', 'frank-lloyd-wright-organic-architecture-guide'],
    hub: {
      studies: historyStudies,
      comparisons: historyComparisons,
      methodStudy: historyMethod,
      caseStudy: historyCaseStudy,
      faq: historyFaq,
      promise: 'Architectural history for understanding buildings — and the design decisions we make today. Not a parade of dates: a working archive for reading facades, structures and materials, and for carrying their lessons into contemporary practice.',
      timelineSpan: [950, 2000],
      startHere: [
        {
          title: 'Identify the style',
          text: 'Learn the five-sign method our guides use — silhouette, openings, ornament, structure and material — and practise it on the styles already in the archive.',
          href: '#history-styles',
          linkLabel: 'Start with the styles',
        },
        {
          title: 'Compare the neighbours',
          text: 'Styles are easiest to tell apart side by side. The comparison studies put two close movements in one frame and mark the differences that actually decide the name.',
          href: '#history-comparisons',
          linkLabel: 'See the comparisons',
        },
        {
          title: 'Follow the material',
          text: 'Every style is also a construction decision. Trace how stone, brick, iron, glass and concrete made the forms possible — then meet the same materials as modern systems in the library.',
          href: '#history-materials',
          linkLabel: 'Follow the material',
        },
      ],
      timeline: [
        { label: 'Romanesque', period: 'c. 1000–1150', start: 1000, end: 1150 },
        { label: 'Gothic', period: 'c. 1140–1500', start: 1140, end: 1500 },
        { label: 'Baroque', period: 'c. 1600–1750', start: 1600, end: 1750 },
        { label: 'Rococo', period: 'c. 1720–1770', start: 1720, end: 1770 },
        { label: 'Victorian', period: '1837–1901', start: 1837, end: 1901 },
        { label: 'Art Nouveau', period: 'c. 1890–1910', start: 1890, end: 1910 },
        { label: 'Modernism', period: 'c. 1900–1965', start: 1900, end: 1965 },
        { label: 'Art Deco', period: 'c. 1910–1939', start: 1910, end: 1939, articleSlug: 'art-deco-architecture-history-features-buildings' },
        { label: 'Brutalism', period: 'c. 1952–1979', start: 1952, end: 1979, articleSlug: 'brutalist-architecture-history-features-buildings' },
      ],
      lanes: [
        {
          id: 'history-styles',
          kicker: 'STYLES & MOVEMENTS',
          aside: 'The movements themselves',
          title: 'Styles & movements',
          blurb: 'What each movement believed, how it was built, and the signs that identify it in the street. Guides open in clusters — a style arrives with the comparison that sharpens it.',
          entries: [
            { id: 'brutalism', articleSlug: 'brutalist-architecture-history-features-buildings', title: 'Brutalism', period: 'c. 1952–1979', learn: 'Why raw concrete became a public language — seven buildings, from Marseille to São Paulo, that make the case.' },
            { id: 'art-deco', articleSlug: 'art-deco-architecture-history-features-buildings', title: 'Art Deco', period: 'c. 1910–1939', learn: 'Geometry, glamour and the machine age: stepped massing, stylised ornament and the Jazz Age city.' },
            { id: 'frank-lloyd-wright', articleSlug: 'frank-lloyd-wright-organic-architecture-guide', title: 'Frank Lloyd Wright & organic architecture', learn: 'How Wright grew buildings from landscape, material and the open plan — and what organic architecture really claimed.' },
            { id: 'art-nouveau', title: 'Art Nouveau', period: 'c. 1890–1910', learn: 'The whiplash line in iron, glass and tile — a total style that tried to make every detail grow.' },
            { id: 'gothic', title: 'Gothic', period: 'c. 1140–1500', learn: 'Pointed arches, rib vaults and walls of glass: how structure learned to become light.' },
            { id: 'romanesque', title: 'Romanesque', period: 'c. 1000–1150', learn: 'Round arches and massive walls — the grounded architecture that Gothic learned to lift.' },
            { id: 'baroque-rococo', title: 'Baroque & Rococo', period: 'c. 1600–1770', learn: "Movement, theatre and ornament: the Baroque's public drama and Rococo's intimate turn, read as one cluster." },
            { id: 'modernism-international-style', title: 'Modernism & the International Style', period: 'c. 1900–1965', learn: 'Function, white walls and a promised new world — what modernism kept, and what it threw away.' },
            { id: 'victorian', title: 'Victorian architecture', period: '1837–1901', learn: 'An era rather than a style: revival upon revival, new industry, new suburbs and the decorated house.' },
          ],
        },
        {
          id: 'history-elements',
          kicker: 'ELEMENTS & STRUCTURE',
          aside: 'The devices underneath',
          title: 'Elements & structure',
          blurb: 'Styles change; the problems do not. This lane studies the parts that carry, span, shelter and admit light — the layer where history becomes construction.',
          entries: [
            { id: 'arch-vault-flying-buttress', title: 'Arch, vault & flying buttress', learn: 'Three devices that carried stone higher, opened the wall and let Gothic interiors fill with glass.' },
            { id: 'the-dome', title: 'The dome', learn: 'Spanning the sacred and the civic — masonry shells, coffering, and the long road to iron and glass.' },
            { id: 'columns-orders', title: 'Columns & orders', learn: 'The classical orders as a grammar of proportion — and the many deliberate ways builders broke it.' },
            { id: 'light-in-historic-buildings', title: 'Light in historic buildings', learn: 'Before electricity, light was structure: clerestories, oculi, courtyards and walls of glass.' },
          ],
        },
        {
          id: 'history-types',
          kicker: 'BUILDING TYPES',
          aside: 'What a building is for',
          title: 'Building types',
          blurb: 'A style describes how a building looks; a type describes what it is for. This lane follows the enduring programmes across the centuries that dressed them.',
          entries: [
            { id: 'medieval-castles', title: 'Medieval castles & fortifications', learn: 'Walls, keeps and gatehouses: fortification as a building type — and the domestic life arranged inside it.' },
            { id: 'the-historic-house', title: 'The historic house', learn: 'Hall, corridor, villa, suburb: how the private house changed as privacy and comfort were invented.' },
          ],
        },
        {
          id: 'history-comparisons',
          kicker: 'COMPARISONS',
          aside: 'Telling styles apart',
          title: 'Comparisons',
          blurb: 'Identification is a comparative skill. Each study sets two close styles in one frame, on the same details, so the difference can be seen rather than memorised.',
          entries: [
            { id: 'art-deco-vs-art-nouveau', title: 'Art Deco vs Art Nouveau', learn: 'Curve against geometry: telling the two most confused styles of the early 1900s apart at a glance.' },
            { id: 'gothic-vs-romanesque', title: 'Gothic vs Romanesque', learn: 'Pointed against round — the arch, the vault and the wall in one field comparison of medieval neighbours.' },
            { id: 'identify-style-method', title: "How to identify a building's style", learn: "The section's field guide: the five-sign method worked through on real facades, step by step." },
          ],
        },
      ],
      method: {
        kicker: 'METHOD & SOURCES',
        title: 'How this section works.',
        text: 'Every guide in this section is built from documented buildings and institutional sources — the RIBA and the Victoria and Albert Museum among them — and checked against the published record before it appears here. Photographs are licensed and credited where they appear, with author, platform and licence named; diagrams are drawn by the journal and labelled as originals. Where historians disagree about a date, a label or an attribution, the guide says so rather than smoothing it over.',
      },
      bridge: {
        kicker: 'FROM HISTORY TO THE WORKSHOP',
        title: 'The material behind the style.',
        text: 'A style is never only a look. Romanesque mass is a decision about stone and its limits; Gothic height is a decision about structure; Brutalist weight is a decision about concrete, cost and honesty. So this section reads every movement three ways: the historic material, the design principle it carries, and the modern system that answers the same problem today. Follow the thread into the library, where those materials are working systems — inspectable, configurable and downloadable.',
        links: [
          { label: 'Explore the material library', href: '/materials/' },
          { label: 'Travertine — Roman stone as a modern panel system', href: '/materials/stone/natural-stone/travertine/' },
          { label: 'Ceramic & porcelain stoneware panels', href: '/materials/stone/ceramic-porcelain/porcelain-stoneware/' },
          { label: 'Fluted wood panels', href: '/materials/wood/fluted-panels/fluted-wood/' },
        ],
      },
    },
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
