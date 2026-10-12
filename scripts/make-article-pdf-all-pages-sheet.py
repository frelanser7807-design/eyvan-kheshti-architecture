from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


root = Path(__file__).resolve().parents[1]
render_root = root / "tmp" / "pdfs" / "article-render-20261008-v2"
files = sorted(render_root.glob("*/page-*.png"))
thumb_w, thumb_h = 220, 310
cols = 7
rows = (len(files) + cols - 1) // cols
sheet = Image.new("RGB", (cols * thumb_w, rows * (thumb_h + 26)), "#171918")
draw = ImageDraw.Draw(sheet)
font = ImageFont.load_default()

for index, path in enumerate(files):
    image = Image.open(path).convert("RGB")
    image.thumbnail((thumb_w - 12, thumb_h - 12), Image.Resampling.LANCZOS)
    x = (index % cols) * thumb_w + (thumb_w - image.width) // 2
    y = (index // cols) * (thumb_h + 26) + 4
    sheet.paste(image, (x, y))
    label = f"{path.parent.name[:14]} / {path.stem.replace('page-', 'p')}"
    draw.text((index % cols * thumb_w + 6, y + image.height + 3), label, fill="#F1E7D7", font=font)

out = root / "tmp" / "pdfs" / "article-all-pages-contact-sheet.jpg"
sheet.save(out, quality=88, optimize=True)
print(out)
