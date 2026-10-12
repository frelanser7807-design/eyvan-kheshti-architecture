from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, Table, TableStyle, PageBreak, KeepTogether
from PIL import Image as PILImage

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "downloads" / "the-voids-villa-project-guide.pdf"
COVER = ROOT / "public" / "assets" / "projects" / "the-voids" / "photos" / "facade.jpg"
PHOTO_ROOT = ROOT / "public" / "assets" / "projects" / "the-voids" / "photos"
DRAWING_ROOT = ROOT / "public" / "assets" / "projects" / "the-voids" / "drawings"

GOLD = colors.HexColor("#B58547")
INK = colors.HexColor("#151716")
MUTED = colors.HexColor("#5F5B55")
PAPER = colors.HexColor("#F2EEE6")

styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name="Eyebrow", parent=styles["Normal"], fontName="Helvetica-Bold", fontSize=7, leading=10, tracking=2, textColor=GOLD, spaceAfter=8))
styles.add(ParagraphStyle(name="Display", parent=styles["Title"], fontName="Times-Roman", fontSize=36, leading=34, textColor=INK, spaceAfter=14))
styles.add(ParagraphStyle(name="H2x", parent=styles["Heading2"], fontName="Times-Roman", fontSize=23, leading=25, textColor=INK, spaceAfter=12))
styles.add(ParagraphStyle(name="Bodyx", parent=styles["BodyText"], fontName="Helvetica", fontSize=9.2, leading=15, textColor=MUTED, spaceAfter=9))
styles.add(ParagraphStyle(name="Smallx", parent=styles["BodyText"], fontName="Helvetica", fontSize=7.2, leading=11, textColor=MUTED))
styles.add(ParagraphStyle(name="WhiteDisplay", parent=styles["Title"], fontName="Times-Roman", fontSize=39, leading=37, textColor=colors.white, spaceAfter=10))
styles.add(ParagraphStyle(name="WhiteBody", parent=styles["BodyText"], fontName="Helvetica", fontSize=9, leading=14, textColor=colors.HexColor("#E7E0D5")))


def fit_image(path, max_w, max_h):
    with PILImage.open(path) as im:
        w, h = im.size
    scale = min(max_w / w, max_h / h)
    return Image(str(path), width=w * scale, height=h * scale)


def page_bg(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(PAPER)
    canvas.rect(0, 0, doc.pagesize[0], doc.pagesize[1], fill=1, stroke=0)
    canvas.setStrokeColor(colors.HexColor("#C9BBA6"))
    canvas.line(18 * mm, 15 * mm, doc.pagesize[0] - 18 * mm, 15 * mm)
    canvas.setFont("Helvetica", 6.5)
    canvas.setFillColor(MUTED)
    canvas.drawString(18 * mm, 10.5 * mm, "WORLD ARCH JOURNAL · THE VOIDS VILLA · ENGLISH PROJECT GUIDE")
    canvas.drawRightString(doc.pagesize[0] - 18 * mm, 10.5 * mm, str(doc.page))
    canvas.restoreState()


def cover_bg(canvas, doc):
    canvas.saveState()
    page_w, page_h = doc.pagesize
    with PILImage.open(COVER) as im:
        w, h = im.size
    scale = max(page_w / w, page_h / h)
    image_w, image_h = w * scale, h * scale
    canvas.drawImage(str(COVER), (page_w - image_w) / 2, (page_h - image_h) / 2, image_w, image_h, preserveAspectRatio=True, mask="auto")
    canvas.setFillColor(colors.Color(0.03, 0.04, 0.04, alpha=.64))
    canvas.rect(0, 0, page_w, page_h, fill=1, stroke=0)
    canvas.setStrokeColor(GOLD)
    canvas.rect(15 * mm, 15 * mm, page_w - 30 * mm, page_h - 30 * mm, fill=0, stroke=1)
    canvas.restoreState()


story = []
story.extend([
    Spacer(1, 86 * mm),
    Paragraph("WORLD ARCH JOURNAL", styles["Eyebrow"]),
    Paragraph("THE VOIDS<br/>VILLA", styles["WhiteDisplay"]),
    Paragraph("Koohsar, Karaj, Iran · 2021–2024<br/>Architecture: AsNow Design & Construct", styles["WhiteBody"]),
    Spacer(1, 45 * mm),
    Paragraph("PROJECT HISTORY · DESIGN EVOLUTION · ENGLISH PLANS & SECTIONS", styles["WhiteBody"]),
    PageBreak(),
])

story.extend([
    Paragraph("PROJECT READING / 01", styles["Eyebrow"]),
    Paragraph("A solid white volume, opened by inhabitable voids.", styles["Display"]),
    Paragraph("The Voids Villa reconsiders a suburban retreat as a connected spatial landscape. Leisure spaces occupy the lower floor, shared life unfolds at ground level and private rooms rise above. The architectural identity comes from the courtyards, bridges, stairs and brick-lined voids that join those layers.", styles["Bodyx"]),
    Spacer(1, 5 * mm),
])

facts = [
    ["LOCATION", "Koohsar, Karaj, Iran", "TYPE", "Residential villa"],
    ["ARCHITECTS", "Solmaz Tatari · Ehsan Tavassoli", "DATES", "2021–2024"],
    ["SITE AREA", "1,000 m²", "BUILT AREA", "540 m²"],
    ["STUDIO", "AsNow Design & Construct", "PHOTOGRAPHY", "Mohammad Hossein Hamzelouei"],
]
table = Table(facts, colWidths=[28*mm, 58*mm, 26*mm, 55*mm], rowHeights=[16*mm]*4)
table.setStyle(TableStyle([
    ("GRID", (0,0), (-1,-1), .4, colors.HexColor("#C8BBA8")),
    ("BACKGROUND", (0,0), (-1,-1), colors.HexColor("#E9E2D7")),
    ("FONTNAME", (0,0), (-1,-1), "Helvetica"),
    ("FONTSIZE", (0,0), (-1,-1), 7.5),
    ("TEXTCOLOR", (0,0), (-1,-1), MUTED),
    ("TEXTCOLOR", (0,0), (0,-1), GOLD),
    ("TEXTCOLOR", (2,0), (2,-1), GOLD),
    ("VALIGN", (0,0), (-1,-1), "MIDDLE"),
    ("LEFTPADDING", (0,0), (-1,-1), 7),
]))
story.extend([table, Spacer(1, 8*mm)])

sections = [
    ("Context", "The site opens toward the more desirable north and west views and becomes protective toward possible future neighbours on the east and south. The result is a hybrid introverted–extroverted house."),
    ("Void system", "A generous north garden, a smaller south court and a semi-central courtyard connect open and covered voids across all three levels, bringing daylight deeper into the building."),
    ("Movement", "The circulation route permits wandering and discovery without requiring every journey to pass through private rooms. Stairs and bridges turn movement itself into an architectural experience."),
    ("Memory and material", "An existing mature tree anchors the deepest court as a marker of time. White room volumes contrast with brick-toned circulation, making occupied rooms and connective voids visually distinct."),
]
section_cells = []
for title, body in sections:
    section_cells.append([Paragraph(title, styles["H2x"]), Paragraph(body, styles["Bodyx"])])
section_table = Table([
    [section_cells[0], section_cells[1]],
    [section_cells[2], section_cells[3]],
], colWidths=[84*mm, 84*mm])
section_table.setStyle(TableStyle([
    ("VALIGN", (0,0), (-1,-1), "TOP"),
    ("BOX", (0,0), (-1,-1), .4, colors.HexColor("#C8BBA8")),
    ("INNERGRID", (0,0), (-1,-1), .4, colors.HexColor("#C8BBA8")),
    ("LEFTPADDING", (0,0), (-1,-1), 10),
    ("RIGHTPADDING", (0,0), (-1,-1), 10),
    ("TOPPADDING", (0,0), (-1,-1), 10),
    ("BOTTOMPADDING", (0,0), (-1,-1), 8),
]))
story.append(section_table)
story.append(PageBreak())

photo_pages = [
    (
        "PROJECT PHOTOGRAPHY / 02",
        "Built spaces and connected voids",
        [
            ("NORTH FACADE AND GARDEN EDGE", "facade.jpg"),
            ("LIVING SPACE AND CENTRAL VOID", "interior-void.jpg"),
            ("POOL TOWARD THE SUNKEN GARDEN", "pool.jpg"),
        ],
    ),
    (
        "PROJECT PHOTOGRAPHY / 03",
        "The inhabitable upper landscape",
        [
            ("ROOF PROMENADE AND CENTRAL VOID", "roof-promenade.jpg"),
            ("ROOF STAIR AND UPPER COURT", "roof-stair.jpg"),
            ("COURTYARD BATHROOM", "bathroom-court.jpg"),
        ],
    ),
]

for eyebrow, title, panels in photo_pages:
    photo_cells = []
    for label, filename in panels:
        image = fit_image(PHOTO_ROOT / filename, 78*mm, 66*mm)
        caption = Paragraph(
            f"<b>{label}</b><br/>Photography: Mohammad Hossein Hamzelouei<br/>Source: Contemporary Architecture of Iran / ArchDaily.",
            styles["Smallx"],
        )
        photo_cells.append([image, caption])
    photo_cells.append([Spacer(1, 66*mm), Paragraph("", styles["Smallx"])])
    photo_table = Table([photo_cells[:2], photo_cells[2:]], colWidths=[84*mm, 84*mm])
    photo_table.setStyle(TableStyle([
        ("VALIGN", (0,0), (-1,-1), "TOP"),
        ("BOX", (0,0), (-1,-1), .4, colors.HexColor("#C8BBA8")),
        ("INNERGRID", (0,0), (-1,-1), .4, colors.HexColor("#C8BBA8")),
        ("LEFTPADDING", (0,0), (-1,-1), 8),
        ("RIGHTPADDING", (0,0), (-1,-1), 8),
        ("TOPPADDING", (0,0), (-1,-1), 8),
        ("BOTTOMPADDING", (0,0), (-1,-1), 8),
    ]))
    story.extend([
        Paragraph(eyebrow, styles["Eyebrow"]),
        Paragraph(title, styles["Display"]),
        Paragraph("Published project photography is presented as credited editorial reference material. These are standard project photographs, not panoramic tour renders.", styles["Bodyx"]),
        photo_table,
        Spacer(1, 5*mm),
        Paragraph("Editorial reference reproduction. Copyright remains with the photographer and original publishers; source links are listed in this guide.", styles["Smallx"]),
        PageBreak(),
    ])

drawings = [
    ("LOWER FLOOR PLAN", "lower-floor-plan.png"),
    ("GROUND FLOOR PLAN", "ground-floor-plan.png"),
    ("UPPER FLOOR PLAN", "upper-floor-plan.png"),
    ("ROOF PLAN", "roof-plan.png"),
    ("SECTION A–A", "section-aa.png"),
    ("SECTION B–B", "section-bb.png"),
]
for index, (label, filename) in enumerate(drawings, start=4):
    path = DRAWING_ROOT / filename
    story.extend([
        Paragraph(f"DRAWING ARCHIVE / {index:02d}", styles["Eyebrow"]),
        Paragraph(label, styles["H2x"]),
        Spacer(1, 2*mm),
        fit_image(path, 168*mm, 218*mm),
        Spacer(1, 4*mm),
        Paragraph("Original English editorial redraw for visual study. Not a measured construction document.", styles["Smallx"]),
        PageBreak(),
    ])

story.extend([
    Paragraph("SOURCES & REPRESENTATION / 10", styles["Eyebrow"]),
    Paragraph("Research note", styles["Display"]),
    Paragraph("Project facts and the architects’ stated design intentions were checked against the Contemporary Architecture of Iran project archive and a secondary ArchDaily publication. This guide paraphrases those sources; it does not reproduce the architects’ text.", styles["Bodyx"]),
    Spacer(1, 4*mm),
    Paragraph("Primary source", styles["H2x"]),
    Paragraph("https://caoi.ir/en/projects/item/1938-the-voids-koohsar-karaj-asnow-design-construct.html", styles["Smallx"]),
    Spacer(1, 4*mm),
    Paragraph("Secondary reference", styles["H2x"]),
    Paragraph("https://www.archdaily.com/1022881/the-voids-villa-asnow-design-and-construct", styles["Smallx"]),
    Spacer(1, 10*mm),
    Paragraph("Representation disclaimer", styles["H2x"]),
    Paragraph("The 3D walkthrough and redrawn diagrams are AI-assisted editorial interpretations produced for architectural learning. They are not measured surveys, permit drawings or construction documents. The photographic plates in this guide are credited source project photographs; copyright remains with photographer Mohammad Hossein Hamzelouei and the original publishers.", styles["Bodyx"]),
])

OUT.parent.mkdir(parents=True, exist_ok=True)
doc = SimpleDocTemplate(str(OUT), pagesize=A4, rightMargin=20*mm, leftMargin=20*mm, topMargin=22*mm, bottomMargin=21*mm, title="The Voids Villa — English Project Guide", author="World Arch Journal")
doc.build(story, onFirstPage=cover_bg, onLaterPages=page_bg)
print(OUT)
