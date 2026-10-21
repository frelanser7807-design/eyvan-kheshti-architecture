# SUPERSEDED 2026-10-21 — the ceramic & porcelain panel now uses real
# photogrammetry scans (Poly Haven / ambientCG, CC0). Do NOT run: it would
# regenerate the rejected procedural assets. Kept for history only.
"""Original periodic procedural porcelain stoneware maps, directly sampled
at 4096 x 4096. Not an upscale, manufacturer scan, or a certified physical
product. Finish names describe color studies of real porcelain stoneware
families sold internationally as large-format slabs."""
from pathlib import Path
import hashlib, json
import numpy as np
from PIL import Image

ROOT=Path('public/assets/material-studio/ceramic-porcelain')
SHARED=ROOT/'shared'; SHARED.mkdir(parents=True,exist_ok=True)
N=4096
x=np.arange(N,dtype=np.float32)[None,:]/N
y=np.arange(N,dtype=np.float32)[:,None]/N
tau=np.float32(2*np.pi)
rng=np.random.default_rng(90210)
# Broad, soft tonal drift: the cloudy body of a honed porcelain slab.
cloud=np.zeros((N,N),dtype=np.float32)
for i in range(26):
    fx=int(rng.integers(2,26));fy=int(rng.integers(2,26))
    cloud+=np.sin(tau*(x*fx+y*fy)+rng.uniform(0,tau))/26
# A few long, faint mineral veins, kept subtle as in technical porcelain.
warp=.006*np.sin(tau*(x*2+y*3))+.003*np.sin(tau*(x*4-y*3))
veins=np.zeros_like(cloud)
for f,a in [(9,.16),(17,.11),(31,.06)]:
    veins+=a*np.sin(tau*(y*f+warp*f)+rng.uniform(0,tau))
# Fine homogeneous speckle of a full-body porcelain mix.
fine=rng.normal(0,1,(N,N)).astype(np.float32)
# Near-flat honed surface: micro variation only, no pores or relief pattern.
height=np.clip(.5+.010*cloud+.004*veins+.0012*fine,0,1)
dy,dx=(np.roll(height,-1,0)-np.roll(height,1,0)),(np.roll(height,-1,1)-np.roll(height,1,1))
normal=np.stack((-dx*.7,dy*.7,np.ones_like(height)),axis=-1)
normal/=np.linalg.norm(normal,axis=-1,keepdims=True)
Image.fromarray(np.uint8(np.clip(normal*.5+.5,0,1)*255)).save(SHARED/'normal-opengl-4k.png')
Image.fromarray(np.uint16(height*65535)).save(SHARED/'height-16bit-4k.png')
rough=np.clip(.52+.07*cloud+.02*veins+.006*fine,0,1)
Image.fromarray(np.uint8(rough*255)).save(SHARED/'roughness-4k.png')
palette={'alpine-white':(228,219,203),'warm-greige':(201,190,171),'silver-grey':(169,171,168),'graphite':(92,92,95),'terracotta':(176,124,96)}
for name,rgb in palette.items():
    folder=ROOT/name;folder.mkdir(exist_ok=True)
    tone=1+.055*cloud+.045*veins+.0025*fine
    color=np.uint8(np.clip(tone[:,:,None]*np.array(rgb,dtype=np.float32),0,255))
    image=Image.fromarray(color);image.save(folder/'basecolor-4k.png')
    image.resize((512,512),Image.Resampling.LANCZOS).save(folder/'preview.webp',quality=92)
    files={'basecolor-4k.png':folder/'basecolor-4k.png',**{n:SHARED/n for n in ['normal-opengl-4k.png','roughness-4k.png','height-16bit-4k.png']}}
    manifest={'id':'porcelain-stoneware-'+name,'name':name.replace('-',' ').title()+' porcelain stoneware study','resolution':[N,N],'method':'Original periodic procedural material sampled directly at 4096 x 4096; no image enlargement.','tileMeters':[1.2,1.2],'normalConvention':'OpenGL +Y','heightBitDepth':16,'license':'Original digital material for personal and commercial visualization. Not a manufacturer scan or specification.','sha256':{n:hashlib.sha256(p.read_bytes()).hexdigest() for n,p in files.items()}}
    (folder/'manifest.json').write_text(json.dumps(manifest,indent=2),encoding='utf-8')
    print(name,flush=True)
