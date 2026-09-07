import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

function box(group, geometryCache, material, size, position, rotation = [0, 0, 0]) {
  const key = size.join('x');
  if (!geometryCache.has(key)) geometryCache.set(key, new THREE.BoxGeometry(...size));
  const mesh = new THREE.Mesh(geometryCache.get(key), material);
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  group.add(mesh);
  return mesh;
}

function buildVilla(scene) {
  const geometries = new Map();
  const materials = {
    stone: new THREE.MeshStandardMaterial({ color: 0x8a725d, roughness: 0.82, metalness: 0.02 }),
    pale: new THREE.MeshStandardMaterial({ color: 0xc6aa89, roughness: 0.74 }),
    dark: new THREE.MeshStandardMaterial({ color: 0x171513, roughness: 0.68 }),
    glass: new THREE.MeshPhysicalMaterial({ color: 0x172125, roughness: 0.08, metalness: 0.08, transparent: true, opacity: 0.72 }),
    glow: new THREE.MeshStandardMaterial({ color: 0xd6a361, emissive: 0xd68834, emissiveIntensity: 2.2, roughness: 0.4 }),
    water: new THREE.MeshPhysicalMaterial({ color: 0x17292c, roughness: 0.12, metalness: 0.18, transparent: true, opacity: 0.83 }),
  };

  const villa = new THREE.Group();
  villa.position.y = -0.35;
  scene.add(villa);

  box(villa, geometries, materials.stone, [15, 0.36, 9], [0, 0, 0]);
  box(villa, geometries, materials.dark, [5.8, 3.5, 7.5], [-4.2, 1.9, -0.2]);
  box(villa, geometries, materials.stone, [0.48, 3.7, 7.8], [-7.1, 2, -0.2]);
  box(villa, geometries, materials.pale, [6.5, 0.5, 8.2], [-4.1, 4, -0.15]);
  box(villa, geometries, materials.pale, [7.2, 0.46, 6.2], [3.6, 3.25, -0.8]);
  box(villa, geometries, materials.stone, [0.46, 3.2, 6.1], [6.95, 1.65, -0.8]);
  box(villa, geometries, materials.stone, [0.5, 3.2, 6.1], [0.15, 1.65, -0.8]);
  box(villa, geometries, materials.glass, [6.35, 2.7, 0.18], [3.55, 1.55, 2.2]);
  box(villa, geometries, materials.glass, [0.18, 2.7, 5.2], [0.42, 1.55, -0.55]);
  box(villa, geometries, materials.glow, [5.8, 0.06, 0.05], [3.55, 0.5, 2.32]);
  box(villa, geometries, materials.glow, [0.05, 0.06, 4.7], [0.54, 0.5, -0.4]);

  for (let i = 0; i < 5; i += 1) {
    box(villa, geometries, materials.stone, [1.8, 0.22, 5.4 - i * 0.45], [7.3 + i * 0.86, 0.08 + i * 0.22, 0.6]);
  }

  const water = box(villa, geometries, materials.water, [13, 0.08, 7.5], [0.5, -0.15, 8.5]);
  box(villa, geometries, materials.dark, [2.8, 0.08, 2.8], [-1.75, 0.24, -0.15]);

  const treeGeometry = new THREE.IcosahedronGeometry(0.75, 1);
  const trunkGeometry = new THREE.CylinderGeometry(0.08, 0.13, 1.6, 6);
  const leafMaterial = new THREE.MeshStandardMaterial({ color: 0x49503b, roughness: 0.95 });
  const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x4c3828, roughness: 1 });
  const treePositions = [[-1.7, 0.3, -0.1], [8.7, 0.25, -3.8], [-8.9, 0.25, 4.2]];
  treePositions.forEach(([x, y, z], index) => {
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.set(x, y + 0.8, z);
    villa.add(trunk);
    const crown = new THREE.Mesh(treeGeometry, leafMaterial);
    crown.scale.set(1 + index * 0.22, 1.45, 1 + index * 0.12);
    crown.position.set(x, y + 2, z);
    villa.add(crown);
  });

  const dustGeometry = new THREE.BufferGeometry();
  const points = [];
  for (let i = 0; i < 420; i += 1) points.push((Math.random() - 0.5) * 36, Math.random() * 11, (Math.random() - 0.5) * 34);
  dustGeometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
  const dustMaterial = new THREE.PointsMaterial({ color: 0xd6bc98, size: 0.025, transparent: true, opacity: 0.34, depthWrite: false });
  const dust = new THREE.Points(dustGeometry, dustMaterial);
  scene.add(dust);

  return { villa, water, materials, geometries, dust, dustGeometry, dustMaterial, treeGeometry, trunkGeometry, leafMaterial, trunkMaterial };
}

export default function CinematicScene({ onSceneChange }) {
  const canvasRef = useRef(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: 'high-performance' });
    } catch {
      setFailed(true);
      return undefined;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 700 ? 1.15 : 1.65));
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.88;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b0a09);
    scene.fog = new THREE.FogExp2(0x0b0a09, 0.027);
    const camera = new THREE.PerspectiveCamera(39, window.innerWidth / window.innerHeight, 0.1, 100);

    const world = buildVilla(scene);
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(90, 90),
      new THREE.MeshStandardMaterial({ color: 0x0c0b09, roughness: 1 }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.55;
    scene.add(floor);

    const hemisphere = new THREE.HemisphereLight(0xb8c4cf, 0x332317, 1.55);
    const sun = new THREE.DirectionalLight(0xffc98e, 4.4);
    sun.position.set(-9, 11, 8);
    const interior = new THREE.PointLight(0xffa347, 22, 16, 1.4);
    interior.position.set(2.7, 2, -0.6);
    const rim = new THREE.DirectionalLight(0x8293aa, 1.6);
    rim.position.set(12, 5, -12);
    scene.add(hemisphere, sun, interior, rim);

    const cameraCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(15, 6.6, 18),
      new THREE.Vector3(8.5, 3.2, 9.5),
      new THREE.Vector3(-8.8, 3.5, 7.2),
      new THREE.Vector3(3.2, 2.05, 3.8),
      new THREE.Vector3(0.5, 11.8, 16.5),
    ], false, 'catmullrom', 0.2);
    const lookCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 1.5, 0),
      new THREE.Vector3(0.3, 1.5, -0.2),
      new THREE.Vector3(-1.8, 1.7, -0.4),
      new THREE.Vector3(1.9, 1.4, -1.2),
      new THREE.Vector3(0, 0.2, 0),
    ]);

    let targetProgress = 0;
    let currentProgress = 0;
    let pointerX = 0;
    let pointerY = 0;
    let frame = 0;
    let lastScene = -1;
    let hidden = document.hidden;
    const cameraPosition = new THREE.Vector3();
    const lookAt = new THREE.Vector3();

    const updateScroll = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      targetProgress = THREE.MathUtils.clamp(window.scrollY / max, 0, 1);
      const sceneIndex = Math.min(4, Math.round(targetProgress * 4));
      if (sceneIndex !== lastScene) {
        lastScene = sceneIndex;
        onSceneChange?.(sceneIndex);
      }
    };
    const updatePointer = (event) => {
      pointerX = (event.clientX / window.innerWidth - 0.5) * 0.35;
      pointerY = (event.clientY / window.innerHeight - 0.5) * 0.18;
    };
    const resize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 700 ? 1.15 : 1.65));
      renderer.setSize(window.innerWidth, window.innerHeight, false);
    };
    const visibility = () => { hidden = document.hidden; };

    function animate(time) {
      frame = requestAnimationFrame(animate);
      if (hidden) return;
      currentProgress = reducedMotion ? targetProgress : THREE.MathUtils.lerp(currentProgress, targetProgress, 0.055);
      cameraCurve.getPointAt(currentProgress, cameraPosition);
      lookCurve.getPointAt(currentProgress, lookAt);
      camera.position.copy(cameraPosition);
      if (!reducedMotion) {
        camera.position.x += pointerX;
        camera.position.y -= pointerY;
      }
      camera.lookAt(lookAt);
      world.villa.rotation.y = Math.sin(currentProgress * Math.PI) * 0.055;
      world.water.position.y = -0.15 + Math.sin(time * 0.00065) * 0.018;
      world.dust.rotation.y = time * 0.000015;
      interior.intensity = 18 + Math.sin(time * 0.0012) * 2.5;
      scene.fog.density = THREE.MathUtils.lerp(0.029, 0.021, currentProgress);
      renderer.render(scene, camera);
    }

    updateScroll();
    window.addEventListener('scroll', updateScroll, { passive: true });
    window.addEventListener('pointermove', updatePointer, { passive: true });
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', visibility);
    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', updateScroll);
      window.removeEventListener('pointermove', updatePointer);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', visibility);
      world.geometries.forEach((geometry) => geometry.dispose());
      Object.values(world.materials).forEach((material) => material.dispose());
      world.dustGeometry.dispose();
      world.dustMaterial.dispose();
      world.treeGeometry.dispose();
      world.trunkGeometry.dispose();
      world.leafMaterial.dispose();
      world.trunkMaterial.dispose();
      floor.geometry.dispose();
      floor.material.dispose();
      renderer.dispose();
    };
  }, [onSceneChange]);

  return (
    <div className={'cinematic-world ' + (failed ? 'is-fallback' : '')} aria-hidden="true">
      <canvas ref={canvasRef} />
      <div className="fallback-architecture">
        <span className="fallback-slab slab-one" />
        <span className="fallback-slab slab-two" />
        <span className="fallback-window" />
      </div>
      <div className="atmosphere" />
      <div className="film-grain" />
      <div className="vignette" />
    </div>
  );
}
