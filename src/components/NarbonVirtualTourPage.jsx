import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

const DRAWINGS = '/assets/projects/narbon-villa/drawings';
const PHOTOS = '/assets/projects/narbon-villa/photos';
const VIEW_ARC = THREE.MathUtils.degToRad(112);
const VIEW_YAW_LIMIT = 27;

const scenes = [
  { id: 'exterior-arrival', title: 'Exterior Arrival', level: 'Exterior', image: `${PHOTOS}/photo-01.jpg`, group: 'Published Photo 01', note: 'A verified exterior photograph showing the bridge, garden, pool edge and the three white volumes. No interior destination is inferred from this viewpoint.' },
  { id: 'exterior-view', title: 'Main Exterior View', level: 'Exterior', image: `${PHOTOS}/photo-02.jpg`, group: 'Published Photo 02', note: 'A second verified exterior photograph of the principal elevation and bridge. The viewpoint remains labelled as exterior because the source does not identify a room position.' },
  { id: 'garden-side-massing', title: 'Garden-Side Massing', level: 'Exterior', image: `${PHOTOS}/photo-03.jpg`, group: 'Published Photo 03', note: 'This published exterior photograph records the relationship between the elevated white volumes, the garden edge and the bridge without assigning an unverified interior destination.' },
  { id: 'aerial-site-view', title: 'Aerial Site View', level: 'Site', image: `${PHOTOS}/photo-04.jpg`, group: 'Published Photo 04', note: 'The aerial photograph documents the complete house-and-garden composition, including the retained site edges and the building footprint.' },
  { id: 'boundary-wall', title: 'Street Boundary Wall', level: 'Exterior', image: `${PHOTOS}/photo-05.jpg`, group: 'Published Photo 05', note: 'The published street-side photograph records the retained earthen boundary wall and the new entrance opening.' },
  { id: 'pool-garden-axis', title: 'Pool and Garden Axis', level: 'Ground-floor exterior', image: `${PHOTOS}/photo-06.jpg`, group: 'Published Photo 06', note: 'A long exterior view records the pool, garden and building together. The lower-level plan separately verifies the pool function.' },
  { id: 'facade-bridge', title: 'Main Facade and Bridge', level: 'Exterior', image: `${PHOTOS}/photo-07.jpg`, group: 'Published Photo 07', note: 'This frontal photograph documents the bridge and the layered main facade from the garden side.' },
  { id: 'sky-gap', title: 'Sky Gap Between Volumes', level: 'Exterior detail', image: `${PHOTOS}/photo-08.jpg`, group: 'Published Photo 08', note: 'A vertical exterior viewpoint records the narrow opening to the sky between the project volumes.' },
  { id: 'brick-passage-steps', title: 'Brick Passage and Steps', level: 'Exterior circulation', image: `${PHOTOS}/photo-09.jpg`, group: 'Published Photo 09', note: 'The source photograph records an exterior brick passage and its steps. No room destination is inferred.' },
  { id: 'rooftop', title: 'Rooftop Cinema and Sky Watching', level: 'First-floor roof', image: `${PHOTOS}/photo-10.jpg`, group: 'Plan space 5', note: 'The first-floor plan explicitly labels this roof area as Rooftop Cinema + Sky Watching; the telescope in the published photograph confirms that use.' },
  { id: 'courtyard-brick-stair', title: 'Courtyard and Brick Stair', level: 'Exterior', image: `${PHOTOS}/photo-11.jpg`, group: 'Published Photo 11', note: 'This exterior photograph documents a planted courtyard edge, white wall and brick stair as one composition.' },
  { id: 'brick-stair-detail', title: 'Brick Stair Detail', level: 'Exterior circulation', image: `${PHOTOS}/photo-12.jpg`, group: 'Published Photo 12', note: 'A close source view records the geometry and construction expression of the exterior brick stair.' },
  { id: 'shaded-terrace-stair', title: 'Shaded Terrace and Stair', level: 'Exterior circulation', image: `${PHOTOS}/photo-13.jpg`, group: 'Published Photo 13', note: 'The published image records the stair beneath a deep overhead plane, preserving the project’s shaded exterior transition.' },
  { id: 'facade-junction', title: 'Brick and White Facade Junction', level: 'Exterior detail', image: `${PHOTOS}/photo-14.jpg`, group: 'Published Photo 14', note: 'This source photograph isolates the junction between the brick surface and the projecting white volume.' },
  { id: 'garden-pavilion-view', title: 'Garden Pavilion View', level: 'Garden exterior', image: `${PHOTOS}/photo-15.jpg`, group: 'Published Photo 15', note: 'A verified garden photograph documents the brick outdoor structure and surrounding planting.' },
  { id: 'framed-garden-opening', title: 'Framed Garden Opening', level: 'Exterior detail', image: `${PHOTOS}/photo-16.jpg`, group: 'Published Photo 16', note: 'The published photograph records a large framed exterior opening and its brick sun-shading surface.' },
  { id: 'pool-main-facade', title: 'Pool and Main Facade', level: 'Ground-floor exterior', image: `${PHOTOS}/photo-17.jpg`, group: 'Published Photo 17', note: 'This exterior viewpoint places the verified pool in front of the main facade and bridge.' },
  { id: 'living-terrace-threshold', title: 'Interior–Terrace Threshold', level: 'Ground floor', image: `${PHOTOS}/photo-18.jpg`, group: 'Published Photo 18', note: 'The source photograph records the visual transition between the furnished interior and the shaded exterior edge. No unverified route is asserted.' },
  { id: 'kitchen', title: 'Kitchen', level: 'Ground floor', image: `${PHOTOS}/photo-19.jpg`, group: 'Plan space 2', note: 'The kitchen is explicitly identified as space 2 on the ground-floor plan and is directly documented by this photograph.' },
  { id: 'kitchen-alternate', title: 'Kitchen — Alternate View', level: 'Ground floor', image: `${PHOTOS}/photo-20.jpg`, group: 'Plan space 2', note: 'A second published kitchen photograph documents the same plan-verified ground-floor space from another viewpoint.' },
  { id: 'living-dining', title: 'Living Room and Dining', level: 'Ground floor', image: `${PHOTOS}/photo-21.jpg`, group: 'Plan spaces 3 + 4', note: 'The photograph and ground-floor plan jointly verify the open living and dining zone, with the kitchen visible beyond.' },
  { id: 'living-alternate', title: 'Living Room — Alternate View', level: 'Ground floor', image: `${PHOTOS}/photo-22.jpg`, group: 'Plan space 3', note: 'This second published view records the ground-floor living room, identified as space 3 on the plan.' },
  { id: 'interior-stair-pool', title: 'Interior Stair and Pool View', level: 'Interior', image: `${PHOTOS}/photo-23.jpg`, group: 'Published Photo 23', note: 'The photograph documents an interior stair viewpoint with the pool visible beyond. No unsupported floor-to-floor route is added.' },
  { id: 'poolside-facade-steps', title: 'Poolside Facade and Steps', level: 'Exterior', image: `${PHOTOS}/photo-24.jpg`, group: 'Published Photo 24', note: 'A verified poolside view records the facade and stepped exterior ground condition.' },
  { id: 'brick-passage-one', title: 'Brick Passage I', level: 'Circulation', image: `${PHOTOS}/photo-25.jpg`, group: 'Published Photo 25', note: 'The source photograph documents a narrow brick passage as a distinct architectural viewpoint.' },
  { id: 'glazed-brick-passage', title: 'Glazed Brick Passage', level: 'Circulation', image: `${PHOTOS}/photo-26.jpg`, group: 'Published Photo 26', note: 'This photograph records the relationship between brick walls, glazing and the linear passage.' },
  { id: 'brick-glass-corridor', title: 'Brick and Glass Corridor', level: 'Circulation', image: `${PHOTOS}/photo-27.jpg`, group: 'Published Photo 27', note: 'The published image documents a corridor between the brick enclosure and the glazed edge.' },
  { id: 'master-bedroom', title: 'Master Bedroom', level: 'First floor', image: `${PHOTOS}/photo-28.jpg`, group: 'Plan space 1', note: 'The bedroom is explicitly identified as space 1 on the first-floor plan. The adjacent bathroom and terrace remain visible but are not treated as separate viewpoints.' },
  { id: 'terrace-shower', title: 'Open-Air Terrace and Shower', level: 'First floor exterior', image: `${PHOTOS}/photo-29.jpg`, group: 'Plan space 3', note: 'This is not an enclosed bathroom. The published first-floor plan explicitly identifies space 3 as Terrace + Shower, and the original project photograph records its open-air roof opening.' },
  { id: 'brick-corridor-garden', title: 'Brick Corridor and Garden View', level: 'Circulation', image: `${PHOTOS}/photo-30.jpg`, group: 'Published Photo 30', note: 'The final published photograph records the brick corridor and its framed view toward the planted exterior.' },
].map((scene, index, all) => ({
  ...scene,
  image: scene.image.replace('.jpg', '.webp'),
  previous: index > 0 ? all[index - 1]?.id : null,
  next: index < all.length - 1 ? all[index + 1]?.id : null,
}));

const drawings = [
  ['Sunken Courtyard Plan', `${DRAWINGS}/plan-basment-5.jpg`],
  ['Ground Floor Plan', `${DRAWINGS}/plan-groundf-7.jpg`],
  ['First Floor Plan', `${DRAWINGS}/plan-first-floor-6.jpg`],
  ['Section A-A', `${DRAWINGS}/section-aa-8.jpg`],
  ['Section B-B', `${DRAWINGS}/section-bb-9.jpg`],
  ['Section C-C', `${DRAWINGS}/section-cc-10.jpg`],
  ['Section D-D', `${DRAWINGS}/section-dd-11.jpg`],
  ['Section E-E', `${DRAWINGS}/section-ee-12.jpg`],
  ['Section F-F', `${DRAWINGS}/section-ff-13.jpg`],
];

const questions = [
  ['Which functions are verified on the lower level?', 'The published lower-level plan identifies the pool, fountain, bathroom and boiler room.'],
  ['Which social spaces are verified on the ground floor?', 'The published ground-floor plan identifies the kitchen, living room, dining area, TV room and northern iwan.'],
  ['Where is the outdoor shower located?', 'The published first-floor plan identifies Terrace + Shower as space 3, beside the first-floor master bedroom.'],
  ['What use is documented for the roof?', 'The published first-floor plan labels space 5 as Rooftop Cinema + Sky Watching, supported by the telescope visible in photo 10.'],
];

function direction(yaw, pitch) {
  const phi = THREE.MathUtils.degToRad(90 - pitch);
  const theta = THREE.MathUtils.degToRad(yaw);
  return new THREE.Vector3(Math.sin(phi) * Math.sin(theta), Math.cos(phi), Math.sin(phi) * Math.cos(theta));
}

export default function NarbonVirtualTourPage() {
  const mountRef = useRef(null);
  const runtimeRef = useRef(null);
  const [started, setStarted] = useState(false);
  const [runtimeReady, setRuntimeReady] = useState(false);
  const [selected, setSelected] = useState(scenes[0].id);
  const [transitioning, setTransitioning] = useState(false);
  const [plansOpen, setPlansOpen] = useState(false);
  const [activeDrawing, setActiveDrawing] = useState(drawings[1]);
  const [noteOpen, setNoteOpen] = useState(false);
  const currentIndex = scenes.findIndex((scene) => scene.id === selected);
  const current = scenes[currentIndex];
  const sceneById = useMemo(() => Object.fromEntries(scenes.map((scene) => [scene.id, scene])), []);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.className = 'vt-canvas';
    renderer.domElement.tabIndex = 0;
    renderer.domElement.setAttribute('aria-label', 'Interactive source-photograph view of Narbon Villa');
    mount.prepend(renderer.domElement);

    const world = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(56, 1, 0.1, 100);
    camera.position.set(0, 0, 0);
    const geometry = new THREE.CylinderGeometry(5, 5, 1, 128, 1, true, -VIEW_ARC / 2, VIEW_ARC);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.BackSide });
    const imageSurface = new THREE.Mesh(geometry, material);
    world.add(imageSurface);
    const loader = new THREE.TextureLoader();
    const controls = { yaw: 0, pitch: 0, targetYaw: 0, targetPitch: 0, dragging: false, x: 0, y: 0 };

    const resize = () => {
      const width = mount.clientWidth || window.innerWidth;
      const height = mount.clientHeight || window.innerHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(mount);
    resize();

    const down = (event) => { controls.dragging = true; controls.x = event.clientX; controls.y = event.clientY; renderer.domElement.setPointerCapture?.(event.pointerId); };
    const move = (event) => {
      if (!controls.dragging) return;
      controls.targetYaw = THREE.MathUtils.clamp(controls.targetYaw - (event.clientX - controls.x) * .055, -VIEW_YAW_LIMIT, VIEW_YAW_LIMIT);
      controls.targetPitch = THREE.MathUtils.clamp(controls.targetPitch + (event.clientY - controls.y) * .04, -10, 10);
      controls.x = event.clientX; controls.y = event.clientY;
    };
    const up = (event) => { controls.dragging = false; renderer.domElement.releasePointerCapture?.(event.pointerId); };
    const wheel = (event) => {
      event.preventDefault();
      camera.fov = THREE.MathUtils.clamp(camera.fov + event.deltaY * .02, 46, 64);
      camera.updateProjectionMatrix();
    };
    const key = (event) => {
      if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') controls.targetYaw = THREE.MathUtils.clamp(controls.targetYaw - 3, -VIEW_YAW_LIMIT, VIEW_YAW_LIMIT);
      if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') controls.targetYaw = THREE.MathUtils.clamp(controls.targetYaw + 3, -VIEW_YAW_LIMIT, VIEW_YAW_LIMIT);
      if (event.key === 'ArrowUp') controls.targetPitch = THREE.MathUtils.clamp(controls.targetPitch + 2, -10, 10);
      if (event.key === 'ArrowDown') controls.targetPitch = THREE.MathUtils.clamp(controls.targetPitch - 2, -10, 10);
    };
    renderer.domElement.addEventListener('pointerdown', down);
    renderer.domElement.addEventListener('pointermove', move);
    renderer.domElement.addEventListener('pointerup', up);
    renderer.domElement.addEventListener('pointercancel', up);
    renderer.domElement.addEventListener('wheel', wheel, { passive: false });
    renderer.domElement.addEventListener('keydown', key);

    let frame;
    const animate = () => {
      controls.yaw += (controls.targetYaw - controls.yaw) * .11;
      controls.pitch += (controls.targetPitch - controls.pitch) * .11;
      camera.lookAt(direction(controls.yaw, controls.pitch).multiplyScalar(10));
      renderer.render(world, camera);
      frame = requestAnimationFrame(animate);
    };
    animate();
    runtimeRef.current = { renderer, material, loader, controls, texture: null, imageSurface, camera };
    setRuntimeReady(true);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      runtimeRef.current?.texture?.dispose();
      geometry.dispose(); material.dispose(); renderer.dispose(); renderer.domElement.remove();
      runtimeRef.current = null;
      setRuntimeReady(false);
    };
  }, []);

  useEffect(() => {
    const runtime = runtimeRef.current;
    if (!runtime || !runtimeReady) return undefined;
    let cancelled = false;
    runtime.loader.load(current.image, (texture) => {
      if (cancelled) return texture.dispose();
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = runtime.renderer.capabilities.getMaxAnisotropy();
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      runtime.texture?.dispose();
      runtime.material.map = texture;
      runtime.material.needsUpdate = true;
      runtime.texture = texture;
      const sourceWidth = texture.image?.naturalWidth || texture.image?.width || 1600;
      const sourceHeight = texture.image?.naturalHeight || texture.image?.height || 1000;
      const sourceAspect = sourceWidth / sourceHeight;
      const arcWidth = 5 * VIEW_ARC;
      const fittedHeight = THREE.MathUtils.clamp(arcWidth / sourceAspect, 4.6, 10.5);
      runtime.imageSurface.scale.set(1, fittedHeight, 1);
      runtime.controls.targetYaw = 0;
      runtime.controls.targetPitch = 0;
      runtime.controls.yaw = 0;
      runtime.controls.pitch = 0;
      runtime.camera.fov = 56;
      runtime.camera.updateProjectionMatrix();
      window.setTimeout(() => setTransitioning(false), 120);
    });
    return () => { cancelled = true; };
  }, [current, runtimeReady]);

  const goTo = (id) => {
    if (!id || !sceneById[id] || id === selected) return;
    setTransitioning(true);
    window.setTimeout(() => setSelected(id), 180);
  };

  return (
    <main className="vt-page" id="main-content">
      <section className={`vt-stage narbon-stage ${started ? 'is-started' : 'is-intro'}`} ref={mountRef}>
        <div className={`vt-transition ${transitioning ? 'is-visible' : ''}`} aria-hidden="true" />
        <header className="vt-topbar">
          <a href="/" className="vt-brand">WORLD ARCH JOURNAL</a>
          <div className="vt-progress"><span>{String(currentIndex + 1).padStart(2, '0')}</span><i><b style={{ width: `${((currentIndex + 1) / scenes.length) * 100}%` }} /></i><span>{String(scenes.length).padStart(2, '0')}</span></div>
          <div className="vt-actions">
            <button type="button" data-analytics-event="cta_click" data-analytics-label="narbon_plans_open" onClick={() => setPlansOpen(true)}>PLANS &amp; SECTIONS</button>
            <a className="narbon-download" href="/downloads/narbon-villa-project-guide.pdf" download>PDF ↓</a>
            <a className="narbon-download" href="/projects/narbon-villa/">PROJECT FILE ↗</a>
          </div>
        </header>

        <div className="vt-location"><small>{current.level} · {current.group}</small><h1>Narbon Villa</h1><span>{current.title}</span></div>

        {started && <aside className={`vt-note ${noteOpen ? 'is-open' : ''}`}>
          <button type="button" className="vt-note-toggle" onClick={() => setNoteOpen((value) => !value)}>{noteOpen ? '×' : 'i'}</button>
          <small>VERIFIED VIEW NOTE</small><h2>{current.title}</h2><p>{current.note}</p><span>Published photograph + English project drawing cross-check.</span>
        </aside>}

        <nav className="vt-scene-rail" aria-label="Narbon Villa viewpoints">
          {scenes.map((scene, index) => <button type="button" key={scene.id} className={scene.id === selected ? 'is-active' : ''} onClick={() => goTo(scene.id)}><span>{String(index + 1).padStart(2, '0')}</span><b>{scene.title}</b><small>{scene.group}</small></button>)}
        </nav>

        <div className="vt-walk-controls" aria-label="Move between adjacent project viewpoints">
          <button type="button" disabled={!current.previous || transitioning} onClick={() => goTo(current.previous)}><span>←</span><small>PREVIOUS</small></button>
          <button type="button" className="is-forward" disabled={!current.next || transitioning} onClick={() => goTo(current.next)}><span>→</span><small>NEXT VIEW</small></button>
        </div>
        <div className="vt-help">DRAG TO LOOK · SCROLL TO ZOOM · MOVE BETWEEN VERIFIED VIEWPOINTS</div>

        {!started && <section className="vt-intro" aria-labelledby="narbon-intro-title"><small>AN INTERACTIVE SOURCE-PHOTO PROJECT JOURNEY</small><h1 id="narbon-intro-title">Narbon Villa</h1><p>Move through 30 published viewpoints. Interior labels are shown only where a photograph can be cross-checked against the English project plans.</p><button type="button" data-analytics-event="cta_click" data-analytics-label="narbon_tour_start" onClick={() => setStarted(true)}>ENTER THE VILLA <span>↗</span></button><footer><span>Chatrud, Kerman · 2022</span><span>Gera Studio Architects · Hossein Namazi</span></footer></section>}

        {plansOpen && <section className="vt-diagram" aria-labelledby="narbon-plans-title"><button type="button" className="vt-diagram-close" onClick={() => setPlansOpen(false)}>×</button><header><small>SPACE ↔ DRAWING</small><h2 id="narbon-plans-title">Read Narbon Villa in plan and section.</h2><p>All drawings are English-language project documents. They are provided for architectural study, not construction.</p></header><div className="vt-diagram-drawings"><article><small>PROJECT DRAWINGS</small><div className="vt-drawing-tabs">{drawings.map((drawing) => <button type="button" key={drawing[0]} className={drawing[0] === activeDrawing[0] ? 'is-active' : ''} onClick={() => setActiveDrawing(drawing)}>{drawing[0]}</button>)}</div><figure><img src={activeDrawing[1]} alt={`Narbon Villa ${activeDrawing[0]}`} /><figcaption>{activeDrawing[0]} · Drawing credit: Gera Studio Architects / Contemporary Architecture of Iran.</figcaption><div className="vt-drawing-downloads"><a href={activeDrawing[1]} download>DOWNLOAD THIS DRAWING ↓</a><a href="/downloads/narbon-villa-english-drawing-pack.zip" download>DOWNLOAD DRAWING PACK ↓</a><a href="/downloads/narbon-villa-project-guide.pdf" download>DOWNLOAD COMPLETE PDF ↓</a></div></figure></article><article><small>KEY DESIGN QUESTIONS</small><div className="narbon-question-grid">{questions.map(([q,a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div></article></div></section>}
      </section>

      <section className="vt-credits"><small>ABOUT THIS EXPERIENCE</small><h2>A verified photographic walkthrough.</h2><p>This experience uses published project photographs without generating unseen rooms or claiming continuous measured geometry. Space names are used only when the photograph can be cross-checked against the project plans.</p><dl><div><dt>Architecture</dt><dd>Gera Studio Architects</dd></div><div><dt>Lead architect</dt><dd>Hossein Namazi</dd></div><div><dt>Original photography</dt><dd>Mohammad Hassan Ettefagh</dd></div><div><dt>Primary archive</dt><dd><a href="https://www.caoi.ir/en/projects/item/1855-narbon-villa-kerman-gera-studio.html" target="_blank" rel="noreferrer">Contemporary Architecture of Iran ↗</a></dd></div></dl><a className="vt-return" href="/projects/narbon-villa/">Open the complete project file</a></section>
    </main>
  );
}
