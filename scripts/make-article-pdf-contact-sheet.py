from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


root = Path(__file__).resolve().parents[1]
render_root = root / "tmp" / "pdfs" / "article-render-20261008-v2"
files = []
for folder in sorted(render_root.iterdir()):
    if folder.is_dir():
        pages = sorted(folder.glob("page-*.png"))
        if pages:
            files.append(pages[0])
thumb_w, thumb_h = 300, 430
cols = 4
rows = (len(files) + cols - 1) // cols
sheet = Image.new("RGB", (cols * thumb_w, rows * (thumb_h + 42)), "#171918")
draw = ImageDraw.Draw(sheet)
font = ImageFont.load_default()

for index, path in enumerate(files):
    image = Image.open(path).convert("RGB")
    image.thumbnail((thumb_w - 18, thumb_h - 18), Image.Resampling.LANCZOS)
    x = (index % cols) * thumb_w + (thumb_w - image.width) // 2
    y = (index // cols) * (thumb_h + 42) + 7
    sheet.paste(image, (x, y))
    label = path.parent.name[:40]
    draw.text((index % cols * thumb_w + 12, y + image.height + 7), label, fill="#F1E7D7", font=font)

out = root / "tmp" / "pdfs" / "article-first-pages-contact-sheet.jpg"
sheet.save(out, quality=90, optimize=True)
print(out)
