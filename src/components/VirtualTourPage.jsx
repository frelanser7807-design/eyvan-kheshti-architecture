import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

const ASSET_ROOT = '/assets/virtual-tours/the-voids';

const scenes = [
  {
    id: 'arrival',
    title: 'North Garden Arrival',
    level: 'Garden',
    image: `${ASSET_ROOT}/01-arrival.jpg`,
    note: 'The villa first reads as a restrained white box. Terracotta-lined voids then reveal a second, warmer spatial layer and frame the approach from the open north garden.',
    evidence: 'Interpretive reconstruction from published photographs, plans and the architects’ project statement.',
    yaw: 0,
    pitch: -2,
    hotspots: [
      { target: 'living', label: 'Enter the living floor', yaw: 0, pitch: -6 },
      { target: 'basement-arrival', label: 'Descend to leisure level', yaw: 18, pitch: -17 },
    ],
    details: [
      { title: 'Open north, protected sides', label: 'MASSING', yaw: 2, pitch: 13, text: 'The north and west edges open toward desirable views, while the more protected sides anticipate neighbouring plots. The result combines extroverted outlooks with introverted courts.' },
      { title: 'A box lifted from its site', label: 'GROUND', yaw: 21, pitch: -15, text: 'The sunken court and long garden steps visually detach the cubic volume from the ground and reveal the leisure level below.' },
    ],
  },
  {
    id: 'living',
    title: 'Living, Dining & Kitchen',
    level: 'Ground floor',
    image: `${ASSET_ROOT}/02-living.jpg`,
    note: 'The conventional living programme is loosened by long views across the garden, internal voids and upper bridges. White solid rooms remain calm while terracotta voids carry movement, light and orientation.',
    evidence: 'Documented project strategy; furnishings are a restrained interpretive completion.',
    yaw: 0,
    pitch: -1,
    hotspots: [
      { target: 'arrival', label: 'Return to garden', yaw: -56, pitch: -4 },
      { target: 'courtyard', label: 'Enter the central void', yaw: 68, pitch: -3 },
      { target: 'basement-arrival', label: 'Go down to the pool', yaw: 92, pitch: -12 },
    ],
    details: [
      { title: 'White rooms, terracotta voids', label: 'MATERIAL', yaw: 24, pitch: 7, text: 'Light-toned solid rooms form the calm background; denser terracotta surfaces mark courtyards, bridges and circulation as a second spatial system.' },
      { title: 'A room with long sightlines', label: 'VIEW', yaw: -47, pitch: 0, text: 'Garden glazing, the double-height opening and the upper bridge allow several levels to be understood from one position.' },
      { title: 'Daylight from more than one side', label: 'LIGHT', yaw: 8, pitch: 28, text: 'Perimeter glass and overhead openings reduce dependence on a single facade and pull daylight into the depth of the plan.' },
    ],
  },
  {
    id: 'basement-arrival',
    title: 'Leisure Level Descent',
    level: 'Lower floor',
    image: `${ASSET_ROOT}/03-basement-arrival.jpg`,
    note: 'The leisure floor is not treated as a sealed basement. A planted cut, filtered roof light and an open stair extend the garden downward so the change of level remains visible and legible.',
    evidence: 'Interpretive reconstruction guided by published pool photography and sections.',
    yaw: 8,
    pitch: -4,
    hotspots: [
      { target: 'living', label: 'Climb to living floor', yaw: -42, pitch: 10 },
      { target: 'pool', label: 'Walk beside the pool', yaw: 30, pitch: -4 },
    ],
    details: [
      { title: 'A basement that still belongs to the garden', label: 'SECTION', yaw: -38, pitch: 9, text: 'The open stair and planted cut preserve a direct view to daylight, making the lower floor read as part of the landscape rather than an enclosed basement.' },
      { title: 'Filtered light at the lower datum', label: 'LIGHT', yaw: 58, pitch: 24, text: 'Perforated overhead screens soften glare while allowing a moving pattern of daylight to register time across the lower court.' },
    ],
  },
  {
    id: 'pool',
    title: 'Pool & Sunken Garden',
    level: 'Lower floor',
    image: `${ASSET_ROOT}/03-pool.jpg`,
    note: 'Water, planting and the grass-jointed path run in parallel. The perforated roof filters hard sun while the glazed edge keeps the long pool visually connected to the planted court.',
    evidence: 'Based on published photography; peripheral continuity is an interpretive reconstruction.',
    yaw: 7,
    pitch: -3,
    hotspots: [
      { target: 'basement-arrival', label: 'Return to the lower stair', yaw: 102, pitch: -4 },
      { target: 'courtyard', label: 'Continue to central courtyard', yaw: -76, pitch: 2 },
    ],
    details: [
      { title: 'Parallel bands', label: 'PLAN', yaw: 15, pitch: -7, text: 'Pool, circulation path and planted strip run side by side. Each band has a clear function but stays visually connected to the others.' },
      { title: 'Water extends the section', label: 'REFLECTION', yaw: 5, pitch: -18, text: 'The pool reflects the screened roof and surrounding walls, visually increasing the perceived height of the sunken leisure court.' },
    ],
  },
  {
    id: 'courtyard',
    title: 'Semi-central Courtyard',
    level: 'Ground floor',
    image: `${ASSET_ROOT}/04-courtyard.jpg`,
    note: 'This courtyard acts like a vertical orientation device. The tree, open sky and opposing stairs connect three levels without turning the void into a simple leftover light well.',
    evidence: 'Core spatial idea documented by the architects; image is an original interpretive reconstruction.',
    yaw: 0,
    pitch: 0,
    hotspots: [
      { target: 'living', label: 'Back to living spaces', yaw: 88, pitch: -2 },
      { target: 'stair-base', label: 'Begin the brick stair', yaw: -67, pitch: 1 },
      { target: 'pool', label: 'Descend toward the pool', yaw: 158, pitch: -11 },
    ],
    details: [
      { title: 'The tree as a clock', label: 'LANDSCAPE', yaw: 0, pitch: -2, text: 'The architects describe the valuable tree as a marker of time. As it grows, it occupies more of the vertical void and changes the interior experience.' },
      { title: 'Light delivered downward', label: 'DAYLIGHT', yaw: 32, pitch: 30, text: 'The semi-central court connects open and covered voids across three floors, carrying daylight toward the deepest part of the house.' },
      { title: 'Two stairs, two characters', label: 'CIRCULATION', yaw: 71, pitch: 8, text: 'A heavy terracotta stair and a lighter white stair behind glass create distinct routes while remaining visually connected across the courtyard.' },
    ],
  },
  {
    id: 'stair-base',
    title: 'Brick Stair — Base',
    level: 'Ground floor',
    image: `${ASSET_ROOT}/05-stair-base.jpg`,
    note: 'The brick stair is both circulation and occupied edge. Its weight contrasts with the lighter white stair behind glass, making two vertical routes readable across the courtyard.',
    evidence: 'Stair relationship documented in photographs and section; panorama is reconstructed.',
    yaw: -34,
    pitch: 4,
    hotspots: [
      { target: 'courtyard', label: 'Step back into courtyard', yaw: 58, pitch: -7 },
      { target: 'stair-mid', label: 'Climb to the landing', yaw: -8, pitch: 17 },
    ],
    details: [
      { title: 'Circulation becomes an edge to inhabit', label: 'STAIR', yaw: -30, pitch: 10, text: 'Broad landings and direct views into the courtyard turn the ascent into a sequence of pauses rather than a hidden service route.' },
      { title: 'Material reinforces direction', label: 'BRICK', yaw: -54, pitch: 2, text: 'The continuous brick lining makes the route legible across walls, floor, risers and soffits.' },
    ],
  },
  {
    id: 'stair-mid',
    title: 'Brick Stair — Mid Landing',
    level: 'Between floors',
    image: `${ASSET_ROOT}/06-stair-mid.jpg`,
    note: 'At the landing, the courtyard is read in section: the tree drops below eye level, the opposite stair crosses the glazed wall, and upper bridges enter the field of view.',
    evidence: 'Vertical sequence reconstructed from published stair photographs and sections.',
    yaw: -32,
    pitch: 0,
    hotspots: [
      { target: 'stair-base', label: 'Descend to ground floor', yaw: 160, pitch: -18 },
      { target: 'stair-upper', label: 'Continue upward', yaw: -43, pitch: 13 },
    ],
    details: [
      { title: 'The house becomes a section', label: 'LEVELS', yaw: 42, pitch: -15, text: 'From the landing, ground, upper bridge and opposite stair can be seen at once. The vertical organisation is understood through movement rather than signage.' },
      { title: 'A controlled pause', label: 'LANDING', yaw: -8, pitch: -4, text: 'The landing widens the route and provides a moment to look back into the courtyard before continuing upward.' },
    ],
  },
  {
    id: 'stair-upper',
    title: 'Upper Landing',
    level: 'Upper floor',
    image: `${ASSET_ROOT}/07-stair-upper.jpg`,
    note: 'The upper landing completes the vertical promenade. Glass balustrades preserve the depth of the void while the terracotta enclosure gives the circulation route a distinct material identity.',
    evidence: 'Interpretive reconstruction based on upper-level photographs and project sections.',
    yaw: 2,
    pitch: -3,
    hotspots: [
      { target: 'stair-mid', label: 'Descend to mid landing', yaw: -132, pitch: -16 },
      { target: 'terrace', label: 'Walk to upper terrace', yaw: 83, pitch: -2 },
      { target: 'bathroom', label: 'Open the bathroom', yaw: -74, pitch: -1 },
    ],
    details: [
      { title: 'Visual continuity without losing safety', label: 'EDGE', yaw: 36, pitch: -8, text: 'Transparent balustrades retain long diagonal views through the void while making the upper route secure.' },
      { title: 'A network, not one corridor', label: 'ROUTE', yaw: 88, pitch: 0, text: 'Upper bridges, terraces and stairs form several possible paths around the void, supporting the project’s idea of wandering and discovery.' },
    ],
  },
  {
    id: 'terrace',
    title: 'Upper Terrace & Glass Bridge',
    level: 'Upper floor',
    image: `${ASSET_ROOT}/08-terrace.jpg`,
    note: 'The terrace turns circulation into a sequence of framed sky, mountain and courtyard views. A planted marker gives scale to the brick-lined upper void and makes the outdoor room feel inhabited.',
    evidence: 'Reconstructed from documented terrace, bridge and courtyard photographs.',
    yaw: 0,
    pitch: -1,
    hotspots: [
      { target: 'stair-upper', label: 'Return to upper landing', yaw: -110, pitch: -3 },
      { target: 'roof-court', label: 'Climb to the roof promenade', yaw: 78, pitch: 4 },
    ],
    details: [
      { title: 'The terrace is an outdoor room', label: 'VOID', yaw: 10, pitch: 2, text: 'Terracotta surfaces continue across floor and wall so the open court feels enclosed enough to become a room while remaining open to sky.' },
      { title: 'A planted scale marker', label: 'TREE', yaw: -8, pitch: 2, text: 'The sculptural tree gives human scale to the upper court and mediates between the precise building grid and the distant landscape.' },
      { title: 'Framed rather than panoramic', label: 'VIEW', yaw: 70, pitch: 2, text: 'Openings and bridges edit the mountain view into deliberate fragments, making movement reveal the landscape progressively.' },
    ],
  },
  {
    id: 'roof-court',
    title: 'Roof Promenade & Central Void',
    level: 'Roof terrace',
    image: `${ASSET_ROOT}/10-rooftop-panorama-v2.webp`,
    audio: 'terrace',
    note: 'The roof is not a leftover surface. It is a walkable upper landscape where terracotta volumes, a glass bridge and the central void frame the mountains and pull the visitor through the project.',
    evidence: 'Original AI-assisted editorial reconstruction based on the published upper-terrace photographs, roof plan and sections. Source photography: Mohammad Hossein Hamzelouei.',
    yaw: 0,
    pitch: -2,
    hotspots: [
      { target: 'terrace', label: 'Return to the upper terrace', yaw: -108, pitch: -3 },
      { target: 'roof-stair', label: 'Walk to the roof stair', yaw: 72, pitch: -4 },
    ],
    details: [
      { title: 'The roof becomes a fifth facade', label: 'ROOF', yaw: 18, pitch: 10, text: 'Terracotta parapets, bridges and planted cuts make the roof legible as an inhabited facade rather than technical infrastructure.' },
      { title: 'A void that reveals the lower garden', label: 'SECTION', yaw: 52, pitch: -16, text: 'The guarded opening keeps the central courtyard visible below, preserving the vertical continuity that defines the villa.' },
      { title: 'Mountain view as a sequence', label: 'LANDSCAPE', yaw: 94, pitch: 4, text: 'The roof promenade reveals the wider landscape gradually, alternating framed views with close brick-lined moments.' },
    ],
  },
  {
    id: 'roof-stair',
    title: 'Roof Stair & Upper Court',
    level: 'Roof terrace',
    image: `${ASSET_ROOT}/11-rooftop-stair-panorama-v2.webp`,
    audio: 'stair-upper',
    note: 'At the roof stair, the villa reads as a continuous promenade: the stair, glass edge, courtyard opening and upper volume overlap in one elevated view.',
    evidence: 'Original AI-assisted editorial reconstruction based on published roof-court photographs and the project section drawings. Source photography: Mohammad Hossein Hamzelouei.',
    yaw: 4,
    pitch: -3,
    hotspots: [
      { target: 'roof-court', label: 'Return to roof promenade', yaw: -78, pitch: -4 },
      { target: 'bathroom', label: 'Return to the upper court', yaw: 122, pitch: -4 },
    ],
    details: [
      { title: 'The stair makes the roof accessible', label: 'MOVEMENT', yaw: 112, pitch: -8, text: 'The stair turns the roof from an inaccessible cap into the final step of the villa’s continuous circulation sequence.' },
      { title: 'Glass protects the edge without closing it', label: 'EDGE', yaw: -10, pitch: -2, text: 'A transparent balustrade preserves views into the void and toward the mountains while marking the safe walking line.' },
    ],
  },
  {
    id: 'bathroom',
    title: 'Courtyard Bathroom',
    level: 'Upper floor',
    image: `${ASSET_ROOT}/09-bathroom.jpg`,
    note: 'The bath is aligned with a private terracotta court. The exterior wall becomes the visual finish of the room, allowing daylight and planting to replace decorative excess.',
    evidence: 'Bathtub and courtyard view are documented; unseen fixtures are clearly marked as conceptual completion.',
    yaw: 0,
    pitch: -1,
    hotspots: [
      { target: 'roof-stair', label: 'Return to the roof stair', yaw: 164, pitch: -2 },
      { target: 'stair-upper', label: 'Return to upper landing', yaw: -146, pitch: -2 },
    ],
    details: [
      { title: 'The court becomes the finish', label: 'WINDOW', yaw: 0, pitch: 1, text: 'The bathtub faces a terracotta courtyard wall and planting, allowing the exterior surface to replace conventional decorative feature walls.' },
      { title: 'A deliberately quiet palette', label: 'MATERIAL', yaw: -57, pitch: 0, text: 'Grey stone-like surfaces, white sanitary elements and warm timber storage keep attention on daylight and the courtyard view.' },
    ],
  },
];

const sceneById = Object.fromEntries(scenes.map((scene) => [scene.id, scene]));

const levelStops = [
  { label: 'UPPER', scene: 'roof-court' },
  { label: 'BETWEEN', scene: 'stair-mid' },
  { label: 'GROUND', scene: 'arrival' },
  { label: 'LOWER', scene: 'basement-arrival' },
];

const sceneQuestions = {
  arrival: ['Why does the villa feel open and protected at the same time?', 'The north garden opens long views, while the other edges are more controlled in anticipation of neighbouring plots.'],
  living: ['How does daylight reach beyond the perimeter rooms?', 'Glazing, internal voids and overhead openings bring light from several directions into the depth of the plan.'],
  'basement-arrival': ['What prevents this lower level from feeling like a sealed basement?', 'The open stair, planted cut and filtered roof light keep the garden and sky visually present during the descent.'],
  pool: ['Why are the pool, path and planting arranged as parallel bands?', 'The bands separate use without breaking visual continuity, so water, movement and landscape remain part of one room.'],
  courtyard: ['What makes the courtyard more than a simple light well?', 'It connects three levels, two stair systems, the open sky and a living tree, becoming the house’s main orientation device.'],
  'stair-base': ['Why does the stair feel like an inhabited place?', 'Wide landings, brick continuity and views into the courtyard turn circulation into a sequence of pauses.'],
  'stair-mid': ['How does this landing explain the whole house?', 'Ground, upper bridge, tree and opposite stair become visible at once, allowing the section to be understood through movement.'],
  'stair-upper': ['Why use transparent balustrades around the void?', 'They protect the route while preserving diagonal views and the perceived depth of the central void.'],
  terrace: ['Why is the mountain view revealed in fragments?', 'Walls, bridges and openings edit the panorama so the landscape is discovered progressively as the visitor moves.'],
  'roof-court': ['Why does the roof feel like part of the architecture rather than a technical surface?', 'The roof is shaped as a walkable sequence of courtyards, bridges and parapets that continues the villa’s void system.'],
  'roof-stair': ['What changes when the stair reaches the roof?', 'The route becomes an elevated promenade, linking the courtyard opening, the upper volume and the mountain horizon.'],
  bathroom: ['What replaces a conventional decorative feature wall here?', 'The framed terracotta courtyard, daylight and planting become the visual finish of the bathroom.'],
};

const missionKeys = new Set(scenes.slice(0, 8).map((scene) => `${scene.id}::${scene.details[0].title}`));

const drawings = [
  { id: 'lower', label: 'LOWER FLOOR', image: '/assets/projects/the-voids/drawings/lower-floor-plan.png', alt: 'English editorial lower-floor plan of The Voids Villa showing pool and leisure spaces' },
  { id: 'ground', label: 'GROUND FLOOR', image: '/assets/projects/the-voids/drawings/ground-floor-plan.png', alt: 'English editorial ground-floor plan of The Voids Villa' },
  { id: 'upper', label: 'UPPER FLOOR', image: '/assets/projects/the-voids/drawings/upper-floor-plan.png', alt: 'English editorial upper-floor plan of The Voids Villa' },
  { id: 'roof', label: 'ROOF PLAN', image: '/assets/projects/the-voids/drawings/roof-plan.png', alt: 'English editorial roof plan of The Voids Villa' },
  { id: 'section-aa', label: 'SECTION A–A', image: '/assets/projects/the-voids/drawings/section-aa.png', alt: 'English editorial section A-A through The Voids Villa' },
  { id: 'section-bb', label: 'SECTION B–B', image: '/assets/projects/the-voids/drawings/section-bb.png', alt: 'English editorial section B-B through The Voids Villa' },
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
export default function VirtualTourPage() {
  const mountRef = useRef(null);
  const runtimeRef = useRef(null);
  const selectedRef = useRef('arrival');
  const hotspotLayerRef = useRef(null);
  const navigationRef = useRef(null);
  const walkingTimerRef = useRef([]);
  const audioRef = useRef(null);
  const [selected, setSelected] = useState('arrival');
  const [started, setStarted] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [transitioning, setTransitioning] = useState(true);
  const [activeDetail, setActiveDetail] = useState(null);
  const [foundInsights, setFoundInsights] = useState(() => new Set());
  const [visitedScenes, setVisitedScenes] = useState(() => new Set(['arrival']));
  const [walking, setWalking] = useState(null);
  const [mapOpen, setMapOpen] = useState(true);
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizRevealed, setQuizRevealed] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [diagramOpen, setDiagramOpen] = useState(false);
  const [activeDrawing, setActiveDrawing] = useState('ground');
  const [drawingZoomed, setDrawingZoomed] = useState(false);
  const [nightMode, setNightMode] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [walkTarget, setWalkTarget] = useState('');
  const [hasWalked, setHasWalked] = useState(false);
  const [viewMode] = useState('panorama');
  const current = sceneById[selected];
  const progress = useMemo(() => scenes.findIndex((scene) => scene.id === selected) + 1, [selected]);
  const missionFound = useMemo(() => [...foundInsights].filter((key) => missionKeys.has(key)).length, [foundInsights]);

  useEffect(() => {
    if (viewMode !== 'model') return undefined;
    const timer = window.setTimeout(() => setTransitioning(false), started ? 420 : 80);
    return () => window.clearTimeout(timer);
  }, [started, viewMode]);

  const goTo = (id, requestedDirection) => {
    if (!sceneById[id] || id === selectedRef.current || walking) return;
    const currentIndex = scenes.findIndex((scene) => scene.id === selectedRef.current);
    const targetIndex = scenes.findIndex((scene) => scene.id === id);
    const direction = requestedDirection || (targetIndex >= currentIndex ? 'forward' : 'backward');
    walkingTimerRef.current.forEach(window.clearTimeout);
    setWalking(direction);
    setWalkTarget(sceneById[id].title);
    setHasWalked(true);
    setTransitioning(true);
    const switchTimer = window.setTimeout(() => {
      selectedRef.current = id;
      setSelected(id);
      setNoteOpen(false);
      setActiveDetail(null);
      setQuizOpen(false);
      setQuizRevealed(false);
      setVisitedScenes((previous) => new Set(previous).add(id));
    }, 760);
    const finishTimer = window.setTimeout(() => {
      setWalking(null);
      setWalkTarget('');
    }, 1550);
    walkingTimerRef.current = [switchTimer, finishTimer];
  };

  const walkRoute = (step) => {
    if (!started || walking) return;
    const index = scenes.findIndex((scene) => scene.id === selectedRef.current);
    const nextIndex = index + step;
    if (nextIndex >= scenes.length) {
      setCompleted(true);
      return;
    }
    if (nextIndex < 0) return;
    goTo(scenes[nextIndex].id, step > 0 ? 'forward' : 'backward');
  };
  navigationRef.current = walkRoute;

  const openDetail = (detail) => {
    const key = `${selectedRef.current}::${detail.title}`;
    setFoundInsights((previous) => new Set(previous).add(key));
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

  const toggleNarration = () => {
    if (speaking) {
      audioRef.current?.pause();
      if (audioRef.current) audioRef.current.currentTime = 0;
      setSpeaking(false);
      return;
    }
    audioRef.current?.pause();
    const audio = new Audio(`${ASSET_ROOT}/audio/${current.audio || selected}.wav`);
    audio.preload = 'auto';
    audio.onended = () => setSpeaking(false);
    audio.onerror = () => setSpeaking(false);
    audioRef.current = audio;
    setSpeaking(true);
    audio.play().catch(() => setSpeaking(false));
  };

  const shareResult = async () => {
    const text = `I explored The Voids Villa and discovered ${missionFound} of 8 hidden architectural ideas.`;
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: 'The Voids Villa — Virtual Tour', text, url }).catch(() => {});
      return;
    }
    await navigator.clipboard?.writeText(`${text} ${url}`);
  };

  const openDiagram = () => {
    const upperLevel = current.level.toUpperCase();
    if (upperLevel.includes('LOWER')) setActiveDrawing('lower');
    else if (upperLevel.includes('UPPER') || upperLevel.includes('BETWEEN')) setActiveDrawing('upper');
    else setActiveDrawing('ground');
    setDiagramOpen(true);
  };

  const handleModelSceneChange = useCallback((id) => {
    if (!sceneById[id]) return;
    selectedRef.current = id;
    setSelected(id);
    setVisitedScenes((previous) => new Set(previous).add(id));
    setActiveDetail(null);
    setQuizOpen(false);
  }, []);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || viewMode !== 'panorama') return undefined;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.className = 'vt-canvas';
    renderer.domElement.setAttribute('aria-label', 'Interactive 360-degree architectural walkthrough');
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
      yaw: 0,
      pitch: -2,
      targetYaw: 0,
      targetPitch: -2,
      active: false,
      startX: 0,
      startY: 0,
      startYaw: 0,
      startPitch: 0,
      velocityYaw: 0,
      velocityPitch: 0,
      lastMove: performance.now(),
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
      if (event.key === 'ArrowUp' || event.key.toLowerCase() === 'w') navigationRef.current?.(1);
      if (event.key === 'ArrowDown' || event.key.toLowerCase() === 's') navigationRef.current?.(-1);
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'w', 'W', 'a', 'A', 's', 'S', 'd', 'D'].includes(event.key)) {
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
        if (now - controls.lastMove > 5500 && started) controls.targetYaw += 0.012;
      }
      controls.yaw += (controls.targetYaw - controls.yaw) * 0.09;
      controls.pitch += (controls.targetPitch - controls.pitch) * 0.09;
      const viewDirection = directionFromAngles(controls.yaw, controls.pitch, 1);
      const stride = mount.classList.contains('is-walking') ? .58 : 0;
      camera.position.copy(viewDirection).multiplyScalar(stride);
      camera.lookAt(viewDirection.clone().multiplyScalar(10));
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
  }, [started, viewMode]);

  useEffect(() => () => walkingTimerRef.current.forEach(window.clearTimeout), []);

  useEffect(() => {
    audioRef.current?.pause();
    audioRef.current = null;
    setSpeaking(false);
  }, [selected]);

  useEffect(() => () => audioRef.current?.pause(), []);

  useEffect(() => {
    const runtime = runtimeRef.current;
    if (!runtime || viewMode !== 'panorama') return undefined;
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
  }, [selected, started, viewMode]);

  useEffect(() => {
    scenes.forEach((scene) => {
      const image = new Image();
      image.decoding = 'async';
      image.src = scene.image;
    });
  }, []);

  const toggleFullscreen = async () => {
    const element = mountRef.current?.closest('.vt-page');
    if (!element) return;
    if (document.fullscreenElement) await document.exitFullscreen();
    else await element.requestFullscreen?.();
  };

  return (
    <main className="vt-page" id="main-content">
      <div className={`vt-stage ${viewMode === 'model' ? 'is-model' : 'is-panorama'} ${walking ? `is-walking is-walking-${walking}` : ''} ${nightMode ? 'is-night' : 'is-day'}`} ref={mountRef}>
        <div className={`vt-transition ${transitioning ? 'is-visible' : ''} ${walking ? 'is-passage' : ''}`} aria-hidden="true" />
        <div className={`vt-passage ${walking ? 'is-visible' : ''}`} aria-hidden="true"><i /><span>WALKING TO<br /><b>{walkTarget}</b></span></div>
        <header className="vt-topbar">
          <a href="/" className="vt-brand">WORLD ARCH JOURNAL</a>
          <div className="vt-progress" aria-label={`Scene ${progress} of ${scenes.length}`}>
            <span>{String(progress).padStart(2, '0')}</span>
            <i><b style={{ width: `${(progress / scenes.length) * 100}%` }} /></i>
            <span>{String(scenes.length).padStart(2, '0')}</span>
          </div>
          <div className="vt-actions">
            <button type="button" data-analytics-event="cta_click" data-analytics-label="voids_plans_open" onClick={openDiagram}>PLAN / SECTION</button>
            <button type="button" onClick={() => setNightMode((value) => !value)}>{nightMode ? 'DAY' : 'NIGHT'}</button>
            <button type="button" className={speaking ? 'is-active' : ''} onClick={toggleNarration}>{speaking ? 'STOP VOICE' : 'VOICE'}</button>
            <button type="button" onClick={toggleFullscreen}>FULLSCREEN</button>
          </div>
        </header>

        <div className="vt-location" aria-live="polite">
          <small>{current.level}</small>
          <h1>The Voids Villa</h1>
          <span>{current.title}</span>
        </div>

        {viewMode === 'panorama' && <div className="vt-hotspot-layer" ref={hotspotLayerRef}>
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
        </div>}

        {activeDetail && (
          <aside className="vt-detail" aria-live="polite">
            <button type="button" onClick={closeDetail} aria-label="Close detail">×</button>
            <small>{activeDetail.label} · WHY IT MATTERS</small>
            <h2>{activeDetail.title}</h2>
            <p>{activeDetail.text}</p>
            <span className="vt-detail-focus">FOCUSED DETAIL VIEW · SCROLL TO INSPECT</span>
          </aside>
        )}

        {quizOpen && (
          <aside className="vt-quiz" aria-live="polite">
            <button type="button" onClick={() => setQuizOpen(false)} aria-label="Close question">×</button>
            <small>SPACE QUESTION</small>
            <h2>{sceneQuestions[selected][0]}</h2>
            {quizRevealed ? <p>{sceneQuestions[selected][1]}</p> : <button className="vt-quiz-reveal" type="button" onClick={() => setQuizRevealed(true)}>REVEAL THE ARCHITECTURAL REASON</button>}
          </aside>
        )}

        <aside className={`vt-level-map ${mapOpen ? 'is-open' : ''}`} aria-label="Level navigator">
          <button className="vt-level-map-toggle" type="button" onClick={() => setMapOpen((value) => !value)}>{mapOpen ? '×' : 'LEVELS'}</button>
          <small>YOUR POSITION</small>
          <div className="vt-level-stack">
            {levelStops.map((level) => {
              const upperLevel = current.level.toUpperCase();
              const active = level.label === 'GROUND'
                ? upperLevel.includes('GROUND') || upperLevel.includes('GARDEN')
                : level.label === 'UPPER'
                  ? upperLevel.includes('UPPER') || upperLevel.includes('ROOF')
                : upperLevel.includes(level.label);
              return (
                <button type="button" key={level.label} className={active ? 'is-active' : ''} onClick={() => goTo(level.scene)}>
                  <i /> <span>{level.label}</span>
                </button>
              );
            })}
          </div>
        </aside>

        {diagramOpen && (
          <section className="vt-diagram" aria-labelledby="vt-diagram-title">
            <button type="button" className="vt-diagram-close" onClick={() => setDiagramOpen(false)} aria-label="Close plan and section">×</button>
            <header>
              <small>SPACE ↔ DRAWING</small>
              <h2 id="vt-diagram-title">Read the villa in plan and section.</h2>
              <p>This original navigation diagram is interpretive—not a measured construction drawing. The gold marker shows your current position.</p>
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
                    <figcaption>{drawing.label} · Tap the drawing to enlarge · Drawing credit: AsNow Design &amp; Construct / CAOI</figcaption>
                    <div className="vt-drawing-downloads" aria-label={`${drawing.label} downloads`}>
                      <a href={drawing.image} download={`the-voids-villa-${drawing.id}.png`}>DOWNLOAD THIS DRAWING ↓</a>
                      <a href="/downloads/the-voids-villa-english-drawing-pack.zip" download>DOWNLOAD FULL DRAWING PACK ↓</a>
                      <a href="/downloads/the-voids-villa-project-guide.pdf" download>DOWNLOAD PROJECT GUIDE PDF ↓</a>
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
            <div className="vt-schematic-section">
              <small>INTERPRETIVE ROUTE SECTION</small>
              <svg viewBox="0 0 620 300" role="img" aria-label="Schematic section through the villa levels and void">
                <path d="M55 72H255V115H365V72H565M55 148H215V190H405V148H565M55 232H255V202H365V232H565" />
                <path className="is-void" d="M255 45V245M365 45V245" />
                <path className="is-route" d="M108 218L192 170L246 130L312 100L405 82L512 82" />
                <circle cx={progress < 3 ? 108 : progress < 6 ? 246 : progress < 8 ? 312 : 470} cy={current.level.includes('Lower') ? 218 : current.level.includes('Upper') || current.level.includes('Roof') ? 82 : current.level.includes('Between') ? 130 : 170} r="9" />
                <text x="60" y="57">UPPER</text><text x="60" y="135">GROUND</text><text x="60" y="220">LOWER</text>
                <text x="277" y="270">CENTRAL VOID</text>
              </svg>
            </div>
          </section>
        )}

        {drawingZoomed && (
          <div className="vt-drawing-lightbox" role="dialog" aria-modal="true" aria-label="Enlarged project drawing">
            <button type="button" onClick={() => setDrawingZoomed(false)} aria-label="Close enlarged drawing">×</button>
            {drawings.filter((drawing) => drawing.id === activeDrawing).map((drawing) => <img key={drawing.id} src={drawing.image} alt={drawing.alt} />)}
          </div>
        )}

        <div className="vt-mission" aria-live="polite">
          <small>DISCOVERY MISSION</small>
          <b>{missionFound}/8</b>
          <span>hidden ideas found</span>
        </div>

        <aside className={`vt-note ${noteOpen ? 'is-open' : ''}`} aria-live="polite">
          <button type="button" className="vt-note-toggle" onClick={() => setNoteOpen((value) => !value)} aria-expanded={noteOpen}>
            {noteOpen ? '×' : 'i'}
          </button>
          <small>ARCHITECT’S NOTE · {current.level.toUpperCase()}</small>
          <h2>{current.title}</h2>
          <p>{current.note}</p>
          <span>{current.evidence}</span>
        </aside>

        {viewMode === 'panorama' && <nav className="vt-scene-rail" aria-label="Tour scenes">
          {scenes.map((scene, index) => (
            <button type="button" key={scene.id} className={scene.id === selected ? 'is-active' : ''} onClick={() => goTo(scene.id)}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <b>{scene.title}</b>
              <small>{scene.level}</small>
            </button>
          ))}
        </nav>}

        {viewMode === 'panorama' && <div className="vt-walk-controls" aria-label="Move between 360-degree viewpoints">
          <button type="button" onClick={() => walkRoute(-1)} disabled={progress === 1 || Boolean(walking)} aria-label="Walk backward"><span>↓</span><small>BACK</small></button>
          <button type="button" className="is-forward" onClick={() => walkRoute(1)} disabled={Boolean(walking)}><span>↑</span><small>{progress === scenes.length ? 'FINISH' : 'WALK FORWARD'}</small></button>
          <button type="button" onClick={() => { setQuizOpen(true); setQuizRevealed(false); }}><span>?</span><small>QUESTION</small></button>
        </div>}
        {!hasWalked && started && viewMode === 'panorama' && <div className="vt-walk-coach">FOLLOW <b>WALK FORWARD</b> TO MOVE THROUGH THE COMPLETE PROJECT SEQUENCE</div>}

        {viewMode === 'panorama' && <div className="vt-help">DRAG TO LOOK · USE WALK FORWARD TO CHANGE VIEWPOINT</div>}

        {!started && (
          <section className="vt-intro" aria-labelledby="vt-intro-title">
            <small>AN INTERACTIVE ARCHITECTURE JOURNEY</small>
            <h1 id="vt-intro-title">The Voids Villa</h1>
            <p>Walk through a reconstructed three-level sequence of gardens, living spaces, stairs, pool and terraces. Find the eight hidden architectural ideas along the way.</p>
            <button type="button" onClick={() => { setStarted(true); setTransitioning(true); }}>ENTER THE VILLA <span>↗</span></button>
            <footer>
              <span>Koohsar, Karaj · 2021–2024</span>
              <span>Architects: Solmaz Tatari & Ehsan Tavassoli</span>
            </footer>
          </section>
        )}

        {completed && (
          <section className="vt-complete" aria-labelledby="vt-complete-title">
            <button type="button" className="vt-complete-close" onClick={() => setCompleted(false)} aria-label="Close summary">×</button>
            <small>JOURNEY COMPLETE</small>
            <h2 id="vt-complete-title">You moved through The Voids.</h2>
            <p>You visited {visitedScenes.size} of {scenes.length} spaces and discovered {missionFound} of 8 hidden architectural ideas.</p>
            <div>
              <button type="button" onClick={() => { setCompleted(false); goTo('arrival', 'backward'); }}>RESTART THE TOUR</button>
              <button type="button" data-analytics-event="cta_click" data-analytics-label="voids_plans_open" onClick={() => { setCompleted(false); openDiagram(); }}>EXPLORE PLANS &amp; SECTIONS</button>
              <a href="/articles/">EXPLORE ARCHITECTURE ARTICLES</a>
              <a href="/#contact">ORDER A CUSTOM VIRTUAL TOUR</a>
              <button type="button" onClick={shareResult}>SHARE YOUR SCORE</button>
            </div>
          </section>
        )}
      </div>

      <section className="vt-credits">
        <small>ABOUT THIS EXPERIENCE</small>
        <h2>A spatial reading, not a measured survey.</h2>
        <p>This AI-assisted interpretive reconstruction was developed from publicly presented photography, plans, sections and the architects’ written project description. It is designed for architectural learning and spatial exploration; it must not be used as construction documentation.</p>
        <dl>
          <div><dt>Architecture</dt><dd>AsNow Design & Construct</dd></div>
          <div><dt>Architects</dt><dd>Solmaz Tatari, Ehsan Tavassoli</dd></div>
          <div><dt>Original photography</dt><dd>Mohammad Hossein Hamzelouei</dd></div>
          <div><dt>Reference archive</dt><dd><a href="https://caoi.ir/en/projects/item/1938" target="_blank" rel="noopener noreferrer">Contemporary Architecture of Iran ↗</a></dd></div>
        </dl>
        <a className="vt-return" href="/">Return to World Arch Journal</a>
      </section>
    </main>
  );
}
