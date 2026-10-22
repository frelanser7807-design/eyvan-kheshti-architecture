import { defaultContent } from '../data/defaultContent.js';

const shell = {
  background: 'var(--ink)',
  color: 'var(--paper)',
  minHeight: '100vh',
  padding: 'clamp(48px, 8vw, 110px) clamp(20px, 6vw, 72px) 80px',
};

const inner = { maxWidth: '1080px', margin: '0 auto' };
const eyebrow = {
  fontSize: '0.72rem',
  letterSpacing: '0.32em',
  textTransform: 'uppercase',
  color: 'var(--sand)',
  margin: '0 0 18px',
};
const title = {
  fontFamily: 'Georgia, serif',
  fontWeight: 400,
  fontSize: 'clamp(2rem, 5vw, 3.4rem)',
  lineHeight: 1.15,
  margin: '0 0 16px',
};
const intro = { color: 'var(--muted)', lineHeight: 1.8, maxWidth: '760px', margin: '0 0 12px' };
const sectionTitle = {
  fontFamily: 'Georgia, serif',
  fontSize: 'clamp(1.4rem, 2.6vw, 2rem)',
  fontWeight: 400,
  margin: '56px 0 14px',
};
const paragraph = { color: 'var(--muted)', lineHeight: 1.85, maxWidth: '760px', margin: '0 0 14px' };

const columns = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '1px',
  background: 'var(--line)',
  border: '1px solid var(--line)',
  margin: '8px 0 8px',
};
const card = { background: 'var(--ink)', padding: '28px' };
const cardLabel = { fontSize: '0.72rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--sand)', margin: '0 0 10px' };
const cardText = { color: 'var(--muted)', fontSize: '0.95rem', margin: 0, lineHeight: 1.7 };

const founderWrap = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
  gap: '32px',
  alignItems: 'center',
  marginTop: '8px',
};
const markFigure = { margin: 0, textAlign: 'center' };
const markImage = { width: '150px', height: '150px', objectFit: 'contain' };
const markCaption = { color: 'var(--muted)', fontSize: '0.85rem', marginTop: '12px', lineHeight: 1.6 };

const ctaRow = { display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '28px' };
const ctaPrimary = {
  padding: '14px 40px',
  border: '1px solid var(--sand)',
  background: 'var(--sand)',
  color: 'var(--ink)',
  letterSpacing: '0.18em',
  fontSize: '0.78rem',
  textTransform: 'uppercase',
  textDecoration: 'none',
};
const ctaSecondary = {
  padding: '14px 40px',
  border: '1px solid var(--line)',
  color: 'var(--paper)',
  letterSpacing: '0.18em',
  fontSize: '0.78rem',
  textTransform: 'uppercase',
  textDecoration: 'none',
};
const textLink = { color: 'var(--paper)', textDecoration: 'none', borderBottom: '1px solid var(--sand)', paddingBottom: '2px' };

const studioServices = [
  { label: 'Architectural Design', text: 'Villas and residential buildings designed from first sketch to a coordinated drawing set.' },
  { label: 'Floor Plans', text: 'New layouts and plan revisions shaped around daylight, movement, privacy and your way of living.' },
  { label: 'Facade Design', text: 'Elevations with a clear material logic — including mechanically fixed brick and contemporary cladding systems.' },
  { label: 'Interior Architecture', text: 'Kitchens, living spaces, bathrooms and full interiors with materials and dimensions resolved, not guessed.' },
  { label: 'Courtyards & Gardens', text: 'Outdoor rooms, courtyards and roof gardens planned for shade, privacy and connection to the home.' },
  { label: 'Visualisation & Presentation', text: 'Renders, walkthroughs and presentation boards that explain a design decision to clients and juries.' },
];

export default function AboutPage() {
  const brand = defaultContent.brand || {};
  const name = brand.name || 'WORLD ARCH JOURNAL';

  return (
    <main style={shell}>
      <div style={inner}>
        <p style={eyebrow}>About · {name}</p>
        <h1 style={title}>An architecture journal with a working studio behind it.</h1>
        <p style={intro}>
          World Arch Journal is an independent architecture publication and remote design studio.
          We publish evidence-led guides, dated briefings and field notes on how buildings are
          designed, built and improved — and we design homes, facades and interiors for clients
          around the world.
        </p>

        <h2 style={sectionTitle}>The journal</h2>
        <p style={paragraph}>
          The journal exists to make architectural knowledge usable. Every substantial story is
          original, illustrated and sourced: we separate verified facts from editorial analysis
          and from design propositions, cite our sources, and correct errors openly under our{' '}
          <a style={textLink} href="/editorial-policy/">editorial standards</a>. Alongside
          long-form guides, the site carries a dated news briefing, an analysis archive, a free
          material library with downloadable PBR textures, and a growing collection of project
          studies and virtual tours.
        </p>

        <h2 style={sectionTitle}>The studio</h2>
        <p style={paragraph}>
          The same team designs buildings. The studio works remotely — brief, concept, drawings
          and revisions are handled online, so a project can be in any country while the design
          work happens in one place. Whether a plot is empty, a house is half-built, or a
          structure is already standing, the design can still be shaped to its best possible
          version: planned to the client&apos;s taste, compliant with regulations, and precisely
          calculated.
        </p>
        <div style={columns}>
          {studioServices.map((service) => (
            <div key={service.label} style={card}>
              <p style={cardLabel}>{service.label}</p>
              <p style={cardText}>{service.text}</p>
            </div>
          ))}
        </div>
        <p style={paragraph}>
          See the full breakdown on the{' '}
          <a style={textLink} href="/services/">design services page</a>, or browse{' '}
          <a style={textLink} href="/projects/">selected projects</a>.
        </p>

        <h2 style={sectionTitle}>The founder</h2>
        <div style={founderWrap}>
          <div>
            <p style={paragraph}>
              World Arch Journal was founded by an architect and interior designer who has worked
              independently since 2011 — more than fifteen years of practice across residential
              design, building facades and interior projects. The founder is the journal&apos;s
              editor, and leads the studio&apos;s design work personally.
            </p>
            <p style={paragraph}>
              The position behind everything published here is simple: good architecture is not a
              style, it is a series of correct decisions — about light, structure, materials and
              the dimensions of everyday life. The journal publishes those decisions in the open;
              the studio applies them to real projects, remotely and worldwide.
            </p>
          </div>
          <figure style={markFigure}>
            <img
              style={markImage}
              src="/assets/brand/world-arch-wa-mark-v1.png"
              alt="World Arch Journal monogram"
              width="150"
              height="150"
              loading="lazy"
            />
            <figcaption style={markCaption}>
              The World Arch Journal mark. The journal is a brand-first publication — the work
              speaks before the person.
            </figcaption>
          </figure>
        </div>

        <h2 style={sectionTitle}>Start a project</h2>
        <p style={paragraph}>
          Have a plot to design, a plan that needs fixing, or a building to finish properly?
          Send a brief and we will reply within 2 working days.
        </p>
        <div style={ctaRow}>
          <a style={ctaPrimary} href="/contact/">Start your project</a>
          <a style={ctaSecondary} href="/services/">Explore services</a>
        </div>
      </div>
    </main>
  );
}
