import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import * as THREE from 'three';

const routeStops = [
  { id: 'arrival', label: 'North Garden Arrival', position: [0, 1.68, 15] },
  { id: 'living', label: 'Living, Dining & Kitchen', position: [2.4, 1.68, 7.3] },
  { id: 'basement-arrival', label: 'Leisure Level Descent', position: [3.7, .5, 4.8] },
  { id: 'pool', label: 'Pool & Sunken Garden', position: [4.2, -1.72, .6] },
  { id: 'courtyard', label: 'Semi-central Courtyard', position: [.3, 1.68, 2.4] },
  { id: 'stair-base', label: 'Brick Stair — Base', position: [-3.5, 1.68, 1.5] },
  { id: 'stair-mid', label: 'Brick Stair — Mid Landing', position: [-3.65, 3.22, -.4] },
  { id: 'stair-upper', label: 'Upper Landing', position: [-3.3, 5.08, -2.3] },
  { id: 'terrace', label: 'Upper Terrace & Glass Bridge', position: [0, 5.08, -.2] },
  { id: 'bathroom', label: 'Courtyard Bathroom', position: [3.5, 5.08, .8] },
];

function makeBrickTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const context = canvas.getContext('2d');
  context.fillStyle = '#9a4e32';
  context.fillRect(0, 0, 512, 512);
  for (let row = 0; row < 16; row += 1) {
    const y = row * 32;
    context.fillStyle = 'rgba(48,22,13,.26)';
    context.fillRect(0, y, 512, 2);
    const offset = row % 2 ? 32 : 0;
    for (let x = offset; x < 512; x += 64) context.fillRect(x, y, 2, 32);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function addBox(group, size, position, material, cast = true) {
  const geometry = new THREE.BoxGeometry(...size);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(...position);
  mesh.castShadow = cast;
  mesh.receiveShadow = true;
  group.add(mesh);
  return mesh;
}

function addTree(group, x, y, z, scale = 1) {
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(.09 * scale, .14 * scale, 2.4 * scale, 10), new THREE.MeshStandardMaterial({ color: '#6f4b31', roughness: 1 }));
  trunk.position.set(x, y + 1.2 * scale, z);
  trunk.castShadow = true;
  group.add(trunk);
  const crownMaterial = new THREE.MeshStandardMaterial({ color: '#617646', roughness: .94 });
  [[0, 2.45, 0], [.55, 2.15, .1], [-.48, 2.12, -.16], [.12, 2.05, .52]].forEach(([dx, dy, dz]) => {
    const crown = new THREE.Mesh(new THREE.IcosahedronGeometry(.74 * scale, 2), crownMaterial);
    crown.position.set(x + dx * scale, y + dy * scale, z + dz * scale);
    crown.castShadow = true;
    group.add(crown);
  });
}

function createVilla(world) {
  const villa = new THREE.Group();
  const white = new THREE.MeshStandardMaterial({ color: '#ece9e2', roughness: .72, metalness: .02 });
  const dark = new THREE.MeshStandardMaterial({ color: '#252829', roughness: .55, metalness: .15 });
  const timber = new THREE.MeshStandardMaterial({ color: '#8b6042', roughness: .72 });
  const brickTexture = makeBrickTexture();
  const brick = new THREE.MeshStandardMaterial({ map: brickTexture, color: '#b86f4a', roughness: .88 });
  const floor = new THREE.MeshStandardMaterial({ color: '#bdb9b0', roughness: .9 });
  const glass = new THREE.MeshPhysicalMaterial({ color: '#9cb4b8', transparent: true, opacity: .29, roughness: .06, metalness: .04, transmission: .28, side: THREE.DoubleSide });
  const water = new THREE.MeshPhysicalMaterial({ color: '#2b9ba8', transparent: true, opacity: .78, roughness: .12, metalness: .08, transmission: .15 });

  addBox(villa, [18, .32, 24], [0, -3.58, 2], dark);
  addBox(villa, [18, .22, 24], [0, -.12, 2], white);
  addBox(villa, [18, .22, 24], [0, 3.28, 2], white);
  addBox(villa, [18, .32, 24], [0, 6.75, 2], white);

  [-8.8, 8.8].forEach((x) => addBox(villa, [.35, 10.2, 24], [x, 1.6, 2], white));
  addBox(villa, [18, 10.2, .35], [0, 1.6, -9.8], white);
  addBox(villa, [4.2, 10.2, .45], [-6.9, 1.6, 13.8], white);
  addBox(villa, [4.2, 10.2, .45], [6.9, 1.6, 13.8], white);
  addBox(villa, [9.8, .25, .08], [0, 1.6, 13.58], glass, false);
  addBox(villa, [9.8, .25, .08], [0, 5.05, 13.58], glass, false);

  addBox(villa, [7.4, 7.1, .32], [0, 2.6, -1.8], brick);
  addBox(villa, [.32, 7.1, 7.1], [-3.7, 2.6, 1.6], brick);
  addBox(villa, [.32, 7.1, 7.1], [3.7, 2.6, 1.6], brick);
  addBox(villa, [7.4, .22, 7.1], [0, 6.2, 1.6], brick);
  addBox(villa, [7.1, .08, 5.8], [0, 1.65, 1.6], glass, false);

  addBox(villa, [5.5, .18, 10], [4.5, -3.2, .2], water, false);
  addBox(villa, [6.1, .45, .28], [4.5, -3.15, -4.92], white);
  addBox(villa, [6.1, .45, .28], [4.5, -3.15, 5.32], white);
  addBox(villa, [.28, .45, 10], [1.45, -3.15, .2], white);
  addBox(villa, [.28, .45, 10], [7.55, -3.15, .2], white);

  for (let index = 0; index < 15; index += 1) {
    const y = -3.34 + index * .23;
    const z = 5.5 + index * .33;
    addBox(villa, [2.2, .2, .55], [3.7, y, z], brick);
  }
  for (let index = 0; index < 16; index += 1) {
    const y = .08 + index * .215;
    const z = 2.5 - index * .28;
    addBox(villa, [2.4, .19, .5], [-3.4, y, z], brick);
  }

  addBox(villa, [6.8, .14, 1.5], [0, 3.55, 1.6], glass, false);
  addBox(villa, [6.8, .12, .12], [0, 4.45, .88], dark);
  for (let x = -3.2; x <= 3.2; x += .8) addBox(villa, [.06, 1.7, .06], [x, 4.4, .88], dark, false);

  addBox(villa, [4.8, .65, 1.7], [3.2, .38, 7], floor);
  addBox(villa, [2.4, .42, 1.1], [3.2, .55, 5.9], timber);
  addBox(villa, [3.4, .45, 1.4], [-3, .32, 7.4], floor);
  addBox(villa, [2.3, .62, 1.2], [-3, .56, 6.7], timber);

  addTree(villa, 0, -.1, 1.6, 1.05);
  addTree(villa, -6.6, -3.4, 10.5, .86);
  addTree(villa, 6.9, -3.4, 10.2, .8);

  const garden = new THREE.Mesh(new THREE.PlaneGeometry(42, 42), new THREE.MeshStandardMaterial({ color: '#64724c', roughness: 1 }));
  garden.rotation.x = -Math.PI / 2;
  garden.position.y = -3.72;
  garden.position.z = 2;
  garden.receiveShadow = true;
  villa.add(garden);

  world.add(villa);
  return { villa, brickTexture };
}

const ModelWalkthrough = forwardRef(function ModelWalkthrough({ onSceneChange }, ref) {
  const mountRef = useRef(null);
  const runtimeRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [moving, setMoving] = useState(false);
  const [currentStop, setCurrentStop] = useState(routeStops[0]);

  useImperativeHandle(ref, () => ({
    forward: () => { if (runtimeRef.current) runtimeRef.current.intent = 1; },
    backward: () => { if (runtimeRef.current) runtimeRef.current.intent = -1; },
    stop: () => { if (runtimeRef.current) runtimeRef.current.intent = 0; },
  }), []);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.className = 'vt-model-canvas';
    renderer.domElement.tabIndex = 0;
    renderer.domElement.setAttribute('aria-label', 'True three-dimensional guided walkthrough of The Voids Villa');
    mount.prepend(renderer.domElement);

    const world = new THREE.Scene();
    world.background = new THREE.Color('#9db7cb');
    world.fog = new THREE.Fog('#aab7b4', 24, 62);
    const camera = new THREE.PerspectiveCamera(69, mount.clientWidth / mount.clientHeight, .06, 120);
    const hemi = new THREE.HemisphereLight('#dcebff', '#6c533c', 2.15);
    world.add(hemi);
    const sun = new THREE.DirectionalLight('#fff3dc', 4.6);
    sun.position.set(-12, 22, 18);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -24;
    sun.shadow.camera.right = 24;
    sun.shadow.camera.top = 24;
    sun.shadow.camera.bottom = -24;
    world.add(sun);
    const { brickTexture } = createVilla(world);

    const points = routeStops.map((stop) => new THREE.Vector3(...stop.position));
    const curve = new THREE.CatmullRomCurve3(points, false, 'centripetal', .28);
    const runtime = { renderer, world, camera, curve, progress: 0, intent: 0, yawOffset: 0, pitch: 0, dragging: false, lastX: 0, lastY: 0, brickTexture };
    runtimeRef.current = runtime;

    const resize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      camera.aspect = width / Math.max(1, height);
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(mount);

    const setIntent = (value) => {
      runtime.intent = value;
      setMoving(Boolean(value));
    };
    const keyDown = (event) => {
      if (['w', 'W', 'ArrowUp'].includes(event.key)) setIntent(1);
      if (['s', 'S', 'ArrowDown'].includes(event.key)) setIntent(-1);
      if (['w', 'W', 's', 'S', 'ArrowUp', 'ArrowDown'].includes(event.key)) event.preventDefault();
    };
    const keyUp = (event) => {
      if (['w', 'W', 's', 'S', 'ArrowUp', 'ArrowDown'].includes(event.key)) setIntent(0);
    };
    const pointerDown = (event) => {
      runtime.dragging = true;
      runtime.lastX = event.clientX;
      runtime.lastY = event.clientY;
      renderer.domElement.setPointerCapture?.(event.pointerId);
    };
    const pointerMove = (event) => {
      if (!runtime.dragging) return;
      runtime.yawOffset -= (event.clientX - runtime.lastX) * .004;
      runtime.pitch = THREE.MathUtils.clamp(runtime.pitch - (event.clientY - runtime.lastY) * .003, -.92, .92);
      runtime.lastX = event.clientX;
      runtime.lastY = event.clientY;
    };
    const pointerUp = (event) => {
      runtime.dragging = false;
      renderer.domElement.releasePointerCapture?.(event.pointerId);
    };
    renderer.domElement.addEventListener('keydown', keyDown);
    renderer.domElement.addEventListener('keyup', keyUp);
    renderer.domElement.addEventListener('pointerdown', pointerDown);
    renderer.domElement.addEventListener('pointermove', pointerMove);
    renderer.domElement.addEventListener('pointerup', pointerUp);
    renderer.domElement.addEventListener('pointercancel', pointerUp);

    let frame = 0;
    let previous = performance.now();
    let lastStopIndex = -1;
    const animate = (now) => {
      frame = requestAnimationFrame(animate);
      const delta = Math.min((now - previous) / 1000, .04);
      previous = now;
      runtime.progress = THREE.MathUtils.clamp(runtime.progress + runtime.intent * delta * .035, 0, 1);
      const point = curve.getPointAt(runtime.progress);
      const tangent = curve.getTangentAt(Math.min(.999, runtime.progress + .002)).normalize();
      camera.position.copy(point);
      const baseYaw = Math.atan2(tangent.x, -tangent.z);
      const yaw = baseYaw + runtime.yawOffset;
      const look = new THREE.Vector3(Math.sin(yaw) * Math.cos(runtime.pitch), Math.sin(runtime.pitch), -Math.cos(yaw) * Math.cos(runtime.pitch));
      camera.lookAt(point.clone().add(look));
      renderer.render(world, camera);
      const stopIndex = Math.min(routeStops.length - 1, Math.round(runtime.progress * (routeStops.length - 1)));
      if (stopIndex !== lastStopIndex) {
        lastStopIndex = stopIndex;
        const stop = routeStops[stopIndex];
        setCurrentStop(stop);
        onSceneChange?.(stop.id);
      }
      setProgress((previousProgress) => Math.abs(previousProgress - runtime.progress) > .002 ? runtime.progress : previousProgress);
    };
    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      renderer.domElement.removeEventListener('keydown', keyDown);
      renderer.domElement.removeEventListener('keyup', keyUp);
      renderer.domElement.removeEventListener('pointerdown', pointerDown);
      renderer.domElement.removeEventListener('pointermove', pointerMove);
      renderer.domElement.removeEventListener('pointerup', pointerUp);
      renderer.domElement.removeEventListener('pointercancel', pointerUp);
      brickTexture.dispose();
      world.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => material.dispose());
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
      runtimeRef.current = null;
    };
  }, [onSceneChange]);

  const beginMove = (direction) => {
    if (!runtimeRef.current) return;
    runtimeRef.current.intent = direction;
    setMoving(true);
    runtimeRef.current.renderer.domElement.focus();
  };
  const endMove = () => {
    if (!runtimeRef.current) return;
    runtimeRef.current.intent = 0;
    setMoving(false);
  };

  return (
    <div className="vt-model" ref={mountRef}>
      <div className="vt-model-status">
        <small>TRUE 3D WALK MODE · INTERPRETIVE RECONSTRUCTION</small>
        <b>{currentStop.label}</b>
        <i><span style={{ width: `${Math.round(progress * 100)}%` }} /></i>
      </div>
      <div className="vt-model-controls" aria-label="Walk controls">
        <button type="button" onPointerDown={() => beginMove(-1)} onPointerUp={endMove} onPointerLeave={endMove}><span>↓</span><b>HOLD TO WALK BACK</b></button>
        <button type="button" className={moving ? 'is-moving' : ''} onPointerDown={() => beginMove(1)} onPointerUp={endMove} onPointerLeave={endMove}><span>↑</span><b>HOLD TO WALK FORWARD</b></button>
      </div>
      <div className="vt-model-help">HOLD W / S TO WALK · DRAG TO LOOK · CAMERA CHANGES HEIGHT ON STAIRS</div>
    </div>
  );
});

export default ModelWalkthrough;
