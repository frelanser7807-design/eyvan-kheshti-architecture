"""Decode the shipped architectural previews before publication."""
from pathlib import Path
from PIL import Image

images = list(Path('dist/assets/material-studio/mineral/scenes').glob('*.webp'))
if len(images) < 30:
    raise ValueError(f'Expected 30 architectural finish previews, found {len(images)}')
for path in images:
    with Image.open(path) as image:
        image.load()
        if image.size != (1536, 1024):
            raise ValueError(f'Unexpected architectural preview dimensions: {path}: {image.size}')
print(f'Verified {len(images)} complete 1536 × 1024 architectural preview images.')
