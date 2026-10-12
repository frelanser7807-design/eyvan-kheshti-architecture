from pathlib import Path
from io import BytesIO
from urllib.request import Request, urlopen

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle, Image
from reportlab.lib.utils import ImageReader


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "output" / "pdf"
OUT.mkdir(parents=True, exist_ok=True)
ASSET = ROOT / "tmp" / "atlas-pdf-assets"
ASSET.mkdir(parents=True, exist_ok=True)

INK = colors.HexColor("#202420")
MUTED = colors.HexColor("#5d625c")
ACCENT = colors.HexColor("#896743")
PAPER = colors.HexColor("#f2efe8")
LINE = colors.HexColor("#cdc7ba")

GUIDES = [
    {
        "slug": "istanbul",
        "title": "Istanbul Architecture & Travel Guide",
        "subtitle": "A layered reading of domes, waterfronts, neighbourhoods and contemporary cultural spaces.",
        "number": "01",
        "image": "https://images.unsplash.com/photo-1655832975303-9c474a06ed56?auto=format&fit=crop&fm=jpg&q=82&w=1600",
        "credit": "Cover photo: Akbar Nemati / Unsplash",
        "lens": "Byzantine · Ottoman · Contemporary",
        "places": [
            ("Hagia Sophia", "Read the building as a long sequence of structural, religious and civic transformations."),
            ("Süleymaniye Mosque", "Study how topography, courtyard and dome organise a monumental urban presence."),
            ("Galata and Karaköy", "Trace the shift from historic commercial fabric to a contemporary waterfront district."),
            ("Istanbul Modern", "Compare a new cultural interior with the scale, light and movement of the Bosphorus edge."),
            ("Beylerbeyi and the Bosphorus", "Observe how palace, shore and public movement form a changing architectural horizon."),
        ],
        "routes": [
            ("Historic peninsula half-day", "Begin around Hagia Sophia, continue toward Süleymaniye and read the slope down toward the Golden Horn. Allow time for interiors, queues and prayer schedules."),
            ("Karaköy to the Bosphorus", "Move from the commercial grain of Galata and Karaköy toward the waterfront, then compare contemporary cultural buildings with the historic shore."),
        ],
        "notes": "Istanbul is a large, layered city. Use the guide as an architecture-led framework, confirm opening hours and access with each venue, and plan transport between districts.",
        "sources": ["GoTürkiye: Istanbul", "UNESCO: Historic Areas of Istanbul", "Istanbul Modern: Visitor information"],
    },
    {
        "slug": "antalya",
        "title": "Antalya Architecture & Travel Guide",
        "subtitle": "A coastal city read through Kaleiçi, Roman thresholds, Seljuk landmarks and ancient regional sites.",
        "number": "02",
        "image": "https://images.unsplash.com/photo-1654162201495-aee8a4ba5521?auto=format&fit=crop&q=82&w=1600",
        "credit": "Cover photo: Igor Sporynin / Unsplash",
        "lens": "Roman · Seljuk · Ottoman",
        "places": [
            ("Hadrian’s Gate", "Examine the Roman triumphal gateway and its relationship to today’s street edge."),
            ("Kaleiçi lanes", "Look for overhanging upper floors, shaded passages and courtyard thresholds."),
            ("Yivli Minare", "Study the distinctive fluted minaret and the Seljuk urban layer around it."),
            ("Perge", "Trace the ancient street and civic plan on a dedicated regional visit."),
            ("Aspendos", "Focus on the scale, acoustical form and collective experience of the Roman theatre."),
        ],
        "routes": [
            ("Kaleiçi walking loop", "Begin at Hadrian’s Gate, follow the old-town lanes toward Yivli Minare, then descend toward the historic harbour. Allow about two hours for an exterior-focused walk, more with interiors or stops."),
            ("Ancient-city study day", "Treat Perge and Aspendos as a separate excursion. Compare the organisation of a Roman urban site with a theatre conceived for collective spectacle."),
        ],
        "notes": "Uneven paving, slopes and regional travel times matter. Confirm access, opening hours and transport directly with the relevant venue before departure.",
        "sources": ["GoTürkiye: Antalya sights", "Türkiye Museums: Perge", "Türkiye Museums: Aspendos brochure"],
    },
    {
        "slug": "cappadocia",
        "title": "Cappadocia Architecture & Travel Guide",
        "subtitle": "A cultural landscape where architecture is carved, inhabited and inseparable from geology.",
        "number": "03",
        "image": "https://images.unsplash.com/photo-1733035997497-90897c722c84?auto=format&fit=crop&q=82&w=1600",
        "credit": "Cover photo: Igor Sporynin / Unsplash",
        "lens": "Rock-cut · Vernacular · Sacred",
        "places": [
            ("Göreme Open-Air Museum", "Study the arrangement of rock-cut religious spaces and the relationship between enclosure and landscape."),
            ("Göreme town", "Look at the transition between carved rooms and later built fabric."),
            ("Uçhisar", "Consider settlement, elevation and the region’s visual geography."),
            ("Valley paths", "Notice how openings, slopes and landform define movement."),
            ("Kaymaklı or Derinkuyu", "Choose one underground town to study vertical circulation and enclosure."),
        ],
        "routes": [
            ("Göreme close reading", "Begin in Göreme, visit the Open-Air Museum, then return through the town to compare carved and built spaces. Allow extra time for queues and terrain."),
            ("Regional settlement study", "Pair Uçhisar with either Kaymaklı or Derinkuyu on a separate day. The underground towns are alternatives, not mandatory duplicate stops."),
        ],
        "notes": "Exposed paths and carved interiors are not uniformly accessible. Check museum access, trail conditions and weather locally; underground spaces can be narrow or steep.",
        "sources": ["UNESCO: Göreme National Park and the Rock Sites of Cappadocia", "GoTürkiye: See Cappadocia", "Türkiye Museums: Göreme Open-Air Museum"],
    },
]


def fetch_cover(url: str, slug: str) -> Path | None:
    target = ASSET / f"{slug}.jpg"
    if target.exists() and target.stat().st_size > 20000:
        return target
    try:
        req = Request(url, headers={"User-Agent": "WorldArchJournal-PDF/1.0"})
        data = urlopen(req, timeout=30).read()
        target.write_bytes(data)
        return target
    except Exception:
        return None


def p(text, style):
    return Paragraph(text.replace("&", "&amp;"), style)


def footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(LINE)
    canvas.line(18 * mm, 14 * mm, 192 * mm, 14 * mm)
    canvas.setFillColor(MUTED)
    canvas.setFont("Helvetica", 8)
    canvas.drawString(18 * mm, 9 * mm, "WORLD ARCH ATLAS · WORLD ARCH JOURNAL")
    canvas.drawRightString(192 * mm, 9 * mm, f"{doc.page}")
    canvas.restoreState()


def build_guide(guide):
    path = OUT / f"world-arch-atlas-{guide['slug']}-architecture-travel-guide.pdf"
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(name="Kicker", parent=styles["Normal"], fontName="Helvetica-Bold", fontSize=8, leading=11, textColor=ACCENT, spaceAfter=7, tracking=1.2))
    styles.add(ParagraphStyle(name="TitleWA", parent=styles["Title"], fontName="Times-Bold", fontSize=31, leading=32, textColor=INK, spaceAfter=12))
    styles.add(ParagraphStyle(name="Sub", parent=styles["Normal"], fontName="Times-Roman", fontSize=14, leading=19, textColor=MUTED, spaceAfter=18))
    styles.add(ParagraphStyle(name="H2WA", parent=styles["Heading2"], fontName="Times-Bold", fontSize=21, leading=24, textColor=INK, spaceBefore=10, spaceAfter=10))
    styles.add(ParagraphStyle(name="H3WA", parent=styles["Heading3"], fontName="Helvetica-Bold", fontSize=11, leading=14, textColor=INK, spaceBefore=5, spaceAfter=3))
    styles.add(ParagraphStyle(name="BodyWA", parent=styles["BodyText"], fontName="Helvetica", fontSize=9.5, leading=14, textColor=MUTED, spaceAfter=7))
    styles.add(ParagraphStyle(name="SmallWA", parent=styles["BodyText"], fontName="Helvetica", fontSize=8, leading=11, textColor=MUTED, spaceAfter=5))
    styles.add(ParagraphStyle(name="QuoteWA", parent=styles["BodyText"], fontName="Times-Italic", fontSize=13, leading=17, textColor=INK, leftIndent=12, borderColor=ACCENT, borderWidth=1, borderPadding=8, spaceBefore=8, spaceAfter=12))

    story = []
    cover = fetch_cover(guide["image"], guide["slug"])
    story.append(p(f"WORLD ARCH ATLAS / TÜRKIYE / {guide['number']}", styles["Kicker"]))
    story.append(p(guide["title"], styles["TitleWA"]))
    story.append(p(guide["subtitle"], styles["Sub"]))
    if cover:
        im = Image(str(cover), width=174 * mm, height=90 * mm)
        im.hAlign = "LEFT"
        story.append(im)
        story.append(p(guide["credit"], styles["SmallWA"]))
    story.append(Spacer(1, 4 * mm))
    facts = [[p("ARCHITECTURAL LENS", styles["Kicker"]), p("GUIDE STATUS", styles["Kicker"]), p("WEB EDITION", styles["Kicker"])], [p(guide["lens"], styles["BodyWA"]), p("Editorial guide · reviewed 08 October 2026", styles["BodyWA"]), p(f"worldarchjournal.com/atlas/turkiye/{guide['slug']}/", styles["BodyWA"])]]
    t = Table(facts, colWidths=[58 * mm, 58 * mm, 58 * mm])
    t.setStyle(TableStyle([("BOX", (0, 0), (-1, -1), 0.5, LINE), ("INNERGRID", (0, 0), (-1, -1), 0.5, LINE), ("BACKGROUND", (0, 0), (-1, 0), PAPER), ("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 8), ("RIGHTPADDING", (0, 0), (-1, -1), 8), ("TOPPADDING", (0, 0), (-1, -1), 7), ("BOTTOMPADDING", (0, 0), (-1, -1), 7)]))
    story.append(t)
    story.append(PageBreak())

    story.append(p("01 / ORIENTATION", styles["Kicker"]))
    story.append(p("Read the city in layers.", styles["H2WA"]))
    story.append(p(guide["notes"], styles["BodyWA"]))
    story.append(p("This downloadable edition is an editorial companion to the live guide. It is not a booking service, does not make a current price or availability claim, and does not replace official venue information.", styles["QuoteWA"]))
    story.append(p("02 / ARCHITECTURE", styles["Kicker"]))
    story.append(p("Five places to study.", styles["H2WA"]))
    for name, desc in guide["places"]:
        story.append(p(name, styles["H3WA"]))
        story.append(p(desc, styles["BodyWA"]))
    story.append(PageBreak())

    story.append(p("03 / ARCHITECTURE ROUTES", styles["Kicker"]))
    story.append(p("Two ways to explore.", styles["H2WA"]))
    for name, desc in guide["routes"]:
        story.append(p(name, styles["H3WA"]))
        story.append(p(desc, styles["BodyWA"]))
    story.append(p("04 / PRACTICAL NOTES", styles["Kicker"]))
    story.append(p("Use the live page for links and updates.", styles["H2WA"]))
    story.append(p("Opening hours, access, weather, transport, trail conditions and venue policies can change. Re-check the official source before travelling. The web edition contains live Google Maps links and the current source list.", styles["BodyWA"]))
    story.append(p(f"Open the live guide: https://worldarchjournal.com/atlas/turkiye/{guide['slug']}/", styles["QuoteWA"]))
    story.append(PageBreak())

    story.append(p("05 / RESEARCH NOTES", styles["Kicker"]))
    story.append(p("Sources and editorial boundary.", styles["H2WA"]))
    for source in guide["sources"]:
        story.append(p(f"• {source}", styles["BodyWA"]))
    story.append(Spacer(1, 6 * mm))
    story.append(p("The routes and architecture readings in this edition are World Arch Journal’s synthesis of the cited material. Venue ownership, entry conditions and commercial availability remain with the official provider. No affiliate relationship is implied by this guide; any future partner link will be labelled and activated only after verification.", styles["BodyWA"]))
    story.append(Spacer(1, 12 * mm))
    story.append(p("Download the latest edition from the Atlas page", styles["H3WA"]))
    story.append(p("https://worldarchjournal.com/atlas/", styles["BodyWA"]))
    doc = SimpleDocTemplate(str(path), pagesize=A4, rightMargin=18 * mm, leftMargin=18 * mm, topMargin=17 * mm, bottomMargin=20 * mm, title=guide["title"], author="World Arch Journal")
    doc.build(story, onFirstPage=footer, onLaterPages=footer)
    print(path)


for item in GUIDES:
    build_guide(item)
