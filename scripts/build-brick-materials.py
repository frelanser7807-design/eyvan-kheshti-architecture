"""Original periodic masonry maps sampled directly at 4096²; not scans."""
from pathlib import Path
import hashlib, json
import numpy as np
from PIL import Image

ROOT = Path('public/assets/material-studio/brick')
SHARED = ROOT / 'shared'
SHARED.mkdir(parents=True, exist_ok=True)
N = 4096
x = np.arange(N, dtype=np.float32)[None, :] / N
y = np.arange(N, dtype=np.float32)[:, None] / N
row = np.floor(y * 16).astype(int)
u = (x * 5 + (row % 2) * .5) % 1
v = (y * 16) % 1
edge = np.minimum(np.minimum(u, 1-u) / .025, np.minimum(v, 1-v) / .075)
brick = np.clip(edge, 0, 1)
brick = brick * brick * (3 - 2 * brick)
col = np.floor(x * 5 + (row % 2) * .5).astype(int) % 5
rng = np.random.default_rng(82471)
variation = rng.uniform(-.13,.13,(16,5)).astype(np.float32)[row % 16,col]
tau = np.float32(2*np.pi)
grain = np.zeros((N,N),np.float32)
for fx,fy,a in [(71,53,.35),(137,89,.22),(293,211,.13),(511,367,.08),(827,613,.05)]:
    grain += a*np.sin(tau*(x*fx+y*fy))*np.cos(tau*(x*fy-y*fx))
height = np.clip(.14 + brick*(.57 + .022*grain + .035*variation),0,1)
dy=(np.roll(height,-1,0)-np.roll(height,1,0))*12
dx=(np.roll(height,-1,1)-np.roll(height,1,1))*12
normal=np.stack((-dx,dy,np.ones_like(height)),axis=-1)
normal/=np.linalg.norm(normal,axis=-1,keepdims=True)
Image.fromarray(np.uint8(np.clip(normal*.5+.5,0,1)*255)).save(SHARED/'normal-opengl-4k.png')
Image.fromarray(np.uint16(height*65535)).save(SHARED/'height-16bit.png')
rough=np.clip(.88-.12*brick+.035*grain,0,1)
Image.fromarray(np.uint8(rough*255)).save(SHARED/'roughness-4k.png')
for name,rgb in {'classic-red':(168,84,66),'terracotta':(183,110,78),'buff':(190,160,116),'weathered-brown':(122,90,72),'charcoal':(78,76,84)}.items():
    folder=ROOT/name;folder.mkdir(exist_ok=True)
    face=(1+variation+.075*grain)[:,:,None]*np.array(rgb,dtype=np.float32)
    mortar=(1+.035*grain)[:,:,None]*np.array([170,163,149],dtype=np.float32)
    color=np.uint8(np.clip(face*brick[:,:,None]+mortar*(1-brick[:,:,None]),0,255))
    img=Image.fromarray(color);img.save(folder/'basecolor-4k.png')
    img.resize((512,512),Image.Resampling.LANCZOS).save(folder/'preview.webp',quality=92)
    # Lightweight display maps; downloads retain the original 4K maps.
    img.resize((1024,1024),Image.Resampling.LANCZOS).save(folder/'display.webp',quality=92)
    files={'basecolor-4k.png':folder/'basecolor-4k.png',**{n:SHARED/n for n in ['normal-opengl-4k.png','roughness-4k.png','height-16bit.png']}}
    manifest={'id':'waj-brick-'+name,'resolution':[N,N],'method':'Original periodic procedural masonry, directly sampled at 4096 x 4096; no enlargement or manufacturer scan.','tileMeters':[1.2,1.2],'normalConvention':'OpenGL +Y','heightBitDepth':16,'license':'Personal and commercial visualization permitted. Not a certified physical product.','sha256':{n:hashlib.sha256(p.read_bytes()).hexdigest() for n,p in files.items()}}
    (folder/'manifest.json').write_text(json.dumps(manifest,indent=2),encoding='utf-8')
    print(name,flush=True)
for name in ['normal-opengl','roughness']:
    with Image.open(SHARED/(name+'-4k.png')) as img:
        img.resize((1024,1024),Image.Resampling.LANCZOS).save(SHARED/(name+'-display.png'))
