import pilotPackage from '../../agent-system/examples/pilot-article-package.json' with { type: 'json' };
import climateResponsiveFacades from './climateResponsiveFacades.js';
import adaptiveReuseArchitecture from './adaptiveReuseArchitecture.js';
import prefabVsModularHomes from './prefabVsModularHomes.js';
import smallCourtyardDesign from './smallCourtyardDesign.js';
import biophilicDesignArchitecture from './biophilicDesignArchitecture.js';
import bimVsCadArchitects from './bimVsCadArchitects.js';
import passiveHouseVsNetZero from './passiveHouseVsNetZero.js';
import modernVillaReimagined from './modernVillaReimagined.js';

const courtyardWindHouse = {
  id: 'article-courtyard-wind-house-passive-cooling',
  slug: 'courtyard-wind-house-passive-cooling',
  title: 'The House After the Grid: Five Passive-Cooling Moves',
  category: 'Climate & Resilient Architecture',
  meta: '12 MIN READ · 5 ORIGINAL VISUALS',
  status: 'WORLD ARCH JOURNAL CONCEPT STUDY · ISSUE 00',
  excerpt: 'Courtyard Wind House is an original, unbuilt design study asking a direct question: when mechanical cooling pauses, which architectural decisions can still slow heat, move air and preserve a more habitable interior?',
  image: '/assets/editorial/issue-00/courtyard-wind-house-cover.jpg',
  imageAlt: 'Exterior concept view of Courtyard Wind House with a shaded colonnade, water court and wind-catcher',
  visualLabel: 'FIG. 01 · ORIGINAL CONCEPT VISUALISATION · WORLD ARCH JOURNAL, 2026',
  contentHtml: `
    <p>Cooling is often treated as equipment added after the architecture has been decided. Courtyard Wind House begins from the opposite direction. It is a fictional, unbuilt study for a hot-dry climate in which shade, wall depth, air paths and the sequence from room to courtyard are treated as the first cooling system. Mechanical systems may still be necessary, but they are no longer asked to correct every spatial decision.</p>
    <p>The question is timely. The International Energy Agency identifies passive design, behaviour and more efficient equipment as essential to moderating the growth of cooling demand. Recent research also examines “passive survivability”: how long a building can remain tolerable when extreme heat and a power outage overlap. This article does not claim that the concept shown here has been simulated or certified. Instead, it turns established principles into an architectural test bed and states clearly what would still need to be verified.</p>

    <h2>A concept study, not a performance claim</h2>
    <p>The project is organised as two inhabited bars around a long, narrow planted court. A deep colonnade shades the most exposed glazing. Perforated terracotta screens temper low-angle sun while keeping the edge visually porous. A wind-catcher marks the service end of the plan and is drawn as a possible high-level exhaust route. Thick earthen walls give the rooms weight, shadow and a slower thermal response.</p>
    <p>These are design hypotheses, not guaranteed outcomes. The <a href="https://www.energy.gov/sites/prod/files/guide_to_passive_solar_home_design.pdf">U.S. Department of Energy’s passive-solar design guide</a> emphasises that orientation, room arrangement, glazing, thermal mass and landscape must respond to climate. That dependence matters: a strategy useful in a dry climate with a large day-night temperature swing may be ineffective or unsafe in a hot-humid location. The final building would require a real site, weather data, envelope specifications, occupancy assumptions, code review and dynamic thermal analysis.</p>

    <h2>01 — Delay the heat before trying to remove it</h2>
    <p>The first move is sectional. Roofs extend beyond the glass line; the veranda becomes a deep inhabitable buffer rather than a decorative strip. Screens form a second line of defence, catching direct sun before it reaches the inner façade. Openings are recessed so the wall itself becomes a shading device. Each layer reduces the amount of solar radiation that the interior must later absorb or reject.</p>
    <p>Thermal mass is used with equal caution. Heavy walls can moderate short temperature swings because heat moves through them over time, but mass does not make heat disappear. The Department of Energy’s guidance on <a href="https://www.energy.gov/cmei/buildings/zeb-technologies-passive-design-techniques">passive design techniques</a> notes that mass is most useful when exterior cycles and interior conditions allow stored heat to be balanced or released. In this concept, the walls are therefore paired with night ventilation and external shading. Without cool enough nights, controlled air change or an appropriate envelope build-up, mass can retain unwanted heat.</p>

    <h2>02 — Give air a complete route through the plan</h2>
    <p>A window is not a ventilation strategy by itself. Air needs an inlet, a path through occupied space and an outlet. Courtyard Wind House uses the central court as a shared pressure and shade zone: rooms can open toward it while selected openings connect to the outer edge. The plan keeps most occupied spaces relatively shallow, avoiding deep rooms that depend on a single façade.</p>
    <p>The <a href="https://www.wbdg.org/resources/natural-ventilation">Whole Building Design Guide</a> describes natural ventilation as a pressure-driven circuit and stresses the placement of both supply and exhaust openings. It also warns that climate, humidity, smoke, outdoor air quality, security and fire separation can limit when windows or high-level exhaust paths should operate. The wind-catcher in the drawings is therefore a spatial proposition, not a universal device. Its geometry, intake direction, acoustic behaviour, weather protection and fire strategy would all need project-specific engineering.</p>

    <h2>03 — Let the courtyard work as climatic space</h2>
    <p>The court is deliberately narrow enough to receive moving shade from the surrounding walls and screens. Trees are positioned as spatial anchors rather than a decorative perimeter. A linear water element is included as a visual and microclimatic study, but the design does not assume that evaporation is free: water availability, maintenance, humidity and local regulation would decide whether it is responsible or useful.</p>
    <p>More importantly, the courtyard gives every major room a second orientation and creates a sequence of thermal choices. On a mild morning, doors may open fully. At the hottest time, screens and deep reveals protect the inner edge. At night, selected openings could support a purge cycle if outdoor conditions are cooler and safe. Architecture becomes adjustable through ordinary elements—doors, shutters, curtains and thresholds—rather than through a single spectacular gesture.</p>

    <h2>04 — Design for the night as carefully as the photograph</h2>
    <p>Many passive-cooling images celebrate bright daylight, yet the critical reset may happen after sunset. In climates with a meaningful diurnal swing, night ventilation can release heat accumulated in the building fabric. The section therefore connects low openings, shaded circulation and the proposed high exhaust tower. Bedrooms face small planted courts so that privacy and air movement can be studied together.</p>
    <p>This strategy still has boundaries. The WBDG guidance notes that natural ventilation does not remove humidity in the way air-conditioning can, and that local topography and surrounding buildings can change the wind conditions suggested by distant weather stations. A real design would need controls for dusty air, noise, insects and security. It would also need a clear mixed-mode sequence so occupants know when openings should remain closed and when mechanical cooling takes over.</p>

    <h2>05 — Test the plan, not only the envelope</h2>
    <p>A 2026 study in <a href="https://www.sciencedirect.com/science/article/pii/S0378778826008017">Energy and Buildings</a> used thousands of apartment plans to build representative types and simulate their response to historical heatwaves under outage conditions. Its findings are specific to the study’s hot-humid context and should not be transferred directly to this hot-dry concept. The useful editorial lesson is narrower: spatial topology matters, and drawings can be analysed as performance variables rather than neutral containers.</p>
    <p>For Courtyard Wind House, the next design stage would compare several variants: wider and narrower courts, different opening positions, alternate screen porosities, reduced glazing, separate day and night ventilation modes, and a version without the wind-catcher. Daylight, airflow, overheating risk, water demand and embodied impacts would be examined together. A beautiful diagram earns credibility only when it leads to a test that might prove the first idea wrong.</p>

    <h2>What the drawing set is designed to communicate</h2>
    <p>The plan and section are intentionally paired on one editorial sheet. The plan shows the two bars, the continuous shaded route and the distribution of small planted courts. The section reveals what the plan cannot: depth of shade, the height difference that could assist buoyancy-driven exhaust, and the relationship between occupied rooms, water, vegetation and roof.</p>
    <p>The exploded axonometric isolates the five passive propositions—solar control, a complete air path, stack exhaust, thermal mass and night purge. It should be read as an explanatory graphic rather than a construction or engineering drawing. No dimensions, airflow rates or performance values are shown because none have yet been calculated. That omission is deliberate: precise-looking numbers would create false authority.</p>

    <h2>An honest five-part checklist</h2>
    <p>Before a future version of the house could be described as resilient, the team would need to answer five questions. First, what exact climate and extreme-weather scenario is being tested? Second, which indoor safety or comfort criteria define success? Third, how do shade, envelope, air movement and mechanical systems interact across normal operation and an outage? Fourth, can occupants understand and control the building safely? Fifth, do the material and water strategies remain responsible when their full life cycle and local scarcity are considered?</p>
    <p>The broader context is urgent. The <a href="https://www.iea.org/reports/space-cooling-2">IEA’s space-cooling analysis</a> warns that cooling demand can grow sharply without action and places passive design alongside efficient equipment and behaviour. An independent <a href="https://www.designboom.com/architecture/power-goes-out-keep-house-cooling-passive-survivability/">Designboom editorial survey</a> recently connected power-outage resilience with contemporary homes using shade, courtyards, screens, heavy walls and ventilation. Those precedents are used here to frame a question, not to copy a project. The design, text and images in this feature are original to the Eyvan concept study.</p>

    <h2>The house after the grid</h2>
    <p>Passive design should not be romanticised as a substitute for engineering, public infrastructure or safe mechanical cooling. Its value is that it gives architecture useful work to do before power is consumed and after a system is interrupted. Shade becomes a room. Air movement becomes a plan. Material thickness becomes time. The courtyard becomes an environmental choice rather than an image.</p>
    <p>Courtyard Wind House is therefore less a finished answer than a disciplined beginning. It shows how a project can be published attractively while keeping the line between visual possibility and verified performance visible. That line is central to this magazine: inspire first, document carefully, and never allow the confidence of the page to exceed the strength of the evidence.</p>
  `,
  facts: [
    ['PROJECT', 'Courtyard Wind House'],
    ['TYPE', 'Original unbuilt concept study'],
    ['DESIGN', 'World Arch Journal · Farnaz Ghaffarian'],
    ['LOCATION', 'Hot-dry climate · Site not assigned'],
    ['YEAR', '2026'],
    ['STATUS', 'Research concept · Not simulated or certified'],
  ],
  visuals: [
    {
      src: '/assets/editorial/issue-00/courtyard-wind-house-interior.jpg',
      alt: 'Conceptual interior of Courtyard Wind House opening onto a shaded planted courtyard',
      caption: 'FIG. 02 · The shaded veranda extends the living space toward the planted court while recessed openings and a porous screen control direct sun.',
      afterSection: 0,
      layout: 'wide',
    },
    {
      src: '/assets/editorial/issue-00/courtyard-wind-house-passive-diagram.jpg',
      alt: 'Exploded axonometric showing passive cooling strategies for Courtyard Wind House',
      caption: 'FIG. 03 · The environmental sequence: shade, air path, stack exhaust, thermal mass and night purge. Explanatory concept diagram; performance not yet simulated.',
      afterSection: 1,
      layout: 'wide',
    },
    {
      src: '/assets/editorial/issue-00/courtyard-wind-house-plan-section.jpg',
      alt: 'Concept plan and longitudinal section of Courtyard Wind House',
      caption: 'FIG. 04 · Ground-floor plan and longitudinal section. Original concept drawing; not for construction and not to scale.',
      afterSection: 3,
      layout: 'full',
    },
    {
      src: '/assets/editorial/issue-00/courtyard-wind-house-material-detail.jpg',
      alt: 'Rammed earth wall, timber door, limestone threshold and terracotta screen material study',
      caption: 'FIG. 05 · Material study: layered earthen wall, stone threshold, timber opening and porous terracotta screen. Final assemblies require local technical verification.',
      afterSection: 5,
      layout: 'offset',
    },
  ],
  scope: 'Courtyard Wind House is an original, unbuilt editorial concept. The visuals are AI-assisted design studies directed for World Arch Journal. No thermal simulation, construction documentation, certification or site-specific engineering has been completed.',
  faq: [
    { question: 'Is Courtyard Wind House a built project?', answer: 'No. It is an original unbuilt concept created to demonstrate a climate-aware design and editorial workflow.' },
    { question: 'Do the passive strategies guarantee comfort during an outage?', answer: 'No. Their value depends on climate, duration, envelope performance, occupancy and operation. A real project requires modelling, code review and professional engineering.' },
    { question: 'Are the plans available for construction?', answer: 'No. The drawing is an explanatory concept image, not a measured or coordinated construction document.' },
    { question: 'Were images copied from the source publications?', answer: 'No. All project visuals were generated as original concept imagery for this feature. The publications are used only as discovery and editorial context.' },
  ],
  evidence: [
    { publisher: 'U.S. Department of Energy', source_url: 'https://www.energy.gov/sites/prod/files/guide_to_passive_solar_home_design.pdf', claim: 'Passive design integrates orientation, layout, glazing, thermal mass and landscape and must respond to climate.', limitations: 'General design guidance; it does not validate the Eyvan concept or replace project-specific analysis.' },
    { publisher: 'Whole Building Design Guide', source_url: 'https://www.wbdg.org/resources/natural-ventilation', claim: 'Natural ventilation depends on pressure, complete inlet-to-outlet air paths and climate-appropriate operation.', limitations: 'General technical guidance; smoke, humidity, air quality, security and code conditions require local review.' },
    { publisher: 'Energy and Buildings / Elsevier', source_url: 'https://www.sciencedirect.com/science/article/pii/S0378778826008017', claim: 'A 2026 study examined how apartment-plan typologies affect overheating and passive survivability in a hot-humid context.', limitations: 'The study context and apartment types are not the same as this fictional hot-dry house; no result is transferred to the concept.' },
    { publisher: 'International Energy Agency', source_url: 'https://www.iea.org/reports/space-cooling-2', claim: 'Passive design, behavioural change and efficient equipment are important to moderating cooling-demand growth.', limitations: 'Global analysis rather than a design calculation for this project.' },
    { publisher: 'Designboom', source_url: 'https://www.designboom.com/architecture/power-goes-out-keep-house-cooling-passive-survivability/', claim: 'Independent editorial context connects passive survivability with contemporary architectural strategies.', limitations: 'Used for topic discovery and context only; no project text, image or claim has been republished.' },
  ],
  primarySource: { canonical_url: 'https://www.energy.gov/sites/prod/files/guide_to_passive_solar_home_design.pdf', publisher: 'U.S. Department of Energy' },
  audience: 'Architects, design students and readers interested in climate-responsive residential architecture',
  cta: 'Continue through Issue 00 for more evidence-led architecture, drawings and original visual studies.',
  tags: ['Passive Cooling', 'Courtyard House', 'Climate Design', 'Resilience', 'Architecture'],
  author: 'Farnaz Ghaffarian',
  published: true,
};

const pilot = pilotPackage;

const technicalPilot =
  {
    id: `article-${pilot.seo.slug}`,
    slug: pilot.seo.slug,
    title: pilot.seo.title,
    category: pilot.wordpress.category,
    meta: `${pilot.article.word_count.toLocaleString('en-US')} WORDS`,
    status: 'EDITORIAL PILOT · SAMPLE',
    excerpt: pilot.article.excerpt,
    image: '/assets/candidates/office-world/scene-07-principal-design-desk-v3.png',
    imageAlt: 'Sample World Arch Journal studio visual used while dedicated article illustrations are pending',
    visualLabel: 'SAMPLE VISUAL · ARTICLE ILLUSTRATIONS PENDING',
    contentHtml: pilot.article.content_html,
    faq: pilot.article.faq,
    evidence: pilot.source.evidence,
    primarySource: pilot.source,
    audience: pilot.editorial.audience,
    cta: pilot.editorial.cta,
    tags: pilot.wordpress.tags,
    author: pilot.wordpress.author,
    scope: 'This article explains an information-design framework. It does not certify a BIM object, an energy result or software interoperability.',
    published: false,
  };

export const articles = [modernVillaReimagined, passiveHouseVsNetZero, bimVsCadArchitects, biophilicDesignArchitecture, smallCourtyardDesign, prefabVsModularHomes, adaptiveReuseArchitecture, climateResponsiveFacades, courtyardWindHouse, technicalPilot];

export function articleBySlug(slug) {
  return articles.find((article) => article.slug === slug);
}
