import { useState } from 'react';
import { mineralRoot } from '../data/mineralMaterials.js';
import MaterialSceneGallery from './MaterialSceneGallery.jsx';
import { materialScenes } from '../data/materialScenes.js';
import StoneSurfaceViewer from './StoneSurfaceViewer.jsx';
import { zipMaterialFiles } from '../lib/materialZip.js';
import './MineralMaterialPanel.css';

export default function MineralMaterialPanel({ material }) {
  const requested = new URLSearchParams(window.location.search).get('finish');
  const [selected, setSelected] = useState(material.finishes.some((finish) => finish.id === requested) ? requested : material.finishes[0].id);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');
  const [tier, setTier] = useState('16k');
  const finish = material.finishes.find((item) => item.id === selected);
  const root = `${mineralRoot}${material.id}/`;
  const preview = `${root}${selected}/preview.webp`;
  const select = (id) => {
    setSelected(id); setStatus('');
    const url = new URL(window.location.href);
    url.searchParams.set('finish', id);
    window.history.replaceState(null, '', url);
  };
  const download = async () => {
    if (busy) return;
    if (!globalThis.crypto?.subtle) { setStatus('For verified downloads, open this page over HTTPS.'); return; }
    setBusy(true); setStatus(`Preparing and checking the ${tier.toUpperCase()} maps…`);
    try {
      const response = await fetch(`${root}${selected}/${tier === '16k' ? 'manifest-16k.json' : 'manifest.json'}`, {cache:'no-store'});
      if (!response.ok) throw new Error('Manifest unavailable');
      const manifest = await response.json();
      const files = [];
      for (const file of manifest.files) {
        if (file.parts) {
          const chunks = [];
          for (const part of file.parts) {
            const result = await fetch(`${part.url}?v=${part.sha256}`);
            if (!result.ok) throw new Error('Map part unavailable');
            const data = new Uint8Array(await result.arrayBuffer());
            const hash = [...new Uint8Array(await crypto.subtle.digest('SHA-256', data))].map((value) => value.toString(16).padStart(2, '0')).join('');
            if (hash !== part.sha256) throw new Error('Map part integrity check failed');
            chunks.push(data);
          }
          files.push({ name: file.name, data: chunks });
          continue;
        }
        const result = await fetch(`${file.url}?v=${file.sha256}`);
        if (!result.ok) throw new Error('Map unavailable');
        const data = new Uint8Array(await result.arrayBuffer());
        const hash = [...new Uint8Array(await crypto.subtle.digest('SHA-256', data))].map((value) => value.toString(16).padStart(2, '0')).join('');
        if (hash !== file.sha256) throw new Error('Map integrity check failed');
        files.push({ name: file.name, data });
      }
      files.push({ name: 'manifest.json', data: new TextEncoder().encode(JSON.stringify(manifest, null, 2)) });
      const url = URL.createObjectURL(zipMaterialFiles(files));
      const link = document.createElement('a');
      link.href = url; link.download = `waj-${material.id}-${selected}-${tier}.zip`; link.click();
      setTimeout(() => URL.revokeObjectURL(url), 30000);
      setStatus(`${finish.name} · ${tier.toUpperCase()} pack ready. Map integrity verified.`);
    } catch { setStatus('The material pack could not be verified. Please try again.'); }
    finally { setBusy(false); }
  };
  return <main className="mp-page" id="main-content">
    <header className="mp-header"><a href="/">WORLD ARCH JOURNAL</a><a href="/materials/">Material Library ↗</a></header>
    <nav className="mp-breadcrumb" aria-label="Breadcrumb"><a href="/materials/">Materials</a><span>/</span><a href={`/materials/category/${material.category}/`}>{material.category === 'metal' ? 'Metal' : material.category === 'concrete' ? 'Concrete' : 'Plaster & paint'}</a><span>/</span><span aria-current="page">{material.name}</span></nav>
    <div className="mp-layout"><section className="mp-studio">{materialScenes[material.id] && <MaterialSceneGallery material={material} finish={finish} onSelect={select} disabled={busy}/>}<details className="mp-source-map" open={!materialScenes[material.id]}><summary>Inspect the seamless source map</summary><figure className="mp-surface"><img src={preview} width="1024" height="1024" alt={`${finish.name} ${material.name.toLowerCase()} seamless surface study`} fetchPriority="high"/><figcaption><span>THE SURFACE, UP CLOSE</span><b>{finish.name}</b><small>Original procedural material · 1200 × 1200 mm digital repeat</small></figcaption></figure></details>
      <div className="mp-about"><small>DESIGNED FOR YOUR MATERIAL PALETTE</small><h2>A quiet surface.<br/>A considered finish.</h2><p>{material.application}</p><p>The flat preview and studio viewer use the same material maps. These are digital finish studies, not site photographs, quarry scans or certified manufacturer samples.</p></div>
      <section className="mp-reading"><h2>Materials in context</h2>{material.reading.map((link) => <a key={link.url} href={link.url}>{link.label} ↗</a>)}<a href="/materials/">Explore all material collections ↗</a></section>
    </section><aside className="mp-controls"><small className="mp-eyebrow">{material.label}</small><h1>{material.name}.</h1><p className="mp-lead">Explore the tone.<br/>Read the surface.</p><p>{material.description}</p><h2>Choose your finish</h2><div className="mp-swatches" role="group" aria-label={`${material.name} finishes`}>{material.finishes.map((item) => <button key={item.id} type="button" disabled={busy} aria-pressed={selected === item.id} aria-label={`Select ${item.name}`} onClick={() => select(item.id)}><span style={{ backgroundColor: item.color, backgroundImage: `url(${root}${item.id}/preview.webp)` }}>{selected === item.id ? '✓' : ''}</span><small>{item.name}</small></button>)}</div>
      <StoneSurfaceViewer key={material.id} finish={finish} root={root} filePrefix={`waj-${material.id}`} mapUrls={[preview, `${root}shared/normal-opengl-preview.png`, `${root}shared/roughness-preview.png`]} note="Adjust light on the sphere or panel. The flat texture preview remains unlit. Studio maps are 1K for responsive browsing; the downloadable source maps are 4K."/>
      <section className="mp-download"><small>ORIGINAL PROCEDURAL PBR MAPS</small><h2>Take the surface<br/>into your project.</h2><label>Download resolution<select value={tier} disabled={busy} onChange={event => {setTier(event.target.value);setStatus('');}}><option value="16k">16K · seamless tiled edition</option><option value="4k">4K · original source maps</option></select></label><p>{tier === '16k' ? '16384 × 16384 px, made from 4 × 4 seamless source repeats. No additional scan detail. Digital repeat: 4800 × 4800 mm.' : 'Original 4096 × 4096 procedural source maps. Digital repeat: 1200 × 1200 mm.'}</p><button type="button" disabled={busy} onClick={download}>{busy ? 'Preparing…' : `Download ${finish.name} · ${tier.toUpperCase()} ZIP ↓`}</button><p role="status">{status || 'Base color · OpenGL normal · roughness · 16-bit height'}</p><dl><dt>Resolution</dt><dd>{tier === '16k' ? '16384 × 16384 px' : '4096 × 4096 px'}</dd><dt>Digital repeat</dt><dd>{tier === '16k' ? '4800 × 4800 mm' : material.repeat}</dd><dt>Native project files</dt><dd>Not included</dd></dl><p>Free for personal and commercial visualisation. Do not resell the maps as a standalone texture pack. Physical color, durability and installation suitability must be checked with the supplier.</p></section>
    </aside></div><footer className="mp-footer"><span>WORLD ARCH JOURNAL · MATERIAL LIBRARY</span><a href="/materials/">Back to the collection ↗</a></footer>
  </main>;
}
