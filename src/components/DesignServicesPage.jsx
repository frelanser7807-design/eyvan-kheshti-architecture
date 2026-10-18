import './DesignServicesPage.css';

const services = [
  { id: 'villa-design', group: 'WHOLE PROJECT', title: 'Villa & Residential Design', text: 'A coordinated design direction for a new home or a substantial residential redesign—from the brief and spatial concept to agreed presentation outputs.' },
  { id: 'floor-plan', group: 'PLANNING', title: 'Floor Plan Design', text: 'Room layouts and circulation studies shaped around your site, dimensions, lifestyle and priorities. Area-based options can be scoped once the brief is reviewed.' },
  { id: 'facade', group: 'EXTERIOR', title: 'Facade Design', text: 'A clear architectural identity through proportion, openings, material direction, shading and presentation views.' },
  { id: 'kitchen', group: 'INTERIOR · BY SPACE', title: 'Kitchen Design', text: 'Choose a visual concept package or develop a selected direction further. The exact renders, drawings and level of detail will be stated in each package.' },
  { id: 'living-reception', group: 'INTERIOR · BY SPACE', title: 'Living & Reception Design', text: 'A considered room concept covering layout, focal points, lighting atmosphere, finishes and visual presentation.' },
  { id: 'bathroom', group: 'INTERIOR · BY SPACE', title: 'Bathroom Design', text: 'A space-specific interior concept with a carefully coordinated layout, material palette and agreed visual outputs.' },
  { id: 'courtyard-garden', group: 'LANDSCAPE · BY SPACE', title: 'Courtyard & Garden Design', text: 'Outdoor rooms planned for movement, planting, shade, privacy and a stronger relationship to the home.' },
  { id: 'roof-garden', group: 'LANDSCAPE · BY SPACE', title: 'Roof Garden Design', text: 'A roof-level outdoor concept shaped around use, views, planting, privacy and the constraints identified in the brief.' },
  { id: 'renders-only', group: 'VISUALISATION', title: 'Render-Only Concept Options', text: 'A visual comparison of alternative design directions when you need images for a decision or presentation—not a technical drawing package.' },
  { id: 'combined-package', group: 'COMBINED SCOPE', title: 'Combined Design Package', text: 'Bring several rooms or disciplines together—such as floor plan, facade, kitchen, living spaces and landscape—under one coordinated brief.' },
];

function requestLink(id) {
  return `/services/custom-plan-design/?service=${encodeURIComponent(id)}#request`;
}

export default function DesignServicesPage() {
  return (
    <main className="design-services-page">
      <header className="design-services-nav"><a href="/">WORLD ARCH JOURNAL <span>BY FARNAZ</span></a><nav><a href="/projects/">Selected work</a><a href="/services/custom-plan-design/">Project enquiry</a><a href="/payments/">Payments</a></nav></header>
      <section className="design-services-hero">
        <p className="design-services-eyebrow">DESIGN SERVICES · BY FARNAZ GHAFFARIAN</p>
        <h1>One space, one home,<br /><em>or a complete vision.</em></h1>
        <p>Explore focused architectural and interior design services. Choose a single room, landscape area or facade—or combine several into one coordinated residential brief.</p>
        <a className="design-services-primary" href="#service-menu">Explore the services <span>↓</span></a>
      </section>
      <section className="design-services-principles" aria-label="Service approach">
        <article><small>01 / CHOOSE</small><h2>Start with the space</h2><p>Kitchen, living room, bathroom, facade, garden, roof garden or floor plan.</p></article>
        <article><small>02 / SET THE SCOPE</small><h2>Pick the right depth</h2><p>Visual concepts and render-only options stay distinct from packages with drawings and detail.</p></article>
        <article><small>03 / COMBINE</small><h2>Scale to the project</h2><p>Join services into a larger brief. Deliverables, timing and price are agreed before work begins.</p></article>
      </section>
      <section id="service-menu" className="design-services-menu">
        <header><small>THE SERVICE MENU</small><h2>Design, selected around your brief.</h2><p>Each service will have its own clearly defined package. Prices and package contents will be added after they are confirmed.</p></header>
        <div className="design-service-grid">{services.map((service, index) => (
          <article key={service.id}>
            <small>{String(index + 1).padStart(2, '0')} · {service.group}</small>
            <h3>{service.title}</h3><p>{service.text}</p>
            <a href={requestLink(service.id)}>Discuss this service <span>↗</span></a>
          </article>
        ))}</div>
      </section>
      <section className="design-services-scope-note">
        <small>BEFORE WE BEGIN</small><p>Every proposal confirms the project scope, supplied information, deliverables, revision allowance, timing and fee. Engineering, statutory approvals and construction documentation are included only when explicitly agreed and provided by appropriately qualified professionals.</p>
      </section>
      <footer className="design-services-footer"><a href="/projects/atlas-villa/">See the Atlas Villa design study ↗</a><a href="/">Return to World Arch Journal</a></footer>
    </main>
  );
}
