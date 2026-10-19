"""Author a periodic fluted-wood PBR material from equations at native 4096px.

This does not edit, enlarge, or sample any existing image. The seven finishes
share geometry and grain; they are designed visualization assets, not scans.
"""
from pathlib import Path
import hashlib
import json
import zipfile
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public/assets/material-studio/fluted-wood'
PACKAGES = ROOT / 'outputs/fluted-material-packages-v1'
N = 4096
PREVIEW = 768
FINISHES = [
    ('natural-oak', 'Natural oak', (185, 139, 87), .57),
    ('light-oak', 'Light oak', (215, 188, 147), .61),
    ('walnut', 'Walnut tone', (105, 68, 45), .49),
    ('smoked-oak', 'Smoked oak', (121, 103, 84), .59),
    ('grey-oak', 'Grey oak', (158, 156, 145), .64),
    ('charcoal', 'Charcoal black', (49, 47, 43), .53),
    ('white', 'White wood', (226, 223, 213), .62),
]

def lattice(nx, ny, seed):
    """Periodic value noise evaluated directly at the target sampling rate."""
    rng = np.random.default_rng(seed)
    grid = rng.uniform(-1, 1, (ny, nx)).astype(np.float32)
    x = np.linspace(0, nx, N, endpoint=False, dtype=np.float32)
    y = np.linspace(0, ny, N, endpoint=False, dtype=np.float32)
    ix, iy = x.astype(int), y.astype(int)
    fx, fy = x - ix, y - iy
    fx = fx * fx * (3 - 2 * fx)
    fy = fy * fy * (3 - 2 * fy)
    a = grid[iy[:, None] % ny, ix[None, :] % nx]
    b = grid[iy[:, None] % ny, (ix[None, :] + 1) % nx]
    c = grid[(iy[:, None] + 1) % ny, ix[None, :] % nx]
    d = grid[(iy[:, None] + 1) % ny, (ix[None, :] + 1) % nx]
    return ((a * (1-fx) + b * fx) * (1-fy[:, None]) + (c * (1-fx) + d * fx) * fy[:, None]).astype(np.float32)

def save8(path, data):
    Image.fromarray(np.clip(data * 255, 0, 255).astype(np.uint8)).save(path, compress_level=4)

def main():
    OUT.mkdir(parents=True, exist_ok=True)
    PACKAGES.mkdir(parents=True, exist_ok=True)
    shared = OUT / 'shared'; shared.mkdir(exist_ok=True)
    # Distorted longitudinal growth rings, multi-scale fibers and small pores.
    u = np.arange(N, dtype=np.float32)[None, :] / N
    v = np.arange(N, dtype=np.float32)[:, None] / N
    warp = .8*lattice(7, 3, 41) + .28*lattice(17, 5, 82)
    rings = np.sin(2*np.pi * (u*167 + warp))
    fibers = np.sin(2*np.pi * (u*487 + warp*2.8 + .12*lattice(43, 9, 59)))
    broad = lattice(32, 4, 117)
    fine = lattice(641, 139, 32)
    grain = .46*broad + .21*rings + .10*fibers + .045*fine
    pores = np.maximum(lattice(900, 120, 222) - .31, 0)**2
    # An explicitly authored 20mm pitch, rounded 4mm relief profile.
    profile = (.5 + .5*np.cos(2*np.pi*u*24))**.36
    height = np.broadcast_to(profile, (N, N)).copy() * .004
    height += (.000045 * fibers + .000035 * fine - .0002 * pores)
    dx = (np.roll(height, -1, 1)-np.roll(height, 1, 1)) / (2*.48/N)
    dy = (np.roll(height, -1, 0)-np.roll(height, 1, 0)) / (2*.48/N)
    norm = np.sqrt(dx*dx+dy*dy+1)
    normal = np.stack((-dx/norm, dy/norm, 1/norm), axis=-1)
    save8(shared/'normal-opengl-4k.png', normal*.5+.5)
    h = np.clip((height+.00025)/.0045, 0, 1)
    Image.fromarray((h*65535).astype(np.uint16)).save(shared/'height-16bit-4k.png')
    # A presentation render: illumination is separate from the albedo.
    light = np.array([-.88, .08, .468], np.float32)
    shading = (np.clip(np.sum(normal*light, axis=-1), 0, 1)*.70+.35) * (.78+.22*profile)
    records = []
    for slug, name, rgb, rough in FINISHES:
        folder = OUT/slug; folder.mkdir(exist_ok=True)
        color = np.array(rgb, np.float32)/255
        modulation = 1 + grain*.24 - pores*.38
        albedo = np.clip(modulation[..., None]*color[None, None, :], 0, 1)
        save8(folder/'basecolor-4k.png', albedo)
        roughness = np.clip(rough + .06*broad + .055*pores + .018*fine, .1, .95)
        save8(folder/'roughness-4k.png', roughness)
        render = np.clip(albedo*shading[..., None], 0, 1)
        Image.fromarray((render*255).astype(np.uint8)).resize((PREVIEW, PREVIEW), Image.Resampling.LANCZOS).save(folder/'preview.webp', quality=93)
        manifest = {
            'id': slug, 'name': name, 'version': 1,
            'creator': 'World Arch Journal / procedural material authoring',
            'method': 'Original periodic procedural equations sampled at 4096x4096; no raster upscaling or third-party texture input.',
            'resolution': [N, N], 'sourceResolution': 'resolution-independent procedural source',
            'physicalTileMeters': [.48, .48], 'flutePitchMeters': .02,
            'heightRangeMeters': [-.00025, .00425], 'metallic': 0,
            'notes': 'Designed visualization material. Finish names describe appearance; not a scan or certified commercial product. Maps use UV +V upward. Repeat with linear/mipmap filtering.',
            'license': 'Use and modify these exported maps in personal and commercial design/rendering projects. No manufacturer affiliation or physical-product warranty.',
            'maps': {'baseColor': {'file':'basecolor-4k.png','colorSpace':'sRGB'}, 'roughness':{'file':'roughness-4k.png','colorSpace':'linear'}, 'normal':{'file':'normal-opengl-4k.png','colorSpace':'linear','convention':'OpenGL +Y'}, 'height':{'file':'height-16bit-4k.png','colorSpace':'linear','bitDepth':16}},
        }
        files = {'basecolor-4k.png':folder/'basecolor-4k.png','roughness-4k.png':folder/'roughness-4k.png','normal-opengl-4k.png':shared/'normal-opengl-4k.png','height-16bit-4k.png':shared/'height-16bit-4k.png'}
        manifest['sha256'] = {name:hashlib.sha256(path.read_bytes()).hexdigest() for name,path in files.items()}
        (folder/'manifest.json').write_text(json.dumps(manifest, indent=2), encoding='utf-8')
        with zipfile.ZipFile(PACKAGES/f'waj-fluted-{slug}-4k.zip', 'w', zipfile.ZIP_STORED) as bundle:
            for filename,path in files.items(): bundle.write(path, filename)
            bundle.write(folder/'manifest.json','manifest.json')
            bundle.write(Path(__file__), 'source/build-fluted-materials.py')
        for path in files.values():
            with Image.open(path) as image: assert image.size == (N,N), path
        edge_x = float(np.mean(abs(albedo[:,0]-albedo[:,-1])))
        edge_y = float(np.mean(abs(albedo[0]-albedo[-1])))
        records.append({'id':slug,'name':name,'rgb':rgb,'size':(PACKAGES/f'waj-fluted-{slug}-4k.zip').stat().st_size,'edgeMeanDifference01':[edge_x,edge_y]})
        print(f'{slug}: 4 maps at {N}x{N}, archive ready', flush=True)
    (OUT/'production-report.json').write_text(json.dumps({'dimensionsVerified':True,'method':'native procedural evaluation','finishes':records},indent=2), encoding='utf-8')
    (shared/'build-fluted-materials.py').write_text(Path(__file__).read_text(encoding='utf-8'),encoding='utf-8')

if __name__ == '__main__': main()
