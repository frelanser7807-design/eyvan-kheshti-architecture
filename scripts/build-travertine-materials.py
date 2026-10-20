"""Original periodic procedural material maps, directly sampled at 4096².
Not an upscale, quarry scan, or a certified physical product.
"""
from pathlib import Path
import hashlib, json
import numpy as np
from PIL import Image

ROOT=Path('public/assets/material-studio/travertine')
SHARED=ROOT/'shared'; SHARED.mkdir(parents=True,exist_ok=True)
N=4096
x=np.arange(N,dtype=np.float32)[None,:]/N
y=np.arange(N,dtype=np.float32)[:,None]/N
tau=np.float32(2*np.pi)
rng=np.random.default_rng(19741)
warp=.009*np.sin(tau*(x*2+y*3))+.004*np.sin(tau*(x*5-y*2))
bands=np.zeros((N,N),dtype=np.float32)
for f,a in [(12,.23),(29,.18),(57,.12),(113,.07),(237,.035)]:
    bands+=a*np.sin(tau*(y*f+warp*f)+rng.uniform(0,tau))
cloud=np.zeros_like(bands)
for i in range(22):
    fx=int(rng.integers(3,80));fy=int(rng.integers(8,180))
    cloud+=np.sin(tau*(x*fx+y*fy)+rng.uniform(0,tau))/22
fine=rng.normal(0,1,(N,N)).astype(np.float32)
pores=np.maximum(0,cloud+.11*bands-.20)*4
pores=np.clip(pores,0,.7)
height=np.clip(.52+.035*bands-.5*pores+.004*np.sin(tau*(x*369+y*217)),0,1)
dy,dx=(np.roll(height,-1,0)-np.roll(height,1,0)),(np.roll(height,-1,1)-np.roll(height,1,1))
normal=np.stack((-dx*1.8,dy*1.8,np.ones_like(height)),axis=-1)
normal/=np.linalg.norm(normal,axis=-1,keepdims=True)
Image.fromarray(np.uint8(np.clip(normal*.5+.5,0,1)*255)).save(SHARED/'normal-opengl-4k.png')
Image.fromarray(np.uint16(height*65535)).save(SHARED/'height-16bit-4k.png')
rough=np.clip(.64+.20*pores+.03*cloud+.012*fine,0,1)
Image.fromarray(np.uint8(rough*255)).save(SHARED/'roughness-4k.png')
palette={'ivory':(222,211,190),'cream':(203,183,151),'sand':(183,157,121),'silver':(164,164,157),'walnut':(136,112,89)}
for name,rgb in palette.items():
    folder=ROOT/name;folder.mkdir(exist_ok=True)
    tone=1+.10*bands+.10*cloud-.27*pores+.006*fine
    color=np.uint8(np.clip(tone[:,:,None]*np.array(rgb,dtype=np.float32),0,255))
    image=Image.fromarray(color);image.save(folder/'basecolor-4k.png')
    image.resize((512,512),Image.Resampling.LANCZOS).save(folder/'preview.webp',quality=92)
    files={'basecolor-4k.png':folder/'basecolor-4k.png',**{n:SHARED/n for n in ['normal-opengl-4k.png','roughness-4k.png','height-16bit-4k.png']}}
    manifest={'id':'travertine-'+name,'name':name.title()+' travertine study','resolution':[N,N],'method':'Original periodic procedural material sampled directly at 4096 x 4096; no image enlargement.','tileMeters':[1.2,1.2],'normalConvention':'OpenGL +Y','heightBitDepth':16,'license':'Original digital material for personal and commercial visualization. Not a manufacturer scan or specification.','sha256':{n:hashlib.sha256(p.read_bytes()).hexdigest() for n,p in files.items()}}
    (folder/'manifest.json').write_text(json.dumps(manifest,indent=2),encoding='utf-8')
    print(name,flush=True)

