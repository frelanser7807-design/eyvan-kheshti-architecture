from pathlib import Path
from PIL import Image
import json
import shutil


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT.parents[1] / "tmp" / "narbon-source-audit"
GENERATED = Path.home() / ".codex" / "generated_images" / "01a07b01-238c-7512-9a48-605ccc63fa73"
TOUR_OUT = ROOT / "public" / "assets" / "virtual-tours" / "narbon-villa"
PHOTO_OUT = ROOT / "public" / "assets" / "projects" / "narbon-villa" / "photos"
DRAWING_OUT = ROOT / "public" / "assets" / "projects" / "narbon-villa" / "drawings"


# Only individually outpainted photographs that can be assigned to a documented
# project space are admitted. Earlier multi-photo or plan-invented renders are
# intentionally excluded.
PANORAMAS = {
    1: "exec-0bb13c51-ca2f-4dc6-a25f-50b224cacaf0.png",
    2: "exec-13984d71-3e30-462f-8791-173c9cd2f48c.png",
    5: "exec-84d48fc1-574f-43fd-9e12-d3b74de724d7.png",
    6: "exec-fab13a5a-43d6-4271-a663-3d37cd92e885.png",
    7: "exec-07b4060b-6898-440f-9144-e2f0bbe00b24.png",
    10: "exec-f79221dc-6a3b-4e0d-9948-58e1adc556aa.png",
    17: "exec-93f28174-fb14-4a73-82e9-206dd9c7cf22.png",
    19: "exec-ea44002d-5228-41f7-bb99-75c29d9532e4.png",
    21: "exec-3abc29a4-81c5-4738-9a12-55b78118dc9b.png",
    25: "exec-9570b612-9fb8-4f12-ab0e-951dfd2e8ee2.png",
    28: "exec-6edc979c-18ea-4d84-bf15-ee8e7193b053.png",
    29: "exec-be88407e-b70a-4546-bb7d-b474e8813b96.png",
    30: "exec-a778c015-215b-433e-8f82-56417ff621fc.png",
}


def source_photo(index: int) -> Path:
    return SOURCE / f"narbon-villa-gera-studio-architects_{index}.jpg"


def locked_photo_layer(path: Path):
    image = Image.open(path).convert("RGB")
    max_width, max_height = 1180, 820
    scale = min(max_width / image.width, max_height / image.height)
    size = (round(image.width * scale), round(image.height * scale))
    resized = image.resize(size, Image.Resampling.LANCZOS)
    x = (2048 - size[0]) // 2
    y = (1024 - size[1]) // 2
    return resized, (x, y)


def prepare_panorama(index: int, generated_name: str):
    generated_path = GENERATED / generated_name
    if not generated_path.exists():
        raise FileNotFoundError(generated_path)
    background = Image.open(generated_path).convert("RGB").resize((2048, 1024), Image.Resampling.LANCZOS)
    locked, position = locked_photo_layer(source_photo(index))
    # Reinsert the exact source view after generative outpainting. This prevents
    # the model from redesigning the documented architecture in the main view.
    background.paste(locked, position)
    output = TOUR_OUT / f"scene-{index:02d}.jpg"
    background.save(output, quality=92, subsampling=0, optimize=True)
    return output


def main():
    TOUR_OUT.mkdir(parents=True, exist_ok=True)
    PHOTO_OUT.mkdir(parents=True, exist_ok=True)
    DRAWING_OUT.mkdir(parents=True, exist_ok=True)

    for index in range(1, 31):
        shutil.copy2(source_photo(index), PHOTO_OUT / f"photo-{index:02d}.jpg")

    for drawing in sorted((SOURCE / "drawings").glob("*.jpg")):
        shutil.copy2(drawing, DRAWING_OUT / drawing.name)

    prepared = []
    for index, generated_name in PANORAMAS.items():
        output = prepare_panorama(index, generated_name)
        prepared.append({"photo": index, "file": output.name, "sourceLocked": True})

    shutil.copy2(source_photo(1), ROOT / "public" / "assets" / "projects" / "narbon-villa" / "cover.jpg")
    (TOUR_OUT / "manifest.json").write_text(
        json.dumps({"project": "Narbon Villa", "panoramas": prepared}, indent=2),
        encoding="utf-8",
    )
    print(f"Prepared {len(prepared)} locked-source panoramas, 30 photographs and 17 drawings.")


if __name__ == "__main__":
    main()
