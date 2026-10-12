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
const intro = { color: 'var(--muted)', lineHeight: 1.8, maxWidth: '720px', margin: '0 0 12px' };

const grid = { display: 'grid', gap: '1px', background: 'var(--line)', border: '1px solid var(--line)' };
const card = { background: 'var(--ink)', padding: 'clamp(24px, 4vw, 44px)' };
const cardNum = { fontSize: '0.72rem', letterSpacing: '0.28em', color: 'var(--sand)', margin: '0 0 14px' };
const cardTitle = { fontFamily: 'Georgia, serif', fontSize: 'clamp(1.3rem, 2.4vw, 1.8rem)', fontWeight: 400, margin: '0 0 6px' };
const cardDetail = { fontSize: '0.72rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--muted)', margin: '0 0 14px' };
const cardText = { lineHeight: 1.75, color: 'var(--paper)', opacity: 0.88, margin: '0 0 10px' };
const ctaRow = { marginTop: '64px', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' };
const ctaButton = {
  display: 'inline-block',
  padding: '14px 34px',
  border: '1px solid var(--sand)',
  color: 'var(--ink)',
  background: 'var(--sand)',
  textDecoration: 'none',
  letterSpacing: '0.18em',
  fontSize: '0.78rem',
  textTransform: 'uppercase',
};
const ctaNote = { color: 'var(--muted)', fontSize: '0.9rem' };

export default function ServicesPage() {
  const services = defaultContent.services || [];
  return (
    <main style={shell}>
      <div style={inner}>
        <p style={eyebrow}>Services</p>
        <h1 style={title}>Design services, from first line to final detail.</h1>
        <p style={intro}>
          Studio work by Farnaz Ghaffarian for real communication needs: explaining a facade
          decision, organising a spatial proposal, presenting a project to a client, or turning
          technical information into a readable visual narrative.
        </p>

        <div style={grid}>
          {services.map((service) => (
            <article key={service.id} style={card}>
              <p style={cardNum}>{service.number}</p>
              <h2 style={cardTitle}>{service.title}</h2>
              {service.detail ? <p style={cardDetail}>{service.detail}</p> : null}
              {service.text ? <p style={cardText}>{service.text}</p> : null}
            </article>
          ))}
        </div>

        <div style={ctaRow}>
          <a style={ctaButton} href="/contact/">Start a project</a>
          <span style={ctaNote}>Tell us about your project — we reply within 2 working days.</span>
        </div>
      </div>
    </main>
  );
}
