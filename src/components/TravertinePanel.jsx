import {useState,useId,useEffect,useRef} from 'react';
import {travertineFinishes as finishes,travertineScenes as scenes,travertineRoot as ROOT} from '../data/travertine.js';
import StoneSurfaceViewer from './StoneSurfaceViewer.jsx';
import {zipMaterialFiles} from '../lib/materialZip.js';
import './TravertinePanel.css';

function Facade({scene,finish,onExpand}){
 const uid=useId().replaceAll(':','');const ratios=finish.rgb.map((v,i)=>v/finishes[0].rgb[i]);
 return <figure className="tp-facade"><svg viewBox="0 0 1254 1254" role="img" aria-label={`${scene.name}: ${finish.name} travertine on ${scene.surface.toLowerCase()}`}><defs><clipPath id={`stone-${uid}`}><path d={scene.mask}/></clipPath><filter id={`foliage-${uid}`} colorInterpolationFilters="sRGB"><feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 3.189 10.728 1.083 0 -7"/></filter><mask id={`stone-mask-${uid}`} maskUnits="userSpaceOnUse" x="0" y="0" width="1254" height="1254"><image href={`${ROOT}scenes/${scene.id}.png`} width="1254" height="1254" filter={`url(#foliage-${uid})`}/></mask><filter id={`tone-${uid}`} colorInterpolationFilters="sRGB"><feColorMatrix type="matrix" values={`${ratios[0]} 0 0 0 0 0 ${ratios[1]} 0 0 0 0 0 ${ratios[2]} 0 0 0 0 0 1 0`}/></filter></defs><image href={`${ROOT}scenes/${scene.id}.png`} width="1254" height="1254"/>{finish.id!=='ivory'&&<image href={`${ROOT}scenes/${scene.id}.png`} width="1254" height="1254" clipPath={`url(#stone-${uid})`} mask={`url(#stone-mask-${uid})`} filter={`url(#tone-${uid})`}/>}</svg><figcaption><span><b>{scene.name}</b><small>{scene.surface}</small></span>{onExpand&&<button onClick={()=>onExpand(scene)} aria-label={`Enlarge ${scene.name}`}>↗</button>}</figcaption></figure>;
}

export default function TravertinePanel(){
 const initial=new URLSearchParams(window.location.search).get('finish');
 const [selected,setSelected]=useState(finishes.some(f=>f.id===initial)?initial:'ivory');
 const [expanded,setExpanded]=useState(null),[busy,setBusy]=useState(false),[status,setStatus]=useState('');
 const dialog=useRef(null);const finish=finishes.find(f=>f.id===selected);
 useEffect(()=>{if(expanded)dialog.current?.showModal();},[expanded]);
 const select=id=>{setSelected(id);setStatus('');const u=new URL(window.location.href);u.searchParams.set('finish',id);window.history.replaceState(null,'',u);};
 const download=async()=>{
  if(busy)return;setBusy(true);setStatus('Preparing verified material maps…');
  const id=selected;
  try{
   const mr=await fetch(`${ROOT}${id}/manifest.json`);if(!mr.ok)throw Error();const manifest=await mr.json();
   const files=[];
   for(const [name,hash] of Object.entries(manifest.sha256)){
    const r=await fetch(`${ROOT}${name.startsWith('basecolor')?id:'shared'}/${name}`);if(!r.ok)throw Error();const data=new Uint8Array(await r.arrayBuffer());
    const actual=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',data))).map(v=>v.toString(16).padStart(2,'0')).join('');if(actual!==hash)throw Error();files.push({name,data});
   }
   files.push({name:'manifest.json',data:new TextEncoder().encode(JSON.stringify(manifest,null,2))});
   const blob=zipMaterialFiles(files),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`waj-travertine-${id}-4k.zip`;a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);setStatus('4K pack ready · file checksums verified.');
  }catch{setStatus('The pack could not be verified. Please try again.');}finally{setBusy(false);}
 };
 return <main className="tp-page" id="main-content"><header className="tp-header"><a href="/materials/">WORLD ARCH JOURNAL<small>MATERIAL LIBRARY</small></a><a href="/materials/category/stone/">Explore stone ↗</a></header><nav className="tp-breadcrumb" aria-label="Breadcrumb"><a href="/materials/">Materials</a><span>/</span><a href="/materials/category/stone/">Stone</a><span>/</span><span>Travertine</span></nav>
 <div className="tp-layout"><section className="tp-gallery" aria-label="Three coordinated facade studies">{scenes.map((scene,i)=><div className={i===0?'tp-main-scene':''} key={scene.id}><Facade scene={scene} finish={finish} onExpand={setExpanded}/></div>)}<p className="tp-caption">One stone family. Three exterior contexts. Color studies affect the featured stone face only; glazing, planting and original lighting stay fixed. AI-created architecture, not photographs of built projects.</p></section>
 <aside className="tp-controls"><span className="tp-eyebrow">STONE COLLECTION / 01</span><h1>Travertine.</h1><p className="tp-lead">Quiet layers.<br/>A facade with depth.</p><p>Vein-cut stone studies, from warm ivory to cool silver. Explore five coordinated palettes across three architectural settings.</p><div className="tp-selected"><span>COLOR STUDY</span><b>{finish.name}</b></div><div className="tp-swatches" role="group" aria-label="Travertine colors">{finishes.map(f=><button key={f.id} aria-label={`Select ${f.name}`} aria-pressed={selected===f.id} onClick={()=>select(f.id)} style={{backgroundImage:`url(${ROOT}${f.id}/preview.webp)`}}><span>{selected===f.id?'✓':''}</span><small>{f.name}</small></button>)}</div><StoneSurfaceViewer finish={finish}/>
 <section className="tp-download"><span>4096 × 4096 · ORIGINAL PROCEDURAL MAPS</span><h2>Take the material<br/>into your project.</h2><label>Resolution<select aria-label="Download resolution"><option>4K · 4096 × 4096</option></select></label><button onClick={download} disabled={busy}>{busy?'Preparing…':`Download ${finish.name} · 4K ZIP ↓`}</button><small role="status">{status||'Base color · normal · roughness · 16-bit height'}</small><p>16K is not available in this release. PNG maps can be imported into compatible 3D software; native MAX, FBX, Revit and SketchUp files are not included.</p></section>
 <details open><summary>Material characteristics</summary><dl><dt>Family</dt><dd>Travertine-inspired digital stone</dd><dt>Cut / appearance</dt><dd>Vein-cut / honed matte</dd><dt>Selected palette</dt><dd>{finish.name}</dd><dt>Application shown</dt><dd>Exterior facade visualization</dd><dt>Digital repeat</dt><dd>1200 × 1200 mm</dd><dt>Map resolution</dt><dd>4096 × 4096 pixels</dd><dt>Normal convention</dt><dd>OpenGL (+Y)</dd><dt>Height precision</dt><dd>16-bit grayscale</dd></dl></details><details><summary>Files, license & limitations</summary><p>Original procedural material, not a quarry scan or certified manufacturer sample. Names describe color studies, not guaranteed commercial stock. Suitability, slab thickness, anchoring and weather resistance require supplier and project-specific verification.</p><p>Personal and commercial visualization use permitted. Scene lighting and texture pattern are illustrative; the downloadable maps are shown separately in the surface viewer.</p><a href={`${ROOT}${selected}/manifest.json`} target="_blank" rel="noreferrer">Material manifest & checksums ↗</a></details></aside></div>
 <section className="tp-related"><span>RELATED READING</span><h2>Stone, facades and the buildings behind them</h2><ul><li><a href="/articles/climate-responsive-facades-cooling-design/">Climate-responsive facades and passive cooling</a></li><li><a href="/articles/rainscreen-facade-design-water-control/">Rainscreen facade design and water control</a></li><li><a href="/projects/the-voids-villa/">Project: The Voids Villa — courtyards in brick and stone</a></li><li><a href="/materials/wood/fluted-panels/fluted-wood/">Sibling panel: original fluted wood room studies</a></li><li><a href="/materials/stone/ceramic-porcelain/porcelain-stoneware/">Sibling panel: porcelain stoneware room studies</a></li></ul></section>
 <footer className="tp-footer">WORLD ARCH JOURNAL · ORIGINAL MATERIAL STUDIES<a href="/materials/category/stone/">Back to stone library ↗</a></footer><dialog ref={dialog} className="tp-dialog" onClose={()=>setExpanded(null)} onClick={e=>{if(e.target===e.currentTarget)dialog.current?.close();}}><button className="tp-close" aria-label="Close enlarged facade" onClick={()=>dialog.current?.close()}>Close ×</button>{expanded&&<Facade scene={expanded} finish={finish}/>}</dialog></main>;
}

