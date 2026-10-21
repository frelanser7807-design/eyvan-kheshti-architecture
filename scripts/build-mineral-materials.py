"""Original periodic procedural visualisation maps; no manufacturer scans."""
import hashlib
import json
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1] / 'public/assets/material-studio/mineral'
SIZE = 4096
FAMILIES = {
    'exposed-concrete': [('natural-grey', (165,164,156)), ('warm-grey', (179,170,154)), ('light-cement', (206,206,196)), ('sandstone', (188,169,140)), ('graphite', (99,103,98))],
    'microcement': [('warm-ivory', (222,214,196)), ('soft-greige', (182,175,162)), ('clay', (187,150,129)), ('sage', (164,173,156)), ('charcoal', (104,107,103))],
}

def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def save_png(image, path):
    temporary = path.with_suffix('.png.tmp')
    image.save(temporary, format='PNG')
    with Image.open(temporary) as check:
        check.load()
    temporary.replace(path)

def generate(family, finishes, seed):
    folder = ROOT / family
    shared = folder / 'shared'
    shared.mkdir(parents=True, exist_ok=True)
    rng = np.random.default_rng(seed)
    axis = np.arange(SIZE, dtype=np.float32) / SIZE * (2 * np.pi)
    field = np.zeros((SIZE, SIZE), dtype=np.float32)
    # Integer spatial frequencies form a periodic tile, including trowel bands.
    for k in range(1, 13):
        fx, fy = rng.integers(1, 18, size=2)
        phase = rng.random() * 2 * np.pi
        field += np.sin(axis[:, None] * fy + axis[None, :] * fx + phase) / (k ** .85)
    field /= max(float(np.max(np.abs(field))), 1)
    grain = rng.normal(0, 1, (SIZE, SIZE)).astype(np.float32)
    for _ in range(4):
        grain = (grain + np.roll(grain, 1, 0) + np.roll(grain, -1, 0) + np.roll(grain, 1, 1) + np.roll(grain, -1, 1)) / 5
    height = field * (.12 if family == 'exposed-concrete' else .055) + grain * .007
    if family == 'exposed-concrete':
        for _ in range(2600):
            cx, cy = rng.integers(0, SIZE, size=2)
            radius = int(rng.integers(2, 11))
            offsets = np.arange(-radius, radius + 1)
            radial = np.maximum(0, 1 - (offsets[:, None] ** 2 + offsets[None, :] ** 2) / radius ** 2)
            height[np.ix_((cy + offsets) % SIZE, (cx + offsets) % SIZE)] -= radial * .22
    hx = (np.roll(height, -1, 1) - np.roll(height, 1, 1)) * 5
    hy = (np.roll(height, -1, 0) - np.roll(height, 1, 0)) * 5
    length = np.sqrt(hx * hx + hy * hy + 1)
    normal = np.stack((-hx / length, hy / length, 1 / length), axis=-1)
    save_png(Image.fromarray(np.uint8(np.clip((normal * .5 + .5) * 255, 0, 255))), shared / 'normal-opengl-4k.png')
    roughness = np.uint8(np.clip((.78 if family == 'exposed-concrete' else .62) + field * .07 + grain * .015, 0, 1) * 255)
    save_png(Image.fromarray(roughness), shared / 'roughness-4k.png')
    save_png(Image.fromarray(np.uint16(np.round(np.clip(height + .5, 0, 1) * 8191) * 8)), shared / 'height-4k.png')
    # A small GPU preview avoids uploading 4K textures to mobile just to browse.
    for filename in ['normal-opengl', 'roughness']:
        with Image.open(shared / f'{filename}-4k.png') as im:
            im.resize((1024,1024), Image.Resampling.LANCZOS).save(shared / f'{filename}-preview.png')
    for finish, rgb in finishes:
        target = folder / finish
        target.mkdir(exist_ok=True)
        variation = field * 10 + grain * 1.6 + height * 18
        color = np.uint8(np.clip(np.array(rgb, dtype=np.float32)[None,None,:] + variation[:,:,None], 0, 255))
        image = Image.fromarray(color)
        save_png(image, target / 'basecolor-4k.png')
        image.resize((1024,1024), Image.Resampling.LANCZOS).save(target / 'preview.webp', quality=88)
        files = {'basecolor-4k.png': target / 'basecolor-4k.png', **{name: shared / name for name in ['normal-opengl-4k.png','roughness-4k.png','height-4k.png']}}
        manifest = {'family': family, 'finish': finish, 'resolution': [4096,4096], 'repeat_mm': [1200,1200], 'normal_convention': 'OpenGL', 'height': '16-bit relative displacement; choose strength for the scene', 'provenance': 'Original World Arch Journal procedural visualisation study; not a physical product or scan.', 'license': 'Free for personal and commercial visualisation; do not resell the maps as a standalone texture pack.', 'files': [{'name': name, 'url': '/' + str(p.relative_to(ROOT.parents[2])), 'sha256': digest(p)} for name,p in files.items()]}
        (target / 'manifest.json').write_text(json.dumps(manifest, indent=2))
    print(f'Generated {family}: {len(finishes)} finishes and verified 4K maps')

for seed, (family, finishes) in enumerate(FAMILIES.items(), start=912):
    generate(family, finishes, seed)

# Finalise manifests only after every surface has been written. This is also
# the publication boundary: checksums always describe the final on-disk maps.
for manifest_path in ROOT.rglob('manifest.json'):
    manifest = json.loads(manifest_path.read_text())
    for file in manifest['files']:
        source = ROOT.parents[2] / file['url'].lstrip('/')
        if source.stat().st_size >= 25 * 1024 * 1024:
            raise ValueError(f'Map exceeds the hosting limit: {source}')
        file['sha256'] = digest(source)
    manifest_path.write_text(json.dumps(manifest, indent=2))
