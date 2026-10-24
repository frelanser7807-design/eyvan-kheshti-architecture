import { projects } from '../data/projects.js';
import { atlasVilla } from '../data/atlasVilla.js';
import { ajorbaft } from '../data/ajorbaft.js';

export function ProjectCoverGrid({ compact = false }) {
  return (
    <div className={`project-cover-grid ${compact ? 'is-compact' : ''}`}>
      {projects.map((project, index) => (
        <a className="project-cover-card" href={project.detailPath} key={project.id} aria-label={`Explore ${project.title}`}>
          <img src={project.cover} alt={project.coverAlt} loading={index ? 'lazy' : 'eager'} decoding="async" />
          <span className="project-cover-shade" />
          <span className="project-cover-number">{String(index + 1).padStart(2, '0')}</span>
          <span className="project-cover-brand"><i />WORLD <b>ARCH</b><i /><em>JOURNAL</em></span>
          <span className="project-cover-copy">
            <strong>{project.title}</strong>
            <small>IMMERSIVE PROJECT</small>
            <span className="project-cover-badges">{project.features.map((feature) => <i key={feature}>{feature}</i>)}</span>
            <em>VIEW PROJECT <b>↗</b></em>
          </span>
        </a>
      ))}
      <article className="project-cover-card project-cover-atlas">
        <img src={atlasVilla.cover} alt="Atlas Villa residential architecture design study" loading="lazy" decoding="async" />
        <span className="project-cover-shade" />
        <span className="project-cover-number">{String(projects.length + 1).padStart(2, '0')}</span>
        <span className="project-cover-brand"><i />WORLD <b>ARCH</b><i /><em>JOURNAL</em></span>
        <div className="project-cover-copy">
          <small>SELECTED STUDIO DESIGN</small>
          <strong>Atlas Villa</strong>
          <span className="project-cover-badges">{atlasVilla.tags.slice(0, 3).map((tag) => <i key={tag}>{tag}</i>)}</span>
          <div className="project-cover-atlas-actions"><a href={atlasVilla.path}>VIEW DESIGN STUDY ↗</a><a href={atlasVilla.etsyUrl} target="_blank" rel="noopener noreferrer">BUY FULL PACKAGE ↗</a></div>
        </div>
      </article>
      <a className="project-cover-card" href={ajorbaft.path} aria-label="Explore Ajorbaft Triplex Brick Residence">
        <img src={ajorbaft.cover} alt="Ajorbaft triplex brick residence exterior visualisation at night" loading="lazy" decoding="async" />
        <span className="project-cover-shade" />
        <span className="project-cover-number">{String(projects.length + 2).padStart(2, '0')}</span>
        <span className="project-cover-brand"><i />WORLD <b>ARCH</b><i /><em>JOURNAL</em></span>
        <span className="project-cover-copy"><strong>Ajorbaft</strong><small>TRIPLEX BRICK RESIDENCE</small><span className="project-cover-badges">{ajorbaft.tags.slice(0, 3).map(tag => <i key={tag}>{tag}</i>)}</span><em>VIEW DESIGN STUDY ↗</em></span>
      </a>
    </div>
  );
}

export function HomeVirtualToursShowcase() {
  return (
    <section className="home-virtual-tours" aria-labelledby="home-virtual-tours-title">
      <header className="home-virtual-tours-heading">
        <div>
          <small>01 / IMMERSIVE PROJECTS · 360°</small>
          <h2 id="home-virtual-tours-title">Walk through the architecture.</h2>
          <p>Enter the spatial tour first, then open the project archive for photographs, English drawings and the downloadable PDF guide.</p>
        </div>
        <a href="/projects/">VIEW ALL PROJECTS <span aria-hidden="true">↗</span></a>
      </header>

      <div className="home-virtual-tours-grid">
        {projects.map((project, index) => (
          <article className="home-virtual-tour-card" key={project.id}>
            <img src={project.cover} alt={project.coverAlt} loading={index ? 'lazy' : 'eager'} decoding="async" />
            <span className="home-virtual-tour-veil" aria-hidden="true" />
            <div className="home-virtual-tour-copy">
              <span className="home-virtual-tour-kicker">{String(index + 1).padStart(2, '0')} · {project.tourLive === false ? 'VIRTUAL TOUR IN REBUILD' : 'LIVE VIRTUAL TOUR'}</span>
              <h3>{project.title}</h3>
              <p>{project.location} · {project.studio}</p>
              <span className="home-virtual-tour-features">
                {project.features.map((feature) => <i key={feature}>{feature}</i>)}
              </span>
              <div className="home-virtual-tour-actions">
                {project.tourLive === false
                  ? <a className="is-primary" href={project.detailPath}>VIEW PROJECT FILE <b aria-hidden="true">↗</b></a>
                  : <a className="is-primary" href={project.tourPath}>{project.tourEnterLabel || 'ENTER 360° TOUR'} <b aria-hidden="true">↗</b></a>}
                <a href={project.detailPath}>PLANS, PHOTOS &amp; PDF <b aria-hidden="true">↓</b></a>
              </div>
            </div>
          </article>
        ))}
      </div>
      <article className="home-design-study-card">
        <img src={atlasVilla.cover} alt="Atlas Villa residential architecture design study" loading="lazy" decoding="async" />
        <div className="home-design-study-copy">
          <small>{String(projects.length + 1).padStart(2, '0')} · SELECTED STUDIO DESIGN</small>
          <h3>Atlas Villa</h3>
          <p>Residential architecture · Interior concepts · Visualisation</p>
          <div className="home-virtual-tour-features">{atlasVilla.tags.slice(0, 3).map((tag) => <i key={tag}>{tag}</i>)}</div>
          <div className="home-virtual-tour-actions">
            <a className="is-primary" href={atlasVilla.path}>VIEW DESIGN STUDY <b aria-hidden="true">↗</b></a>
            <a href={atlasVilla.etsyUrl} target="_blank" rel="noopener noreferrer">BUY FULL PACKAGE <b aria-hidden="true">↗</b></a>
          </div>
        </div>
      </article>
      <article className="home-design-study-card">
        <img src={ajorbaft.cover} alt="Ajorbaft red-brick residence exterior design visualisation" loading="lazy" decoding="async" />
        <div className="home-design-study-copy">
          <small>04 · SELECTED DESIGN STUDY</small><h3>Ajorbaft</h3>
          <p>Triplex Brick Residence · Courtyard · Interior spaces</p>
          <div className="home-virtual-tour-actions"><a className="is-primary" href={ajorbaft.path}>VIEW DESIGN STUDY <b aria-hidden="true">↗</b></a></div>
        </div>
      </article>
    </section>
  );
}

export default function ProjectsHub() {
  return (
    <main className="projects-hub">
      <header className="projects-shell-header">
        <a href="/" className="projects-brand">WORLD ARCH JOURNAL </a>
        <nav><a href="/services/">Design services</a><a href="/materials/">Materials</a><a href="/shop/">Shop</a></nav>
      </header>
      <section className="projects-hero">
        <small>IMMERSIVE PROJECT ARCHIVE</small>
        <h1>Projects to enter,<br />study and keep.</h1>
        <p>Explore documented architecture through spatial tours and drawings, and discover the Atlas Villa and Ajorbaft design studies through selected project presentations.</p>
      </section>
      <section className="projects-gallery" aria-labelledby="projects-gallery-title">
        <div className="projects-gallery-heading"><span id="projects-gallery-title">SELECTED PROJECTS</span><b>{String(projects.length).padStart(2, '0')} TOURS · 02 DESIGN STUDIES</b></div>
        <ProjectCoverGrid />
      </section>
      <footer className="projects-footer"><span>© WORLD ARCH JOURNAL</span><a href="/">RETURN HOME</a></footer>
    </main>
  );
}

