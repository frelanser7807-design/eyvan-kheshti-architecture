import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

const ASSET_ROOT = '/assets/virtual-tours/villa-safadasht';
const DRAWINGS_ROOT = '/assets/projects/villa-safadasht/drawings';
const PHOTO_EVIDENCE = 'Published project photograph by Ali Daghigh & Abdolreza Bassiri; the 360° canvas is an editorial montage composed from the photograph for this tour.';

const scenes = [
  {
    id: 'axis',
    title: 'The Garden Axis',
    level: 'Exterior',
    image: `${ASSET_ROOT}/01-axis.jpg`,
    note: 'The villa is met head-on, along the single pedestrian axis that organises the whole plot. The pool runs ahead of you toward the facade; above it, the first-floor bridge spans between the two wings, and the open passage waits at the centre.',
    evidence: PHOTO_EVIDENCE,
    yaw: 0,
    pitch: -2,
    hotspots: [
      { target: 'pool-court', label: 'Continue to the pool court', yaw: -32, pitch: -9 },
    ],
    details: [
      { title: 'One line organises everything', label: 'AXIS', yaw: 0, pitch: -12, text: 'Entrance, garden, passage, pool and pavilion sit on one straight line. The architects describe the building as a frame for the site: the axis is the sentence, and every space is a word in it.' },
      { title: 'Stone before garden', label: 'MATERIAL', yaw: -18, pitch: 10, text: 'The facade is a single, quiet field of unpolished grey Esparakhon dolomite. Openings are cut deeply into the stone, so shadow — not ornament — models the elevation.' },
    ],
  },
  {
    id: 'undercroft',
    title: 'Beneath the Bridge',
    level: 'Ground floor',
    image: `${ASSET_ROOT}/03-undercroft.jpg`,
    note: 'Under the bridge the building opens completely. This shaded breezeway is where the axis of the site crosses the axis of the building — the point the architects call the heart of the project, where every exploration starts and ends.',
    evidence: PHOTO_EVIDENCE,
    yaw: 4,
    pitch: -2,
    hotspots: [
      { target: 'pool-court', label: 'Into the pool court', yaw: 30, pitch: -8 },
    ],
    details: [
      { title: 'The heart', label: 'VOID', yaw: 0, pitch: 2, text: 'Splitting the ground floor gives each wing its own entrance while the void keeps them visually one house. Public and private are separated by air, not by a wall.' },
      { title: 'Shade as a room', label: 'CLIMATE', yaw: -30, pitch: 14, text: 'The deep stone soffit and the water beside it cool the crossing point, so the middle of the house works as an outdoor room in Karaj’s hot summers.' },
    ],
  },
  {
    id: 'pool-court',
    title: 'Pool Court at Dusk',
    level: 'Ground floor',
    image: `${ASSET_ROOT}/04-pool-court.jpg`,
    note: 'The pool slides beneath the bridge, half in shade, half in open air. From the water you read the whole section at once: wings at your sides, bedrooms floating above, the sky framed by stone.',
    evidence: PHOTO_EVIDENCE,
    yaw: 0,
    pitch: -3,
    hotspots: [
      { target: 'undercroft', label: 'Return to the passage', yaw: -52, pitch: -3 },
      { target: 'living-dining', label: 'Enter the west wing', yaw: 48, pitch: -2 },
    ],
    details: [
      { title: 'Water under stone', label: 'POOL', yaw: 6, pitch: -16, text: 'Columns stand 15 metres apart on either side of the pool and the slabs are reinforced so nothing interrupts the water’s run beneath the bridge.' },
      { title: 'Glimpses from above', label: 'LIGHT', yaw: 18, pitch: 22, text: 'Glazed slots in the bridge floor open views down to the water, so the pool stays present even from the most private rooms above.' },
    ],
  },
  {
    id: 'living-dining',
    title: 'Living, Dining & Kitchen',
    level: 'Ground floor · West wing',
    image: `${ASSET_ROOT}/05c-col4.jpg`,
    note: 'The public wing is one tall, calm volume: dining and kitchen behind floor-to-ceiling glazing, the garden always in view, and the stone carried inside so the room feels carved rather than decorated.',
    evidence: PHOTO_EVIDENCE,
    yaw: -4,
    pitch: 0,
    hotspots: [
      { target: 'stair', label: 'Climb the floating stair', yaw: 38, pitch: 6 },
      { target: 'pool-court', label: 'Back to the pool court', yaw: -70, pitch: -4 },
    ],
    details: [
      { title: 'The public west', label: 'PLAN', yaw: -16, pitch: 4, text: 'Living, dining and kitchen share 205 m² in the west wing, with the main stair rising at its end toward the bridge rooms.' },
      { title: 'Glass to the orchard', label: 'VIEW', yaw: 22, pitch: 2, text: 'The tall glazing turns the garden into the room’s fourth wall — the Persian garden idea, that building and site are one entity, made literal.' },
    ],
  },
  {
    id: 'stair',
    title: 'The Floating Stair',
    level: 'Ground floor · West wing',
    image: `${ASSET_ROOT}/06-stair.jpg`,
    note: 'Stone treads float against the wall, screened by fine vertical wires. Sunlight through the glazing prints the stair’s shadow across the stone — the circulation becomes the room’s decoration.',
    evidence: PHOTO_EVIDENCE,
    yaw: 0,
    pitch: 2,
    hotspots: [
      { target: 'stair-hall', label: 'Cross to the east stair hall', yaw: 44, pitch: 0 },
      { target: 'living-dining', label: 'Back to living & dining', yaw: -56, pitch: -4 },
    ],
    details: [
      { title: 'Wires as balustrade', label: 'DETAIL', yaw: -14, pitch: 10, text: 'Hair-thin vertical cables guard the stair without blocking light or view, keeping the flight visually weightless against the heavy stone.' },
      { title: 'Shadow printing', label: 'LIGHT', yaw: 26, pitch: -6, text: 'At certain hours the wires cast a ruled shadow across treads and wall — a daily, moving ornament that costs nothing and cannot be faked.' },
    ],
  },
  {
    id: 'stair-hall',
    title: 'The East Stair Hall',
    level: 'Ground floor · East wing',
    image: `${ASSET_ROOT}/07b-col27.jpg`,
    note: 'The semi-private east wing has its own stair, lit by a tall garden window. Recreation room, jacuzzi and pantry sit on this side — the quieter half of the house, reached without crossing the public rooms.',
    evidence: PHOTO_EVIDENCE,
    yaw: 2,
    pitch: 0,
    hotspots: [
      { target: 'bridge-living', label: 'Up into the bridge', yaw: 30, pitch: 10 },
      { target: 'stair', label: 'Back to the west stair', yaw: -48, pitch: -2 },
    ],
    details: [
      { title: 'A second, quieter stair', label: 'PLAN', yaw: -20, pitch: 8, text: 'Each wing climbs independently to the bridge, so guests, family and the recreation spaces circulate without disturbing one another.' },
      { title: 'A tall slot of light', label: 'LIGHT', yaw: 12, pitch: 16, text: 'The full-height window washes the stone hall with garden light and turns the stair into a vertical sundial for the east wing.' },
    ],
  },
  {
    id: 'bridge-living',
    title: 'Inside the Bridge',
    level: 'First floor',
    image: `${ASSET_ROOT}/08-bridge-living.jpg`,
    note: 'The bridge interior is the family’s private living level: bedrooms at the ends, the lounge between them, and a deep window that looks back down into the pool court — the house watching its own heart.',
    evidence: PHOTO_EVIDENCE,
    yaw: 0,
    pitch: -1,
    hotspots: [
      { target: 'stair-hall', label: 'Descend to the east wing', yaw: -58, pitch: -8 },
    ],
    details: [
      { title: 'Four bedrooms, one lounge', label: 'PROGRAMME', yaw: -24, pitch: 4, text: 'The 370 m² bridge carries four bedrooms and the family TV lounge — the whole private programme lifted into one suspended stone volume.' },
      { title: 'A window onto the court', label: 'VIEW', yaw: 16, pitch: -4, text: 'Internal glazing keeps the pool court in sight from the lounge, so the void below stays part of daily life upstairs.' },
    ],
  },
  {
    id: 'terrace',
    title: 'The Bridge Terrace',
    level: 'First floor',
    image: `${ASSET_ROOT}/10b-col2.jpg`,
    note: 'Along the top of the stone volume, the terrace runs with the bedrooms — a narrow outdoor gallery of glass balustrades, deep reveals and long views over the garden roofs of Baghestan-e-Kushk.',
    evidence: PHOTO_EVIDENCE,
    yaw: -4,
    pitch: 2,
    hotspots: [
      { target: 'bathroom', label: 'Visit the stone bathroom', yaw: 36, pitch: -2 },
    ],
    details: [
      { title: 'Rooms turned outward', label: 'FACADE', yaw: 14, pitch: 8, text: 'Bedroom terraces push the private rooms to the very skin of the bridge, so waking up means stepping straight into the garden air.' },
      { title: 'The soffit as ceiling', label: 'MATERIAL', yaw: -18, pitch: 20, text: 'Overhead, the stone soffit is left bare — the same Esparakhon dolomite, weathering slowly, unifies inside, outside, above and below.' },
    ],
  },
  {
    id: 'bathroom',
    title: 'The Stone Bathroom',
    level: 'First floor',
    image: `${ASSET_ROOT}/11-bathroom.jpg`,
    note: 'Even the bathrooms are carved from the project’s single material: Esparakhon stone on walls and floor, one timber counter, one white basin. The discipline of one material is what makes the house feel inevitable.',
    evidence: PHOTO_EVIDENCE,
    yaw: 0,
    pitch: -1,
    hotspots: [
      { target: 'dusk', label: 'Finish at the facade, dusk', yaw: 42, pitch: -2 },
      { target: 'terrace', label: 'Back to the terrace', yaw: -52, pitch: 0 },
    ],
    details: [
      { title: 'One material, inside and out', label: 'MATERIAL', yaw: -12, pitch: 4, text: 'The architects clad exterior and interior walls in the same unpolished dolomite — a decision that removes every visual seam between the house and its rooms.' },
    ],
  },
  {
    id: 'dusk',
    title: 'The Villa at Dusk',
    level: 'Exterior',
    image: `${ASSET_ROOT}/12-dusk.jpg`,
    note: 'At dusk the walk reverses: lit windows mark the bridge rooms, the passage glows at the centre, and the pool mirrors the whole composition back at the garden. One line, two wings, a bridge — complete.',
    evidence: PHOTO_EVIDENCE,
    yaw: 0,
    pitch: -2,
    hotspots: [
      { target: 'axis', label: 'Restart the walk', yaw: 0, pitch: -6 },
    ],
    details: [
      { title: 'The frame at night', label: 'LIGHT', yaw: -16, pitch: 8, text: 'After dark the openings do the expressive work the architects intended: the solid stone recedes and the lit voids — passage, slots, terraces — draw the house.' },
    ],
  },
];

const sceneById = Object.fromEntries(scenes.map((scene) => [scene.id, scene]));

const drawings = [
  { id: 'ground', label: 'GROUND FLOOR', image: `${DRAWINGS_ROOT}/schematic-ground-floor-plan.png`, alt: 'Schematic ground-floor plan of Villa Safadasht showing the west wing, the open passage, the east wing, pool and site axis' },
  { id: 'first', label: 'FIRST FLOOR', image: `${DRAWINGS_ROOT}/schematic-first-floor-plan.png`, alt: 'Schematic first-floor plan of the Villa Safadasht bridge with four bedrooms and the family lounge' },
  { id: 'section', label: 'LONG SECTION', image: `${DRAWINGS_ROOT}/schematic-long-section.png`, alt: 'Schematic long section of Villa Safadasht along the site axis' },
];

function directionFromAngles(yaw, pitch, radius = 10) {
  const yawRad = THREE.MathUtils.degToRad(yaw);
  const pitchRad = THREE.MathUtils.degToRad(pitch);
  const cosPitch = Math.cos(pitchRad);
  return new THREE.Vector3(
    Math.sin(yawRad) * cosPitch * radius,
    Math.sin(pitchRad) * radius,
    -Math.cos(yawRad) * cosPitch * radius,
  );
}

export default function SafadashtVirtualTourPage() {
  const mountRef = useRef(null);
  const runtimeRef = useRef(null);
  const selectedRef = useRef('axis');
  const hotspotLayerRef = useRef(null);
  const [selected, setSelected] = useState('axis');
  const [started, setStarted] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [transitioning, setTransitioning] = useState(true);
  const [activeDetail, setActiveDetail] = useState(null);
  const [visitedScenes, setVisitedScenes] = useState(() => new Set(['axis']));
  const [diagramOpen, setDiagramOpen] = useState(false);
  const [activeDrawing, setActiveDrawing] = useState('ground');
  const [drawingZoomed, setDrawingZoomed] = useState(false);
  const current = sceneById[selected];
  const progress = useMemo(() => scenes.findIndex((scene) => scene.id === selected) + 1, [selected]);
  const currentIndex = progress - 1;

  const goTo = (id) => {
    if (!sceneById[id] || id === selectedRef.current) return;
    setTransitioning(true);
    window.setTimeout(() => {
      selectedRef.current = id;
      setSelected(id);
      setNoteOpen(false);
      setActiveDetail(null);
      setVisitedScenes((previous) => new Set(previous).add(id));
    }, 220);
  };

  const openDetail = (detail) => {
    setActiveDetail(detail);
    const runtime = runtimeRef.current;
    if (runtime) {
      runtime.controls.targetYaw = detail.yaw;
      runtime.controls.targetPitch = detail.pitch;
      runtime.camera.fov = 49;
      runtime.camera.updateProjectionMatrix();
    }
  };

  const closeDetail = () => {
    setActiveDetail(null);
    const runtime = runtimeRef.current;
    if (runtime) {
      runtime.camera.fov = 68;
      runtime.camera.updateProjectionMatrix();
    }
  };

  const toggleFullscreen = async () => {
    const element = mountRef.current?.closest('.vt-page');
    if (!element) return;
    if (document.fullscreenElement) await document.exitFullscreen();
    else await element.requestFullscreen?.();
  };

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.className = 'vt-canvas';
    renderer.domElement.setAttribute('aria-label', 'Interactive 360-degree walkthrough of Villa Safadasht');
    renderer.domElement.tabIndex = 0;
    mount.prepend(renderer.domElement);

    const world = new THREE.Scene();
    world.background = new THREE.Color('#11100e');
    const camera = new THREE.PerspectiveCamera(68, mount.clientWidth / mount.clientHeight, 0.1, 100);
    const geometry = new THREE.SphereGeometry(50, 72, 48);
    geometry.scale(-1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    world.add(new THREE.Mesh(geometry, material));

    const controls = {
      yaw: 0, pitch: -2, targetYaw: 0, targetPitch: -2,
      active: false, startX: 0, startY: 0, startYaw: 0, startPitch: 0,
      velocityYaw: 0, velocityPitch: 0, lastMove: performance.now(),
    };
    const loader = new THREE.TextureLoader();
    runtimeRef.current = { renderer, world, camera, geometry, material, controls, loader, texture: null };

    const resize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(mount);

    const pointerDown = (event) => {
      controls.active = true;
      controls.startX = event.clientX;
      controls.startY = event.clientY;
      controls.startYaw = controls.targetYaw;
      controls.startPitch = controls.targetPitch;
      controls.velocityYaw = 0;
      controls.velocityPitch = 0;
      controls.lastMove = performance.now();
      renderer.domElement.setPointerCapture?.(event.pointerId);
      renderer.domElement.classList.add('is-dragging');
    };
    const pointerMove = (event) => {
      if (!controls.active) return;
      const nextYaw = controls.startYaw - (event.clientX - controls.startX) * 0.105;
      const nextPitch = THREE.MathUtils.clamp(controls.startPitch + (event.clientY - controls.startY) * 0.085, -78, 78);
      controls.velocityYaw = nextYaw - controls.targetYaw;
      controls.velocityPitch = nextPitch - controls.targetPitch;
      controls.targetYaw = nextYaw;
      controls.targetPitch = nextPitch;
      controls.lastMove = performance.now();
    };
    const pointerUp = (event) => {
      controls.active = false;
      renderer.domElement.releasePointerCapture?.(event.pointerId);
      renderer.domElement.classList.remove('is-dragging');
    };
    const wheel = (event) => {
      event.preventDefault();
      camera.fov = THREE.MathUtils.clamp(camera.fov + event.deltaY * 0.025, 42, 82);
      camera.updateProjectionMatrix();
      controls.lastMove = performance.now();
    };
    const keydown = (event) => {
      const step = event.shiftKey ? 8 : 3;
      if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') controls.targetYaw -= step;
      if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') controls.targetYaw += step;
      if (['ArrowLeft', 'ArrowRight', 'a', 'A', 'd', 'D'].includes(event.key)) {
        event.preventDefault();
        controls.lastMove = performance.now();
      }
    };
    renderer.domElement.addEventListener('pointerdown', pointerDown);
    renderer.domElement.addEventListener('pointermove', pointerMove);
    renderer.domElement.addEventListener('pointerup', pointerUp);
    renderer.domElement.addEventListener('pointercancel', pointerUp);
    renderer.domElement.addEventListener('wheel', wheel, { passive: false });
    renderer.domElement.addEventListener('keydown', keydown);

    let frame = 0;
    const projected = new THREE.Vector3();
    const forward = new THREE.Vector3();
    const animate = (now) => {
      frame = requestAnimationFrame(animate);
      if (!controls.active) {
        controls.targetYaw += controls.velocityYaw;
        controls.targetPitch = THREE.MathUtils.clamp(controls.targetPitch + controls.velocityPitch, -78, 78);
        controls.velocityYaw *= 0.88;
        controls.velocityPitch *= 0.84;
        if (now - controls.lastMove > 5500) controls.targetYaw += 0.012;
      }
      controls.yaw += (controls.targetYaw - controls.yaw) * 0.09;
      controls.pitch += (controls.targetPitch - controls.pitch) * 0.09;
      const viewDirection = directionFromAngles(controls.yaw, controls.pitch, 1);
      camera.position.set(0, 0, 0);
      camera.lookAt(viewDirection.multiplyScalar(10));
      renderer.render(world, camera);

      camera.getWorldDirection(forward);
      hotspotLayerRef.current?.querySelectorAll('[data-vt-hotspot]').forEach((element) => {
        const yaw = Number(element.dataset.yaw || 0);
        const pitch = Number(element.dataset.pitch || 0);
        projected.copy(directionFromAngles(yaw, pitch, 10));
        const inFront = projected.clone().normalize().dot(forward) > 0.18;
        projected.project(camera);
        const visible = inFront && Math.abs(projected.x) <= 1.12 && Math.abs(projected.y) <= 1.12;
        element.style.left = `${(projected.x * 0.5 + 0.5) * 100}%`;
        element.style.top = `${(-projected.y * 0.5 + 0.5) * 100}%`;
        element.style.opacity = visible ? '1' : '0';
        element.style.pointerEvents = visible ? 'auto' : 'none';
      });
    };
    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      renderer.domElement.removeEventListener('pointerdown', pointerDown);
      renderer.domElement.removeEventListener('pointermove', pointerMove);
      renderer.domElement.removeEventListener('pointerup', pointerUp);
      renderer.domElement.removeEventListener('pointercancel', pointerUp);
      renderer.domElement.removeEventListener('wheel', wheel);
      renderer.domElement.removeEventListener('keydown', keydown);
      runtimeRef.current?.texture?.dispose();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      runtimeRef.current = null;
    };
  }, []);

  useEffect(() => {
    const runtime = runtimeRef.current;
    if (!runtime) return undefined;
    let cancelled = false;
    const scene = sceneById[selected];
    runtime.controls.targetYaw = scene.yaw;
    runtime.controls.yaw = scene.yaw;
    runtime.controls.targetPitch = scene.pitch;
    runtime.controls.pitch = scene.pitch;
    runtime.controls.velocityYaw = 0;
    runtime.controls.velocityPitch = 0;
    runtime.loader.load(scene.image, (texture) => {
      if (cancelled) {
        texture.dispose();
        return;
      }
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = runtime.renderer.capabilities.getMaxAnisotropy();
      const oldTexture = runtime.texture;
      runtime.material.map = texture;
      runtime.material.needsUpdate = true;
      runtime.texture = texture;
      oldTexture?.dispose();
      window.setTimeout(() => setTransitioning(false), 80);
    });
    return () => { cancelled = true; };
  }, [selected]);

  useEffect(() => {
    scenes.forEach((scene) => {
      const image = new Image();
      image.decoding = 'async';
      image.src = scene.image;
    });
  }, []);

  return (
    <main className="vt-page" id="main-content">
      <div className="vt-stage is-panorama" ref={mountRef}>
        <div className={`vt-transition ${transitioning ? 'is-visible' : ''}`} aria-hidden="true" />
        <header className="vt-topbar">
          <a href="/" className="vt-brand">WORLD ARCH JOURNAL</a>
          <div className="vt-progress" aria-label={`Scene ${progress} of ${scenes.length}`}>
            <span>{String(progress).padStart(2, '0')}</span>
            <i><b style={{ width: `${(progress / scenes.length) * 100}%` }} /></i>
            <span>{String(scenes.length).padStart(2, '0')}</span>
          </div>
          <div className="vt-actions">
            <button type="button" data-analytics-event="cta_click" data-analytics-label="safadasht_plans_open" onClick={() => setDiagramOpen(true)}>PLANS &amp; SECTIONS</button>
            <a className="narbon-download" href="/downloads/villa-safadasht-project-guide.pdf" download>DOWNLOAD PROJECT GUIDE (PDF) ↓</a>
            <a className="narbon-download" href="/projects/villa-safadasht/">PROJECT FILE ↗</a>
            <button type="button" onClick={toggleFullscreen}>FULLSCREEN</button>
          </div>
        </header>

        <div className="vt-location" aria-live="polite">
          <small>{current.level}</small>
          <h1>Villa Safadasht</h1>
          <span>{current.title}</span>
        </div>

        <div className="vt-hotspot-layer" ref={hotspotLayerRef}>
          {current.hotspots.map((hotspot) => (
            <button
              className="vt-hotspot"
              type="button"
              key={`${selected}-${hotspot.target}`}
              data-vt-hotspot
              data-yaw={hotspot.yaw}
              data-pitch={hotspot.pitch}
              onClick={() => goTo(hotspot.target)}
            >
              <span className="vt-hotspot-ring"><i /></span>
              <b>{hotspot.label}</b>
            </button>
          ))}
          {current.details.map((detail) => (
            <button
              className="vt-hotspot is-info"
              type="button"
              key={`${selected}-${detail.title}`}
              data-vt-hotspot
              data-yaw={detail.yaw}
              data-pitch={detail.pitch}
              onClick={() => openDetail(detail)}
              aria-label={`Open architecture detail: ${detail.title}`}
            >
              <span className="vt-hotspot-ring"><i>+</i></span>
              <b>{detail.label}</b>
            </button>
          ))}
        </div>

        {activeDetail && (
          <aside className="vt-detail" aria-live="polite">
            <button type="button" onClick={closeDetail} aria-label="Close detail">×</button>
            <small>{activeDetail.label} · WHY IT MATTERS</small>
            <h2>{activeDetail.title}</h2>
            <p>{activeDetail.text}</p>
            <span className="vt-detail-focus">FOCUSED DETAIL VIEW · SCROLL TO INSPECT</span>
          </aside>
        )}

        <aside className={`vt-note ${noteOpen ? 'is-open' : ''}`} aria-live="polite">
          <button type="button" className="vt-note-toggle" onClick={() => setNoteOpen((value) => !value)} aria-expanded={noteOpen}>
            {noteOpen ? '×' : 'i'}
          </button>
          <small>ARCHITECT’S NOTE · {current.level.toUpperCase()}</small>
          <h2>{current.title}</h2>
          <p>{current.note}</p>
          <span>{current.evidence}</span>
        </aside>

        <nav className="vt-scene-rail" aria-label="Tour scenes">
          {scenes.map((scene, index) => (
            <button type="button" key={scene.id} className={scene.id === selected ? 'is-active' : ''} onClick={() => goTo(scene.id)}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <b>{scene.title}</b>
              <small>{scene.level}</small>
            </button>
          ))}
        </nav>

        <div className="vt-walk-controls" aria-label="Move between adjacent viewpoints">
          <button type="button" disabled={currentIndex === 0} onClick={() => goTo(scenes[currentIndex - 1].id)}><span>←</span><small>PREVIOUS</small></button>
          <button type="button" className="is-forward" disabled={currentIndex === scenes.length - 1} onClick={() => goTo(scenes[currentIndex + 1].id)}><span>→</span><small>NEXT VIEW</small></button>
        </div>
        <div className="vt-help">DRAG TO LOOK · SCROLL TO ZOOM · FOLLOW THE AXIS FROM GARDEN TO PAVILION</div>

        {!started && (
          <section className="vt-intro" aria-labelledby="safadasht-intro-title">
            <small>AN INTERACTIVE ARCHITECTURE JOURNEY</small>
            <h1 id="safadasht-intro-title">Villa Safadasht</h1>
            <p>Walk the passage of Kamran Heirati Architects’ Memar Award-winning villa: along the garden axis, beneath the suspended stone bridge and through both wings, in ten photographic viewpoints.</p>
            <button type="button" data-analytics-event="cta_click" data-analytics-label="safadasht_tour_start" onClick={() => { setStarted(true); setTransitioning(true); window.setTimeout(() => setTransitioning(false), 350); }}>ENTER THE VILLA <span>↗</span></button>
            <footer>
              <span>Baghestan-e-Kushk, Karaj · 2016</span>
              <span>Kamran Heirati Architects · Memar Award 2016, First Place</span>
            </footer>
          </section>
        )}

        {diagramOpen && (
          <section className="vt-diagram" aria-labelledby="safadasht-diagram-title">
            <button type="button" className="vt-diagram-close" onClick={() => setDiagramOpen(false)} aria-label="Close plans and sections">×</button>
            <header>
              <small>SPACE ↔ DRAWING</small>
              <h2 id="safadasht-diagram-title">Read the villa in plan and section.</h2>
              <p>These schematic diagrams are original World Arch Journal readings of the documented layout — not measured construction drawings. The complete guide, with the full project history and all nineteen photographs, is the PDF below.</p>
            </header>
            <div className="vt-diagram-drawings">
              <article>
                <small>PROJECT DRAWINGS</small>
                <div className="vt-drawing-tabs">
                  {drawings.map((drawing) => <button type="button" key={drawing.id} className={activeDrawing === drawing.id ? 'is-active' : ''} onClick={() => setActiveDrawing(drawing.id)}>{drawing.label}</button>)}
                </div>
                {drawings.filter((drawing) => drawing.id === activeDrawing).map((drawing) => (
                  <figure key={drawing.id}>
                    <button type="button" className="vt-drawing-image" onClick={() => setDrawingZoomed(true)} aria-label={`Enlarge ${drawing.label}`}><img src={drawing.image} alt={drawing.alt} /></button>
                    <figcaption>{drawing.label} · Tap the drawing to enlarge · Schematic diagram: World Arch Journal, after the documented project layout.</figcaption>
                    <div className="vt-drawing-downloads" aria-label={`${drawing.label} downloads`}>
                      <a href={drawing.image} download>DOWNLOAD THIS DRAWING ↓</a>
                      <a href="/downloads/villa-safadasht-english-drawing-pack.zip" download>DOWNLOAD DRAWING PACK ↓</a>
                      <a href="/downloads/villa-safadasht-project-guide.pdf" download>DOWNLOAD PROJECT GUIDE (PDF) ↓</a>
                    </div>
                  </figure>
                ))}
              </article>
              <article>
                <small>SPATIAL ROUTE</small>
                <ol>
                  {scenes.map((scene, index) => (
                    <li key={scene.id} className={scene.id === selected ? 'is-active' : visitedScenes.has(scene.id) ? 'is-visited' : ''}>
                      <button type="button" onClick={() => { setDiagramOpen(false); goTo(scene.id); }}>
                        <span>{String(index + 1).padStart(2, '0')}</span><b>{scene.title}</b><small>{scene.level}</small>
                      </button>
                    </li>
                  ))}
                </ol>
              </article>
            </div>
          </section>
        )}

        {drawingZoomed && (
          <div className="vt-drawing-lightbox" role="dialog" aria-modal="true" aria-label="Enlarged project drawing">
            <button type="button" onClick={() => setDrawingZoomed(false)} aria-label="Close enlarged drawing">×</button>
            {drawings.filter((drawing) => drawing.id === activeDrawing).map((drawing) => <img key={drawing.id} src={drawing.image} alt={drawing.alt} />)}
          </div>
        )}
      </div>

      <section className="vt-credits">
        <small>ABOUT THIS EXPERIENCE</small>
        <h2>A passage through a Persian garden.</h2>
        <p>On a 2,400 m² garden plot in Baghestan-e-Kushk, Kamran Heirati Architects organised a weekend villa as a single walk: two ground-floor wings — public west, semi-private east — split by an open passage and rejoined above by a first-floor bridge of bedrooms, with the swimming pool running beneath it. The project won first place at the Memar Award 2016. This tour is built from the project’s published photographs; its 360° canvases are editorial montages composed from those photographs, and the plans are schematic readings — neither is a measured survey.</p>
        <dl>
          <div><dt>Architecture</dt><dd>Kamran Heirati Architects</dd></div>
          <div><dt>Lead architect</dt><dd>Kamran Heirati</dd></div>
          <div><dt>Original photography</dt><dd>Ali Daghigh, Abdolreza Bassiri</dd></div>
          <div><dt>Primary archive</dt><dd><a href="https://caoi.ir/en/projects/item/1024-villa-safadasht.html" target="_blank" rel="noreferrer">Contemporary Architecture of Iran ↗</a></dd></div>
        </dl>
        <a className="vt-return" href="/projects/villa-safadasht/">Open the complete project file</a>
      </section>
    </main>
  );
}
