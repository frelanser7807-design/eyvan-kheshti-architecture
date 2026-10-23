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
    {
        "slug": "dubai",
        "country": "uae",
        "country_label": "UAE",
        "title": "Dubai Architecture & Travel Guide",
        "subtitle": "A creek trading town and a vertical metropolis, read at two speeds.",
        "number": "04",
        "image": "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3d/Burj_Khalifa_Night_View_01.jpg/1280px-Burj_Khalifa_Night_View_01.jpg",
        "credit": "Cover photo: Sergei Gussev / Wikimedia Commons / CC BY 2.0",
        "lens": "Supertall · Vernacular · Futurist",
        "places": [
            ("Al Fahidi Historical Neighbourhood", "Study the barjeel wind towers: how a pre-electric city caught the breeze, and how coral stone, gypsum and shaded lanes compose the street."),
            ("Dubai Creek by abra", "Cross on the wooden boats and read the working waterfront: dhows, trading logic, the waterline that explains the city’s position."),
            ("Burj Khalifa", "SOM’s buttressed core and Y-shaped plan rise 828 metres in spiralling setbacks drawn from regional geometry."),
            ("Museum of the Future", "Killa Design’s 77-metre torus on Sheikh Zayed Road — the facade is Arabic calligraphy, the message written on the building."),
            ("Dubai Frame", "A 150-metre frame in Zabeel Park that stages old and new Dubai as two composed views — one side each."),
        ],
        "routes": [
            ("Creek walking loop", "Begin in Al Fahidi before the heat builds, cross the Creek by abra, then work through the Deira souks on foot. Allow about three hours for an exterior-focused loop, more with museum stops."),
            ("Sheikh Zayed Road & Downtown", "Take the Metro Red Line along the city’s spine: Museum of the Future, then Dubai Frame at Zabeel Park, then on to Burj Khalifa and Downtown for the evening. Use the metro between districts — the highway scale defeats walking."),
        ],
        "notes": "October to April is the walking season. Plan outdoor routes for morning and evening and keep midday for interiors — this is a city designed around shade and air-conditioning, and your itinerary should be too.",
        "sources": ["Visit Dubai: official visitor information", "Burj Khalifa: official site", "Museum of the Future: official site", "SOM: Burj Khalifa project"],
    },
    {
        "slug": "baku",
        "country": "azerbaijan",
        "country_label": "AZERBAIJAN",
        "title": "Baku Architecture & Travel Guide",
        "subtitle": "A walled medieval city on the Caspian shore, and the theatrical skyline rising behind it.",
        "number": "05",
        "image": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a1/HEIDAR_ALIYEV_CENTER_WIDE_ANGLE.%D7%96%D7%95%D7%95%D7%99%D7%AA_%D7%A8%D7%97%D7%91%D7%94_%D7%9E%D7%A8%D7%9B%D7%96_%D7%94%D7%99%D7%99%D7%93%D7%A8_%D7%90%D7%9C%D7%99%D7%99%D7%91.jpg/1280px-HEIDAR_ALIYEV_CENTER_WIDE_ANGLE.%D7%96%D7%95%D7%95%D7%99%D7%AA_%D7%A8%D7%97%D7%91%D7%94_%D7%9E%D7%A8%D7%9B%D7%96_%D7%94%D7%99%D7%99%D7%93%D7%A8_%D7%90%D7%9C%D7%99%D7%99%D7%91.jpg",
        "credit": "Cover photo: Avisadehh / Wikimedia Commons / CC0",
        "lens": "Medieval · Oil-Boom · Parametric",
        "places": [
            ("Icherisheher (Old City)", "Enter through the Double Gates and read the walled fabric: stone lanes, bathhouses, caravanserais and carved wooden balconies composing a complete medieval town."),
            ("Maiden Tower (Qız Qalası)", "The twelfth-century stone cylinder at the Old City's edge — part watchtower, part enduring mystery. Climb it for the panorama over the bay and the rooftops."),
            ("Palace of the Shirvanshahs", "The fifteenth-century palace complex at the city's high point — Divankhana, mosque, mausoleum and baths in honey-coloured stone."),
            ("Heydar Aliyev Center", "Zaha Hadid's 2012 landmark: one continuous surface folding from plaza to roof without a straight line. Study the plaza first; the building is the landscape."),
            ("Flame Towers", "Three flame-shaped towers on the hill above the bay, their LED facades running fire animations after dark — the second oil age's city symbol."),
        ],
        "routes": [
            ("Old City walking loop", "Enter through the Double Gates, climb to the Shirvanshahs' Palace first, then descend through the lanes to the Maiden Tower and out along the walls. Allow around two and a half hours, more with interiors."),
            ("Boulevard to Highland Park", "Walk the Caspian promenade from the Carpet Museum past the Baku Eye and Little Venice, then ride the funicular to the Highland Park terrace for the bay panorama. Time the top of the hill for the hour before sunset."),
        ],
        "notes": "Baku is the City of Winds: the khazri blows off the Caspian and can turn a boulevard walk into an exposed one. Spring and autumn are the walking seasons. Use the guide as an architecture-led framework and confirm opening hours and access with each venue.",
        "sources": ["UNESCO: Walled City of Baku with the Shirvanshah's Palace and Maiden Tower", "Azerbaijan Travel: official visitor information", "Zaha Hadid Architects: Heydar Aliyev Centre"],
    },
    {
        "slug": "tbilisi",
        "country": "georgia",
        "country_label": "GEORGIA",
        "title": "Tbilisi Architecture & Travel Guide",
        "subtitle": "A cliff-and-river reading of fortresses, domed bathhouses, carved balconies and the glass icons of the new city.",
        "number": "06",
        "image": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/51/Narikala%2C_Tiflis%2C_Georgia%2C_2016-09-29%2C_DD_91.jpg/1280px-Narikala%2C_Tiflis%2C_Georgia%2C_2016-09-29%2C_DD_91.jpg",
        "credit": "Cover photo: Diego Delso / Wikimedia Commons / CC BY-SA 4.0",
        "lens": "Fortress · Bathhouse · Glass",
        "places": [
            ("Narikala Fortress", "The fourth-century citadel crowning the ridge — Persian in origin, rebuilt over sixteen centuries. Walk the walls for the city's defining panorama; the cable car from Rike Park climbs in about two minutes."),
            ("Metekhi Church", "The thirteenth-century church on the cliff above the Mtkvari, watched over by the statue of King Vakhtang Gorgasali — the legendary fifth-century founder. Study the perch before the building: the site is the composition."),
            ("Abanotubani", "The sulfur-bath district at the city's root: brick domes and vaulted roofs rising straight from the ground, the most intact of them the blue-tiled Orbeliani bathhouse. Read the district as one piece of thermal infrastructure."),
            ("Bridge of Peace", "Michele De Lucchi's 2010 bow — 150 metres of steel and glass spanning the Mtkvari to Rike Park, lit at night by LEDs that blink the periodic table in Morse code. Cross it at dusk."),
            ("Sameba (Holy Trinity Cathedral)", "The cathedral complex on St Elijah hill in Avlabari — one of the largest Orthodox churches built in the modern era. The courtyard at sunset, belltower against the foothills, is the composed view."),
        ],
        "routes": [
            ("Old Town walking loop", "Start at Meidan Square, walk through Abanotubani past the bathhouse domes, follow the Leghvtakhevi gorge to its waterfall, then climb the ridge to Narikala and the Kartlis Deda statue. Descend through the lanes to Sioni Cathedral and Shardeni Street. Allow three hours unhurried."),
            ("Bridge of Peace to Sameba", "Cross the Bridge of Peace from Rike Park at dusk, continue through Europe Square and climb Avlabari to the Sameba Cathedral terrace — river, ridge and foothills read in one sequence. Time the terrace for sunset."),
        ],
        "notes": "Tbilisi is a city of hills: the ridge and gorge sections are steep and exposed, so mix walking with the cable car and Bolt rides. Spring and autumn are the walking seasons. Use the guide as an architecture-led framework and confirm opening hours and access with each venue.",
        "sources": ["Georgia Travel: official visitor information", "The Georgian Guide: Tbilisi Old Town walking tour", "Madloba: Narikala Fortress guide"],
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
    story.append(p(f"WORLD ARCH ATLAS / {guide.get('country_label', 'TÜRKIYE')} / {guide['number']}", styles["Kicker"]))
    story.append(p(guide["title"], styles["TitleWA"]))
    story.append(p(guide["subtitle"], styles["Sub"]))
    if cover:
        im = Image(str(cover), width=174 * mm, height=90 * mm)
        im.hAlign = "LEFT"
        story.append(im)
        story.append(p(guide["credit"], styles["SmallWA"]))
    story.append(Spacer(1, 4 * mm))
    facts = [[p("ARCHITECTURAL LENS", styles["Kicker"]), p("GUIDE STATUS", styles["Kicker"]), p("WEB EDITION", styles["Kicker"])], [p(guide["lens"], styles["BodyWA"]), p("Editorial guide · reviewed 08 October 2026", styles["BodyWA"]), p(f"worldarchjournal.com/atlas/{guide.get('country', 'turkiye')}/{guide['slug']}/", styles["BodyWA"])]]
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
    story.append(p(f"Open the live guide: https://worldarchjournal.com/atlas/{guide.get('country', 'turkiye')}/{guide['slug']}/", styles["QuoteWA"]))
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
