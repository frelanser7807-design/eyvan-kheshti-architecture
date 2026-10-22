import { useEffect, useState } from 'react';
import { sceneImage, materialScenes } from '../data/materialScenes.js';

function SceneImage({ scene, material, finish, original = false, priority = false }) {
  const src = original ? scene.src : sceneImage(scene, material, finish);
  return <div className="mp-scene-image"><img src={src} alt={`${scene.title} · ${original ? material.finishes[0].name : finish.name} architectural material study`} width="1536" height="1024" loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'}/></div>;
}
export default function MaterialSceneGallery({ material, finish, onSelect, disabled = false }) {
  const [active, setActive] = useState(0);
  const [original, setOriginal] = useState(false);
  useEffect(() => setOriginal(false), [finish.id]);
  const scenes = materialScenes[material.id];
  if (!scenes) return null;
  const scene = scenes[active];
  return <section className="mp-scene-gallery" aria-label={`${material.name} architectural previews`}>
    <p className="mp-mobile-title">{material.name}.</p>
    <div className="mp-mobile-finishes" role="group" aria-label="Preview finish">
      {material.finishes.map(item => <button key={item.id} type="button" disabled={disabled} aria-label={`Preview ${item.name}`} aria-pressed={item.id === finish.id} onClick={() => onSelect(item.id)} style={{backgroundColor:item.color}}><span>{item.name}</span></button>)}
    </div>
    <figure className="mp-scene-hero">
      <SceneImage key={scene.id} scene={scene} finish={finish} material={material} original={original} priority/>
      <figcaption><span>{scene.title}</span><strong>{original ? 'Original scene' : finish.name}</strong></figcaption>
    </figure>
    <div className="mp-scene-toolbar"><span>SEE IT IN ARCHITECTURE</span><button type="button" aria-pressed={original} onClick={() => setOriginal(!original)}>{original ? 'Show selected finish' : 'Compare original'}</button></div>
    <div className="mp-scene-thumbnails" role="group" aria-label="Choose architectural scene">
      {scenes.map((item, index) => <button key={item.id} type="button" aria-pressed={index === active} onClick={() => setActive(index)} aria-label={`Show ${item.title}`}><SceneImage scene={item} finish={finish} material={material}/><span>{item.title}</span></button>)}
    </div>
    <p className="mp-scene-note">AI-generated architectural studies. Finish selection changes the featured wall only. Color previews are illustrative; confirm physical samples and specifications with your supplier.</p>
  </section>;
}
