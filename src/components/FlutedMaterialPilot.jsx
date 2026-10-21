import { useEffect, useRef, useState, useId } from 'react';
import './FlutedMaterialPilot.css';
import { zipMaterialFiles } from '../lib/materialZip.js';
import MaterialSurfaceViewer from './MaterialSurfaceViewer.jsx';

const ROOT = '/assets/material-studio/fluted-wood/';
const SCENES = '/assets/material-studio/fluted-scenes-v1/';
const finishes = [
  { id: 'natural-oak', name: 'Natural oak', color: '#b98b57', rgb: [185,139,87] },
  { id: 'light-oak', name: 'Light oak', color: '#d7bc93', rgb: [215,188,147] },
  { id: 'walnut', name: 'Walnut tone', color: '#69442d', rgb: [105,68,45] },
  { id: 'smoked-oak', name: 'Smoked oak', color: '#796754', rgb: [121,103,84] },
  { id: 'grey-oak', name: 'Grey oak', color: '#9e9c91', rgb: [158,156,145] },
  { id: 'charcoal', name: 'Charcoal black', color: '#312f2b', rgb: [49,47,43] },
  { id: 'white', name: 'White wood', color: '#e2dfd5', rgb: [226,223,213] },
];
const contexts = [
  { id:'bedroom', name:'Bedroom', surface:'The headboard wall', num:'01',
    // The fixed source's fluted wall, excluding headboard, pendants and plants.
    mask:'M189 68H1103V742H189Z', maskImage:'bedroom-mask.png', exclude:[] },
  { id:'kitchen', name:'Kitchen', surface:'The island front', num:'02', mask:'M95 690H1182V984H95Z', exclude:[] },
  { id:'living', name:'Living room', surface:'The television wall', num:'03', mask:'M210 120H1085V839L1026 844L989 868L984 887H210Z',
    exclude:['M409 405H880V677H409Z','M201 758H1088V838H201Z'] },
];

function Scene({ scene, finish, original = false, onExpand }) {
  const uid = useId().replaceAll(':','');
  const filterId = `finish-${uid}`;
  const maskId = `mask-${uid}`;
  const rgb = finish.rgb.map(v=>v/255);
  // Luminance-preserving finish study of a fixed photographic source. This
  // changes only the masked panel; it is not advertised as real-time ray tracing.
  const rows = rgb.map(c=>`${.2126*c/.55} ${.7152*c/.55} ${.0722*c/.55} 0 0`).join(' ');
  return <figure className="fp-scene" data-scene={scene.id}>
    <div className="fp-scene-image">
      <svg viewBox="0 0 1254 1254" role="img" aria-label={`${scene.name}: ${original?'Natural oak':finish.name} on ${scene.surface.toLowerCase()}`}>
        <defs>
          <filter id={filterId} colorInterpolationFilters="sRGB"><feColorMatrix type="matrix" values={`${rows} 0 0 0 1 0`} /></filter>
          <clipPath id={`${maskId}-bounds`}><path d={scene.mask}/></clipPath>
          <filter id={`${maskId}-binary`} colorInterpolationFilters="sRGB"><feComponentTransfer><feFuncR type="discrete" tableValues="0 1 1"/><feFuncG type="discrete" tableValues="0 1 1"/><feFuncB type="discrete" tableValues="0 1 1"/></feComponentTransfer></filter>
          <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="1254" height="1254">{scene.maskImage?<image href={`${SCENES}${scene.maskImage}`} width="1254" height="1254" clipPath={`url(#${maskId}-bounds)`} filter={`url(#${maskId}-binary)`}/>:<path d={scene.mask} fill="white"/>}{scene.exclude.map((d,i)=><path key={i} d={d} fill="black"/>)}</mask>
        </defs>
        <image href={`${SCENES}${scene.id}.png`} width="1254" height="1254" />
        {!original && finish.id !== 'natural-oak' && <g mask={`url(#${maskId})`}><image href={`${SCENES}${scene.id}.png`} width="1254" height="1254" filter={`url(#${filterId})`} /></g>}
      </svg>
      {onExpand && <button className="fp-expand" type="button" aria-label={`Enlarge ${scene.name}`} onClick={()=>onExpand(scene)}>↗</button>}
    </div>
    <figcaption><span><i>{scene.num}</i> {scene.name}</span><small>{scene.surface}</small></figcaption>
  </figure>;
}

export default function FlutedMaterialPilot() {
  const initialId = new URLSearchParams(window.location.search).get('finish');
  const [selected, setSelected] = useState(finishes.some(f=>f.id===initialId)?initialId:'natural-oak');
  const [original, setOriginal] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [downloadState, setDownloadState] = useState('');
  const [busy, setBusy] = useState(false);
  const [quality,setQuality] = useState('4k');
  // Enable higher resolutions only after their complete release passes validation.
  const ultra = null;
  const dialog = useRef(null);
  const finish = finishes.find(f=>f.id===selected);
  const changeFinish = id => {
    setSelected(id); setOriginal(false);
    const url = new URL(window.location.href); url.searchParams.set('finish',id);
    window.history.replaceState(null,'',url);
  };
  useEffect(()=>{ if(expanded) dialog.current?.showModal(); },[expanded]);
  const download = async () => {
    if(busy)return;
    const id=selected, name=finish.name;
    setBusy(true);setDownloadState(`Preparing ${name}…`);
    try {
      const paths=[['basecolor-4k.png',`${id}/basecolor-4k.png`],['roughness-4k.png',`${id}/roughness-4k.png`],['normal-opengl-4k.png','shared/normal-opengl-4k.png'],['height-16bit-4k.png','shared/height-16bit-4k.png'],['manifest.json',`${id}/manifest.json`],['source/build-fluted-materials.py','shared/build-fluted-materials.py']];
      let files=[];
      if(quality==='16k' && ultra){
        const root='/assets/material-studio/fluted-ultra-v2/16k/';
        for(const filename of [`${id}-basecolor.png`,'roughness.png','normal-opengl.png','height-16bit.png']){
          const record=ultra.files[filename];const parts=[];setDownloadState(`Preparing ${name}: ${filename}…`);
          for(const part of record.parts){const response=await fetch(root+part);if(!response.ok)throw new Error('Map unavailable');parts.push(new Uint8Array(await response.arrayBuffer()));}
          const data=new Uint8Array(record.bytes);let offset=0;for(const part of parts){data.set(part,offset);offset+=part.length;}
          if(offset!==record.bytes)throw new Error('Incomplete map');
          const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',data)),v=>v.toString(16).padStart(2,'0')).join('');
          if(hash!==record.sha256)throw new Error('Map integrity check failed');files.push({name:filename,data});
        }
        files.push({name:'manifest.json',data:new TextEncoder().encode(JSON.stringify({...ultra,selectedFinish:id},null,2))});
      } else files=await Promise.all(paths.map(async([filename,path])=>{const response=await fetch(`${ROOT}${path}`);if(!response.ok)throw new Error('Download unavailable');return {name:filename,data:new Uint8Array(await response.arrayBuffer())};}));
      const url=URL.createObjectURL(zipMaterialFiles(files));const link=document.createElement('a');link.href=url;link.download=`waj-fluted-${id}-${quality}.zip`;link.click();setTimeout(()=>URL.revokeObjectURL(url),30000);setDownloadState(`${name} ${quality.toUpperCase()} pack prepared.`);
    } catch {setDownloadState('The pack could not be prepared. Please try again.');} finally {setBusy(false);}
  };
  return <main className="fluted-pilot" id="main-content">
    <header className="fp-header"><a href="/" className="fp-wordmark">WORLD ARCH JOURNAL<span>MATERIAL COLLECTION</span></a><nav><a href="/materials/">Material library</a><a href="/materials/category/wood/">Wood & timber</a><a href="/">Journal home</a></nav></header>
    <nav className="fp-breadcrumb" aria-label="Breadcrumb"><a href="/materials/">Material library</a><span> / </span><a href="/materials/category/wood/">Wood & timber</a><span> / </span><a href="/materials/category/wood/fluted-panels/">Fluted panels</a><span> / </span><b aria-current="page">Original fluted wood</b></nav>
    <div className="fp-layout">
      <div className="fp-gallery">
        <div className="fp-gallery-heading"><span>ONE MATERIAL. THREE SPACES.</span><p>A continuous rhythm.<br/><em>A different atmosphere.</em></p></div>
        <div className="fp-contexts">
          {contexts.map(scene=><Scene key={scene.id} scene={scene} finish={finish} original={original} onExpand={setExpanded}/>)}
          <MaterialSurfaceViewer finish={finish}/>
        </div>
      </div>
      <aside className="fp-product">
        <span className="fp-eyebrow">WORLD ARCH JOURNAL ORIGINALS / 01</span><h1>Fluted wood</h1><p className="fp-description">Fine vertical grain. Softly rounded profiles. One considered finish, seen across a bedroom, a living room and a kitchen island.</p>
        <div className="fp-finish-heading"><span>Finish</span><strong aria-live="polite">{finish.name}</strong></div>
        <div className="fp-swatches" role="group" aria-label="Choose wood finish">{finishes.map(item=><button key={item.id} type="button" aria-pressed={selected===item.id} aria-label={item.name} title={item.name} onClick={()=>changeFinish(item.id)}><span style={{backgroundColor:item.color,backgroundImage:`url(${ROOT}${item.id}/preview.webp)`}}>{selected===item.id && <i>✓</i>}</span><small>{item.name}</small></button>)}</div>
        <label className="fp-compare"><input type="checkbox" checked={original} onChange={e=>setOriginal(e.target.checked)}/> Compare with original oak</label>
        <div className="fp-download-box"><span className="fp-badge">{quality==='16k'?'16384 × 16384':'4096 × 4096'} · NATIVE PROCEDURAL</span><h2>Your material, ready to explore.</h2><p>Base color, normal, roughness and 16-bit height maps. A material pack, not just a preview image.</p><label className="fp-quality">Download resolution<select aria-label="Download resolution" value={quality} disabled={busy} onChange={e=>setQuality(e.target.value)}><option value="4k">4K · 4096 × 4096</option>{ultra&&<option value="16k">16K · 16384 × 16384 · microdetail v2</option>}</select></label>{quality==='16k'&&ultra&&<p>Desktop recommended · approximately {Math.round([`${selected}-basecolor.png`,'roughness.png','normal-opengl.png','height-16bit.png'].reduce((n,k)=>n+ultra.files[k].bytes,0)/1048576)} MB. Files are verified before download.</p>}<button className="fp-download" type="button" disabled={busy} onClick={download}>{busy?'Preparing pack…':`Download ${finish.name} · ${quality.toUpperCase()}`} <span>↓</span></button><small aria-live="polite">{downloadState||'PNG maps · original procedural material'}</small></div>
        <details open><summary>Material information</summary><dl><div><dt>Collection</dt><dd>Original fluted wood</dd></div><div><dt>Finishes</dt><dd>7 color studies</dd></div><div><dt>Digital tile size</dt><dd>480 × 480 mm</dd></div><div><dt>Designed flute pitch</dt><dd>20 mm</dd></div><div><dt>Applications shown</dt><dd>Feature walls, island cladding</dd></div><div><dt>Normal convention</dt><dd>OpenGL +Y</dd></div></dl></details>
        <details open><summary>Technical details</summary><dl><div><dt>Material type</dt><dd>Designed wood-look fluted finish</dd></div><div><dt>Profile relief</dt><dd>4 mm digital design</dd></div><div><dt>Color map</dt><dd>RGB PNG · sRGB · 8 bit/channel</dd></div><div><dt>Data maps</dt><dd>Linear · normal + roughness</dd></div><div><dt>Displacement</dt><dd>16-bit grayscale PNG</dd></div><div><dt>Metalness</dt><dd>0 · non-metal</dd></div><div><dt>Resolution</dt><dd>4K{ultra?' / 16K':''} square maps</dd></div><div><dt>Real-time preview</dt><dd>4K maps, directional studio light</dd></div><div><dt>Room imagery</dt><dd>1254 × 1254 · illustrative finish studies</dd></div><div><dt>Physical specification</dt><dd>No manufacturer, fire rating or installation certification claimed</dd></div></dl></details>
        <details><summary>Files & usage</summary><p>Original designed material for personal and commercial visualization. These are digital finish studies, not a scanned or certified manufacturer product. Room images are AI-created visualizations; screen colors are indicative. Import PNG maps into your renderer; native Revit and SketchUp project files are not included.</p><a href={`${ROOT}${selected}/manifest.json`} target="_blank" rel="noreferrer">4K manifest ↗</a>{ultra&&<p><a href="/assets/material-studio/fluted-ultra-v2/16k/manifest.json" target="_blank" rel="noreferrer">16K manifest & checksums ↗</a> · <a href="/assets/material-studio/fluted-ultra-v2/16k/build-fluted-ultra.py" download>Procedural source ↓</a></p>}</details>
        <a className="fp-consult" href="/services/">Discuss a material palette <span>↗</span></a>
      </aside>
    </div>
    <section className="fp-related"><span>RELATED READING</span><h2>Timber, acoustics and warm interiors</h2><ul><li><a href="/articles/mass-timber-architecture-clt-design-guide/">Mass timber architecture: the CLT design guide</a></li><li><a href="/articles/apartment-acoustic-design/">Apartment acoustic design: quieter homes</a></li><li><a href="/materials/stone/natural-stone/travertine/">Sibling panel: vein-cut travertine facade studies</a></li></ul></section>
    <footer className="fp-footer"><span>WORLD ARCH JOURNAL · ORIGINAL MATERIAL COLLECTION</span><a href="/materials/">Explore the material library ↗</a></footer>
    <dialog ref={dialog} className="fp-dialog" onCancel={()=>setExpanded(null)} onClick={e=>{if(e.target===e.currentTarget){dialog.current.close();setExpanded(null);}}}><button type="button" className="fp-close" aria-label="Close enlarged image" onClick={()=>{dialog.current.close();setExpanded(null);}}>×</button>{expanded && <Scene scene={expanded} finish={finish} original={original}/>}</dialog>
  </main>;
}
