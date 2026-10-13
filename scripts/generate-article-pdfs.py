from __future__ import annotations

import json
import re
import sys
from html import unescape
from html.parser import HTMLParser
from pathlib import Path

from PIL import Image as PilImage
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    Image,
    KeepTogether,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
)


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "tmp" / "pdfs" / "article-pdf-source.json"
OUTPUT = ROOT / "public" / "downloads" / "articles"
IMAGE_CACHE = ROOT / "tmp" / "pdfs" / "article-images"
SITE = "https://worldarchjournal.com"
PAGE_W, PAGE_H = A4

INK = colors.HexColor("#20231F")
MUTED = colors.HexColor("#666057")
GOLD = colors.HexColor("#A8793E")
PAPER = colors.HexColor("#F1ECE3")
LINE = colors.HexColor("#CFC5B7")

def _register_font(name: str, windows_path: str, linux_candidates: list[str]) -> None:
    candidates = [windows_path, *linux_candidates]
    for candidate in candidates:
        if Path(candidate).exists():
            pdfmetrics.registerFont(TTFont(name, candidate))
            return
    raise TTFError(f'No usable font file found for "{name}". Tried: {candidates}')


_register_font("WAJSerif", r"C:\Windows\Fonts\georgia.ttf", ["/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf", "/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf"])
_register_font("WAJSerifBold", r"C:\Windows\Fonts\georgiab.ttf", ["/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf", "/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf"])
_register_font("WAJSerifItalic", r"C:\Windows\Fonts\georgiai.ttf", ["/usr/share/fonts/truetype/dejavu/DejaVuSerif-Italic.ttf", "/usr/share/fonts/truetype/liberation/LiberationSerif-Italic.ttf"])
_register_font("WAJSans", r"C:\Windows\Fonts\arial.ttf", ["/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"])
_register_font("WAJSansBold", r"C:\Windows\Fonts\arialbd.ttf", ["/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"])


def clean(value: str | None) -> str:
    text = unescape(re.sub(r"\s+", " ", str(value or ""))).strip()
    return (text.replace("–", "-").replace("—", "-").replace("‑", "-")
            .replace("·", "|").replace("•", "-").replace("↗", "").replace("↓", ""))


class ArticleHtmlParser(HTMLParser):
    block_tags = {"p", "h2", "h3", "li", "blockquote", "th", "td"}

    def __init__(self):
        super().__init__()
        self.blocks: list[tuple[str, str]] = []
        self.current_tag: str | None = None
        self.buffer: list[str] = []
        self.link_href: str | None = None

    def handle_starttag(self, tag, attrs):
        tag = tag.lower()
        if tag in self.block_tags:
            self._flush()
            self.current_tag = tag
        if tag == "a":
            self.link_href = dict(attrs).get("href")

    def handle_endtag(self, tag):
        tag = tag.lower()
        if tag == "a" and self.link_href:
            href = clean(self.link_href)
            if href:
                self.buffer.append(f" ({href})")
            self.link_href = None
        if tag in self.block_tags:
            self._flush()

    def handle_data(self, data):
        if self.current_tag:
            self.buffer.append(data)

    def close(self):
        super().close()
        self._flush()

    def _flush(self):
        text = clean("".join(self.buffer))
        if text and self.current_tag:
            self.blocks.append((self.current_tag, text))
        self.buffer = []
        self.current_tag = None


def article_blocks(html: str) -> list[tuple[str, str]]:
    parser = ArticleHtmlParser()
    parser.feed(html or "")
    parser.close()
    return parser.blocks


def local_asset(path_value: str | None) -> Path | None:
    if not path_value or not str(path_value).startswith("/"):
        return None
    path = ROOT / "public" / str(path_value).lstrip("/")
    return path if path.is_file() else None


def pdf_image(source: Path, key: str) -> Path:
    IMAGE_CACHE.mkdir(parents=True, exist_ok=True)
    target = IMAGE_CACHE / f"{key}.jpg"
    with PilImage.open(source) as image:
        image = image.convert("RGB")
        image.thumbnail((1400, 1000), PilImage.Resampling.LANCZOS)
        image.save(target, "JPEG", quality=90, optimize=True, progressive=True, subsampling=0)
    return target


def image_flowable(path: Path, max_width=174 * mm, max_height=100 * mm) -> Image:
    with PilImage.open(path) as source:
        width, height = source.size
    ratio = min(max_width / width, max_height / height)
    return Image(str(path), width=width * ratio, height=height * ratio)


styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name="WAJ_Kicker", parent=styles["Normal"], fontName="WAJSansBold", fontSize=7, leading=9, textColor=GOLD, tracking=2.2, spaceAfter=7))
styles.add(ParagraphStyle(name="WAJ_Title", parent=styles["Title"], fontName="WAJSerifBold", fontSize=29, leading=31, textColor=INK, alignment=TA_LEFT, spaceAfter=14))
styles.add(ParagraphStyle(name="WAJ_Deck", parent=styles["Normal"], fontName="WAJSerif", fontSize=12.5, leading=18, textColor=MUTED, spaceAfter=15))
styles.add(ParagraphStyle(name="WAJ_Meta", parent=styles["Normal"], fontName="WAJSans", fontSize=7.5, leading=11, textColor=MUTED, spaceAfter=3))
styles.add(ParagraphStyle(name="WAJ_H2", parent=styles["Heading2"], fontName="WAJSerifBold", fontSize=21, leading=24, textColor=INK, spaceBefore=18, spaceAfter=9, keepWithNext=True))
styles.add(ParagraphStyle(name="WAJ_H3", parent=styles["Heading3"], fontName="WAJSerifBold", fontSize=14, leading=17, textColor=INK, spaceBefore=12, spaceAfter=7, keepWithNext=True))
styles.add(ParagraphStyle(name="WAJ_Body", parent=styles["BodyText"], fontName="WAJSerif", fontSize=10.2, leading=15.2, textColor=INK, spaceAfter=8))
styles.add(ParagraphStyle(name="WAJ_List", parent=styles["BodyText"], fontName="WAJSerif", fontSize=9.8, leading=14.2, leftIndent=13, firstLineIndent=-8, textColor=INK, spaceAfter=6))
styles.add(ParagraphStyle(name="WAJ_Quote", parent=styles["BodyText"], fontName="WAJSerifItalic", fontSize=11, leading=16, leftIndent=12, rightIndent=12, textColor=MUTED, borderColor=GOLD, borderWidth=0, borderPadding=8, spaceBefore=7, spaceAfter=10))
styles.add(ParagraphStyle(name="WAJ_Caption", parent=styles["Normal"], fontName="WAJSans", fontSize=6.8, leading=9.5, textColor=MUTED, spaceBefore=4, spaceAfter=13))
styles.add(ParagraphStyle(name="WAJ_Source", parent=styles["Normal"], fontName="WAJSans", fontSize=7.6, leading=11, textColor=MUTED, leftIndent=9, firstLineIndent=-9, spaceAfter=6))
styles.add(ParagraphStyle(name="WAJ_CTA", parent=styles["Normal"], fontName="WAJSansBold", fontSize=8.5, leading=12, textColor=GOLD, alignment=TA_CENTER, spaceBefore=9, spaceAfter=6))


def page_decor(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(PAPER)
    canvas.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    canvas.setStrokeColor(LINE)
    canvas.line(18 * mm, 15 * mm, PAGE_W - 18 * mm, 15 * mm)
    canvas.setFillColor(MUTED)
    canvas.setFont("WAJSans", 6.5)
    canvas.drawString(18 * mm, 9.5 * mm, "WORLD ARCH JOURNAL | ARCHITECTURE MEDIA & DESIGN")
    canvas.drawRightString(PAGE_W - 18 * mm, 9.5 * mm, f"{doc.page}")
    canvas.restoreState()


def make_pdf(article: dict) -> Path:
    slug = article["slug"]
    target = OUTPUT / f"{slug}.pdf"
    doc = BaseDocTemplate(
        str(target),
        pagesize=A4,
        rightMargin=18 * mm,
        leftMargin=18 * mm,
        topMargin=18 * mm,
        bottomMargin=20 * mm,
        title=clean(article["title"]),
        author=clean(article.get("author") or "World Arch Journal"),
        subject=clean(article.get("excerpt")),
        creator="World Arch Journal",
    )
    frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="article")
    doc.addPageTemplates([PageTemplate(id="editorial", frames=[frame], onPage=page_decor)])
    story = []
    story.append(Paragraph("WORLD ARCH JOURNAL | DOWNLOADABLE EDITION", styles["WAJ_Kicker"]))
    story.append(Paragraph(clean(article["title"]), styles["WAJ_Title"]))
    story.append(Paragraph(clean(article.get("excerpt")), styles["WAJ_Deck"]))
    meta = " | ".join(filter(None, [clean(article.get("category")), clean(article.get("readingTime")), clean(article.get("publishedAt")), clean(article.get("author"))]))
    story.append(Paragraph(meta, styles["WAJ_Meta"]))
    story.append(Paragraph(f'<link href="{SITE}/articles/{slug}/">READ THE LIVE ARTICLE</link>', styles["WAJ_CTA"]))
    story.append(Spacer(1, 7 * mm))

    hero = local_asset(article.get("image"))
    if hero:
        cached = pdf_image(hero, f"{slug}-hero")
        story.extend([
            image_flowable(cached, max_height=93 * mm),
            Paragraph(clean(article.get("visualLabel") or article.get("imageAlt")), styles["WAJ_Caption"]),
        ])

    visual_queue = list(article.get("visuals") or [])
    blocks = article_blocks(article.get("contentHtml") or "")
    inserted = 0
    for index, (tag, text) in enumerate(blocks):
        if tag == "h2":
            story.append(Paragraph(clean(text), styles["WAJ_H2"]))
            if visual_queue and inserted < 3:
                visual = visual_queue.pop(0)
                path = local_asset(visual.get("src"))
                if path:
                    cached = pdf_image(path, f"{slug}-visual-{inserted + 1}")
                    caption = clean(visual.get("caption") or visual.get("alt"))
                    source_url = clean(visual.get("sourceUrl"))
                    if source_url:
                        caption = f"{caption} | Source: {source_url}"
                    story.extend([Spacer(1, 2 * mm), image_flowable(cached, max_height=82 * mm), Paragraph(caption, styles["WAJ_Caption"])])
                    inserted += 1
        elif tag == "h3":
            story.append(Paragraph(clean(text), styles["WAJ_H3"]))
        elif tag == "li":
            story.append(Paragraph(f"- {clean(text)}", styles["WAJ_List"]))
        elif tag == "blockquote":
            story.append(Paragraph(clean(text), styles["WAJ_Quote"]))
        elif tag in {"th", "td"}:
            story.append(Paragraph(clean(text), styles["WAJ_List"]))
        else:
            story.append(Paragraph(clean(text), styles["WAJ_Body"]))

    scope = clean(article.get("scope"))
    if scope:
        story.append(KeepTogether([
            Paragraph("EDITORIAL SCOPE", styles["WAJ_Kicker"]),
            Paragraph(scope, styles["WAJ_Body"]),
        ]))

    faqs = article.get("faq") or []
    if faqs:
        story.append(Paragraph("Frequently asked questions", styles["WAJ_H2"]))
        for item in faqs:
            story.append(Paragraph(clean(item.get("question")), styles["WAJ_H3"]))
            story.append(Paragraph(clean(item.get("answer")), styles["WAJ_Body"]))

    evidence = article.get("evidence") or []
    if evidence:
        story.append(PageBreak())
        story.append(Paragraph("Evidence and source notes", styles["WAJ_H2"]))
        story.append(Paragraph("Claims are scoped to the cited material and editorial limitations recorded below.", styles["WAJ_Body"]))
        for number, source in enumerate(evidence, start=1):
            label = clean(source.get("publisher") or f"Source {number}")
            url = clean(source.get("source_url"))
            claim = clean(source.get("claim"))
            limitation = clean(source.get("limitations"))
            text = f"{number}. <b>{label}</b> | {claim}"
            if limitation:
                text += f" | Limitation: {limitation}"
            if url:
                text += f" | {url}"
            story.append(Paragraph(text, styles["WAJ_Source"]))

    story.extend([
        Spacer(1, 9 * mm),
        Paragraph("CONTINUE ONLINE", styles["WAJ_Kicker"]),
        Paragraph(f'<link href="{SITE}/articles/{slug}/">{SITE}/articles/{slug}/</link>', styles["WAJ_CTA"]),
    ])
    doc.build(story)
    return target


def main():
    OUTPUT.mkdir(parents=True, exist_ok=True)
    source_path = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else SOURCE
    slugs = set(sys.argv[2:])
    data = json.loads(source_path.read_text(encoding="utf-8"))
    if slugs:
        data = [article for article in data if article.get("slug") in slugs]
        missing = slugs - {article.get("slug") for article in data}
        if missing:
            raise ValueError(f"Requested article(s) missing from PDF input: {', '.join(sorted(missing))}")
    results = [make_pdf(article) for article in data]
    print(json.dumps({"count": len(results), "files": [str(path) for path in results]}, indent=2))


if __name__ == "__main__":
    main()
