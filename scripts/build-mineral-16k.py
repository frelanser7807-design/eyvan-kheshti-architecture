"""Stream 16K seamless tiled PNG editions into hosting-safe parts."""
import hashlib
import json
from pathlib import Path
import struct
import zlib

import numpy as np
from PIL import Image

PUBLIC = Path(__file__).resolve().parents[1] / 'public'
ROOT = PUBLIC / 'assets/material-studio/mineral'
LIMIT = 8 * 1024 * 1024

class Parts:
    def __init__(self, target, name):
        self.target, self.name = target, name
        target.mkdir(parents=True, exist_ok=True)
        self.buffer, self.parts = bytearray(), []
        self.hash, self.size = hashlib.sha256(), 0

    def write(self, data):
        self.hash.update(data)
        self.size += len(data)
        while data:
            count = min(LIMIT - len(self.buffer), len(data))
            self.buffer.extend(data[:count])
            data = data[count:]
            if len(self.buffer) == LIMIT:
                self.flush()

    def flush(self):
        if not self.buffer:
            return
        path = self.target / f'{self.name}.part-{len(self.parts):03d}'
        path.write_bytes(self.buffer)
        self.parts.append({'url': '/' + str(path.relative_to(PUBLIC)), 'sha256': hashlib.sha256(self.buffer).hexdigest(), 'bytes': len(self.buffer)})
        self.buffer.clear()

    def finish(self):
        self.flush()
        return {'name': self.name, 'sha256': self.hash.hexdigest(), 'bytes': self.size, 'parts': self.parts}

def chunk(out, kind, data):
    out.write(struct.pack('>I', len(data)) + kind + data + struct.pack('>I', zlib.crc32(kind + data) & 0xffffffff))

def tiled_png(source, target, name):
    record_path = target / f'{name}.json'
    source_hash = hashlib.sha256(source.read_bytes()).hexdigest()
    if record_path.exists():
        cached = json.loads(record_path.read_text())
        if cached.get('source_sha256') == source_hash and all((PUBLIC / part['url'].lstrip('/')).exists() and hashlib.sha256((PUBLIC / part['url'].lstrip('/')).read_bytes()).hexdigest() == part['sha256'] for part in cached['parts']):
            return cached
    with Image.open(source) as image:
        if image.mode in ('I;16', 'I;16B', 'I'):
            pixels = np.asarray(image, dtype='>u2')
            depth, color_type = 16, 0
        elif image.mode == 'L':
            pixels = np.asarray(image)
            depth, color_type = 8, 0
        else:
            pixels = np.asarray(image.convert('RGB'))
            depth, color_type = 8, 2
    out = Parts(target, name)
    out.write(b'\x89PNG\r\n\x1a\n')
    chunk(out, b'IHDR', struct.pack('>IIBBBBB', 16384, 16384, depth, color_type, 0, 0, 0))
    compressor = zlib.compressobj(6)
    previous = np.zeros(pixels[0].nbytes * 4, dtype=np.uint8)
    for index in range(16384):
        row = np.frombuffer(pixels[index % 4096].tobytes() * 4, dtype=np.uint8)
        filtered = np.subtract(row, previous, dtype=np.uint8)
        encoded = compressor.compress(b'\x02' + filtered.tobytes())
        if encoded:
            chunk(out, b'IDAT', encoded)
        previous = row
    chunk(out, b'IDAT', compressor.flush())
    chunk(out, b'IEND', b'')
    record = {**out.finish(), 'source_sha256': source_hash}
    record_path.write_text(json.dumps(record, indent=2))
    return record

for source in ROOT.glob('*/*/*.png'):
    with Image.open(source) as check:
        check.verify()

for family in ('exposed-concrete', 'microcement'):
    folder = ROOT / family
    shared = [tiled_png(folder / 'shared' / filename, folder / '16k/shared', filename.replace('4k','16k')) for filename in ('normal-opengl-4k.png', 'roughness-4k.png', 'height-4k.png')]
    for manifest_path in sorted(folder.glob('*/manifest.json')):
        manifest = json.loads(manifest_path.read_text())
        finish = manifest_path.parent.name
        color = tiled_png(manifest_path.parent / 'basecolor-4k.png', folder / f'16k/{finish}', 'basecolor-16k.png')
        edition = {**{key:value for key,value in manifest.items() if key != 'files'}, 'resolution': [16384,16384], 'source_resolution': [4096,4096], 'source_repeats': [4,4], 'repeat_mm': [4800,4800], 'edition': '16K seamless tiled edition of the original 4K study; no additional scan detail.', 'files': [color, *shared]}
        (manifest_path.parent / 'manifest-16k.json').write_text(json.dumps(edition, indent=2))
    print(f'Generated {family}: verified 16384 × 16384 tiled PNG editions', flush=True)
