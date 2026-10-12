from pathlib import Path
from PIL import Image
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (
    BaseDocTemplate, Frame, PageTemplate, Paragraph, Spacer, Image as RLImage,
    PageBreak, KeepTogether, Table, TableStyle
)


ROOT = Path(__file__).resolve().parents[1]
PHOTO_ROOT = ROOT / "public" / "assets" / "projects" / "narbon-villa" / "photos"
SOURCE_PHOTO_ROOT = ROOT.parents[1] / "tmp" / "narbon-source-audit"
DRAWING_ROOT = ROOT / "public" / "assets" / "projects" / "narbon-villa" / "drawings"
OUT = ROOT / "public" / "downloads" / "narbon-villa-project-guide.pdf"
PDF_IMAGE_CACHE = ROOT / "work" / "narbon-pdf-images"
OUT.parent.mkdir(parents=True, exist_ok=True)
PDF_IMAGE_CACHE.mkdir(parents=True, exist_ok=True)

PAGE_W, PAGE_H = A4
INK = colors.HexColor("#191714")
PAPER = colors.HexColor("#F4F0E8")
GOLD = colors.HexColor("#B9823E")
MUTED = colors.HexColor("#686057")

styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name="Kicker", parent=styles["BodyText"], fontName="Helvetica-Bold", fontSize=7.5, leading=10, tracking=2.2, textColor=GOLD, spaceAfter=8))
styles.add(ParagraphStyle(name="Hero", parent=styles["Title"], fontName="Times-Roman", fontSize=35, leading=34, textColor=INK, spaceAfter=10))
styles.add(ParagraphStyle(name="H1x", parent=styles["Heading1"], fontName="Times-Roman", fontSize=25, leading=27, textColor=INK, spaceBefore=4, spaceAfter=12))
styles.add(ParagraphStyle(name="H2x", parent=styles["Heading2"], fontName="Times-Roman", fontSize=17, leading=20, textColor=INK, spaceBefore=8, spaceAfter=8))
styles.add(ParagraphStyle(name="Bodyx", parent=styles["BodyText"], fontName="Helvetica", fontSize=9.2, leading=14.2, textColor=INK, spaceAfter=8))
styles.add(ParagraphStyle(name="Smallx", parent=styles["BodyText"], fontName="Helvetica", fontSize=7.2, leading=10.5, textColor=MUTED, spaceAfter=5))
styles.add(ParagraphStyle(name="Caption", parent=styles["BodyText"], fontName="Helvetica", fontSize=7.2, leading=10, textColor=MUTED, alignment=TA_LEFT, spaceBefore=4))
styles.add(ParagraphStyle(name="Question", parent=styles["Heading2"], fontName="Times-Roman", fontSize=14.5, leading=17, textColor=INK, spaceAfter=6))
styles.add(ParagraphStyle(name="Answer", parent=styles["BodyText"], fontName="Helvetica", fontSize=8.6, leading=13, textColor=MUTED))


def image_size(path, max_w, max_h):
    with Image.open(path) as im:
        ratio = min(max_w / im.width, max_h / im.height)
        return im.width * ratio, im.height * ratio


def pdf_ready_image(path):
    """Downsample source photography before ReportLab embeds it.

    The public guide keeps every documented view, but a screen-first PDF does
    not benefit from embedding camera-original JPEGs at many times A4 size.
    """
    output = PDF_IMAGE_CACHE / f"{path.stem}-pdf.jpg"
    with Image.open(path) as source:
        image = source.convert("RGB")
        image.thumbnail((950, 950), Image.Resampling.LANCZOS)
        image.save(output, "JPEG", quality=46, optimize=True, progressive=True, subsampling=2)
    return output


def source_photo(index):
    original = SOURCE_PHOTO_ROOT / f"narbon-villa-gera-studio-architects_{index}.jpg"
    if original.exists():
        return original
    return PHOTO_ROOT / f"photo-{index:02d}.jpg"


def photo_block(path, label, max_h=82*mm):
    path = pdf_ready_image(path)
    w, h = image_size(path, 170*mm, max_h)
    return KeepTogether([
        RLImage(str(path), width=w, height=h),
        Paragraph(f"{label}<br/>Photography: Mohammad Hassan Ettefagh. Project archive: Contemporary Architecture of Iran.", styles["Caption"]),
    ])


def question_box(question, answer):
    table = Table([[Paragraph(question, styles["Question"]), Paragraph(answer, styles["Answer"]) ]], colWidths=[58*mm, 104*mm])
    table.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,-1), colors.HexColor("#EEE6D9")),
        ("BOX", (0,0), (-1,-1), 0.8, GOLD),
        ("INNERGRID", (0,0), (-1,-1), 0.35, colors.HexColor("#D7C6AE")),
        ("VALIGN", (0,0), (-1,-1), "TOP"),
        ("LEFTPADDING", (0,0), (-1,-1), 10),
        ("RIGHTPADDING", (0,0), (-1,-1), 10),
        ("TOPPADDING", (0,0), (-1,-1), 10),
        ("BOTTOMPADDING", (0,0), (-1,-1), 10),
    ]))
    return table


def page(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(PAPER)
    canvas.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    canvas.setStrokeColor(colors.HexColor("#D4C9B9"))
    canvas.line(18*mm, 14*mm, PAGE_W-18*mm, 14*mm)
    canvas.setFillColor(MUTED)
    canvas.setFont("Helvetica", 6.5)
    canvas.drawString(18*mm, 8.8*mm, "WORLD ARCH JOURNAL - NARBON VILLA")
    canvas.drawRightString(PAGE_W-18*mm, 8.8*mm, f"{doc.page:02d}")
    canvas.restoreState()


frame = Frame(18*mm, 19*mm, PAGE_W-36*mm, PAGE_H-35*mm, id="normal")
doc = BaseDocTemplate(str(OUT), pagesize=A4, rightMargin=18*mm, leftMargin=18*mm, topMargin=16*mm, bottomMargin=19*mm, title="Narbon Villa - English Project Guide", author="World Arch Journal")
doc.addPageTemplates(PageTemplate(id="main", frames=[frame], onPage=page))

story = []
story += [Paragraph("IMMERSIVE PROJECT ARCHIVE / 02", styles["Kicker"]), Paragraph("Narbon Villa", styles["Hero"]), Paragraph("A house shaped by an orchard wall, sunken shade, two sky rifts and the rediscovery of the roof.", styles["Bodyx"]), Spacer(1, 5*mm), photo_block(source_photo(1), "Project arrival and garden approach", 150*mm), Spacer(1, 3*mm), Paragraph("Chatrud, Kerman, Iran - Gera Studio Architects - 2022", styles["Smallx"]), PageBreak()]

story += [Paragraph("PROJECT FILE / 01", styles["Kicker"]), Paragraph("Facts and credits", styles["H1x"])]
facts = [
    ("Project", "Narbon Villa"), ("Location", "Chatrud, Kerman, Iran"),
    ("Architecture firm", "Gera Studio Architects"), ("Lead architect", "Hossein Namazi"),
    ("Design team", "Marzieh Mehranfar, Mehdi Arab Ameri, Amirmasoud Derikvand, Mehrad Ghaderi, Mohamad Shakori"),
    ("Year", "2022"), ("Site area", "11,000 sqm"), ("Built area", "350 sqm"),
    ("Programme", "Residential villa"), ("Construction", "Gera Studio"),
    ("Structural engineering", "Moeinedini"), ("Electrical and mechanical", "Kaveh Ahangar Davodi"),
    ("Executive manager", "Mehrdad Aghelnejad"), ("Clients", "Mostafa Manzori and Roya Jamshidi"),
    ("Photography", "Mohammad Hassan Ettefagh"),
    ("Recognition", "Joint first place, 15th Architecture and Interior Architecture Award, Memari-va-Sakhteman Magazine, 2023"),
]
table = Table([[Paragraph(f"<b>{a}</b>", styles["Smallx"]), Paragraph(b, styles["Bodyx"])] for a,b in facts], colWidths=[43*mm, 119*mm])
table.setStyle(TableStyle([("VALIGN",(0,0),(-1,-1),"TOP"),("LINEBELOW",(0,0),(-1,-1),0.35,colors.HexColor("#D8CFC2")),("LEFTPADDING",(0,0),(-1,-1),0),("RIGHTPADDING",(0,0),(-1,-1),4),("TOPPADDING",(0,0),(-1,-1),5),("BOTTOMPADDING",(0,0),(-1,-1),5)]))
story += [table, PageBreak()]

story += [Paragraph("HISTORY AND DESIGN INTENT / 02", styles["Kicker"]), Paragraph("From an inherited orchard to a climatic pavilion", styles["H1x"]), Paragraph("Narbon Villa stands within a large orchard in Chatrud, near Kerman. The architects began by retaining the old thatched boundary wall and placing a new boundary behind it. A carefully cut opening and glass entrance preserve the memory of the garden edge while allowing passersby to perceive the mature plane trees and the watercourse that continues toward neighbouring agricultural land.", styles["Bodyx"]), Paragraph("The arrival sequence connects garden and house through a sunken courtyard. Rather than treating shade as a secondary feature, the design uses level changes, deep walls and water to create a cooler threshold for Kerman's long hot days.", styles["Bodyx"]), photo_block(source_photo(5), "The retained garden boundary and renewed entrance", 92*mm), PageBreak()]

story += [Paragraph("SPATIAL STRATEGY / 03", styles["Kicker"]), Paragraph("Two rifts capture sky, air and movement", styles["H1x"]), Paragraph("The house is organised around two deep linear gaps described by the architects as sky rifts. They carry daylight and air through the composition, support cross-ventilation and make changing sun and shadow part of the daily experience. The house therefore reads less as a sealed object and more as a pavilion distributed between garden, interior and roof.", styles["Bodyx"]), Paragraph("The second rift draws movement upward. High walls and roofs at several levels frame the orchard, create shade and reactivate the roof as a place for films, night gatherings and stargazing. A dense brick core binds these routes together and gives the internal sequence a tactile continuity.", styles["Bodyx"]), photo_block(source_photo(10), "Rooftop sky-watching platform", 100*mm), PageBreak()]

story += [Paragraph("KEY QUESTIONS / 04", styles["Kicker"]), Paragraph("Read the project through four questions", styles["H1x"]), question_box("Why preserve the old garden wall?", "Because it carries the physical memory of the orchard and its alleys. The new boundary works behind it, allowing continuity without turning the existing texture into decoration."), Spacer(1, 5*mm), question_box("How does the sunken courtyard respond to climate?", "Its lower level, water and enclosing surfaces create shade and a cooler intermediate zone between the entrance path and the house."), Spacer(1, 5*mm), question_box("What do the two sky rifts do?", "They are not only visual cuts. They organise movement, admit daylight, guide airflow and help the building change character as shadows move."), Spacer(1, 5*mm), question_box("Why is the roof part of the programme?", "The roof becomes an inhabited climatic landscape for outlook, film watching, night gatherings and stargazing rather than a residual technical surface."), PageBreak()]

story += [Paragraph("PHOTOGRAPHIC ARCHIVE / 05", styles["Kicker"]), Paragraph("Thirty documented views", styles["H1x"]), Paragraph("The following pages reproduce the real project photographs used for editorial study. No generated panoramas are included in this PDF.", styles["Bodyx"]), PageBreak()]
for index in range(1, 31, 2):
    story.append(photo_block(source_photo(index), f"Project photograph {index:02d}", 102*mm))
    if index + 1 <= 30:
        story.append(Spacer(1, 4*mm))
        story.append(photo_block(source_photo(index + 1), f"Project photograph {index+1:02d}", 102*mm))
    story.append(PageBreak())

drawing_names = [
    ("diagram-kerman-1.jpg", "Location and climate diagram"),
    ("plan-basment-5.jpg", "Sunken Courtyard Plan"),
    ("plan-groundf-7.jpg", "Ground Floor Plan"),
    ("plan-first-floor-6.jpg", "First Floor Plan"),
    ("elevation-east-2.jpg", "East Elevation"),
    ("elevation-south-3.jpg", "South Elevation"),
    ("elevation-west-4.jpg", "West Elevation"),
    ("section-aa-8.jpg", "Section A-A"), ("section-bb-9.jpg", "Section B-B"),
    ("section-cc-10.jpg", "Section C-C"), ("section-dd-11.jpg", "Section D-D"),
    ("section-ee-12.jpg", "Section E-E"), ("section-ff-13.jpg", "Section F-F"),
    ("section-perspective-east-14.jpg", "Perspective Section - East"),
    ("section-perspective-north-15.jpg", "Perspective Section - North"),
    ("section-perspective-south-16.jpg", "Perspective Section - South"),
    ("section-perspective-west-17.jpg", "Perspective Section - West"),
]
story += [Paragraph("TECHNICAL DRAWING ARCHIVE / 06", styles["Kicker"]), Paragraph("Plans, elevations and sections", styles["H1x"]), Paragraph("The drawings are presented in English for architectural study. Dimensions and levels remain as published; the archive must not be used as construction documentation.", styles["Bodyx"]), PageBreak()]
for filename, label in drawing_names:
    path = DRAWING_ROOT / filename
    w, h = image_size(path, 174*mm, 225*mm)
    story += [Paragraph(label.upper(), styles["Kicker"]), RLImage(str(path), width=w, height=h), Paragraph(f"{label}. Drawing credit: Gera Studio Architects / Contemporary Architecture of Iran.", styles["Caption"]), PageBreak()]

story += [Paragraph("SOURCES AND USE / 07", styles["Kicker"]), Paragraph("Editorial reference notes", styles["H1x"]), Paragraph("Primary project archive: Contemporary Architecture of Iran - Narbon Villa, Kerman, Gera Studio Architects.", styles["Bodyx"]), Paragraph("https://www.caoi.ir/en/projects/item/1855-narbon-villa-kerman-gera-studio.html", styles["Smallx"]), Paragraph("Secondary verification: ArchDaily - Narbon Villa / Gera Studio Architects.", styles["Bodyx"]), Paragraph("https://www.archdaily.com/1008367/narbon-villa-gera-studio-architects", styles["Smallx"]), Spacer(1, 4*mm), Paragraph("All project photographs are credited to Mohammad Hassan Ettefagh. Architectural authorship belongs to Gera Studio Architects. This World Arch Journal guide is an independent English editorial compilation for study and project discovery. The accompanying website tour is clearly identified as an AI-assisted reconstruction and is not a measured survey.", styles["Bodyx"]), Paragraph("Before commercial redistribution, confirm image and drawing permissions with the relevant rights holders.", styles["Bodyx"])]

doc.build(story)
print(OUT)
