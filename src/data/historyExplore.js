// "Keep exploring" map for the Architectural History Series book pages.
// One entry per LIVE book: its anchor in the Architectural History Styles hub
// and the journal articles that genuinely continue its topic. Previous / next
// books in the series are derived from historyDeepPages order, restricted to
// the books listed here — so a book only ever links to books that are live.
// When a new book goes live, add its entry here and the mesh extends itself.

const A = {
  modernVilla: { href: "/articles/modern-villa-reimagined-7-design-principles/", title: "Modern Villa Design Reimagined: 7 Principles for Contemporary Living" },
  stirlingHousing: { href: "/articles/stirling-prize-2026-dense-housing-lessons/", title: "What Good Dense Housing Looks Like: 8 Lessons from the 2026 Stirling Prize Winner" },
  adaptiveReuse: { href: "/articles/adaptive-reuse-architecture-preserve-value/", title: "Adaptive Reuse Architecture: 8 Strategies That Preserve Value" },
  artDeco: { href: "/articles/art-deco-architecture-history-features-buildings/", title: "Art Deco Architecture Explained: The Style That Sold the Machine Age" },
  brutalist: { href: "/articles/brutalist-architecture-history-features-buildings/", title: "Brutalist Architecture Explained: 7 Buildings That Make the Case" },
  frankLloydWright: { href: "/articles/frank-lloyd-wright-organic-architecture-guide/", title: "Frank Lloyd Wright: Organic Architecture, Landmark Works and the Houses You Can Still Visit" },
  biophilic: { href: "/articles/biophilic-design-architecture-wellbeing/", title: "Biophilic Design Architecture: 10 Moves Beyond the Green Wall" },
  courtyardWindHouse: { href: "/articles/courtyard-wind-house-passive-cooling/", title: "The House After the Grid: Five Passive-Cooling Moves" },
  crossVentilation: { href: "/articles/cross-ventilation-apartment-design/", title: "Cross Ventilation in Apartments: 9 Design Moves That Work" },
  climateFacades: { href: "/articles/climate-responsive-facades-cooling-design/", title: "Climate-Responsive Facades: 7 Strategies for Better Cooling" },
  smallCourtyard: { href: "/articles/small-courtyard-design-light-privacy-cooling/", title: "Courtyard House Design: 9 Moves for Light, Privacy and Cooling" },
  apartmentDaylight: { href: "/articles/apartment-daylight-layout-design/", title: "Daylight in Apartments: 8 Layout Decisions Before Bigger Windows" },
  lowCarbonConcrete: { href: "/articles/low-carbon-concrete-epd-guide/", title: "Low-Carbon Concrete: 7 EPD Checks for Architects" },
};

export const historyExplore = {
  "art-nouveau": { hubAnchor: "#study-art-nouveau", articles: [A.biophilic] },
  "gothic": { hubAnchor: "#study-gothic", articles: [] },
  "castles": { hubAnchor: "#study-medieval-castles", articles: [] },
  "baroque-rococo": { hubAnchor: "#study-baroque-rococo", articles: [] },
  "romanesque": { hubAnchor: "#study-romanesque", articles: [] },
  "modernism": { hubAnchor: "#study-modernism-international-style", articles: [A.modernVilla, A.stirlingHousing] },
  "victorian": { hubAnchor: "#study-victorian", articles: [A.adaptiveReuse] },
  "art-deco": { hubAnchor: "#study-art-deco", articles: [A.artDeco] },
  "brutalism": { hubAnchor: "#study-brutalism", articles: [A.brutalist] },
  "frank-lloyd-wright": { hubAnchor: "#study-frank-lloyd-wright", articles: [A.frankLloydWright, A.modernVilla] },
  "the-dome": { hubAnchor: "#study-the-dome", articles: [] },
  "arch-vault-buttress": { hubAnchor: "#study-arch-vault-flying-buttress", articles: [] },
  "columns-classical-orders": { hubAnchor: "#study-columns-orders", articles: [] },
  "light-in-historic-buildings": { hubAnchor: "#study-light-in-historic-buildings", articles: [A.apartmentDaylight] },
  "the-historic-house": { hubAnchor: "#study-the-historic-house", articles: [A.smallCourtyard, A.adaptiveReuse] },
  "art-deco-vs-art-nouveau": { hubAnchor: "#compare-art-deco-vs-art-nouveau", articles: [A.artDeco, A.biophilic] },
  "gothic-vs-romanesque": { hubAnchor: "#compare-gothic-vs-romanesque", articles: [] },
  "how-to-identify-a-buildings-style": { hubAnchor: "#history-method-study", articles: [A.artDeco, A.brutalist] },
  "persian-architecture": { hubAnchor: "#study-persian-architecture", articles: [A.courtyardWindHouse, A.crossVentilation, A.climateFacades] },
  "ancient-rome": { hubAnchor: "#study-ancient-rome", articles: [A.lowCarbonConcrete] },
  "ancient-egypt": { hubAnchor: "#study-ancient-egypt", articles: [] },
};
