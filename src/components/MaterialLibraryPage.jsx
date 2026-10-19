import { useMemo, useState } from 'react';
import { materialApplications, materialCategories, materialLibrary } from '../data/materialLibrary.js';
import './MaterialLibraryPage.css';

const titleCase = (value) => value.replace(/\b\w/g, (letter) => letter.toUpperCase());

function MaterialHeader() {
  return <header className="ml-nav"><a className="ml-brand" href="/">WORLD ARCH JOURNAL <span>BY FARNAZ</span></a><nav aria-label="Material section"><a href="/materials/" aria-current="page">Library</a><a href="/material-studio/">Room visualizer</a><a href="/projects/atlas-villa/">Atlas Villa</a><a href="/services/">Design services</a></nav></header>;
}

function MaterialCard({ item }) {
  return <article className="ml-card">
    <a className="ml-card-image" href={`/materials/${item.slug}/`} aria-label={`View ${item.name} material details`}>
      <img src={item.maps.baseColor} alt={`${item.name} seamless base-color texture sample`} loading="lazy" decoding="async" />
      <span className="ml-card-zoom">VIEW MATERIAL ↗</span>
    </a>
    <div className="ml-card-copy"><div className="ml-card-kicker"><span>{item.familyLabel}</span><span>CC0 SAMPLE</span></div>
      <h2><a href={`/materials/${item.slug}/`}>{item.name}</a></h2>
      <p>{item.applications.map((surface) => materialApplications.find((entry) => entry.id === surface)?.label).filter(Boolean).join(' · ')}</p>
      <div className="ml-card-footer"><span>{item.resolution}</span><a href={`/materials/${item.slug}/`}>PRODUCT DETAILS <b>↗</b></a></div>
    </div>
  </article>;
}

function LibraryFooter() {
  return <footer className="ml-footer"><span>WORLD ARCH JOURNAL · MATERIAL LIBRARY</span><a href="/">Home</a><a href="/services/">Design services</a><a href="/editorial-team/">Contact</a></footer>;
}

function CatalogPage() {
  const [query, setQuery] = useState('');
  const [family, setFamily] = useState('all');
  const [application, setApplication] = useState('all');
  const [color, setColor] = useState('all');
  const [brand, setBrand] = useState('all');
  const families = useMemo(() => [...new Set(materialLibrary.map((item) => item.family))], []);
  const colors = useMemo(() => [...new Set(materialLibrary.map((item) => item.colorFamily))], []);
  const brands = useMemo(() => [...new Set(materialLibrary.map((item) => item.manufacturer?.name || item.source.name))], []);
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return materialLibrary.filter((item) => {
      const matchesQuery = !normalized || [item.name, item.familyLabel, item.description, item.source.name].join(' ').toLowerCase().includes(normalized);
      const itemBrand = item.manufacturer?.name || item.source.name;
      return matchesQuery && (family === 'all' || item.family === family) && (application === 'all' || item.applications.includes(application)) && (color === 'all' || item.colorFamily === color) && (brand === 'all' || itemBrand === brand);
    });
  }, [query, family, application, color, brand]);
  const reset = () => { setQuery(''); setFamily('all'); setApplication('all'); setColor('all'); setBrand('all'); };

  return <main className="material-library-page">
    <MaterialHeader />
    <section className="ml-hero">
      <div className="ml-hero-image" role="img" aria-label="Atlas Villa living room concept render with garden view" />
      <div className="ml-hero-content"><small>WORLD ARCH JOURNAL · MATERIAL LIBRARY</small><h1>Find the finish.<br /><em>See it in space.</em></h1><p>Explore a growing library of architectural surfaces, inspect the material maps, and test finishes in a room-scale visual study.</p>
        <div className="ml-hero-actions"><a className="ml-primary-link" href="#catalog">EXPLORE THE LIBRARY <span>↓</span></a><a href="/material-studio/">OPEN ROOM VISUALIZER ↗</a></div>
        <span className="ml-hero-caption">ATLAS VILLA · DESIGN STUDY IMAGE</span>
      </div>
    </section>
    <section className="ml-category-ribbon" aria-label="Material families">
      {materialCategories.map((category) => {
        const count = materialLibrary.filter((item) => item.family === category.id).length;
        return <button type="button" key={category.id} className={family === category.id ? 'is-active' : ''} disabled={!count} onClick={() => { setFamily(category.id); document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' }); }}>
          <span>{category.label}</span><small>{count ? `${count} sample${count > 1 ? 's' : ''}` : 'Coming soon'}</small>
        </button>;
      })}
    </section>
    <section className="ml-catalog" id="catalog">
      <div className="ml-catalog-heading"><div><small>SEARCH · COMPARE · TEST</small><h2>Material library</h2><p>Browse by material family, room application, color direction or product source.</p></div><span className="ml-result-count" aria-live="polite">{filtered.length} OF {materialLibrary.length} LICENSED SAMPLE SETS</span></div>
      <div className="ml-search-row"><label className="ml-search"><span aria-hidden="true">⌕</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search material, family or source" aria-label="Search materials" /><kbd>SEARCH</kbd></label>
        <label className="ml-select"><span>APPLICATION</span><select value={application} onChange={(event) => setApplication(event.target.value)}><option value="all">All surfaces</option>{materialApplications.map((item) => <option value={item.id} key={item.id}>{item.label}</option>)}</select></label>
        <label className="ml-select"><span>COLOR FAMILY</span><select value={color} onChange={(event) => setColor(event.target.value)}><option value="all">All tones</option>{colors.map((item) => <option value={item} key={item}>{item}</option>)}</select></label>
        <label className="ml-select"><span>BRAND / SOURCE</span><select value={brand} onChange={(event) => setBrand(event.target.value)}><option value="all">All sources</option>{brands.map((item) => <option value={item} key={item}>{item}</option>)}</select></label>
      </div>
      <div className="ml-filter-summary"><span>{family === 'all' ? 'ALL MATERIAL FAMILIES' : titleCase(family)}</span><button type="button" onClick={reset}>RESET FILTERS ↺</button></div>
      {filtered.length ? <div className="ml-grid">{filtered.map((item) => <MaterialCard item={item} key={item.id} />)}</div> : <div className="ml-empty"><span>NO MATCHES</span><h3>Try another search or surface.</h3><button type="button" onClick={reset}>Clear all filters</button></div>}
    </section>
    <section className="ml-experience"><div><small>FROM SAMPLE TO SPACE</small><h2>Test finishes in a room-scale study.</h2><p>Apply a finish to a compatible surface, change the viewpoint and inspect how texture and light read together. The current visualizer is a design study—not a product specification or a color guarantee.</p><a href="/material-studio/">LAUNCH THE ROOM VISUALIZER ↗</a></div><figure><img src="/assets/projects/atlas-villa/living-room.jpg" alt="Atlas Villa living room concept render used as a project reference" loading="lazy" /><figcaption>Atlas Villa · concept render · project reference</figcaption></figure></section>
    <section className="ml-supplier-note"><small>FOR MATERIAL MAKERS & DESIGNERS</small><h2>Bring a verified material into the library.</h2><p>Manufacturer products are added only when product details, images, technical sheets and digital-use permissions can be verified.</p><a href="/editorial-team/">ASK ABOUT A MATERIAL SUBMISSION ↗</a></section>
    <LibraryFooter />
  </main>;
}

function MaterialProductPage({ item }) {
  if (!item) return <main className="material-library-page"><MaterialHeader /><section className="ml-empty ml-missing"><span>404 · MATERIAL NOT FOUND</span><h1>This material is not in the library.</h1><a href="/materials/">Return to the material library ↗</a></section><LibraryFooter /></main>;
  const maps = [
    ['Base color', item.maps.baseColor, 'Color and pattern information used by the material.'],
    ['OpenGL normal', item.maps.normal, 'Surface relief direction map, OpenGL convention.'],
    ['Roughness', item.maps.roughness, 'Greyscale map controlling surface light response.'],
  ];
  return <main className="material-library-page ml-product-page">
    <MaterialHeader />
    <div className="ml-breadcrumb"><a href="/">Home</a><span>/</span><a href="/materials/">Material Library</a><span>/</span><b>{item.name}</b></div>
    <section className="ml-product-intro"><div><small>{item.familyLabel.toUpperCase()} · GENERIC CC0 SAMPLE</small><h1>{item.name}</h1><p>{item.description}</p><div className="ml-product-actions"><a className="ml-primary-link" href={`/material-studio/?material=${encodeURIComponent(item.visualizerMaterialId)}`}>TEST IN ROOM VISUALIZER ↗</a><a href="#map-downloads">VIEW AVAILABLE MAPS ↓</a></div></div><div className="ml-license-badge"><span>LICENSE</span><strong>CC0 1.0</strong><a href={item.source.url} target="_blank" rel="noreferrer">Verify source ↗</a></div></section>
    <section className="ml-product-grid"><div className="ml-map-feature"><img src={item.maps.baseColor} alt={`${item.name} base color PBR map`} /><div><small>SEAMLESS SURFACE SAMPLE · {item.resolution.toUpperCase()}</small><p>Source: <a href={item.source.url} target="_blank" rel="noreferrer">{item.source.name} ↗</a> · {item.source.author}</p></div></div><aside className="ml-spec-panel"><small>MATERIAL RECORD</small><h2>Verified information</h2><dl><div><dt>Material family</dt><dd>{item.familyLabel}</dd></div><div><dt>Applications</dt><dd>{item.applications.map((surface) => materialApplications.find((entry) => entry.id === surface)?.label).filter(Boolean).join(', ')}</dd></div><div><dt>Color direction</dt><dd>{item.colorFamily} · visual reference only</dd></div><div><dt>Finish / dimensions</dt><dd>{item.finish || 'Not supplied'}{item.dimensions ? ` · ${item.dimensions}` : ''}</dd></div><div><dt>Tileable</dt><dd>{item.tileable ? 'Yes, source sample' : 'Not verified'}</dd></div><div><dt>Brand / product code</dt><dd>{item.manufacturer?.name || 'Generic sample'}{item.productCode ? ` · ${item.productCode}` : ' · no manufacturer code'}</dd></div><div><dt>Map workflows</dt><dd>{item.softwareTargets.join(', ')} · texture maps only, no native project export</dd></div></dl><p className="ml-spec-warning">This sample is not a manufacturer product and must not be used as a construction specification. Confirm real-world color and dimensions with the supplier.</p></aside></section>
    <section className="ml-technical-record"><div><small>PRODUCT DOCUMENTATION</small><h2>Technical information</h2></div>{item.technicalSheets.length || item.certifications.length ? <div className="ml-technical-list">{item.certifications.map((certification) => <p key={certification.name}><b>{certification.name}</b> · {certification.issuer || 'Issuer not supplied'}{certification.url ? <> · <a href={certification.url} target="_blank" rel="noreferrer">Verify ↗</a></> : ''}</p>)}{item.technicalSheets.map((sheet) => <p key={sheet.url}><a href={sheet.url} target="_blank" rel="noreferrer">{sheet.title || 'Technical sheet'} ↗</a>{sheet.updatedAt ? ` · ${sheet.updatedAt}` : ''}</p>)}</div> : <p>No manufacturer certifications, verified physical specifications or technical sheets are supplied for this generic sample.</p>}</section>
    {item.gallery.length > 0 && <section className="ml-gallery"><div><small>PRODUCT GALLERY</small><h2>In context</h2></div><div className="ml-gallery-grid">{item.gallery.map((image, index) => <figure key={`${image.src}-${index}`}><img src={image.src} alt={image.alt || `${item.name} material view ${index + 1}`} loading="lazy" /><figcaption>{image.caption || 'Product visualization'}{image.credit ? ` · ${image.credit}` : ''}</figcaption></figure>)}</div></section>}
    <section className="ml-map-section" id="map-downloads"><div className="ml-section-title"><div><small>AVAILABLE FILES</small><h2>PBR map set</h2></div><p>Download only the maps present in this licensed sample pack. No missing maps or software exports are implied.</p></div><div className="ml-map-list">{maps.map(([label, url, description]) => <article key={label}><div className="ml-map-thumb"><img src={url} alt="" loading="lazy" /></div><div><b>{label}</b><p>{description}</p><small>1K JPG · CC0 source</small></div><a href={url} download={`${item.slug}-${label.toLowerCase().replaceAll(' ', '-')}-1k.jpg`}>DOWNLOAD ↓</a></article>)}</div><div className="ml-unavailable-maps"><span>NOT INCLUDED IN THIS SAMPLE PACK</span>{item.missingMaps.join(' · ')}. Software-specific presets and manufacturer documents are not available for this generic sample.</div></section>
    <section className="ml-source-panel"><div><small>PROVENANCE & RIGHTS</small><h2>Source record</h2></div><p>Asset: <a href={item.source.url} target="_blank" rel="noreferrer">{item.source.name} — {item.name} ↗</a><br />Author: {item.source.author}<br />License: {item.source.license}; source attribution retained for transparency.<br />Product brand, product code, physical size and technical certification: not applicable or not supplied.</p></section>
    <section className="ml-related"><div><small>CONTINUE EXPLORING</small><h2>More material samples</h2></div><div className="ml-related-grid">{materialLibrary.filter((candidate) => candidate.id !== item.id).slice(0, 3).map((candidate) => <MaterialCard item={candidate} key={candidate.id} />)}</div></section>
    <LibraryFooter />
  </main>;
}

export default function MaterialLibraryPage({ material = null }) {
  return material ? <MaterialProductPage item={material} /> : <CatalogPage />;
}
