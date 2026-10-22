const sceneRoot = '/assets/material-studio/mineral/scenes/';
const scene = (id, title) => ({ id, title, src: `${sceneRoot}${id}.webp` });
// Each color has its own reviewed architectural image; no browser tint masks.
export const materialScenes = {
  'exposed-concrete': [
    scene('concrete-villa', 'Villa entrance'),
    scene('concrete-courtyard', 'Reflecting courtyard'),
    scene('concrete-interior', 'Dining gallery'),
  ],
  microcement: [
    scene('microcement-living', 'Quiet living'),
    scene('microcement-kitchen', 'Walnut kitchen'),
    scene('microcement-bathroom', 'Mineral spa'),
  ],
};
export function sceneImage(scene, material, finish) {
  return finish.id === material.finishes[0].id ? scene.src : `${sceneRoot}${scene.id}-${finish.id}.webp`;
}
