// Architectural History hub — educational atlas content.
// Every study follows the same discipline: identification facts, formation
// context, five identification signs (each with an image and its limitation),
// materials & construction (historic practice first, modern equivalents named
// separately), documented examples with institutional sources, and one lesson
// for contemporary design. Photographs are licensed via Wikimedia Commons and
// credited per image; diagrams are World Arch Journal originals, labelled.

const H = "/assets/history-hub";

export const historyStudies = [
  {
    id: "art-nouveau",
    title: "Art Nouveau",
    facts: { period: "c. 1890–1910, flourishing 1895–1905", geography: "Belgium and France first, then across Europe and the Americas under local names", types: "Town houses, apartment blocks, department stores, cafés, metro entrances, interiors and furniture", note: "Names vary by country — Modernisme in Catalonia, Jugendstil in Germany, Sezession in Austria — for one international movement, not separate styles." },
    context: [
      "Art Nouveau emerged in the 1890s in prosperous industrial cities whose wealthy clients wanted houses unlike historicist copies. New materials made that possible: exposed iron and glass, large shopfront glazing and thin structural members could curve and open interiors to light. Designers such as Victor Horta in Brussels and Hector Guimard in Paris treated plan, stair, railing and door handle as one continuous design.",
      "Its visual culture drew on botany, Japanese prints and Symbolist art, turning stems, tendrils and the whiplash curve into a complete ornamental system. It reacted against academic historicism and cheap industrial imitation by insisting craft and machine production could produce something new. Exhibitions, magazines and department stores spread it rapidly, then taste and cost pushed architecture toward straighter geometry after about 1910."
    ],
    signs: [
      { name: "Whiplash curve", look: "Asymmetrical lines swell, whip and taper like plant stems across railings, glass, stone and lettering, with no straight repeat.", limit: "Curves alone also occur in Baroque and Rococo; check date and integration.", img: "detail1" },
      { name: "Structure as ornament", look: "Slender iron columns, brackets and balustrades stay visible and flower into decoration instead of hiding behind masonry or plaster.", limit: "Exposed iron also appears in purely industrial buildings of the period.", img: "detail1" },
      { name: "Total interior", look: "Stair, mosaic floor, stained glass, furniture and handles share the same motifs, designed together for one room sequence.", limit: "Later sympathetic refurbishment can imitate a total interior convincingly.", img: "detail2" },
      { name: "Asymmetrical facade", look: "Windows differ in size and shape floor by floor, bays bow outward and ornament concentrates around doors and balconies.", limit: "Asymmetry alone is common in vernacular building and proves little.", img: "hero" },
      { name: "Natural imagery, stylised", look: "Irises, dragonflies, peacocks and sea forms are flattened into pattern rather than carved as realistic naturalistic sculpture.", limit: "Realistic floral carving belongs equally to Gothic Revival work.", img: "detail2" }
    ],
    materials: "Historic practice combined load-bearing brick or stone with exposed cast and wrought iron, large sheets of glass, stained glass, ceramic tile and mosaic, sgraffito plaster and fine hardwoods. Horta and Guimard used iron structurally and decoratively in the same member. The modern equivalent is laser-cut or cast metal with laminated glazing reproducing the line, not the construction.",
    examples: [
      { name: "Horta Museum (Horta House and Studio)", place: "Brussels, Belgium", date: "1898–1901", look: "Asymmetrical stone facade, then the top-lit stair where iron railings, mosaic and stained glass grow from one another.", sourceName: "UNESCO World Heritage Centre", sourceUrl: "https://whc.unesco.org/en/list/1005/" },
      { name: "Casa Batlló", place: "Barcelona, Spain", date: "1904–1906", look: "Undulating facade in broken ceramic trencadís, bone-like stone balconies and a scaly roof ridge by Antoni Gaudí.", sourceName: "UNESCO World Heritage Centre", sourceUrl: "https://whc.unesco.org/en/list/320/" },
      { name: "Castel Béranger", place: "Paris, France", date: "1895–1898", look: "Guimard's apartment block mixing stone, brick and iron, with a famous entrance gate of interlacing whiplash ironwork.", sourceName: "Smarthistory", sourceUrl: "https://smarthistory.org/art-nouveau/" }
    ],
    lesson: "Design the whole sequence, not the facade alone: let structure, light and the smallest handle carry one clear idea through every room.",
    sources: [
      { name: "UNESCO — Major Town Houses of the Architect Victor Horta", url: "https://whc.unesco.org/en/list/1005/" },
      { name: "Victoria and Albert Museum — Art Nouveau", url: "https://www.vam.ac.uk/articles/art-nouveau" },
      { name: "Smarthistory — Art Nouveau", url: "https://smarthistory.org/art-nouveau/" }
    ],
    deepPage: "/magazine/architectural-history-styles/art-nouveau/",
    pdf: "/downloads/history/art-nouveau.pdf",
    bookCover: "/assets/history-deep/art-nouveau/book-cover.jpg",
    readPath: "/magazine/architectural-history-styles/art-nouveau/read/",
    images: {
      hero: { src: `${H}/art-nouveau-hero.jpg`, alt: "Full facade of Casa Batlló in Barcelona with undulating stone, mosaic tile and mask-like balconies", credit: "Photo: Jaume Meneses, via Wikimedia Commons (CC BY-SA 2.0)" },
      detail1: { src: `${H}/art-nouveau-detail1.jpg`, alt: "Cast-iron Paris Métro entrance by Guimard with curling plant-like supports and amber glass canopy", credit: "Photo: Moonik, via Wikimedia Commons (CC BY-SA 3.0)" },
      detail2: { src: `${H}/art-nouveau-detail2.jpg`, alt: "Top-lit staircase in the Horta Museum with sinuous iron railing under a stained-glass skylight", credit: "Photo: via Wikimedia Commons (CC0)" }
    }
  },
  {
    id: "gothic",
    title: "Gothic",
    facts: { period: "c. 1140–1500, Early, High and Late phases succeeding one another regionally", geography: "Born in the Île-de-France, then France, England, the German lands, Spain, Italy and Central Europe", types: "Cathedrals, abbey and parish churches, chapels, later town halls, guildhalls and colleges", note: "National labels differ — Early English, Decorated and Perpendicular in England, Rayonnant and Flamboyant in France — within one evolving structural system." },
    context: [
      "Gothic began around 1140 at the royal Abbey of Saint-Denis near Paris, where Abbot Suger rebuilt the choir with rib vaults, pointed arches and large stained-glass windows. Wealthy bishoprics, pilgrimage income and skilled travelling masons let cathedral chapters compete in height and light. The pointed arch and rib vault concentrated loads onto piers, so walls could thin and open.",
      "Its visual culture treated light as theology: coloured glass narrated scripture to a largely non-reading congregation while sculpture filled portals with ordered teaching. It reacted against the heavy, dim interiors of Romanesque building, though it kept its cruciform plans and towers. From France it spread through monastic networks, royal marriages and mason lodges, mutating locally for four centuries."
    ],
    signs: [
      { name: "Pointed arch", look: "Arches meet at a crown point over doors, windows and arcades, often in several receding moulded orders.", limit: "Pointed arches also appear earlier in Islamic and Romanesque building.", img: "hero" },
      { name: "Rib vault", look: "Stone ribs cross each ceiling bay diagonally, carrying thin webbing and channelling thrust down onto clustered shafts.", limit: "Decorative ribs in later vaults can look structural when they are not.", img: "detail1" },
      { name: "Flying buttress", look: "Exterior stone arches leap from clerestory wall to outer piers, visibly countering vault thrust above the aisle roof.", limit: "Hidden quadrant arches do similar work without the famous silhouette.", img: "hero" },
      { name: "Bar tracery and rose", look: "Thin stone bars divide huge windows into patterned lights, culminating in a circular rose window on the facade.", limit: "Plate tracery in early work is pierced, not yet barred.", img: "detail2" },
      { name: "Vertical, skeletal wall", look: "Clustered shafts run uninterrupted from floor to vault, piers slim down and glass replaces most solid wall.", limit: "Perpendicular and late work can read flatter and more grid-like.", img: "detail1" }
    ],
    materials: "Historic Gothic is cut stone laid in lime mortar, vaulted in stone over timber centring, roofed in lead over great timber trusses and glazed with pot-metal stained glass held in lead cames and iron armatures. Iron ties quietly restrain spreading walls. The modern equivalent is a steel or concrete frame clad in stone, which imitates the profile without the thrust system.",
    examples: [
      { name: "Chartres Cathedral", place: "Chartres, France", date: "1194–1220", look: "West front and Royal Portal, then the nave: flying buttresses, vast clerestory and largely original stained glass including the Blue Virgin window.", sourceName: "UNESCO World Heritage Centre", sourceUrl: "https://whc.unesco.org/en/list/81/" },
      { name: "Sainte-Chapelle", place: "Paris, France", date: "1242–1248", look: "Upper chapel where wall almost disappears: fifteen tall windows of Rayonnant glass between slender buttressed piers, built for royal relics.", sourceName: "UNESCO World Heritage Centre", sourceUrl: "https://whc.unesco.org/en/list/600/" },
      { name: "Cologne Cathedral", place: "Cologne, Germany", date: "begun 1248", look: "Five-aisled choir modelled on Amiens, extreme height and twin-spired west front completed to medieval plans in the nineteenth century.", sourceName: "UNESCO World Heritage Centre", sourceUrl: "https://whc.unesco.org/en/list/292/" }
    ],
    lesson: "Make structure do the expressive work: when loads follow a legible path, walls can open, light can enter and ornament follows naturally.",
    sources: [
      { name: "UNESCO — Chartres Cathedral", url: "https://whc.unesco.org/en/list/81/" },
      { name: "Smarthistory — Gothic architecture: an introduction", url: "https://smarthistory.org/gothic-architecture-an-introduction/" },
      { name: "Historic England", url: "https://historicengland.org.uk/" }
    ],
    deepPage: "/magazine/architectural-history-styles/gothic/",
    pdf: "/downloads/history/gothic.pdf",
    bookCover: "/assets/history-deep/gothic/book-cover.jpg",
    readPath: "/magazine/architectural-history-styles/gothic/read/",
    images: {
      hero: { src: `${H}/gothic-hero.jpg`, alt: "West facade of Chartres Cathedral with two contrasting spires, three sculpted portals and rose window", credit: "Photo: Nina Aldin Thune, via Wikimedia Commons (CC BY 2.5)" },
      detail1: { src: `${H}/gothic-detail1.jpg`, alt: "Chartres nave interior with pointed arcades, rib vaults and tall stained-glass clerestory", credit: "Photo: Stephen Taber, via Wikimedia Commons (CC BY-SA 4.0)" },
      detail2: { src: `${H}/sainte-chapelle-full.jpg`, alt: "Stained glass of Sainte-Chapelle filling the wall between slender stone piers with coloured light", credit: "Photo: Oldmanisold, via Wikimedia Commons (CC BY-SA 4.0)" }
    }
  },
  {
    id: "romanesque",
    title: "Romanesque",
    facts: { period: "c. 1000–1200, giving way to Gothic from the mid-12th century", geography: "Across Latin Europe — France, the German Empire, Italy, Spain and Norman England", types: "Cathedrals, abbey churches, pilgrimage churches, parish churches, castles and baptisteries", note: "Called Norman in England after the Conquest of 1066; Italian Romanesque keeps classical marble revetment quite unlike northern massing, so region must always be stated." },
    context: [
      "After the year 1000, stabilising kingdoms, monastic reform and growing pilgrimage traffic funded a Europe-wide rebuilding in permanent stone. Monasteries such as Cluny, pilgrimage roads to Santiago de Compostela and Norman rulers in England and Sicily spread shared plans through travelling masons. Stone barrel and groin vaults replaced flammable timber roofs, demanding far thicker walls and piers.",
      "Its visual culture revived Roman engineering and carving — round arches, groin vaults, Corinthian-derived capitals — filtered through local stone and monastic discipline. Sculpture returned at scale on portals and capitals, teaching biblical stories through expressive, patterned figures. It reacted against small, timber-roofed early medieval churches, then itself yielded where masons learned to lighten the vault into Gothic."
    ],
    signs: [
      { name: "Round arch throughout", look: "Semicircular arches span every opening and arcade, often recessed in plain or chevron-moulded orders over massive piers.", limit: "Round arches return in Renaissance and revival work of any date.", img: "hero" },
      { name: "Massive wall, small window", look: "Walls read as solid masonry first, with small round-headed windows deeply splayed through the thickness.", limit: "Fortified secular buildings share massiveness for defensive reasons.", img: "hero" },
      { name: "Barrel or groin vault", look: "Continuous semicircular stone tunnel over the nave, or intersecting groins over square bays, with transverse arches between.", limit: "Many Romanesque naves kept timber roofs; vaulting is not universal.", img: "detail1" },
      { name: "Sculpted portal and capitals", look: "A great western or transept doorway carries a carved tympanum, often Christ in Majesty, with historiated capitals inside.", limit: "Weathering and later recutting can obscure originally sharp carving.", img: "detail2" },
      { name: "Twin towers and crossing", look: "Paired western towers and a crossing tower or dome give a blocky, stepped silhouette of distinct masses.", limit: "Single-tower and towerless schemes are common in smaller churches.", img: "hero" }
    ],
    materials: "Historic Romanesque is rubble or ashlar stone in thick lime-mortared walls, vaulted in stone or roofed in timber and lead, with marble revetment and mosaic in Italian and Sicilian centres. Openings stay small because the wall itself carries and resists the vault. The modern equivalent is a framed structure with stone cladding, where apparent thickness is applied, not structural.",
    examples: [
      { name: "Speyer Cathedral", place: "Speyer, Germany", date: "1030–1061, vaulted c. 1082–1106", look: "Vast groin-vaulted nave, dwarf gallery running round the exterior and four towers balancing two domed crossings in red sandstone.", sourceName: "UNESCO World Heritage Centre", sourceUrl: "https://whc.unesco.org/en/list/168/" },
      { name: "Durham Cathedral", place: "Durham, England", date: "1093–1133", look: "Norman nave with alternating compound and drum piers and the earliest surviving high rib vaults over a great church.", sourceName: "UNESCO World Heritage Centre", sourceUrl: "https://whc.unesco.org/en/list/370/" },
      { name: "Cathedral of Santiago de Compostela", place: "Santiago de Compostela, Spain", date: "1075–1211", look: "Pilgrimage plan with ambulatory and radiating chapels, barrel-vaulted nave and the carved Pórtico de la Gloria of Master Mateo.", sourceName: "UNESCO World Heritage Centre", sourceUrl: "https://whc.unesco.org/en/list/347/" }
    ],
    lesson: "Let mass earn its presence: thick, calm walls and small, well-placed openings give interiors gravity, coolness and acoustic stillness modern buildings often lack.",
    sources: [
      { name: "UNESCO — Speyer Cathedral", url: "https://whc.unesco.org/en/list/168/" },
      { name: "Smarthistory — Romanesque art and architecture", url: "https://smarthistory.org/romanesque-art/" },
      { name: "UNESCO — Durham Castle and Cathedral", url: "https://whc.unesco.org/en/list/370/" }
    ],
    deepPage: "/magazine/architectural-history-styles/romanesque/",
    pdf: "/downloads/history/romanesque.pdf",
    bookCover: "/assets/history-deep/romanesque/book-cover.jpg",
    readPath: "/magazine/architectural-history-styles/romanesque/read/",
    images: {
      hero: { src: `${H}/romanesque-hero.jpg`, alt: "Speyer Cathedral in red sandstone with rounded apse, dwarf gallery and towers", credit: "Photo: Moleskine, via Wikimedia Commons (CC BY 4.0)" },
      detail1: { src: `${H}/romanesque-detail1.jpg`, alt: "Durham Cathedral nave with huge cylindrical Norman piers, round arches and stone rib vault", credit: "Photo: Neil Theasby, via Wikimedia Commons (CC BY-SA 2.0)" },
      detail2: { src: `${H}/romanesque-detail2.jpg`, alt: "Carved Romanesque figures and tympanum of the Pórtico de la Gloria at Santiago de Compostela", credit: "Photo: D.Rovchak, via Wikimedia Commons (CC BY-SA 4.0)" }
    }
  },
  {
    id: "art-deco",
    title: "Art Deco",
    deepRead: "/articles/art-deco-architecture-history-features-buildings/",
    facts: { period: "c. 1920–1939, with roots at the 1925 Paris Exposition", geography: "France and the United States first, then worldwide — Britain, India, Egypt, Latin America and beyond", types: "Skyscrapers, cinemas, hotels, ocean liners, department stores, apartment blocks and civic buildings", note: "Later American work is often called Streamline Moderne; British and colonial Deco varies from jazzy ornament to stripped classicism." },
    context: [
      "Art Deco crystallised at Paris's 1925 Exposition Internationale des Arts Décoratifs, then rode interwar prosperity, steel-frame construction, lifts and reinforced concrete. Skyscraper zoning, cinema chains and ocean liners gave it tall, glamorous canvases for modern luxury.",
      "It reacted against Art Nouveau's curves and historicist revival alike, replacing them with symmetry, geometry and stylised sunbursts, chevrons and zigzags drawn from Egyptian, Aztec and machine imagery. Magazines, film and empire exhibitions carried the look worldwide within a decade."
    ],
    signs: [
      { name: "Stepped massing", look: "Towers rise in setbacks to a crown, ziggurat-like, emphasising height and a strong central axis.", limit: "Setbacks were often zoning law, not style alone.", img: "hero" },
      { name: "Geometric ornament", look: "Chevrons, zigzags, sunbursts and stylised eagles repeat in stone, metal and glass at entrances and crowns.", limit: "Geometry alone also marks later modernism.", img: "detail1" },
      { name: "Strong symmetry", look: "Facades compose around a central entrance and vertical piers, with window strips subordinated to the frame.", limit: "Streamlined buildings deliberately break symmetry for curves.", img: "hero" },
      { name: "Rich modern materials", look: "Polished granite, stainless steel, aluminium, vitrolite and neon are displayed as luxury finishes.", limit: "Expensive cladding can dress a conventional building.", img: "detail2" },
      { name: "Streamlined curve", look: "Later work rounds corners, wraps horizontal bands and adds portholes, quoting ships, trains and aircraft.", limit: "Curved corners persist in purely functional modernism.", img: "detail2" }
    ],
    materials: "Historic Deco pairs a steel or reinforced-concrete frame with stone, brick or terracotta cladding, stainless-steel and aluminium spandrels, glass block, vitrolite and rich lobby marbles, bronze and Bakelite. Ornament was cast, carved or pressed industrially. The modern equivalent is unitised curtain walling with applied fins reproducing the profile.",
    examples: [
      { name: "Chrysler Building", place: "New York, United States", date: "1928–1930", look: "Stainless-steel crown of radiating sunburst arches, eagle gargoyles quoting car bonnet ornaments and a needle spire by William Van Alen.", sourceName: "Smarthistory", sourceUrl: "https://smarthistory.org/chrysler-building/" },
      { name: "Eltham Palace", place: "London, England", date: "1933–1936", look: "Courtauld house in brick with stone dressings: entrance hall with marquetry, glass dome and streamlined interiors beside a medieval great hall.", sourceName: "Historic England", sourceUrl: "https://historicengland.org.uk/listing/the-list/list-entry/1000821" },
      { name: "Eros Cinema", place: "Mumbai, India", date: "1938", look: "Stepped, ziggurat-topped cinema in Agra red sandstone within Mumbai's UNESCO-listed Art Deco precinct, second in scale only to Miami.", sourceName: "UNESCO World Heritage Centre", sourceUrl: "https://whc.unesco.org/en/list/1480/" }
    ],
    lesson: "Celebrate new technology in the ornament itself: let lifts, light and speed shape decoration rather than hiding modern systems behind historical dress.",
    sources: [
      { name: "UNESCO — Victorian Gothic and Art Deco Ensembles of Mumbai", url: "https://whc.unesco.org/en/list/1480/" },
      { name: "Victoria and Albert Museum — Art Deco", url: "https://www.vam.ac.uk/articles/art-deco" }
    ],
    deepPage: "/magazine/architectural-history-styles/art-deco/",
    pdf: "/downloads/history/art-deco.pdf",
    bookCover: "/assets/history-deep/art-deco/book-cover.jpg",
    readPath: "/magazine/architectural-history-styles/art-deco/read/",
    images: {
      hero: { src: `${H}/art-deco-hero.jpg`, alt: "Chrysler Building in New York rising to its terraced stainless-steel crown and spire", credit: "Photo: diego_cue, via Wikimedia Commons (CC BY-SA 3.0)" },
      detail1: { src: `${H}/art-deco-detail1.jpg`, alt: "Close view of geometric Art Deco motifs in stone and metal on the Chrysler Building", credit: "Photo: cogito ergo imago, via Wikimedia Commons (CC BY-SA 2.0)" },
      detail2: { src: `${H}/art-deco-detail2.jpg`, alt: "Eltham Palace entrance hall with wood marquetry, curved walls and a glazed circular dome", credit: "Photo: Tom Parnell, via Wikimedia Commons (CC BY-SA 4.0)" }
    }
  },
  {
    id: "baroque-rococo",
    title: "Baroque & Rococo",
    facts: { period: "Baroque c. 1600–1750; Rococo c. 1720–1770", geography: "Baroque begins in Rome, then France, Spain, Austria and Latin America; Rococo centred on France and southern Germany", types: "Churches, palaces, piazzas and state rooms; Rococo mainly salons, pavilions and private interiors", note: "Paired here as one story in two scales: Baroque is public, monumental drama, while Rococo is its lighter, intimate, interior counterpart." },
    context: [
      "Baroque emerged as the Counter-Reformation Church and absolute monarchies needed architecture that persuaded through emotion, scale and spectacle. In Rome, popes rebuilt the city as a theatre of faith; in France, Louis XIV centralised power at Versailles. Improved engineering, large-scale stucco, fresco and gilding workshops, and absolutist patronage made unified, overwhelming ensembles possible.",
      "Its visual culture fused architecture, sculpture and painting into one illusion: ceilings open to heaven, light dramatises altars, and axes organise entire cities. As court taste tired of grandeur, Rococo reacted by shrinking the drama indoors — asymmetry, shells, scrolls and pastel colour for aristocratic leisure. Baroque forms spread globally through empire and mission, Rococo mainly through pattern books and craftsmen."
    ],
    signs: [
      { name: "Colossal, embracing space (Baroque)", look: "Look for vast ovals, sweeping colonnades and piazzas that gather crowds and pull movement toward church or palace.", limit: "Grand planning also appears in later classicism; check for dynamic curvature, not just size.", img: "hero" },
      { name: "Broken, layered facades (Baroque)", look: "Look for facades that advance and recede, with paired columns, broken pediments and deep shadow creating constant movement across the surface.", limit: "Ornament alone is not Baroque; the whole wall must feel modelled, not flatly decorated.", img: "detail1" },
      { name: "Illusion and integrated arts (Baroque)", look: "Look for fresco, stucco and sculpture merging so ceilings dissolve into painted heavens and figures spill beyond their frames.", limit: "Rich interiors occur in many periods; Baroque illusion aims to erase architectural boundaries.", img: "detail1" },
      { name: "C-scrolls and rocaille (Rococo)", look: "Look for delicate C and S scrolls, shell-like rocaille, and ornament that is deliberately asymmetrical, light and playfully irregular.", limit: "Easily confused with Baroque richness; Rococo ornament is smaller, thinner and more capricious.", img: "detail2" },
      { name: "Pastel intimate rooms (Rococo)", look: "Look for small oval salons, mirrored panels, pale gold boiserie, pastel colour and furniture designed as one unified interior.", limit: "Pastel colour alone proves little; scale, asymmetry and integrated decoration must coincide.", img: "detail2" }
    ],
    materials: "Historic Baroque construction is load-bearing masonry — brick cores faced in stone, travertine or stucco — with timber or masonry vaults, fresco in wet plaster, scagliola imitating marble, and carved, gilded wood. Rococo interiors rely on carved timber boiserie, stucco and mirror glass. Modern resin, fibreglass and printed imitations are later substitutes, not historic practice.",
    examples: [
      { name: "St Peter's Square", place: "Vatican City", date: "1656–1667, Gian Lorenzo Bernini", look: "Stand on the marked discs to see the four-deep colonnades align into one row — Baroque staging of crowd, church and obelisk.", sourceName: "UNESCO World Heritage Centre", sourceUrl: "https://whc.unesco.org/en/list/286/" },
      { name: "Palace and Gardens of Versailles", place: "Versailles, France", date: "Begun 1661, expanded to 1715", look: "Read the Hall of Mirrors, garden axis and court facades together: architecture, landscape and ritual staged as absolute power.", sourceName: "UNESCO World Heritage Centre", sourceUrl: "https://whc.unesco.org/en/list/83/" },
      { name: "St Paul's Cathedral", place: "London, United Kingdom", date: "1675–1710, Christopher Wren", look: "English Baroque is restrained outside: a classical dome and twin towers, with drama concentrated in the vast, light-filled crossing within.", sourceName: "St Paul's Cathedral", sourceUrl: "https://www.stpauls.co.uk/" }
    ],
    lesson: "Design the sequence, not just the object: Baroque planning still teaches how axis, threshold, light and reveal can give public space emotional direction.",
    sources: [
      { name: "UNESCO World Heritage Centre", url: "https://whc.unesco.org/en/list/83/" },
      { name: "Smarthistory", url: "https://smarthistory.org/" },
      { name: "Victoria and Albert Museum", url: "https://www.vam.ac.uk/" }
    ],
    deepPage: "/magazine/architectural-history-styles/baroque-rococo/",
    pdf: "/downloads/history/baroque-rococo.pdf",
    bookCover: "/assets/history-deep/baroque-rococo/book-cover.jpg",
    readPath: "/magazine/architectural-history-styles/baroque-rococo/read/",
    images: {
      hero: { src: `${H}/baroque-hero.jpg`, alt: "Bernini colonnade embracing St Peter's Square in Vatican City", credit: "Photo: Jean-Pol GRANDMONT, via Wikimedia Commons (CC BY-SA 3.0)" },
      detail1: { src: `${H}/baroque-detail1.jpg`, alt: "Hall of Mirrors at Versailles showing integrated painting, light and gilding", credit: "Photo: Myrabella, via Wikimedia Commons (CC BY-SA 3.0)" },
      detail2: { src: `${H}/baroque-detail2.jpg`, alt: "Rococo oval salon at the Hôtel de Soubise in Paris", credit: "Photo: Neoclassicism Enthusiast, via Wikimedia Commons (CC BY-SA 4.0)" }
    }
  },
  {
    id: "modernism-international-style",
    title: "Modernism & the International Style",
    facts: { period: "c. 1920–1965; International Style named after the 1932 MoMA exhibition", geography: "Origins in Germany, France, the Netherlands and Russia; then worldwide, especially the United States after 1938", types: "Housing, schools, offices, pavilions, factories and cultural buildings", note: "Modernism is the wider movement; the International Style is its sleek, white, glass-and-steel strand that travelled most successfully." },
    context: [
      "Modernism emerged from industrialisation, urban housing shortages and the trauma of the First World War. Reinforced concrete, steel frames and plate glass freed walls from structure, while architects such as Le Corbusier, Walter Gropius and Ludwig Mies van der Rohe argued that honest, functional, unornamented buildings could serve a healthier, more democratic industrial society.",
      "Its visual culture rejected applied ornament for proportion, repetition and transparency: white volumes, flat roofs and ribbon windows photographed as a universal language. The Bauhaus, CIAM congresses, exhibitions and emigré teachers carried it to the Americas, Palestine, Brazil, India and Japan. Critics later attacked its placeless repetition, yet its planning and construction logic still underpins most contemporary building."
    ],
    signs: [
      { name: "Pilotis and free plan", look: "Look for slender columns lifting the volume so structure is a regular grid and partitions, stairs and rooms move freely inside.", limit: "Columns alone are ancient; the sign counts only when walls become non-structural.", img: "hero" },
      { name: "Flat roof and white volume", look: "Look for smooth, undecorated white or pale surfaces, sharp cubic volumes and a flat roof, often used as a terrace garden.", limit: "White minimalism is now fashionable everywhere; check date, structure and plan together.", img: "hero" },
      { name: "Ribbon windows, free facade", look: "Look for long horizontal window bands wrapping corners, possible only because the facade carries no load and follows the frame.", limit: "Horizontal windows also occur in Streamline Moderne; International Style keeps them flush and grid-bound.", img: "detail1" },
      { name: "Glass curtain and steel grid", look: "Look for a regular steel or concrete frame expressed as a grid, infilled with large glass panes and minimal solid panels.", limit: "Later glass towers copy the look while abandoning the social and functional programme.", img: "detail2" },
      { name: "No applied ornament", look: "Look for detail coming from joints, proportions and materials themselves — flush doors, tubular steel, and lettering without historic mouldings anywhere.", limit: "Absence of ornament is not absence of design; poor copies read merely as unfinished boxes.", img: "detail1" }
    ],
    materials: "Historic Modernist construction centres on reinforced-concrete frames, steel, large sheet and plate glass, stucco render, chrome and tubular steel, linoleum and early plywood. Curtain walls were non-load-bearing skins hung from the frame. Today's high-performance glazing, insulated panels and aluminium systems are modern equivalents and should not be read back into the pioneering buildings.",
    examples: [
      { name: "Villa Savoye", place: "Poissy, France", date: "1928–1931, Le Corbusier and Pierre Jeanneret", look: "Check all Five Points in one house: pilotis, free plan, free facade, ribbon windows and roof garden above a curved entrance.", sourceName: "UNESCO World Heritage Centre", sourceUrl: "https://whc.unesco.org/en/list/1321/" },
      { name: "Bauhaus Building", place: "Dessau, Germany", date: "1925–1926, Walter Gropius", look: "Read the asymmetric pinwheel of workshop, stage and studios, and the workshop wing's full glass curtain wall facing the street.", sourceName: "UNESCO World Heritage Centre", sourceUrl: "https://whc.unesco.org/en/list/729/" },
      { name: "Barcelona Pavilion", place: "Barcelona, Spain", date: "1929, rebuilt 1986, Ludwig Mies van der Rohe", look: "Follow the free plan between marble, onyx and glass screens under a flat roof on chrome columns — space defined without rooms.", sourceName: "Fundació Mies van der Rohe", sourceUrl: "https://miesbcn.com/" }
    ],
    lesson: "Let structure generate freedom: a clear frame that frees plan and facade still gives today's adaptable, daylight-filled buildings their most useful discipline.",
    sources: [
      { name: "UNESCO World Heritage Centre", url: "https://whc.unesco.org/en/list/1321/" },
      { name: "Bauhaus Kooperation", url: "https://www.bauhauskooperation.com/" },
      { name: "The Museum of Modern Art", url: "https://www.moma.org/" }
    ],
    deepPage: "/magazine/architectural-history-styles/modernism/",
    pdf: "/downloads/history/modernism.pdf",
    bookCover: "/assets/history-deep/modernism/book-cover.jpg",
    readPath: "/magazine/architectural-history-styles/modernism/read/",
    images: {
      hero: { src: `${H}/modernism-hero.jpg`, alt: "Villa Savoye at Poissy, white volume raised on pilotis", credit: "Photo: jeanbaptisteparis, via Wikimedia Commons (CC BY-SA 2.0)" },
      detail1: { src: `${H}/modernism-detail1.jpg`, alt: "Bauhaus Dessau studio wing balconies showing grid, steel windows and no ornament", credit: "Photo: via Wikimedia Commons (Public domain)" },
      detail2: { src: `${H}/modernism-detail2.jpg`, alt: "Barcelona Pavilion in Barcelona, marble and onyx screens, glass walls and flat roof beside the reflecting pool", credit: "Photo: Ashley Pomeroy, via Wikimedia Commons (CC BY 3.0)" }
    }
  },
  {
    id: "victorian",
    title: "Victorian architecture",
    facts: { period: "1837–1901, the reign of Queen Victoria, with styles continuing into the early 1900s", geography: "Britain and its empire and trading sphere, including North America, India, Australia and South Africa", types: "Houses and terraces, churches, stations, town halls, museums, factories and exhibition halls", note: "Victorian is an era of competing revivals defined by period and region, not one style — Gothic, Classical, Italianate and Arts and Crafts coexist." },
    context: [
      "Victorian architecture emerged from the Industrial Revolution: railways, iron, plate glass, machine-made brick and terra-cotta, and new wealth from industry and empire. A rapidly urbanising society needed stations, town halls, museums, schools and suburbs at unprecedented speed, while pattern books, journals and manufacturers' catalogues spread designs and components across Britain and abroad.",
      "Its visual culture was revivalist and argumentative: Gothic was promoted as moral and Christian, Classicism as civic and rational, Italianate as domestic and picturesque. Eclecticism, polychrome materials and visible craftsmanship became points of pride. Later Victorian reformers, notably William Morris and the Arts and Crafts movement, reacted against industrial shoddiness from inside the same era."
    ],
    signs: [
      { name: "A named revival language", look: "Look for a whole building consciously in one historic language — pointed Gothic, Italianate towers, Queen Anne brick and gables, or classical orders.", limit: "One historic motif is not enough; Victorians applied revivals as complete systems.", img: "hero" },
      { name: "Polychromy and mixed materials", look: "Look for contrasting red and buff brick, stone dressings, coloured tile, terra-cotta and slate used decoratively across a single facade.", limit: "Colour can come from later paint; check whether contrast is built into the materials.", img: "detail2" },
      { name: "Bay windows and ornamented terraces", look: "Look for projecting bays, sash windows, stucco or carved ornament, patterned brickwork and repeated but individually varied houses along a street.", limit: "Bays survive into Edwardian housing; date, ornament and plan form must agree.", img: "detail2" },
      { name: "Iron and glass engineering", look: "Look for vast glazed train sheds, market halls and exhibition roofs where slender iron structure, not masonry, creates the architecture.", limit: "Iron was often hidden behind revival facades; look inside or at the roof.", img: "detail1" },
      { name: "Asymmetry and picturesque massing", look: "Look for towers, gables, porches and wings composed for varied silhouettes and views, especially in houses, stations and town halls.", limit: "Asymmetry alone is generic; Victorian massing pairs it with revival detail and ornament.", img: "hero" }
    ],
    materials: "Historic Victorian practice combines load-bearing brick and stone with cast and wrought iron, steel late in the period, plate glass, machine-made terra-cotta, encaustic tile, slate and timber sash windows. The Crystal Palace showed prefabricated iron and glass at scale. Modern uPVC windows, cement renders and replica mouldings are later replacements, not historic fabric.",
    examples: [
      { name: "Palace of Westminster", place: "London, United Kingdom", date: "1840–1876, Charles Barry and Augustus Pugin", look: "The defining Gothic Revival landmark: Perpendicular detail, a river facade composed as civic theatre, and interiors saturated with Pugin ornament.", sourceName: "UNESCO World Heritage Centre", sourceUrl: "https://whc.unesco.org/en/list/426/" },
      { name: "Crystal Palace", place: "London, United Kingdom", date: "1851, Joseph Paxton; destroyed by fire 1936", look: "Known only from images and records — note it no longer exists: a prefabricated iron-and-glass exhibition hall built in months.", sourceName: "Victoria and Albert Museum", sourceUrl: "https://www.vam.ac.uk/" },
      { name: "St Pancras Station and Midland Grand Hotel", place: "London, United Kingdom", date: "1868–1876, William Barlow and George Gilbert Scott", look: "Contrast the single-span iron train shed behind with the red-brick Gothic Revival hotel in front — engineering and revival in one site.", sourceName: "Historic England", sourceUrl: "https://historicengland.org.uk/" }
    ],
    lesson: "New technology need not erase character: Victorian builders show how industrial components can still carry civic identity, craft and a strong sense of place.",
    sources: [
      { name: "Historic England", url: "https://historicengland.org.uk/" },
      { name: "Victoria and Albert Museum", url: "https://www.vam.ac.uk/" },
      { name: "The Victorian Society", url: "https://victoriansociety.org.uk/" }
    ],
    deepPage: "/magazine/architectural-history-styles/victorian/",
    pdf: "/downloads/history/victorian.pdf",
    bookCover: "/assets/history-deep/victorian/book-cover.jpg",
    readPath: "/magazine/architectural-history-styles/victorian/read/",
    images: {
      hero: { src: `${H}/victorian-hero.jpg`, alt: "Palace of Westminster in London, Gothic Revival landmark on the Thames", credit: "Photo: Diliff, via Wikimedia Commons (CC BY-SA 2.5)" },
      detail1: { src: `${H}/victorian-detail1.jpg`, alt: "Interior of the Crystal Palace in 1851, iron and glass exhibition hall", credit: "Photo: J. McNeven, via Wikimedia Commons (Public domain)" },
      detail2: { src: `${H}/victorian-detail2.jpg`, alt: "St Pancras Midland Grand Hotel facade in red brick Gothic Revival", credit: "Photo: Loco Steve, via Wikimedia Commons (CC BY-SA 2.0)" }
    }
  },
  {
    id: "brutalism",
    title: "Brutalism",
    deepRead: "/articles/brutalist-architecture-history-features-buildings/",
    facts: { period: "c. 1950–late 1970s, with roots in late Le Corbusier work of the late 1940s", geography: "Britain, France, Europe, the Americas, and worldwide through post-war public building programmes", types: "Housing, universities, civic centres, arts complexes and government buildings", note: "From béton brut, raw concrete: the name describes material honesty, not an intention to be brutal." },
    context: [
      "Brutalism emerged from post-war reconstruction, welfare-state ambition and a need to build housing, schools and civic institutions quickly and at scale. Exposed concrete, prefabrication and sculptural massing promised permanence and honesty after wartime destruction and austerity.",
      "Championed in Britain by Alison and Peter Smithson and Reyner Banham, it spread through universities and new towns worldwide. By the 1970s, maintenance failures, weathering and association with bureaucracy turned opinion; recent scholarship and listing campaigns have recovered its social ambition and sculptural power."
    ],
    signs: [
      { name: "Board-marked raw concrete", look: "Look for béton brut surfaces retaining timber shuttering grain, tie holes and casting joints as the finished texture.", limit: "Any grey concrete is not Brutalist; finish must be deliberately exposed.", img: "detail1" },
      { name: "Sculptural, top-heavy massing", look: "Look for bold geometric blocks, inverted pyramids and upper floors projecting heavily over recessed, shadowed bases.", limit: "Bulk alone is insufficient; massing must read as deliberate sculpture.", img: "hero" },
      { name: "Expressed structure and services", look: "Look for pilotis, external stairs, ducts and circulation towers placed visibly outside the main volume.", limit: "Exposed services also appear in High-Tech; date and material separate them.", img: "hero" },
      { name: "Deep-set, repetitive openings", look: "Look for small, deeply recessed windows punched into thick walls, repeating in a strict, fortress-like grid rhythm.", limit: "Repetition is common in modern housing; depth and wall thickness are key.", img: "detail2" },
      { name: "Streets in the sky", look: "Look for wide access decks and internal streets serving stacked dwellings, intended as elevated communal public space.", limit: "Access decks occur elsewhere; the communal social programme defines them here.", img: "detail2" }
    ],
    materials: "Historic Brutalism is in-situ reinforced concrete cast against timber boards, bush-hammered concrete, brick and large glass panes in heavy frames. Weathering and staining are inherent. Modern polished or painted concrete finishes are later treatments, not the original raw intent.",
    examples: [
      { name: "Unité d'Habitation", place: "Marseille, France", date: "1947–1952, Le Corbusier", look: "Pilotis, a sculptural roof, deep loggias and raw concrete frame 337 homes plus shops and communal facilities as one vertical city.", sourceName: "UNESCO World Heritage Centre", sourceUrl: "https://whc.unesco.org/en/list/1321/" },
      { name: "Barbican Estate", place: "London, United Kingdom", date: "1965–1976, Chamberlin, Powell and Bon", look: "Read the podium, towers and bush-hammered concrete as a complete civic quarter combining housing, arts centre, school and gardens.", sourceName: "Barbican Centre", sourceUrl: "https://www.barbican.org.uk/" },
      { name: "Boston City Hall", place: "Boston, United States", date: "1963–1968, Kallmann, McKinnell and Knowles", look: "Its inverted, stepped pyramid puts ceremonial upper offices visibly above the open public floors at plaza level.", sourceName: "Smarthistory", sourceUrl: "https://smarthistory.org/" }
    ],
    lesson: "Build public ambition in durable form: Brutalism at its best gives collective life — housing, culture, government — a permanent, legible civic presence.",
    sources: [
      { name: "Historic England", url: "https://historicengland.org.uk/" },
      { name: "UNESCO World Heritage Centre", url: "https://whc.unesco.org/en/list/1321/" },
      { name: "RIBA", url: "https://www.architecture.com/" }
    ],
    deepPage: "/magazine/architectural-history-styles/brutalism/",
    pdf: "/downloads/history/brutalism.pdf",
    bookCover: "/assets/history-deep/brutalism/book-cover.jpg",
    readPath: "/magazine/architectural-history-styles/brutalism/read/",
    images: {
      hero: { src: `${H}/brutalism-hero.jpg`, alt: "Boston City Hall, stepped inverted pyramid of precast concrete over an open brick plaza", credit: "Photo: Sean P Bender, via Wikimedia Commons (CC BY-SA 3.0)" },
      detail1: { src: `${H}/brutalism-detail1.jpg`, alt: "Barbican Estate concrete towers and podium in London", credit: "Photo: Todd Huffman, via Wikimedia Commons (CC BY 2.0)" },
      detail2: { src: `${H}/brutalism-detail2.jpg`, alt: "Trellick Tower in London, raw concrete tower with a separate service tower and deep-set balconies", credit: "Photo: Rc1959, via Wikimedia Commons (CC0)" }
    }
  },
  {
    id: "frank-lloyd-wright",
    title: "Frank Lloyd Wright & organic architecture",
    deepRead: "/articles/frank-lloyd-wright-organic-architecture-guide/",
    facts: { period: "Active 1893–1959; Prairie period c. 1900–1914, Usonian period from the 1930s", geography: "United States — Midwest, Pennsylvania, Arizona and New York — with one major work in Tokyo", types: "Houses, churches, offices, museums and cultural buildings", note: "Organic architecture was Wright's own philosophy: a building should grow from its site, materials and inhabitants as one whole." },
    context: [
      "Wright emerged from Louis Sullivan's Chicago office as American suburbs, the automobile and steel-and-concrete construction reshaped domestic life. His Prairie houses answered flat Midwestern land and clients wanting modern, open homes without European revival styling.",
      "After personal and professional crisis, he reinvented himself in the 1930s with Fallingwater, the Johnson Wax Building and affordable Usonian houses. His Taliesin fellowships, publications and dramatic public persona spread organic principles internationally, influencing modern housing, open planning and site-responsive design ever since."
    ],
    signs: [
      { name: "Horizontal, ground-hugging lines", look: "Look for long low roofs, extended eaves and terraces echoing the horizon and anchoring the building firmly to its site.", limit: "Ranch houses copy the horizontality without Wright's spatial integration.", img: "detail1" },
      { name: "Cantilevered terraces", look: "Look for reinforced-concrete trays projecting boldly from a central core, extending living space outward into landscape and air.", limit: "Cantilevers are an engineering device; here they must fuse house and site.", img: "hero" },
      { name: "Open, flowing plan", look: "Look for spaces defined by screens, level changes and a central hearth rather than boxed rooms and doors.", limit: "Open plan is now standard; Wright's version stays centred on hearth and site.", img: "detail2" },
      { name: "Native materials, honestly used", look: "Look for local stone rising from the ground, warm wood and concrete left visible, each material expressing its own nature.", limit: "Rustic cladding alone is not organic; material must generate the form.", img: "hero" },
      { name: "Integral ornament and glass bands", look: "Look for art-glass patterns, built-in furniture and continuous window bands designed as inseparable parts of one architectural idea.", limit: "Applied decoration breaks the rule; Wright's ornament grows from geometry.", img: "detail1" }
    ],
    materials: "Historic Wright construction pairs local stone and brick masonry with reinforced-concrete cantilevers, wood, plaster and art glass. Usonian houses added concrete slab floors with radiant heating and sandwich wall panels. Modern steel reinforcement and repairs sustain Fallingwater today but were not its original visible expression.",
    examples: [
      { name: "Fallingwater", place: "Mill Run, Pennsylvania, United States", date: "1935–1939", look: "Concrete terraces cantilever directly over the waterfall, stone walls rise like the rock ledges, and the stream is heard throughout the house.", sourceName: "Fallingwater / Western Pennsylvania Conservancy", sourceUrl: "https://fallingwater.org/" },
      { name: "Robie House", place: "Chicago, United States", date: "1908–1910", look: "The Prairie ideal: long Roman brick, sweeping eaves, bands of art glass and a flowing plan around a central fireplace.", sourceName: "UNESCO World Heritage Centre", sourceUrl: "https://whc.unesco.org/en/list/1496/" },
      { name: "Solomon R. Guggenheim Museum", place: "New York, United States", date: "1943–1959", look: "A continuous spiral ramp replaces gallery floors entirely — organic, flowing space applied to a museum on Fifth Avenue.", sourceName: "Solomon R. Guggenheim Foundation", sourceUrl: "https://www.guggenheim.org/" }
    ],
    lesson: "Start from the site, not the style: let land, light, material and daily life generate the plan, and form will follow with integrity.",
    sources: [
      { name: "UNESCO World Heritage Centre", url: "https://whc.unesco.org/en/list/1496/" },
      { name: "Frank Lloyd Wright Foundation", url: "https://franklloydwright.org/" },
      { name: "Fallingwater", url: "https://fallingwater.org/" }
    ],
    deepPage: "/magazine/architectural-history-styles/frank-lloyd-wright/",
    pdf: "/downloads/history/frank-lloyd-wright.pdf",
    bookCover: "/assets/history-deep/frank-lloyd-wright/book-cover.jpg",
    readPath: "/magazine/architectural-history-styles/frank-lloyd-wright/read/",
    images: {
      hero: { src: `${H}/flw-hero.jpg`, alt: "Fallingwater cantilevered terraces above the waterfall at Bear Run", credit: "Photo: fuzheado, via Wikimedia Commons (CC BY-SA 2.0)" },
      detail1: { src: `${H}/flw-detail1.jpg`, alt: "Robie House in Chicago with long eaves and art glass bands", credit: "Photo: Stilfehler, via Wikimedia Commons (CC BY-SA 4.0)" },
      detail2: { src: `${H}/flw-detail2.jpg`, alt: "Guggenheim Museum spiral ramp interior in New York", credit: "Photo: Evan-Amos, via Wikimedia Commons (Public domain)" }
    }
  },
  {
    id: "arch-vault-flying-buttress",
    title: "Arch, vault & flying buttress",
    facts: { period: "Arch from Roman antiquity; rib vault and flying buttress mainly 12th to 16th centuries", geography: "Roman world, then medieval northern Europe, later worldwide", types: "Aqueducts, bridges, cathedrals, churches, baths and civic buildings", note: "These are structural elements, not a style: one arch or vault can serve Roman, Romanesque, Gothic and later buildings alike." },
    context: [
      "A flat lintel can span only a short distance before it cracks under its own weight. The arch solved that problem by turning a vertical load into compression passed sideways and downwards through wedge-shaped stones to the supports. Roman builders multiplied arches into arcades and barrel vaults, while medieval masons still needed a fireproof way to roof wide stone interiors without relying on timber.",
      "Pointed arches and rib vaults concentrated thrust onto piers, so the wall between piers could thin and open. The flying buttress then carried the remaining outward push across the aisle roof to a detached outer pier. Together they made taller naves, longer spans and far larger windows possible, and the system spread from northern France across Europe through cathedral workshops and travelling teams of masons."
    ],
    signs: [
      { name: "Semicircular arch", look: "Look for a half-round curve of wedge-shaped voussoirs over a door, window or arcade, springing from solid piers or columns.", limit: "A round arch alone does not prove a Roman date.", img: "detail1" },
      { name: "Pointed arch", look: "Look where two arcs meet at a crown point, often over tall lancet windows, arcades and doorways in medieval churches.", limit: "Pointed arches also appear in later Gothic Revival copies.", img: "hero" },
      { name: "Rib vault", look: "Look overhead for diagonal stone ribs crossing a bay, with thinner webbing between them and bosses where ribs meet.", limit: "Some ribs are decorative and carry little structural load.", img: "detail2" },
      { name: "Flying buttress", look: "Look outside for a half-arch leaping from the high nave wall over the aisle roof to a freestanding outer pier.", limit: "Not every Gothic church needs or has flyers.", img: "hero" },
      { name: "Buttress pier and pinnacle", look: "Look for the tall masonry pier receiving the flyer, often weighted by a pinnacle that keeps thrust travelling safely downwards.", limit: "Pinnacles can be ornamental additions or later restorations.", img: "hero" }
    ],
    materials: "Historic work uses cut stone voussoirs for arches, stone ribs with lighter stone or brick webbing in vaults, and solid masonry buttresses weighted by pinnacles, all built over temporary timber centring until the mortar set. Modern steel, reinforced concrete or laminated timber can follow the same thrust lines, but they are different materials and should not be read back into medieval construction.",
    examples: [
      { name: "Pont du Gard", place: "Near Remoulins, France", date: "1st century CE", look: "Read the three tiers of repeated semicircular arches carrying the water channel; repetition, not ornament, gives the aqueduct its span and rhythm.", sourceName: "UNESCO World Heritage Centre", sourceUrl: "https://whc.unesco.org/en/list/344/" },
      { name: "Durham Cathedral", place: "Durham, England", date: "Begun 1093; rib vaults early 12th century", look: "Look along the nave vault for some of the earliest surviving rib vaults in Europe, carried on massive alternating piers and columns.", sourceName: "UNESCO World Heritage Centre", sourceUrl: "https://whc.unesco.org/en/list/370/" },
      { name: "Chartres Cathedral", place: "Chartres, France", date: "Rebuilt from 1194; consecrated 1260", look: "Walk outside and trace the double flyers from the high choir and nave walls down to their piers, then match them to the windows inside.", sourceName: "UNESCO World Heritage Centre", sourceUrl: "https://whc.unesco.org/en/list/81/" }
    ],
    lesson: "Follow the thrust before drawing the form: structure that visibly carries its loads to the ground can free walls for light and space.",
    sources: [
      { name: "UNESCO World Heritage Centre", url: "https://whc.unesco.org/en/list/81/" },
      { name: "Smarthistory", url: "https://smarthistory.org/chartres-cathedral/" },
      { name: "Historic England", url: "https://historicengland.org.uk/listing/the-list/list-entry/1003011" }
    ],
    deepPage: "/magazine/architectural-history-styles/arch-vault-buttress/",
    pdf: "/downloads/history/arch-vault-buttress.pdf",
    bookCover: "/assets/history-deep/arch-vault-buttress/book-cover.jpg",
    readPath: "/magazine/architectural-history-styles/arch-vault-buttress/read/",
    images: {
      hero: { src: `${H}/arch-hero.jpg`, alt: "Apse of Chartres Cathedral with tiers of flying buttresses rising to pinnacled outer piers", credit: "Photo: Florestan, via Wikimedia Commons (CC BY 3.0)" },
      detail1: { src: `${H}/arch-detail1.jpg`, alt: "Tiered semicircular arches of the Roman aqueduct at Pont du Gard", credit: "Photo: Benh LIEU SONG, via Wikimedia Commons (CC BY-SA 3.0)" },
      detail2: { src: `${H}/arch-detail2.jpg`, alt: "Early rib vaults spanning the nave of Durham Cathedral", credit: "Photo: Oliver-Bonjoch, via Wikimedia Commons (CC BY-SA 3.0)" }
    },
    diagram: { src: `${H}/diagrams/diagram-arch-buttress.svg`, caption: "A section through a Gothic bay shows the rib vault thrust passing along the flying buttress to the weighted outer pier.", credit: "Diagram: World Arch Journal original" }
  },
  {
    id: "the-dome",
    title: "The dome",
    facts: { period: "Roman antiquity to the present; key developments in the 2nd, 6th and 15th centuries", geography: "Rome and the Byzantine world, then Renaissance Italy, the Islamic world and worldwide", types: "Temples, churches, mosques, mausolea, capitols and civic halls", note: "A dome is a structural form, not a style: it can crown Byzantine, Renaissance, Baroque, Ottoman or Neoclassical buildings." },
    context: [
      "Builders wanted a single, unobstructed space covered without a forest of columns or a timber roof that could burn. A dome answers by working entirely in compression, turning the weight of a curved shell into outward thrust at its base. That thrust was the central problem: it demanded massive supporting walls, buttressing volumes or a tension ring strong enough to hold the circle together.",
      "Roman concrete allowed the Pantheon to span a vast rotunda in one pour over timber centring. Byzantine masons set a dome on pendentives so it could rise over a square bay, and Renaissance engineers such as Brunelleschi built double shells with hidden chains and herringbone brickwork. Each step made domes lighter, higher and easier to raise, and the form became a universal sign of gathered, centralised space."
    ],
    signs: [
      { name: "Pendentives", look: "Look for curved triangular surfaces rising from the corners of a square bay and meeting in a circle carrying the dome.", limit: "Pendentives can be hidden behind later decoration.", img: "detail1" },
      { name: "Oculus", look: "Look for an open or glazed circular eye at the crown, admitting a moving shaft of light and reducing weight at the top.", limit: "Not all domes have an oculus; many use lanterns.", img: "hero" },
      { name: "Coffers", look: "Look for recessed square panels stepping up the inner shell; they lighten the dome and organise its surface into measured rings.", limit: "Coffers may be painted imitation rather than real recesses.", img: "hero" },
      { name: "Drum and lantern", look: "Look for a cylindrical or polygonal drum, often windowed, lifting the dome, topped by a small lantern that finishes the silhouette.", limit: "A lantern can be a later addition or rebuilding.", img: "detail2" },
      { name: "Double shell", look: "Look in cutaway views or stair passages for separate inner and outer shells linked by ribs, as in Florence and St Peter in Rome.", limit: "The double shell is rarely visible from outside.", img: "detail2" }
    ],
    materials: "Historic domes use Roman concrete graded from heavy aggregate at the base to light pumice near the crown, Byzantine brick on pendentives, or Renaissance brick laid in herringbone courses between two shells with stone or iron chains resisting spread. Modern domes in steel, reinforced concrete or glass follow different structural rules and should be described as modern construction, not masonry.",
    examples: [
      { name: "Pantheon", place: "Rome, Italy", date: "c. 125 CE", look: "Stand at the centre and compare the diameter with the height to the oculus; then read the five rows of coffers lightening the concrete shell.", sourceName: "Smarthistory", sourceUrl: "https://smarthistory.org/the-pantheon/" },
      { name: "Hagia Sophia", place: "Istanbul, Türkiye", date: "532–537 CE", look: "Look for the dome resting on pendentives over a square, its ring of forty windows making the shell appear to float above the nave.", sourceName: "UNESCO World Heritage Centre", sourceUrl: "https://whc.unesco.org/en/list/356/" },
      { name: "Florence Cathedral", place: "Florence, Italy", date: "Dome 1420–1436", look: "Compare the pointed outer profile with the octagonal drum below, then find the lantern that locks the eight ribs at the crown.", sourceName: "UNESCO World Heritage Centre", sourceUrl: "https://whc.unesco.org/en/list/174/" }
    ],
    lesson: "Design the base as carefully as the crown: a dome succeeds where its outward thrust is visibly gathered, resisted and turned into support.",
    sources: [
      { name: "Smarthistory", url: "https://smarthistory.org/the-pantheon/" },
      { name: "UNESCO World Heritage Centre", url: "https://whc.unesco.org/en/list/174/" },
      { name: "UNESCO World Heritage Centre", url: "https://whc.unesco.org/en/list/356/" }
    ],
    deepPage: "/magazine/architectural-history-styles/the-dome/",
    pdf: "/downloads/history/the-dome.pdf",
    bookCover: "/assets/history-deep/the-dome/book-cover.jpg",
    readPath: "/magazine/architectural-history-styles/the-dome/read/",
    images: {
      hero: { src: `${H}/dome-hero.jpg`, alt: "Coffered dome and open oculus of the Pantheon in Rome", credit: "Photo: T. Le Berre, via Wikimedia Commons (CC BY-SA 4.0)" },
      detail1: { src: `${H}/dome-detail1.jpg`, alt: "Dome on pendentives above the nave of Hagia Sophia", credit: "Photo: Ronan Reinart, via Wikimedia Commons (CC BY-SA 3.0)" },
      detail2: { src: `${H}/dome-detail2.jpg`, alt: "Brunelleschi dome rising over the octagonal drum of Florence Cathedral", credit: "Photo: Julian Lupyan, via Wikimedia Commons (CC0)" }
    },
    diagram: { src: `${H}/diagrams/diagram-dome-section.svg`, caption: "A dome section shows compression flowing down the shell, the oculus lightening the crown and the drum and buttressing resisting spread at the base.", credit: "Diagram: World Arch Journal original" }
  },
  {
    id: "columns-orders",
    title: "Columns & orders",
    facts: { period: "Greek orders from the 7th century BCE; Roman adaptation and reuse ever since", geography: "Greece and the Roman world, revived across Europe and worldwide from the Renaissance", types: "Temples, porticoes, theatres, basilicas, palaces and civic buildings", note: "The orders are a grammar of proportion and parts, not a single style: the same grammar is reused by Classical, Renaissance and Neoclassical buildings." },
    context: [
      "Post-and-lintel construction in stone is limited by how far a beam can span and how a support meets it. Greek builders refined the column and its entablature into a system that spread the load, marked the joint with a capital and gave every part a proportion related to the whole. The result was both structure and a legible language of character, from sturdy to slender and ornate.",
      "Rome adopted the Greek orders, made them taller and more decorative, and often applied them to arched concrete structures where the arch did the real work. Renaissance architects codified the system from surviving ruins and treatises, and it spread worldwide as the default language for temples, law courts, museums and parliaments. Reading the capital is still the fastest way to name the order being quoted."
    ],
    signs: [
      { name: "Doric capital", look: "Look for a plain, cushion-like capital with no volutes, a fluted shaft and, in Greek work, no base under the column.", limit: "Roman Doric usually adds a base and mouldings.", img: "detail1" },
      { name: "Ionic volutes", look: "Look for scroll-like volutes curling on either side of the capital, a shaft with a base and a frieze often carved in relief.", limit: "Volutes read clearly from the front, less from the side.", img: "detail2" },
      { name: "Corinthian acanthus", look: "Look for a bell-shaped capital wrapped in carved acanthus leaves with small volutes, usually on the most slender and decorated shafts.", limit: "Composite capitals mix acanthus with large Ionic volutes.", img: "detail2" },
      { name: "Entablature", look: "Look above the capitals for the horizontal layers of architrave, frieze and cornice that the columns appear to carry together.", limit: "Triglyphs mark Doric friezes; other orders differ.", img: "hero" },
      { name: "Stacked orders", look: "Look for orders placed one above another up a facade, heaviest and plainest at the bottom, richest at the top, as on the Colosseum.", limit: "Stacked orders are often applied decoration, not structure.", img: "hero" }
    ],
    materials: "Greek temples use cut marble or limestone blocks with metal clamps, the column drums stacked and fluted after erection. Roman work combines marble veneer, travertine and brick-faced concrete, so an order may be a surface applied to an arched core. Modern stone cladding, cast stone, fibreglass or steel columns quoting an order are reproductions of its profile, not evidence of historic masonry construction.",
    examples: [
      { name: "Parthenon", place: "Athens, Greece", date: "447–432 BCE", look: "Read the Doric columns around all four sides, noting the plain capitals, the triglyph frieze and the slight swelling of each shaft.", sourceName: "UNESCO World Heritage Centre", sourceUrl: "https://whc.unesco.org/en/list/404/" },
      { name: "Pantheon", place: "Rome, Italy", date: "c. 125 CE", look: "At the portico, look for tall monolithic Corinthian columns carrying a deep entablature and pediment in front of the concrete rotunda behind.", sourceName: "Smarthistory", sourceUrl: "https://smarthistory.org/the-pantheon/" },
      { name: "Colosseum", place: "Rome, Italy", date: "70–80 CE", look: "Read the arcade level by level: Tuscan or Doric below, Ionic in the middle, Corinthian above, each order applied to an arched structure.", sourceName: "UNESCO World Heritage Centre", sourceUrl: "https://whc.unesco.org/en/list/91/" }
    ],
    lesson: "Use proportion as a shared language: a consistent system of parts lets a building signal weight, ceremony and scale before a word is read.",
    sources: [
      { name: "UNESCO World Heritage Centre", url: "https://whc.unesco.org/en/list/404/" },
      { name: "Smarthistory", url: "https://smarthistory.org/the-pantheon/" },
      { name: "Smarthistory", url: "https://smarthistory.org/colosseum-rome/" }
    ],
    deepPage: "/magazine/architectural-history-styles/columns-classical-orders/",
    pdf: "/downloads/history/columns-classical-orders.pdf",
    bookCover: "/assets/history-deep/columns-classical-orders/book-cover.jpg",
    readPath: "/magazine/architectural-history-styles/columns-classical-orders/read/",
    images: {
      hero: { src: `${H}/columns-hero.jpg`, alt: "Stacked orders framing the arcades of the Colosseum in Rome", credit: "Photo: Wilfredor, via Wikimedia Commons (CC0)" },
      detail1: { src: `${H}/columns-detail1.jpg`, alt: "Doric columns of the Parthenon in Athens", credit: "Photo: George E. Koronaios, via Wikimedia Commons (CC BY-SA 4.0)" },
      detail2: { src: `${H}/columns-detail2.jpg`, alt: "Corinthian capitals and entablature of the Pantheon portico", credit: "Photo: Nicholas Hartmann, via Wikimedia Commons (CC BY-SA 4.0)" }
    },
    diagram: { src: `${H}/diagrams/diagram-orders.svg`, caption: "Three columns side by side compare Doric, Ionic and Corinthian capitals, shafts and bases within one shared entablature system.", credit: "Diagram: World Arch Journal original" }
  },
  {
    id: "light-in-historic-buildings",
    title: "Light in historic buildings",
    facts: { period: "Antiquity to the 19th century, with a medieval peak in the 12th and 13th centuries", geography: "Mediterranean world and medieval Europe, with traditions worldwide", types: "Temples, churches, chapels, baths and great halls", note: "Light is a design material, not a style: the same building type can be dark and massive or glazed and luminous in different periods." },
    context: [
      "Before electric light, an interior depended on every opening its structure could afford. Thick load-bearing walls allowed only small windows, so daylight was scarce, directed and precious. Builders treated it as both a practical resource and a meaning in itself: a single beam from an oculus, or coloured light through glass, could mark the sacred centre of a room and tell worshippers where to look.",
      "As rib vaults and flying buttresses took over the structural work, walls in Gothic churches could dissolve into stained glass. Tracery, leading and coloured glass turned daylight into narrative images and shifting colour, while clerestories lifted windows above aisle roofs in earlier churches. Orientation did the rest: east-facing glass caught morning sun, and seasonal change made the same interior perform differently across the day and year."
    ],
    signs: [
      { name: "Oculus", look: "Look for a single circular opening at the crown of a dome or high in a wall, throwing one strong moving shaft of light.", limit: "An oculus may now be glazed or covered.", img: "detail1" },
      { name: "Clerestory", look: "Look for a raised band of windows above the aisle roof and below the vault, washing the upper nave with indirect daylight.", limit: "Clerestory windows can be blocked by later roofs.", img: "detail2" },
      { name: "Stained glass lancets", look: "Look for tall narrow windows divided by stone tracery, filled with coloured glass panels joined by lead and painted with figures.", limit: "Much surviving glass is restored or partly replaced.", img: "hero" },
      { name: "Rose window", look: "Look for a great circular window of radiating tracery, usually on the west front, pouring patterned coloured light down the nave.", limit: "Rose windows also appear in Romanesque churches.", img: "detail2" },
      { name: "Contrast and shadow", look: "Look for deliberately dark zones, such as a low triforium or aisle, that make the lit sanctuary or choir appear brighter by contrast.", limit: "Present darkness may reflect dirt, not design intent.", img: "detail2" }
    ],
    materials: "Historic glazing uses small pieces of coloured or clear glass held in lead cames within iron frames and stone tracery, with painted detail fired onto the surface. Openings in solid masonry, screens and shutters controlled glare and weather. Modern equivalents include large low-iron panes, fritted glass and electric backlighting; these change the colour, diffusion and maintenance of the light and should be identified as modern work.",
    examples: [
      { name: "Pantheon", place: "Rome, Italy", date: "c. 125 CE", look: "Follow the single beam from the oculus as it moves across coffers and floor; it is the only direct light source in the rotunda.", sourceName: "Smarthistory", sourceUrl: "https://smarthistory.org/the-pantheon/" },
      { name: "Sainte-Chapelle", place: "Paris, France", date: "1242–1248", look: "In the upper chapel, look for walls almost entirely replaced by tall stained glass between slender stone uprights, read like a glowing reliquary interior.", sourceName: "Smarthistory", sourceUrl: "https://smarthistory.org/sainte-chapelle-paris/" },
      { name: "Chartres Cathedral", place: "Chartres, France", date: "Rebuilt from 1194", look: "Compare the deep blue and red lancets under the rose window with the clerestory above; most glass is early 13th century and unusually complete.", sourceName: "UNESCO World Heritage Centre", sourceUrl: "https://whc.unesco.org/en/list/81/" }
    ],
    lesson: "Treat daylight as a material with direction, colour and timing: one well-placed opening can organise a whole interior more powerfully than uniform brightness.",
    sources: [
      { name: "Smarthistory", url: "https://smarthistory.org/sainte-chapelle-paris/" },
      { name: "Smarthistory", url: "https://smarthistory.org/chartres-cathedral/" },
      { name: "UNESCO World Heritage Centre", url: "https://whc.unesco.org/en/list/81/" }
    ],
    deepPage: "/magazine/architectural-history-styles/light-in-historic-buildings/",
    pdf: "/downloads/history/light-in-historic-buildings.pdf",
    bookCover: "/assets/history-deep/light-in-historic-buildings/book-cover.jpg",
    readPath: "/magazine/architectural-history-styles/light-in-historic-buildings/read/",
    images: {
      hero: { src: `${H}/light-hero.jpg`, alt: "Stained glass walls of the upper chapel of Sainte-Chapelle in Paris", credit: "Photo: Didier B (Sam67fr), via Wikimedia Commons (CC BY-SA 2.5)" },
      detail1: { src: `${H}/dome-hero.jpg`, alt: "Shaft of light from the oculus of the Pantheon", credit: "Photo: T. Le Berre, via Wikimedia Commons (CC BY-SA 4.0)" },
      detail2: { src: `${H}/light-detail2.jpg`, alt: "North rose window and lancets of Chartres Cathedral", credit: "Photo: Eusebius, via Wikimedia Commons (Public domain)" }
    }
  },
  {
    id: "medieval-castles",
    title: "Medieval castles & fortifications",
    facts: { period: "Mainly 9th to 15th centuries, declining as gunpowder artillery spread", geography: "Europe and the Crusader states of the eastern Mediterranean", types: "Royal fortresses, baronial strongholds, Crusader castles and fortified residences", note: "A castle is a building type, not a style: it is a fortified residence, and its plan answers defence and lordship before decoration." },
    context: [
      "After central authority weakened across much of medieval Europe, local lords needed a residence that could also withstand a siege, store food and weapons, and dominate the land around it. The castle solved three problems at once: defence in depth, a household large enough to run an estate, and a visible seat of power. Its site, usually high ground or a river crossing, was the first weapon.",
      "Early timber motte-and-bailey castles gave way to stone keeps, then to curtain walls with projecting towers, gatehouses and finally concentric rings of defence influenced partly by Crusader experience in the eastern Mediterranean. Each layer forced attackers to slow, turn and expose themselves to fire from above. Gunpowder artillery eventually made high thin walls a liability, and castles evolved into artillery fortresses or unfortified country houses."
    ],
    signs: [
      { name: "Curtain wall and towers", look: "Look for a continuous high stone wall linking projecting round or square towers, so defenders can shoot along the wall face itself.", limit: "Town walls look similar but defend a community.", img: "hero" },
      { name: "Keep", look: "Look for the tallest, thickest-walled tower, usually with its entrance above ground level, containing hall, chamber and storage in one stronghold.", limit: "Not every castle has a keep; later plans dispense with one.", img: "detail1" },
      { name: "Gatehouse", look: "Look for the most heavily defended point: twin towers, a passage once closed by gates and portcullis, and openings for missiles above.", limit: "Gatehouses were also status symbols and lodgings.", img: "detail2" },
      { name: "Arrow slits and machicolations", look: "Look for narrow vertical slits splayed wide inside, and floor openings in parapet galleries for dropping stones or liquids on attackers below.", limit: "Some slits are decorative or later insertions.", img: "detail2" },
      { name: "Concentric defence and moat", look: "Look for two rings of wall, the inner higher than the outer, with a ditch or moat forcing attackers to cross open ground twice.", limit: "A dry ditch may now read as a shallow hollow.", img: "hero" }
    ],
    materials: "Historic castles use a rubble stone core faced with dressed ashlar, lime mortar, and timber for floors, roofs, hoarding and drawbridges, with iron for portcullises, hinges and grilles. Walls are thick because mass, not precision engineering, resists impact and undermining. Modern conservation may add concrete, steel ties or reconstructed timber; new work should be distinguishable from surviving medieval fabric on close inspection.",
    examples: [
      { name: "Conwy Castle", place: "Conwy, Wales", date: "1283–1289", look: "Count the eight great towers and read the two wards inside the curtain wall, then note how the castle and town walls work as one system.", sourceName: "UNESCO World Heritage Centre", sourceUrl: "https://whc.unesco.org/en/list/374/" },
      { name: "Krak des Chevaliers", place: "Near Homs, Syria", date: "12th to 13th centuries", look: "Look for the sloped glacis at the base, the concentric inner and outer walls and the great hall of the Hospitaller knights who held it.", sourceName: "UNESCO World Heritage Centre", sourceUrl: "https://whc.unesco.org/en/list/1229/" },
      { name: "Tower of London", place: "London, England", date: "White Tower begun c. 1078", look: "Read the White Tower as a stone keep of hall and chapel over storage, then trace the later curtain walls and moat added around it.", sourceName: "UNESCO World Heritage Centre", sourceUrl: "https://whc.unesco.org/en/list/488/" }
    ],
    lesson: "Layer thresholds so each one slows, reveals and redirects movement: defence in depth is still the clearest model for legible, secure building entrances.",
    sources: [
      { name: "UNESCO World Heritage Centre", url: "https://whc.unesco.org/en/list/374/" },
      { name: "UNESCO World Heritage Centre", url: "https://whc.unesco.org/en/list/1229/" },
      { name: "UNESCO World Heritage Centre", url: "https://whc.unesco.org/en/list/488/" }
    ],
    deepPage: "/magazine/architectural-history-styles/castles/",
    pdf: "/downloads/history/castles.pdf",
    bookCover: "/assets/history-deep/castles/book-cover.jpg",
    readPath: "/magazine/architectural-history-styles/castles/read/",
    images: {
      hero: { src: `${H}/castles-hero.jpg`, alt: "Curtain walls and towers of Conwy Castle in Wales", credit: "Photo: Nilfanion, via Wikimedia Commons (CC BY-SA 4.0)" },
      detail1: { src: `${H}/castles-detail1.jpg`, alt: "The White Tower keep at the Tower of London", credit: "Photo: Dietmar Rabich, via Wikimedia Commons (CC BY-SA 4.0)" },
      detail2: { src: `${H}/castles-detail2.jpg`, alt: "Concentric defences of Krak des Chevaliers in Syria", credit: "Photo: Bernard Gagnon, via Wikimedia Commons (CC BY-SA 4.0)" }
    }
  },
  {
    id: "the-historic-house",
    title: "The historic house",
    facts: { period: "Roman antiquity to the 19th century, changing with each period", geography: "Mediterranean world, then Europe and its colonies worldwide", types: "Townhouses, hall houses, terraces, villas and manor houses", note: "The house is a building type, not a style: a Georgian terrace and a Victorian villa differ in plan and services as much as in ornament." },
    context: [
      "A house must do in small compass what larger buildings spread out: shelter a household, manage heat, water and waste, receive guests without exposing private life, and show status to the street. Historic plans answer with gradients. Rooms move from public to private, and noisy, smelly service spaces are pushed to a rear wing, a basement or across a courtyard, away from the rooms for living and display.",
      "The Roman domus turned inward on an atrium and peristyle, presenting a blank face to the street. The medieval hall house centred life on one tall communal hall heated by an open hearth. Speculative Georgian terraces standardised the plan behind uniform facades, while the Victorian villa separated family, servants and services with stairs, bells and back corridors. Each step tracks plumbing, heating and changing ideas of privacy."
    ],
    signs: [
      { name: "Courtyard or atrium plan", look: "Look for rooms arranged around an open court or atrium that supplies light, air and rainwater while the street facade stays closed.", limit: "Courtyards also occur in palaces and inns.", img: "detail1" },
      { name: "Great hall", look: "Look for one tall main room with a hearth or fireplace, a screens passage at one end and private chambers beyond the other.", limit: "Many halls were later subdivided or ceiled over.", img: "hero" },
      { name: "Uniform terrace facade", look: "Look for a row of houses sharing one composed classical facade, identical heights and windows, with individual plans hidden behind it.", limit: "Uniformity may be a planning condition, not taste.", img: "detail2" },
      { name: "Separated services", look: "Look for kitchen, scullery and servants rooms in a basement, rear wing or across a yard, reached by a separate stair or corridor.", limit: "Small houses could not afford full separation.", img: "detail2" },
      { name: "Chimney and staircase", look: "Look for masonry chimney stacks marking heated rooms and a stair rising from hall or passage, reorganising the house around private upper floors.", limit: "Stacks and stairs are frequent later insertions.", img: "hero" }
    ],
    materials: "Historic houses use what is local: Roman brick and concrete around courtyards, medieval timber framing with wattle-and-daub or stone, and later brick or stone terraces with slate roofs, sash windows and cast-iron details. Interiors divide structure from finish through plaster, panelling and joinery. Modern insulation, steel, blockwork and plastic services inside an old shell are upgrades, and should be read as layers, not original fabric.",
    examples: [
      { name: "House of the Faun", place: "Pompeii, Italy", date: "2nd century BCE", look: "Trace the sequence from street entrance through atrium to peristyle garden; the house turns inward, with grand reception rooms arranged around two courts.", sourceName: "UNESCO World Heritage Centre", sourceUrl: "https://whc.unesco.org/en/list/829/" },
      { name: "Stokesay Castle", place: "Shropshire, England", date: "c. 1285–1294", look: "Read this fortified manor house by its great hall with tall windows, the chamber block beside it and the later timber-framed gatehouse at the entrance.", sourceName: "Historic England", sourceUrl: "https://historicengland.org.uk/listing/the-list/list-entry/1003011" },
      { name: "Royal Crescent", place: "Bath, England", date: "1767–1774", look: "Look at the single sweeping Georgian facade of thirty terraced houses, then note the irregular backs where each house was finished individually.", sourceName: "UNESCO World Heritage Centre", sourceUrl: "https://whc.unesco.org/en/list/428/" }
    ],
    lesson: "Plan the gradient from public to private first: a house works when arrival, living, service and retreat each have a clear place and threshold.",
    sources: [
      { name: "UNESCO World Heritage Centre", url: "https://whc.unesco.org/en/list/829/" },
      { name: "Historic England", url: "https://historicengland.org.uk/listing/the-list/list-entry/1003011" },
      { name: "UNESCO World Heritage Centre", url: "https://whc.unesco.org/en/list/428/" }
    ],
    images: {
      hero: { src: `${H}/house-hero.jpg`, alt: "Great hall and towers of the fortified manor house at Stokesay", credit: "Photo: DeFacto, via Wikimedia Commons (CC BY-SA 4.0)" },
      detail1: { src: `${H}/house-detail1.jpg`, alt: "Atrium of a Roman domus at Pompeii", credit: "Photo: Carole Raddato, via Wikimedia Commons (CC BY-SA 2.0)" },
      detail2: { src: `${H}/house-detail2.jpg`, alt: "Uniform Georgian facade of the Royal Crescent in Bath", credit: "Photo: Diliff, via Wikimedia Commons (CC BY 2.5)" }
    }
  }
];

export const historyComparisons = [
  {
    id: "art-deco-vs-art-nouveau",
    title: "Art Deco vs Art Nouveau",
    intro: "Both are richly decorative, both rejected Victorian historicism, and both flourished within a generation, so photographs blur them together. Start with curve versus geometry: Nouveau flows, Deco steps. Treat that only as a first approximation, because the V&A notes Deco partly grew out of Nouveau geometry, and exceptions abound.",
    left: { name: "Art Deco", traits: "Stepped, symmetrical and streamlined; machine-age glamour in steel, stone and neon.", img: { src: `${H}/chrysler-retouched.jpg`, alt: "Chrysler Building, New York (1930), its terraced stainless-steel crown and sunburst arches rising above Manhattan", credit: "Photo: David Shankbone, via Wikimedia Commons (Public domain)" } },
    right: { name: "Art Nouveau", traits: "Sinuous, asymmetrical and plant-like; handcrafted growth translated into iron, glass and tile.", img: { src: `${H}/art-nouveau-detail1.jpg`, alt: "Paris Métro entrance designed by Hector Guimard, c.1900, its cast-iron stems curling into plant-like lamps", credit: "Photo: Moonik, via Wikimedia Commons (CC BY-SA 3.0)" } },
    rows: [
      { detail: "Silhouette", left: "Stepped setbacks, ziggurat tiers and sharp vertical emphasis, as on the Chrysler crown.", right: "Rolling, swelling outlines with no straight axis; roofs and balconies curve like stems." },
      { detail: "Openings", left: "Windows in strict grids and repeated bays; doors framed by hard, concentric rectangular mouldings.", right: "Windows and doors swell, narrow or leaf out asymmetrically, following the curve of the design." },
      { detail: "Ornament", left: "Sunbursts, chevrons, zigzags and stylised eagles; ornament is geometric, repeated and sharply edged.", right: "Whiplash lines, lilies, dragonflies and tendrils; ornament grows continuously out of the structure itself." },
      { detail: "Structure & material", left: "Steel frame, concrete and stone cladding, with stainless steel, chrome and black granite accents.", right: "Exposed cast iron, curved glass and ceramic; structure bends visibly, pioneered by Horta and Guimard." },
      { detail: "Colour & surface", left: "High contrast: black, white, silver and gold, glossy lacquer and polished stone surfaces.", right: "Muted, natural tones: sage, mustard, lilac and stained glass glowing against matt, textured surfaces." }
    ],
    shared: "Both are total-design movements spanning buildings, furniture, jewellery and posters; both love stylised nature, rich materials and craftsmanship, and both were international styles quickly adapted to local traditions.",
    exceptions: "Viennese Nouveau was already geometric, Mackintosh used strict grids, and early Deco kept Nouveau florals. Date and place matter: a 1905 Viennese facade can look more Deco than a 1925 Paris one.",
    sources: [
      { name: "Victoria and Albert Museum — Art Deco", url: "https://www.vam.ac.uk/articles/art-deco" },
      { name: "Victoria and Albert Museum — Art Nouveau", url: "https://www.vam.ac.uk/articles/art-nouveau-an-international-style" }
    ]
  },
  {
    id: "gothic-vs-romanesque",
    title: "Gothic vs Romanesque",
    intro: "Both are medieval, stone-built and church-dominated, and Gothic literally grew inside Romanesque buildings, so mixed examples confuse everyone. Start with round arch versus pointed arch. That simplification works surprisingly often, but it is still only a first approximation: Durham already used pointed arches within a thoroughly Romanesque body.",
    left: { name: "Gothic", traits: "Vertical, skeletal and light-filled; stone reduced to a frame for coloured glass.", img: { src: `${H}/gothic-hero.jpg`, alt: "West front of Chartres Cathedral, with twin spires, three sculpted portals, lancets and the great rose window", credit: "Photo: Nina Aldin Thune, via Wikimedia Commons (CC BY 2.5)" } },
    right: { name: "Romanesque", traits: "Massive, grounded and fortress-like; thick walls carry small, deeply set openings.", img: { src: `${H}/compare-gothic-romanesque-right.jpg`, alt: "Durham Cathedral from across the River Wear, its massive Romanesque towers and solid stone mass above the gorge", credit: "Photo: Stoive, via Wikimedia Commons (CC BY-SA 3.0)" } },
    rows: [
      { detail: "Silhouette", left: "Soaring spires, pinnacles and flying buttresses pull the eye upward; Chartres rises in sharp vertical lines.", right: "Low, broad and horizontal; heavy towers and small domes keep Durham and Speyer close to the ground." },
      { detail: "Openings", left: "Pointed arches, huge traceried windows and rose windows; glass replaces wall across entire bays.", right: "Round arches and small, narrow windows punched sparingly through walls up to two metres thick." },
      { detail: "Ornament", left: "Bar tracery, crockets, gargoyles and naturalistic foliage; sculpture becomes slender, animated and increasingly lifelike.", right: "Blind arcading, chevron mouldings and stylised capitals; sculpture is flat, symbolic and fused with the wall." },
      { detail: "Structure & material", left: "Rib vaults, pointed arches and flying buttresses concentrate loads onto piers, freeing walls for glass.", right: "Barrel and groin vaults rest on massive piers and continuous walls; stone mass itself provides stability." },
      { detail: "Colour & surface", left: "Interiors flooded with jewel-like stained-glass colour; painted stone frames vast glowing red and blue windows.", right: "Dim interiors of bare or whitewashed stone, originally enlivened by wall painting rather than coloured light." }
    ],
    shared: "Both use cruciform plans, ribbed or vaulted stone ceilings, sculpted portals teaching Bible stories, and relic-focused pilgrimage planning. Regional masons, budgets and monastic orders shaped both styles as much as any rulebook.",
    exceptions: "Durham Cathedral (begun 1093) pioneered rib vaults and pointed arches yet remains Romanesque in mass. Conversely, many modest Gothic parish churches kept round-headed details, thick walls and tiny windows for generations.",
    sources: [
      { name: "UNESCO World Heritage — Chartres Cathedral", url: "https://whc.unesco.org/en/list/81" },
      { name: "UNESCO World Heritage — Durham Castle and Cathedral", url: "https://whc.unesco.org/en/list/370" }
    ]
  }
];

export const historyMethod = {
  facade: { name: "Chrysler Building", place: "405 Lexington Avenue, New York, completed 1930, architect William Van Alen", img: { src: `${H}/chrysler-retouched.jpg`, alt: "Chrysler Building, New York — the facade worked through in the five-sign method", credit: "Photo: David Shankbone, via Wikimedia Commons (Public domain)" } },
  steps: [
    { sign: "Silhouette", observe: "The tower rises in strict setbacks, then a terraced crown of seven radiating arches steps sharply to a needle spire.", conclude: "Stepped massing and vertical thrust suggest Art Deco, though setbacks alone also reflect New York zoning law." },
    { sign: "Openings", observe: "Windows repeat in an unbroken grid up the shaft, while triangular windows pierce the curved crown tiers in stacked rows.", conclude: "Repetition and geometry point to Deco; grids alone prove little, since any office tower needs regular windows." },
    { sign: "Ornament", observe: "Look for sunburst patterns in the crown, chevron brickwork, and stylised eagle gargoyles modelled on Chrysler car hood ornaments.", conclude: "Machine-inspired, stylised ornament is textbook Deco, but ornament can be applied to almost any underlying style." },
    { sign: "Structure", observe: "A steel frame carries the height; the famous crown is cladding, not masonry structure, hiding a spire assembled secretly inside.", conclude: "Modern frame construction fits Deco-era skyscrapers, yet structure alone cannot separate Deco from other modern styles." },
    { sign: "Material", observe: "White and black brick contrast across the shaft, capped by gleaming stainless steel sheeting that was revolutionary in 1930.", conclude: "Industrial, polished materials confirm the machine-age reading, though later cleaning and restoration can exaggerate the shine." }
  ],
  verdict: "Five signs converge: stepped silhouette, geometric sunburst ornament, stylised automotive eagles and a stainless-steel crown make this confidently Art Deco. Confidence stays qualified because style labels summarise evidence; no single sign, read alone, would be conclusive.",
  mistakes: [
    "Calling it Art Nouveau because the crown curves: Deco curves are geometric arcs, not Nouveau whiplash tendrils.",
    "Calling every old skyscraper Deco: many 1930s towers are stripped classical or early modernist underneath.",
    "Dating by height alone: tallest-building records say nothing about style; read ornament, silhouette and materials together."
  ]
};

export const historyCaseStudy = {
  building: { name: "Sainte-Chapelle, Paris", date: "consecrated 1248", sourceName: "Centre des monuments nationaux / Smarthistory", sourceUrl: "https://www.sainte-chapelle.fr/en" },
  intro: "Commissioned by Louis IX to house the Crown of Thorns, Sainte-Chapelle is a royal palace chapel turned inside out like a reliquary: a modest exterior conceals an upper chapel where wall almost disappears. It is the perfect lens on Gothic because structure, tracery and coloured light become one single, legible system.",
  beats: [
    { detail: "The fifteen windows, each about 15 metres high", explanation: "Fifteen lancet windows, separated only by slender stone piers, wrap the upper chapel in roughly 670 square metres of glass. Deep external buttresses between the windows absorb the vault thrust, so the wall itself carries almost nothing. Two-thirds of the glass is original 13th-century work, narrating over a thousand biblical scenes in deep ruby and blue." },
    { detail: "The slender bar tracery", explanation: "Thin stone bars, reinforced with iron ties, subdivide each window into delicate compartments that hold the glass like a stone net. This Rayonnant refinement replaced earlier plate tracery, in which openings were punched through solid stone. By concentrating strength into a minimal skeleton, masons could enlarge openings, standardise glass panels and flood the interior with even, coloured light." },
    { detail: "The painted dado and gilded vault below the glass", explanation: "Below the windows, a blind arcade of trefoil arches carries painted medallions of saints and martyrs, inset with gilded glass imitating enamel. Above, the rib vault is painted deep blue with gold fleurs-de-lis. Paint unifies stone, glass and metal into one jewelled surface, proving Gothic colour was integral, not a later decorative extra." }
  ],
  lesson: "Separate structure from enclosure: once loads travel through a clear skeleton of piers and buttresses, the wall between can become light, glass and image.",
  images: {
    full: { src: `${H}/sainte-chapelle-full.jpg`, alt: "Upper chapel of Sainte-Chapelle, Paris, its fifteen tall stained-glass windows filling the walls with blue and red light", credit: "Photo: Oldmanisold, via Wikimedia Commons (CC BY-SA 4.0)" },
    detail: { src: `${H}/case-detail.jpg`, alt: "Detail of Sainte-Chapelle window tracery, slender stone bars framing panels of 13th-century stained glass", credit: "Photo: Yair Haklai, via Wikimedia Commons (CC BY-SA 4.0)" }
  },
  sources: [
    { name: "Centre des monuments nationaux — Sainte-Chapelle", url: "https://www.sainte-chapelle.fr/en" },
    { name: "Smarthistory — Sainte-Chapelle, Paris", url: "https://smarthistory.org/sainte-chapelle-paris/" },
    { name: "UNESCO World Heritage — Paris, Banks of the Seine", url: "https://whc.unesco.org/en/list/600" }
  ]
};

export const historyFaq = [
  { question: "How can I identify a building's architectural style?", answer: "Work through five signs in order — silhouette, openings, ornament, structure and material — and let them vote together. One sign alone never decides: a pointed arch can appear in a Gothic church, a Victorian revival station or a modern pastiche. The guided method on this page works the five signs through on a real facade, step by step." },
  { question: "What is the difference between Art Deco and Art Nouveau?", answer: "Art Nouveau (c. 1890–1910) grows its ornament from plant forms — the whiplash line, asymmetrical ironwork, stained glass. Art Deco (c. 1910–1939) streamlines it into geometry: stepped massing, chevrons, sunbursts and machine-age materials. The shortcut 'curve versus geometry' is only a starting point — Deco grew partly out of Nouveau, and the side-by-side study on this page shows where the rule breaks." },
  { question: "How do Gothic and Romanesque churches differ?", answer: "Romanesque churches (c. 1000–1150) carry their vaults on massive walls pierced by small round-arched openings. Gothic builders (from c. 1140) combined the pointed arch, the rib vault and the flying buttress to thin the wall into glass. Compare the arch profile, the vault and how much of the wall is window — the comparison study on this page sets them side by side." },
  { question: "What does a flying buttress actually do?", answer: "It carries the sideways push of a stone vault across an open arc of masonry to a freestanding pier, so the wall between the piers no longer has to resist that thrust — and can be opened into tall windows. It is structure you can read from the street: find the arc, follow the thrust line to the pier." },
  { question: "Is 'Victorian' an architectural style?", answer: "Not a single one. Victorian (1837–1901) names an era, not a style: within it, Gothic Revival, Italianate, Queen Anne and industrial iron-and-glass building stand side by side. Always ask which revival, in which region, for which building type — the entry on this page shows how." },
  { question: "Why does this atlas separate historic materials from modern products?", answer: "Because honesty about time matters. Each entry reads a style three ways and keeps the layers separate: the historic material and how it was worked, the design principle it carries, and only then the modern system that answers the same problem today. A Roman travertine wall and a modern travertine panel are cousins, not twins." }
];
