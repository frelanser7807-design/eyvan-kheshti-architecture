import {useState,useId,useEffect,useRef} from 'react';
import {ceramicFinishes as finishes,ceramicScenes as scenes,ceramicRoot as ROOT} from '../data/ceramicPorcelain.js';
import StoneSurfaceViewer from './StoneSurfaceViewer.jsx';
import {zipMaterialFiles} from '../lib/materialZip.js';
import './CeramicPorcelainPanel.css';

function Room({scene,finish,onExpand}){
 const uid=useId().replaceAll(':','');const ratios=finish.rgb.map((v,i)=>v/finishes[0].rgb[i]);
 return <figure className="cp-room"><svg viewBox="0 0 1254 1254" role="img" aria-label={`${scene.name}: ${finish.name} porcelain stoneware on ${scene.surface.toLowerCase()}`}><defs><filter id={`tone-${uid}`} colorInterpolationFilters="sRGB"><feColorMatrix type="matrix" values={`${ratios[0]} 0 0 0 0 0 ${ratios[1]} 0 0 0 0 0 ${ratios[2]} 0 0 0 0 0 1 0`}/></filter><mask id={`cp-mask-${uid}`} maskUnits="userSpaceOnUse" x="0" y="0" width="1254" height="1254"><path d={scene.mask} fill="white"/>{scene.exclude.map((d,i)=><path key={i} d={d} fill="black"/>)}</mask></defs><image href={`${ROOT}scenes/${scene.id}.png`} width="1254" height="1254"/>{finish.id!=='alpine-white'&&<g mask={`url(#cp-mask-${uid})`}><image href={`${ROOT}scenes/${scene.id}.png`} width="1254" height="1254" filter={`url(#tone-${uid})`}/></g>}</svg><figcaption><span><b>{scene.name}</b><small>{scene.surface}</small></span>{onExpand&&<button onClick={()=>onExpand(scene)} aria-label={`Enlarge ${scene.name}`}>↗</button>}</figcaption></figure>;
}

export default function CeramicPorcelainPanel(){
 const initial=new URLSearchParams(window.location.search).get('finish');
 const [selected,setSelected]=useState(finishes.some(f=>f.id===initial)?initial:'alpine-white');
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
   const blob=zipMaterialFiles(files),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`waj-porcelain-stoneware-${id}-4k.zip`;a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);setStatus('4K pack ready · file checksums verified.');
  }catch{setStatus('The pack could not be verified. Please try again.');}finally{setBusy(false);}
 };
 return <main className="cp-page" id="main-content"><header className="cp-header"><a href="/materials/">WORLD ARCH JOURNAL<small>MATERIAL LIBRARY</small></a><a href="/materials/category/stone/">Explore stone ↗</a></header><nav className="cp-breadcrumb" aria-label="Breadcrumb"><a href="/materials/">Materials</a><span>/</span><a href="/materials/category/stone/">Stone</a><span>/</span><span>Ceramic &amp; porcelain</span></nav>
 <div className="cp-layout"><section className="cp-gallery" aria-label="Three coordinated room studies">{scenes.map((scene,i)=><div className={i===0?'cp-main-scene':''} key={scene.id}><Room scene={scene} finish={finish} onExpand={setExpanded}/></div>)}<p className="cp-caption">One porcelain family. Three interior contexts. Finish studies affect the featured slab surfaces only; joinery, sanitaryware and original lighting stay fixed. AI-created architecture, not photographs of built projects.</p></section>
 <aside className="cp-controls"><span className="cp-eyebrow">STONE COLLECTION / 02</span><h1>Porcelain stoneware.</h1><p className="cp-lead">Quiet surfaces.<br/>Rooms read as one material.</p><p>Full-body porcelain stoneware studies, from alpine white to terracotta. Explore five coordinated finishes across a kitchen, a bathroom and a living room.</p><div className="cp-selected"><span>FINISH STUDY</span><b>{finish.name}</b></div><div className="cp-swatches" role="group" aria-label="Porcelain stoneware finishes">{finishes.map(f=><button key={f.id} aria-label={`Select ${f.name}`} aria-pressed={selected===f.id} onClick={()=>select(f.id)} style={{backgroundImage:`url(${ROOT}${f.id}/preview.webp)`}}><span>{selected===f.id?'✓':''}</span><small>{f.name}</small></button>)}</div><StoneSurfaceViewer finish={finish} root={ROOT} filePrefix="waj-porcelain-stoneware" sceneNoun="room"/>
 <section className="cp-download"><span>4096 × 4096 · ORIGINAL PROCEDURAL MAPS</span><h2>Take the material<br/>into your project.</h2><label>Resolution<select aria-label="Download resolution"><option>4K · 4096 × 4096</option></select></label><button onClick={download} disabled={busy}>{busy?'Preparing…':`Download ${finish.name} · 4K ZIP ↓`}</button><small role="status">{status||'Base color · normal · roughness · 16-bit height'}</small><p>16K is not available in this release. PNG maps can be imported into compatible 3D software; native MAX, FBX, Revit and SketchUp files are not included.</p></section>
 <details open><summary>Material characteristics</summary><dl><dt>Family</dt><dd>Porcelain stoneware (full-body gres)</dd><dt>Format / appearance</dt><dd>Large-format slab / honed matte</dd><dt>Selected finish</dt><dd>{finish.name}</dd><dt>Application shown</dt><dd>Interior walls, floors and island fronts</dd><dt>Digital repeat</dt><dd>1200 × 1200 mm</dd><dt>Map resolution</dt><dd>4096 × 4096 pixels</dd><dt>Normal convention</dt><dd>OpenGL (+Y)</dd><dt>Height precision</dt><dd>16-bit grayscale</dd></dl></details><details><summary>Files, license & limitations</summary><p>Original procedural material studies of porcelain stoneware — the full-body ceramic family produced internationally in large-format slabs by makers such as Ariostea, Florim and Porcelanosa. Not a manufacturer scan or certified product sample; finish names describe color studies, not guaranteed commercial stock. Slip resistance, slab thickness and fixing require supplier and project-specific verification.</p><p>Personal and commercial visualization use permitted. Scene lighting and texture pattern are illustrative; the downloadable maps are shown separately in the surface viewer.</p><a href={`${ROOT}${selected}/manifest.json`} target="_blank" rel="noreferrer">Material manifest & checksums ↗</a></details></aside></div>
 <footer className="cp-footer">WORLD ARCH JOURNAL · ORIGINAL MATERIAL STUDIES<a href="/materials/category/stone/">Back to stone library ↗</a></footer><dialog ref={dialog} className="cp-dialog" onClose={()=>setExpanded(null)} onClick={e=>{if(e.target===e.currentTarget)dialog.current?.close();}}><button className="cp-close" aria-label="Close enlarged room study" onClick={()=>dialog.current?.close()}>Close ×</button>{expanded&&<Room scene={expanded} finish={finish}/>}</dialog></main>;
}
