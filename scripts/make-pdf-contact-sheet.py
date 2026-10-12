from pathlib import Path
from PIL import Image, ImageDraw

root = Path(__file__).resolve().parents[1]
files = sorted((root / "tmp" / "pdfs" / "narbon-render").glob("page-*.png"))
thumb_w, thumb_h = 240, 340
cols = 5
rows = (len(files) + cols - 1) // cols
sheet = Image.new("RGB", (cols * thumb_w, rows * (thumb_h + 24)), "#222222")
draw = ImageDraw.Draw(sheet)
for i, path in enumerate(files):
    im = Image.open(path).convert("RGB")
    im.thumbnail((thumb_w - 10, thumb_h - 10), Image.Resampling.LANCZOS)
    x = (i % cols) * thumb_w + (thumb_w - im.width) // 2
    y = (i // cols) * (thumb_h + 24) + 5
    sheet.paste(im, (x, y))
    draw.text((x, y + im.height + 3), f"Page {i + 1}", fill="white")
out = root / "tmp" / "pdfs" / "narbon-contact-sheet.jpg"
sheet.save(out, quality=90)
print(out)
