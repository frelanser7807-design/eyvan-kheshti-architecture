from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
SOURCE_BRAND = ROOT / "source-assets" / "brand"
PUBLIC_BRAND = ROOT / "public" / "assets" / "brand"
SOURCE = SOURCE_BRAND / "farnaz-professional-profile-v5.png"
OUTPUT = PUBLIC_BRAND / "farnaz-professional-profile-v6.png"
PREVIEW = SOURCE_BRAND / "farnaz-professional-profile-circle-preview-v6.png"


def build_profile() -> None:
    source = Image.open(SOURCE).convert("RGB")
    width, height = source.size

    # A close, social-profile crop. It keeps the generated face/body pixels intact.
    side = int(min(width, height) * 0.70)
    left = (width - side) // 2
    top = max(0, int(height * 0.01))
    if top + side > height:
        top = height - side
    profile = source.crop((left, top, left + side, top + side))
    profile = profile.resize((1080, 1080), Image.Resampling.LANCZOS)

    # Darken the environment while protecting the face, hair, blazer, and neckline.
    dark_environment = ImageEnhance.Brightness(profile).enhance(0.52)
    dark_environment = ImageEnhance.Contrast(dark_environment).enhance(1.08)

    subject_mask = Image.new("L", profile.size, 0)
    draw = ImageDraw.Draw(subject_mask)
    draw.ellipse((220, 35, 850, 715), fill=255)
    draw.polygon(((115, 615), (955, 615), (1080, 1080), (0, 1080)), fill=255)
    subject_mask = subject_mask.filter(ImageFilter.GaussianBlur(44))

    profile = Image.composite(profile, dark_environment, subject_mask)

    # Professional clarity without changing facial structure.
    profile = ImageEnhance.Contrast(profile).enhance(1.06)
    profile = ImageEnhance.Color(profile).enhance(0.96)
    profile = profile.filter(ImageFilter.UnsharpMask(radius=1.7, percent=120, threshold=3))

    # Subtle vignette for stronger focus at small sizes.
    vignette = Image.new("L", profile.size, 0)
    vdraw = ImageDraw.Draw(vignette)
    vdraw.ellipse((90, 15, 990, 1110), fill=210)
    vignette = vignette.filter(ImageFilter.GaussianBlur(130))
    black = Image.new("RGB", profile.size, (4, 5, 7))
    vignette_strength = vignette.point(lambda p: int((255 - p) * 0.32))
    profile = Image.composite(black, profile, vignette_strength)

    profile.save(OUTPUT, quality=0, compress_level=6)

    preview_size = 540
    preview = profile.resize((preview_size, preview_size), Image.Resampling.LANCZOS)
    circle = Image.new("L", (preview_size, preview_size), 0)
    ImageDraw.Draw(circle).ellipse((2, 2, preview_size - 3, preview_size - 3), fill=255)
    canvas = Image.new("RGBA", (preview_size, preview_size), (14, 15, 18, 255))
    canvas.paste(preview.convert("RGBA"), (0, 0), circle)
    canvas.save(PREVIEW, compress_level=6)


if __name__ == "__main__":
    build_profile()
