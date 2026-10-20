import {useState,useId,useEffect,useRef} from 'react';
import {brickFinishes as finishes,brickScenes as scenes,brickRoot as ROOT} from '../data/brick.js';
import BrickSurfaceViewer from './BrickSurfaceViewer.jsx';
import {zipMaterialFiles} from '../lib/materialZip.js';
import './BrickPanel.css';

function Facade({scene,finish,onExpand}){
 const uid=useId().replaceAll(':','');const ratios=finish.rgb.map((v,i)=>v/finishes[0].rgb[i]);
 return <figure className="tp-facade"><svg viewBox="0 0 1254 1254" role="img" aria-label={`${scene.name}: ${finish.name} clay brick on ${scene.surface.toLowerCase()}`}><defs><clipPath id={`brick-${uid}`}><path d={scene.mask} clipRule="evenodd"/></clipPath><filter id={`tone-${uid}`} colorInterpolationFilters="sRGB"><feColorMatrix type="matrix" values={`${ratios[0]} 0 0 0 0 0 ${ratios[1]} 0 0 0 0 0 ${ratios[2]} 0 0 0 0 0 1 0`}/></filter></defs><image href={`${ROOT}scenes/${scene.id}.png`} width="1254" height="1254"/>{finish.id!=='classic-red'&&<image href={`${ROOT}scenes/${scene.id}.png`} width="1254" height="1254" clipPath={`url(#brick-${uid})`} filter={`url(#tone-${uid})`}/>}</svg><figcaption><span><b>{scene.name}</b><small>{scene.surface}</small></span>{onExpand&&<button onClick={()=>onExpand(scene)} aria-label={`Enlarge ${scene.name}`}>↗</button>}</figcaption></figure>;
}

export default function BrickPanel(){
 const initial=new URLSearchParams(window.location.search).get('finish');
 const [selected,setSelected]=useState(finishes.some(f=>f.id===initial)?initial:'classic-red');
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
   const blob=zipMaterialFiles(files),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`waj-brick-${id}-4k.zip`;a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);setStatus('4K pack ready · file checksums verified.');
  }catch{setStatus('The pack could not be verified. Please try again.');}finally{setBusy(false);}
 };
 return <main className="tp-page" id="main-content"><header className="tp-header"><a href="/materials/">WORLD ARCH JOURNAL<small>MATERIAL LIBRARY</small></a><a href="/materials/category/brick/">Explore brick ↗</a></header><nav className="tp-breadcrumb" aria-label="Breadcrumb"><a href="/materials/">Materials</a><span>/</span><a href="/materials/category/brick/">Brick</a><span>/</span><span>Clay brick</span></nav>
 <div className="tp-layout"><section className="tp-gallery" aria-label="Three coordinated facade studies">{scenes.map((scene,i)=><div className={i===0?'tp-main-scene':''} key={scene.id}><Facade scene={scene} finish={finish} onExpand={setExpanded}/></div>)}<p className="tp-caption">One brick family. Three exterior contexts. Color studies affect the featured brick face only; glazing, planting and original lighting stay fixed. AI-created architecture, not photographs of built projects.</p></section>
 <aside className="tp-controls"><span className="tp-eyebrow">BRICK COLLECTION / 01</span><h1>Brick.</h1><p className="tp-lead">Fired clay.<br/>Built to weather.</p><p>Stretcher-bond brick studies, from classic red to charcoal blue. Explore five coordinated palettes across three architectural settings.</p><div className="tp-selected"><span>COLOR STUDY</span><b>{finish.name}</b></div><div className="tp-swatches" role="group" aria-label="Brick colors">{finishes.map(f=><button key={f.id} aria-label={`Select ${f.name}`} aria-pressed={selected===f.id} onClick={()=>select(f.id)} style={{backgroundImage:`url(${ROOT}${f.id}/preview.webp)`}}><span>{selected===f.id?'✓':''}</span><small>{f.name}</small></button>)}</div><BrickSurfaceViewer finish={finish}/>
 <section className="tp-download"><span>4096 × 4096 · ORIGINAL PROCEDURAL MAPS</span><h2>Take the material<br/>into your project.</h2><label>Resolution<select aria-label="Download resolution"><option>4K · 4096 × 4096</option></select></label><button onClick={download} disabled={busy}>{busy?'Preparing…':`Download ${finish.name} · 4K ZIP ↓`}</button><small role="status">{status||'Base color · normal · roughness · 16-bit height'}</small><p>16K is not available in this release. PNG maps can be imported into compatible 3D software; native MAX, FBX, Revit and SketchUp files are not included.</p></section>
 <details open><summary>Material characteristics</summary><dl><dt>Family</dt><dd>Clay brick-inspired digital masonry</dd><dt>Bond / appearance</dt><dd>Stretcher bond / matte</dd><dt>Selected palette</dt><dd>{finish.name}</dd><dt>Application shown</dt><dd>Exterior facade visualization</dd><dt>Digital repeat</dt><dd>1200 × 1200 mm</dd><dt>Map resolution</dt><dd>4096 × 4096 pixels</dd><dt>Normal convention</dt><dd>OpenGL (+Y)</dd><dt>Height precision</dt><dd>16-bit grayscale</dd></dl></details><details><summary>Files, license & limitations</summary><p>Original procedural material, not a manufacturer sample or certified product. Names describe color studies, not guaranteed commercial stock. Suitability, brick dimensions, mortar specification and weather resistance require supplier and project-specific verification.</p><p>Personal and commercial visualization use permitted. Scene lighting and texture pattern are illustrative; the downloadable maps are shown separately in the surface viewer.</p><a href={`${ROOT}${selected}/manifest.json`} target="_blank" rel="noreferrer">Material manifest & checksums ↗</a></details></aside></div>
 <footer className="tp-footer">WORLD ARCH JOURNAL · ORIGINAL MATERIAL STUDIES<a href="/materials/category/brick/">Back to brick library ↗</a></footer><dialog ref={dialog} className="tp-dialog" onClose={()=>setExpanded(null)} onClick={e=>{if(e.target===e.currentTarget)dialog.current?.close();}}><button className="tp-close" aria-label="Close enlarged facade" onClick={()=>dialog.current?.close()}>Close ×</button>{expanded&&<Facade scene={expanded} finish={finish}/>}</dialog></main>;
}
