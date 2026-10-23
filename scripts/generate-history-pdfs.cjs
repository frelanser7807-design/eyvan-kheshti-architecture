/* Generates the Architectural History Series book PDFs from src/data/historyDeep.js.
   Renders a print-styled book (cover, title page, contents, chapters, reference
   sections) with headless Chromium and writes public/downloads/history/<id>.pdf
   plus a copy into dist when a build output exists. Non-fatal by default,
   mirroring generate-newsletter-pdfs.cjs; set PDF_STRICT=1 to fail the build. */
const http = require('node:http');
const fs = require('node:fs');
const fsp = require('node:fs/promises');
const path = require('node:path');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const publicDir = path.join(root, 'public');
const distDir = path.join(root, 'dist');
const publicOutput = path.join(publicDir, 'downloads', 'history');
const distOutput = path.join(distDir, 'downloads', 'history');
const SITE = 'https://worldarchjournal.com';
const mime = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml' };

const esc = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

async function fontFace(family, weight, style, candidates) {
  for (const candidate of candidates) {
    try {
      const data = await fsp.readFile(candidate);
      const format = candidate.endsWith('.woff2') ? 'woff2' : 'truetype';
      return `@font-face{font-family:'${family}';font-weight:${weight};font-style:${style};src:url(data:font/${format === 'woff2' ? 'woff2' : 'ttf'};base64,${data.toString('base64')}) format('${format}')}`;
    } catch { /* try next candidate */ }
  }
  return '';
}

async function bookFonts() {
  const nm = (...parts) => path.join(root, 'node_modules', ...parts);
  const pub = (...parts) => path.join(publicDir, ...parts);
  const faces = await Promise.all([
    fontFace('Playfair Display', 600, 'normal', [pub('assets', 'fonts', 'playfair-display-600.woff2')]),
    fontFace('Playfair Display', 500, 'normal', [pub('assets', 'fonts', 'playfair-display-500.woff2')]),
    fontFace('Playfair Display', 500, 'italic', [pub('assets', 'fonts', 'playfair-display-italic-500.woff2')]),
    fontFace('Cormorant Garamond', 400, 'normal', [nm('@fontsource', 'cormorant-garamond', 'files', 'cormorant-garamond-latin-400-normal.woff2')]),
    fontFace('Cormorant Garamond', 500, 'normal', [nm('@fontsource', 'cormorant-garamond', 'files', 'cormorant-garamond-latin-500-normal.woff2')]),
    fontFace('Cormorant Garamond', 600, 'normal', [nm('@fontsource', 'cormorant-garamond', 'files', 'cormorant-garamond-latin-600-normal.woff2')]),
    fontFace('Cormorant Garamond', 500, 'italic', [nm('@fontsource', 'cormorant-garamond', 'files', 'cormorant-garamond-latin-500-italic.woff2')]),
    fontFace('Inter', 400, 'normal', [nm('@fontsource', 'inter', 'files', 'inter-latin-400-normal.woff2')]),
    fontFace('Inter', 600, 'normal', [nm('@fontsource', 'inter', 'files', 'inter-latin-600-normal.woff2')]),
  ]);
  return faces.filter(Boolean).join('\n');
}

const BOOK_CSS = `
@page { size: A4; background: #f7f1e3; }
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
body { background: #f7f1e3; color: #241d12; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 13pt; line-height: 1.72; }
.sign { page-break-inside: avoid; margin-bottom: 5mm; }
.sign h3 { margin-top: 2mm; }
img { max-width: 100%; }
.cover { page-break-after: always; background: #0d0b08; color: #f3e9d2; height: 246mm; display: flex; flex-direction: column; align-items: center; text-align: center; padding: 16mm 12mm 12mm; border: 1.2mm solid #c6a15b; outline: 0.35mm solid #c6a15b; outline-offset: -4mm; }
.cover .masthead { font-family: Inter, Arial, sans-serif; letter-spacing: .42em; font-size: 10pt; color: #c6a15b; }
.cover .rule { width: 34mm; border-top: .5mm solid #c6a15b; margin: 6mm auto; }
.cover .series { font-family: Inter, Arial, sans-serif; letter-spacing: .3em; font-size: 8.5pt; text-transform: uppercase; color: #d9c491; }
.cover h1 { font-family: 'Playfair Display', Georgia, serif; font-weight: 600; font-size: 40pt; line-height: 1.04; margin: 7mm 0 4mm; }
.cover .subtitle { font-style: italic; font-size: 14.5pt; color: #e8dcc0; max-width: 130mm; }
.cover figure { margin: 8mm 0 0; width: 100%; }
.cover figure img { width: 100%; height: 78mm; object-fit: contain; }
.cover figcaption { font-family: Inter, Arial, sans-serif; font-size: 6.4pt; color: #9a8b6d; margin-top: 2.5mm; line-height: 1.5; }
.cover .bookno { margin-top: auto; font-family: Inter, Arial, sans-serif; letter-spacing: .34em; font-size: 9pt; color: #c6a15b; }
.titlepage { page-break-after: always; text-align: center; padding-top: 34mm; }
.titlepage .series { font-family: Inter, Arial, sans-serif; letter-spacing: .3em; font-size: 8.5pt; text-transform: uppercase; color: #8c6a45; }
.titlepage h1 { font-family: 'Playfair Display', Georgia, serif; font-weight: 600; font-size: 30pt; line-height: 1.12; margin: 8mm 12mm 4mm; }
.titlepage .subtitle { font-style: italic; font-size: 13.5pt; color: #5c4a28; }
.titlepage .rule { width: 30mm; border-top: .45mm solid #c6a15b; margin: 9mm auto; }
.titlepage dl { display: inline-block; text-align: left; margin: 4mm auto 0; font-size: 11pt; }
.titlepage dt { font-family: Inter, Arial, sans-serif; font-size: 7.5pt; letter-spacing: .22em; text-transform: uppercase; color: #8c6a45; margin-top: 4.5mm; }
.titlepage dd { margin: 1mm 0 0; }
.titlepage .colophon { margin-top: 16mm; font-size: 9.5pt; color: #6d5c3d; line-height: 1.65; }
.toc { page-break-after: always; }
.toc h2, .refsec > h2 { font-family: 'Playfair Display', Georgia, serif; font-weight: 600; font-size: 19pt; margin: 0 0 7mm; }
.toc ol { list-style: none; margin: 0; padding: 0; }
.toc li { display: flex; gap: 4mm; padding: 2.1mm 0; border-bottom: .18mm dotted #b9a678; font-size: 11.5pt; }
.toc li b { font-family: Inter, Arial, sans-serif; font-size: 8pt; letter-spacing: .14em; color: #8c6a45; min-width: 22mm; padding-top: 1.2mm; }
.preface { page-break-before: always; }
.preface p { text-align: justify; margin: 0 0 3.6mm; }
.chapter { }
.chapter .kicker { font-family: Inter, Arial, sans-serif; font-size: 8pt; letter-spacing: .3em; text-transform: uppercase; color: #8c6a45; }
.chapter .numeral { font-family: 'Playfair Display', Georgia, serif; font-size: 44pt; color: #c6a15b; line-height: 1; margin: 3mm 0 0; }
.chapter h2 { font-family: 'Playfair Display', Georgia, serif; font-weight: 600; font-size: 21pt; line-height: 1.16; margin: 2mm 0 4mm; }
.chapter .goldrule { border-top: .5mm solid #c6a15b; width: 100%; margin: 0 0 7mm; }
.chapter h3 { font-family: 'Playfair Display', Georgia, serif; font-weight: 600; font-size: 13.5pt; margin: 7.5mm 0 2.5mm; color: #33270f; }
.chapter p { text-align: justify; margin: 0 0 3.6mm; hyphens: auto; }
.chapter p.first::first-letter { font-family: 'Playfair Display', Georgia, serif; font-size: 30pt; line-height: .82; float: left; padding: 1.2mm 2.2mm 0 0; color: #8c6a45; }
.fleuron { display: flex; align-items: center; gap: 3mm; margin: 6mm 22mm; }
.fleuron::before, .fleuron::after { content: ''; flex: 1; border-top: .25mm solid #c6a15b; }
.fleuron span { width: 2.2mm; height: 2.2mm; background: #c6a15b; transform: rotate(45deg); }
figure { margin: 5mm 0 6mm; page-break-inside: avoid; text-align: center; }
figure img { max-height: 150mm; object-fit: contain; }
.halftitle { page-break-after: always; text-align: center; padding-top: 62mm; }
.halftitle .series { font-family: Inter, Arial, sans-serif; letter-spacing: .3em; font-size: 8.5pt; text-transform: uppercase; color: #8c6a45; }
.halftitle h1 { font-family: 'Playfair Display', Georgia, serif; font-weight: 600; font-size: 26pt; margin-top: 6mm; }
.frontispiece { page-break-after: always; text-align: center; padding-top: 8mm; }
.frontispiece figure img { max-height: 178mm; }
.part { page-break-before: always; page-break-after: always; padding-top: 52mm; text-align: center; }
.part .kicker { font-family: Inter, Arial, sans-serif; font-size: 8.5pt; letter-spacing: .34em; text-transform: uppercase; color: #8c6a45; }
.part h2 { font-family: 'Playfair Display', Georgia, serif; font-weight: 600; font-size: 25pt; margin: 5mm 0 4mm; }
.part .rule { width: 30mm; border-top: .45mm solid #c6a15b; margin: 5mm auto; }
.part p { font-style: italic; font-size: 12.5pt; color: #5c4a28; max-width: 120mm; margin: 0 auto; }
.illuslist { page-break-before: always; }
.illuslist h2 { font-family: 'Playfair Display', Georgia, serif; font-weight: 600; font-size: 19pt; margin: 0 0 7mm; }
.illuslist ol { margin: 0; padding-left: 6mm; }
.illuslist li { margin-bottom: 2mm; font-size: 10.5pt; }
.opener { page-break-before: always; page-break-after: always; padding-top: 16mm; }
.opener .kicker { font-family: Inter, Arial, sans-serif; font-size: 8pt; letter-spacing: .3em; text-transform: uppercase; color: #8c6a45; }
.opener .numeral { font-family: 'Playfair Display', Georgia, serif; font-size: 62pt; color: #c6a15b; line-height: 1; margin: 4mm 0 0; }
.opener h2 { font-family: 'Playfair Display', Georgia, serif; font-weight: 600; font-size: 24pt; line-height: 1.16; margin: 3mm 0 4mm; }
.opener .goldrule { border-top: .5mm solid #c6a15b; margin: 0 0 6mm; }
.opener ol { list-style: none; margin: 0 0 4mm; padding: 0; }
.opener li { padding: 1.6mm 0; border-bottom: .18mm dotted #b9a678; font-size: 11.5pt; font-style: italic; color: #4a3a1c; }
.opener figure img { max-height: 96mm; }
.plate { page-break-before: always; page-break-after: always; text-align: center; }
.plate .kicker { font-family: Inter, Arial, sans-serif; font-size: 8pt; letter-spacing: .3em; text-transform: uppercase; color: #8c6a45; }
.plate h3 { font-family: 'Playfair Display', Georgia, serif; font-weight: 600; font-size: 17pt; margin: 3mm 0 5mm; }
.plate figure { margin: 0; }
.plate figure img { max-height: 148mm; }
.plate .platecap { text-align: justify; font-size: 11pt; margin-top: 4mm; }
.plate figcaption { text-align: left; }
figcaption { font-family: Inter, Arial, sans-serif; font-size: 7.2pt; color: #77643f; margin-top: 2mm; line-height: 1.55; text-align: left; }
.refsec { page-break-before: always; }
.refsec dl > div { display: grid; grid-template-columns: 38mm 1fr; gap: 4mm; padding: 1.9mm 0; border-bottom: .18mm solid #ddd0ae; }
.refsec dt { font-weight: 600; }
.refsec dd { margin: 0; }
.refsec ul { margin: 0; padding-left: 5mm; }
.refsec li { margin-bottom: 2.2mm; text-align: left; }
.refsec h3 { font-family: 'Playfair Display', Georgia, serif; font-size: 14pt; margin: 7mm 0 3mm; }
a { color: inherit; text-decoration: none; }
.endmark { text-align: center; margin-top: 12mm; color: #8c6a45; font-family: Inter, Arial, sans-serif; letter-spacing: .3em; font-size: 8pt; }
`;

function figureHtml(page, key) {
  const image = page.images[key];
  if (!image) return '';
  return `<figure><img src="${esc(image.src)}" alt="${esc(image.alt)}" /><figcaption>${esc(image.credit)}. Source: ${esc(image.sourceUrl)}</figcaption></figure>`;
}

function bookHtml(page, fontsCss, baseUrl) {
  const hero = page.images[page.hero];
  const tocItems = page.chapters.map((chapter) => `<li><b>CHAPTER ${esc(chapter.numeral)}</b><span>${esc(chapter.title)}</span></li>`).join('')
    + `<li><b>REFERENCE</b><span>Timeline · Gazetteer · Key figures · Glossary · Bibliography · Illustration credits</span></li>`;
  const PLATES = [
    ['tasselStair', 'Plate I — The Tassel Stair, Brussels', 'The most consequential stair of the 1890s: Horta hangs a glazed dome over an open well and lets the iron railing grow, unbroken, from newel to cornice. Light falls through the plan\'s dark centre; the house\'s circulation becomes its ceremony.'],
    ['secession', 'Plate II — The Secession Building, Vienna', 'Olbrich\'s exhibition temple of 1898: a white cube, a laurel dome of gilded iron leaves, and ornament rationed like ammunition. Vienna\'s revolution would be fought with geometry, not tendrils — this building is the treaty between the two.'],
    ['solvayStairs', 'Plate III — The Hôtel Solvay Stair, Brussels', 'Mahogany, marble, iron and light composed as one chord in Horta\'s most sumptuous surviving interior — preserved, with its furniture and fittings, as the period\'s most complete total work of art.'],
    ['batlloInterior', 'Plate IV — Inside Casa Batlló, Barcelona', 'Gaudí remodelled not walls but weather: mushroom fireplaces, swirling ceilings and light wells graded from deep blue to white, so that a bourgeois apartment breathes like a sea cave.'],
    ['beethovenFrieze', 'Plate V — Klimt\'s Beethoven Frieze, Vienna', 'Painted for the Secession\'s Beethoven exhibition of 1902 and nearly destroyed with it, the frieze survives in the Secession\'s basement: gold leaf, casein and inlaid stone carrying humanity\'s procession toward joy.'],
    ['santPau', 'Plate VI — Hospital de Sant Pau, Barcelona', 'Domènech i Montaner\'s garden city of healing: forty-four pavilions of brick, tile and glass, a working hospital built as a Modernista manifesto and now a UNESCO-listed museum.'],
  ];
  const PLATES_II = [
    ['karlsplatz', 'Plate VII — Karlsplatz Station, Vienna', 'Wagner\'s twin pavilions of 1898–99: marble slabs hung on an iron frame, gilded sunflower ornament screwed on like jewellery. Demolition was planned in the 1960s; the city dismantled, stored and re-erected them instead — preservation as policy, learned the hard way.'],
    ['hortaMuseumStair', 'Plate VIII — The Horta Museum Stair, Brussels', 'The architect\'s own house, designed as a visiting card: the stair rises through a glazed well past mosaic, marble and iron tendrils, in the most photographed interior of the Belgian new art.'],
    ['palauMusica', 'Plate IX — Palau de la Música Catalana, Barcelona', 'Domènech\'s concert hall turns a steel frame into a greenhouse of music: a skylight like an inverted droplet, a stage framed by sculpture, and stained glass where other halls have walls.'],
    ['casaMila', 'Plate X — Casa Milà (La Pedrera), Barcelona', 'Gaudí\'s stone wave of 1906–12, self-supporting facade, free-plan flats and a roofscape of chimneys masked as warriors — the apartment house reimagined as geology.'],
    ['stoclet', 'Plate XI — Palais Stoclet, Brussels', 'Hoffmann\'s marble tower-house for a Brussels banker (1905–11): the Secession idea grown rich and serene, its dining room wrapped in Klimt\'s golden mosaics.'],
    ['hillHouse', 'Plate XII — The Hill House, Helensburgh', 'Mackintosh and Margaret Macdonald\'s total interior in a Scottish suburb: white rooms, stencilled roses, and a main bedroom composed like a watercolour you sleep inside.'],
    ['lavirotte', 'Plate XIII — The Lavirotte Building, Paris', '29 Avenue Rapp (1901): Jules Lavirotte wraps a concrete-framed apartment house in stoneware by Alexandre Bigot, until the facade itself becomes a ceramic relief — pottery at the scale of a street.'],
    ['muchaJob', 'Plate XIV — Mucha\'s JOB Poster, 1896', 'The poster that taught Paris the style in a single winter: a woman, a cigarette, and hair arranged as pure line. The new art\'s most efficient ambassador was printed paper.'],
  ];
  const PARTS = [
    [0, 'Part I', 'Origins and Arrival', 'What the new art was, where it came from, and how — by journal, shop and exhibition — it conquered a continent in a single decade.'],
    [3, 'Part II', 'The Capitals of the New Art', 'Brussels invents it; Paris publicises it; Barcelona, Vienna and Glasgow translate it; the wider map, from Riga to Budapest, proves it a European language.'],
    [9, 'Part III', 'Making and Meaning', 'Iron, glass, ceramic and craft: the materials and workshops of the style, the houses it remade room by room, the women who made and commissioned it, and six buildings read slowly.'],
    [14, 'Part IV', 'Reading and Afterlives', 'The five-sign field method, the fall, the long embarrassment, the resurrection — and what the style still has to teach the people who design buildings now.'],
  ];
  const partFor = (index) => PARTS.find(([start]) => start === index);
  const chapters = page.chapters.map((chapter, chapterIndex) => {
    let firstParaPending = true;
    const leadFigureKey = (chapter.sections.find((section) => section.figure) || {}).figure || null;
    const headings = chapter.sections.filter((section) => section.heading).map((section) => `<li>${esc(section.heading)}</li>`).join('');
    const opener = `<section class="opener"><div class="kicker">${esc(page.series)} · Book ${page.bookNumber}</div><div class="numeral">${esc(chapter.numeral)}</div><h2>${esc(chapter.title)}</h2><div class="goldrule"></div>${headings ? `<ol>${headings}</ol>` : ''}${leadFigureKey ? figureHtml(page, leadFigureKey) : ''}</section>`;
    const sections = chapter.sections.map((section) => {
      const paras = (section.paras || []).map((paragraph) => {
        const cls = firstParaPending ? ' class="first"' : '';
        firstParaPending = false;
        return `<p${cls}>${esc(paragraph)}</p>`;
      }).join('');
      const fig = section.figure && section.figure !== leadFigureKey ? figureHtml(page, section.figure) : '';
      return `${section.heading ? `<h3>${esc(section.heading)}</h3>` : ''}${paras}${fig}`;
    }).join('<div class="fleuron"><span></span></div>');
    const signsBlock = chapter.id === 'reading' ? page.fiveSigns.map((sign, index) => `<div class="sign"><h3>${index + 1}. ${esc(sign.name)}</h3>${figureHtml(page, sign.img)}<p>${esc(sign.look)}</p><p><strong>Limit:</strong> ${esc(sign.limit)}</p></div>`).join('<div class="fleuron"><span></span></div>') : '';
    const body = `<section class="chapter">${signsBlock}${sections}</section>`;
    const renderPlates = (list, label) => list.map(([key, title, caption]) => {
      const image = page.images[key];
      return image ? `<section class="plate"><div class="kicker">${label}</div><h3>${esc(title)}</h3><figure><img src="${esc(image.src)}" alt="${esc(image.alt)}" /><figcaption>${esc(image.credit)}. Source: ${esc(image.sourceUrl)}</figcaption></figure><p class="platecap">${esc(caption)}</p></section>` : '';
    }).join('');
    const plates = chapterIndex === 8 ? renderPlates(PLATES, 'Plates') : chapterIndex === 16 ? renderPlates(PLATES_II, 'Plates · II') : '';
    const part = partFor(chapterIndex);
    const partPage = part ? `<section class="part"><div class="kicker">${esc(part[1])}</div><h2>${esc(part[2])}</h2><div class="rule"></div><p>${esc(part[3])}</p></section>` : '';
    return partPage + opener + body + plates;
  }).join('');
  const timeline = page.timeline.map(([date, event]) => `<div><dt>${esc(date)}</dt><dd>${esc(event)}</dd></div>`).join('');
  const figures = page.figures.map(([name, bio]) => `<div><dt>${esc(name)}</dt><dd>${esc(bio)}</dd></div>`).join('');
  const glossary = page.glossary.map(([term, definition]) => `<div><dt>${esc(term)}</dt><dd>${esc(definition)}</dd></div>`).join('');
  const credits = Object.values(page.images).map((image) => `<li>${esc(image.title)} — ${esc(image.credit)}. ${esc(image.sourceUrl)}</li>`).join('');
  const facts = page.keyFacts.map(([label, value]) => `<div><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`).join('');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8" /><base href="${baseUrl}" /><title>${esc(page.bookTitle)} — World Arch Journal</title><style>${fontsCss}\n${BOOK_CSS}</style></head><body>
<section class="cover">
  <div class="masthead">WORLD ARCH JOURNAL</div>
  <div class="rule"></div>
  <div class="series">${esc(page.series)}</div>
  <h1>${esc(page.title)}</h1>
  <p class="subtitle">${esc(page.subtitle)}</p>
  <figure><img src="${esc(hero.src)}" alt="${esc(hero.alt)}" /><figcaption>${esc(hero.credit)}</figcaption></figure>
  <div class="bookno">BOOK ${page.bookNumber}</div>
</section>
<section class="frontispiece">${figureHtml(page, 'tasselStair')}</section>
<section class="titlepage">
  <div class="series">${esc(page.series)} · Book ${page.bookNumber}</div>
  <h1>${esc(page.bookTitle)}</h1>
  <p class="subtitle">${esc(page.subtitle)}</p>
  <div class="rule"></div>
  <dl>${facts}</dl>
  <p class="colophon">First published ${esc(page.publishedAt)} by World Arch Journal.<br />Web edition: ${SITE}${esc(page.path)}<br />© World Arch Journal. All rights reserved.<br />Free for personal reading and study; no redistribution or resale.<br />Photographs are reproduced from Wikimedia Commons under the licences<br />stated in the illustration credits.</p>
</section>
<section class="refsec"><h2>The Book at a Glance</h2><p>${esc(page.standfirst)}</p><dl>${facts}</dl></section>
<section class="toc"><h2>Contents</h2><ol>${tocItems}</ol></section>
<section class="illuslist"><h2>List of Illustrations</h2><ol>${Object.values(page.images).map((image) => `<li>${esc(image.title)} — ${esc(image.credit)}</li>`).join('')}</ol></section>
<section class="preface"><h2 style="font-family:'Playfair Display',Georgia,serif;font-size:19pt;margin:0 0 7mm">Introduction</h2>${page.intro.map((paragraph) => `<p>${esc(paragraph)}</p>`).join('')}</section>
${chapters}
<section class="refsec"><h2>Timeline: The Style in Dates</h2><dl>${timeline}</dl></section>
<section class="refsec"><h2>Gazetteer: Where to See the Style</h2><dl>${page.gazetteer.map(([place, text]) => `<div><dt>${esc(place)}</dt><dd>${esc(text)}</dd></div>`).join('')}</dl></section>
<section class="refsec"><h2>Key Figures</h2><dl>${figures}</dl></section>
<section class="refsec"><h2>Glossary</h2><dl>${glossary}</dl></section>
<section class="refsec"><h2>Sources &amp; Bibliography</h2><h3>Sources consulted</h3><ul>${page.sources.map((source) => `<li>${esc(source.name)} — ${esc(source.url)}</li>`).join('')}</ul><h3>Bibliography</h3><ul>${page.bibliography.map((entry) => `<li>${esc(entry)}</li>`).join('')}</ul></section>
<section class="refsec"><h2>Illustration Credits</h2><p>All photographs are reproduced from Wikimedia Commons under the licences stated below. No image has been cropped; each is shown whole, as published by its author.</p><ul>${credits}</ul><div class="endmark">· END OF BOOK ${page.bookNumber} ·</div></section>
<section class="refsec"><h2>The Architectural History Series</h2><p>World Arch Journal's Architectural History Series gives every style and building type of the journal's history atlas its own complete book: the full history, the materials honestly told, the key buildings in depth, and the field method that lets the reader identify the style in the street. Each book is published first as a free web edition with a downloadable PDF on worldarchjournal.com.</p><p>Book 1 · Art Nouveau: The Complete History — this volume. In preparation: Gothic · Castles &amp; Fortified Architecture · Baroque &amp; Rococo · Romanesque · Modernism &amp; the International Style · Victorian Architecture · Art Deco · Brutalism · Renaissance · Neoclassical · Ancient Rome · and the remaining studies of the atlas, in the journal's demand order.</p><p>Read the whole series as it appears at ${SITE}${esc(page.hubPath)}</p></section>
</body></html>`;
}

(async () => {
  const { historyDeepPages } = await import('../src/data/historyDeep.js');
  await fsp.mkdir(publicOutput, { recursive: true });
  const server = http.createServer(async (request, response) => {
    try {
      const clean = decodeURIComponent((request.url || '/').split('?')[0]).replace(/^\/+/, '');
      const target = path.resolve(publicDir, clean);
      if (!target.startsWith(publicDir)) throw new Error('bad path');
      const body = await fsp.readFile(target);
      response.writeHead(200, { 'content-type': mime[path.extname(target).toLowerCase()] || 'application/octet-stream', 'cache-control': 'no-store' });
      response.end(body);
    } catch {
      response.writeHead(404, { 'content-type': 'text/plain' });
      response.end('Not found');
    }
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  const browser = await chromium.launch({ headless: true, args: process.env.CI ? ['--no-sandbox', '--disable-setuid-sandbox'] : [] });
  try {
    const fontsCss = await bookFonts();
    const page_ = await browser.newPage();
    for (const book of historyDeepPages) {
      const html = bookHtml(book, fontsCss, `http://127.0.0.1:${port}/`);
      await page_.setContent(html, { waitUntil: 'networkidle' });
      await page_.evaluate(() => document.fonts && document.fonts.ready);
      const filename = `${book.id}.pdf`;
      const outPath = path.join(publicOutput, filename);
      await page_.pdf({
        path: outPath,
        format: 'A4',
        printBackground: true,
        displayHeaderFooter: true,
        margin: { top: '20mm', right: '20mm', bottom: '19mm', left: '20mm' },
        headerTemplate: `<div style="width:100%;font-family:Arial,sans-serif;font-size:7pt;letter-spacing:.24em;color:#8c6a45;padding:0 20mm;display:flex;justify-content:space-between"><span>WORLD ARCH JOURNAL</span><span>${esc(book.title).toUpperCase()} · ${esc(book.series).toUpperCase()}</span></div>`,
        footerTemplate: `<div style="width:100%;font-family:Arial,sans-serif;font-size:7pt;color:#77643f;padding:0 20mm;display:flex;justify-content:space-between"><span>© World Arch Journal · ${SITE}${esc(book.path)}</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`,
      });
      if (fs.existsSync(distDir)) {
        await fsp.mkdir(distOutput, { recursive: true });
        await fsp.copyFile(outPath, path.join(distOutput, filename));
      }
      const stat = await fsp.stat(outPath);
      console.log(`Generated history book PDF: ${filename} (${(stat.size / 1024 / 1024).toFixed(2)} MB)`);
    }
  } finally {
    await browser.close();
    server.close();
  }
})().catch((error) => {
  console.error('WARNING: history PDF generation failed (non-fatal, build continues):', error && error.message ? error.message : error);
  process.exit(process.env.PDF_STRICT === '1' ? 1 : 0);
});
