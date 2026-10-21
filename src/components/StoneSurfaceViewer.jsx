import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import './MaterialSurfaceViewer.css';

export default function StoneSurfaceViewer({finish,root='/assets/material-studio/travertine/',filePrefix='waj-travertine',sceneNoun='facade',mapUrls=null}) {
  const ROOT=root;
  const host=useRef(null), engine=useRef(null);
  const [angle,setAngle]=useState(-45),[power,setPower]=useState(3),[shape,setShape]=useState('sphere');
  const [ready,setReady]=useState(false),[error,setError]=useState(''),[saving,setSaving]=useState(false);
  useEffect(()=>{
    let renderer;
    try {renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true});}
    catch {setError('3D preview is unavailable on this device. The material files remain downloadable.');return;}
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));renderer.outputColorSpace=THREE.SRGBColorSpace;
    renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;
    host.current.appendChild(renderer.domElement);
    const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(34,1,.1,100);camera.position.set(0,0,4.1);
    scene.add(new THREE.HemisphereLight(0xffffff,0xc4b9a6,2.3));
    const light=new THREE.DirectionalLight(0xffffff,3);scene.add(light);
    const fill=new THREE.DirectionalLight(0xe5edff,.7);fill.position.set(-3,1,-2);scene.add(fill);
    const material=new THREE.MeshStandardMaterial({color:0xffffff,roughness:.58,metalness:0,normalScale:new THREE.Vector2(.35,.35)});
    const sphere=new THREE.SphereGeometry(.94,384,192);
    const plane=new THREE.PlaneGeometry(1.95,1.95,384,16);
    const mesh=new THREE.Mesh(sphere,material);scene.add(mesh);
    const draw=()=>renderer.render(scene,camera);
    const resize=()=>{const width=host.current?.clientWidth||320;renderer.setSize(width,width);draw();};
    engine.current={renderer,scene,camera,light,mesh,material,sphere,plane,draw,resize};
    const observer=new ResizeObserver(resize);observer.observe(host.current);resize();
    return()=>{observer.disconnect();material.map?.dispose();material.normalMap?.dispose();material.roughnessMap?.dispose();material.dispose();sphere.dispose();plane.dispose();renderer.dispose();renderer.domElement.remove();engine.current=null;};
  },[]);
  useEffect(()=>{
    const e=engine.current;if(!e)return;let cancelled=false;setReady(false);setError('');
    const loader=new THREE.TextureLoader(),loaded=[];
    Promise.all((mapUrls||[`${ROOT}${finish.id}/basecolor-4k.png`,`${ROOT}shared/normal-opengl-4k.png`,`${ROOT}shared/roughness-4k.png`]).map(url=>loader.loadAsync(url).then(t=>{loaded.push(t);return t;}))).then(([color,normal,roughness])=>{
      if(cancelled){loaded.forEach(t=>t.dispose());return;}
      color.colorSpace=THREE.SRGBColorSpace;
      for(const texture of loaded){texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.anisotropy=Math.min(8,e.renderer.capabilities.getMaxAnisotropy());}
      e.material.map?.dispose();e.material.normalMap?.dispose();e.material.roughnessMap?.dispose();
      e.material.map=color;e.material.normalMap=normal;e.material.roughnessMap=roughness;e.material.roughness=1;e.material.needsUpdate=true;e.draw();setReady(true);
    }).catch(()=>{loaded.forEach(t=>t.dispose());if(!cancelled)setError('Preview maps could not load. Please reload the page.');});
    return()=>{cancelled=true;};
  },[finish.id]);
  useEffect(()=>{const e=engine.current;if(!e)return;const a=angle*Math.PI/180;e.light.position.set(4*Math.sin(a),2.5,4*Math.cos(a));e.light.intensity=power;e.mesh.geometry=shape==='sphere'?e.sphere:e.plane;e.draw();},[angle,power,shape]);
  const save=()=>{
    const e=engine.current;if(!e||!ready||saving)return;setSaving(true);
    try{
      const previousRatio=e.renderer.getPixelRatio();e.renderer.setPixelRatio(1);e.renderer.setSize(4096,4096,false);e.draw();
      e.renderer.domElement.toBlob(blob=>{if(blob){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`${filePrefix}-${finish.id}-${shape}-4k.png`;a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);}else setError('The preview export failed. Please try again.');setSaving(false);},'image/png');
      e.renderer.setPixelRatio(previousRatio);e.resize();
    }catch{setSaving(false);setError('This device could not export a 4K preview. Material map downloads are still available.');e.resize();}
  };
  return <section className="fp-viewer" aria-label="Interactive material and lighting">
    <div className="fp-viewer-top"><span>LIVE MATERIAL STUDY</span><div role="group" aria-label="Preview shape">{['sphere','panel'].map(s=><button type="button" key={s} aria-pressed={shape===s} onClick={()=>setShape(s)}>{s==='sphere'?'Sphere':'Panel'}</button>)}</div></div>
    <div className="fp-webgl" ref={host} role="img" aria-label={`${finish.name} ${shape}, adjustable studio light`}/>
    <p className="fp-viewer-status" role="status">{error||(!ready?'Loading surface maps…':`${finish.name} · real-time PBR lighting`)}</p>
    <label>Light direction <output>{angle}°</output><input aria-label="Light direction" type="range" min="-180" max="180" step="1" value={angle} onChange={e=>setAngle(Number(e.target.value))}/></label>
    <label>Light intensity <output>{power.toFixed(1)}</output><input aria-label="Light intensity" type="range" min="0" max="6" step=".1" value={power} onChange={e=>setPower(Number(e.target.value))}/></label>
    <div className="fp-viewer-actions"><button type="button" onClick={()=>{setAngle(-45);setPower(3);}}>Reset light</button><button type="button" disabled={!ready||saving} onClick={save}>{saving?'Rendering…':`Download ${shape} PNG · 4K ↓`}</button></div>
    <small>Lighting adjusts this material preview. The three {sceneNoun} studies retain their original lighting.</small>
  </section>;
}

