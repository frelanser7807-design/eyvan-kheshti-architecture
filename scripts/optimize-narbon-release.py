from pathlib import Path
from PIL import Image
from zipfile import ZIP_DEFLATED, ZipFile


ROOT = Path(__file__).resolve().parents[1]
TOUR = ROOT / "public" / "assets" / "virtual-tours" / "narbon-villa"
PROJECT = ROOT / "public" / "assets" / "projects" / "narbon-villa"
PHOTOS = PROJECT / "photos"
DRAWINGS = PROJECT / "drawings"
DOWNLOADS = ROOT / "public" / "downloads"

WEB_GALLERY = {1, 2, 5, 10, 19, 21, 28, 29}


def optimize_jpeg(path: Path, max_size: tuple[int, int], quality: int) -> None:
    with Image.open(path) as source:
        image = source.convert("RGB")
        image.thumbnail(max_size, Image.Resampling.LANCZOS)
        temporary = path.with_suffix(".optimized.jpg")
        image.save(temporary, "JPEG", quality=quality, optimize=True, progressive=True, subsampling=2)
    temporary.replace(path)


for scene in TOUR.glob("scene-*.jpg"):
    optimize_jpeg(scene, (2048, 1024), 84)

for photo in PHOTOS.glob("photo-*.jpg"):
    number = int(photo.stem.split("-")[-1])
    if number in WEB_GALLERY:
        optimize_jpeg(photo, (1800, 1800), 78)
    else:
        photo.unlink()

cover = PROJECT / "cover.jpg"
optimize_jpeg(cover, (1800, 1800), 80)

pack = DOWNLOADS / "narbon-villa-english-drawing-pack.zip"
with ZipFile(pack, "w", compression=ZIP_DEFLATED, compresslevel=9) as archive:
    for drawing in sorted(DRAWINGS.glob("*.jpg")):
        archive.write(drawing, arcname=f"Narbon-Villa-English-Drawings/{drawing.name}")

print(f"Optimized {len(list(TOUR.glob('scene-*.jpg')))} tour scenes and {len(WEB_GALLERY)} web photographs.")
print(pack)
