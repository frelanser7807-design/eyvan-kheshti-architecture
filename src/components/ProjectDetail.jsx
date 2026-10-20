import { useState } from 'react';

export default function ProjectDetail({ project }) {
  const [zoomed, setZoomed] = useState(null);
  if (!project) return <main className="project-missing"><h1>Project not found.</h1><a href="/projects/">Return to projects</a></main>;
  return (
    <main className="project-detail">
      <header className="projects-shell-header is-overlay">
        <a href="/" className="projects-brand">WORLD ARCH JOURNAL </a>
        <nav><a href="/projects/">All Projects</a><a href={project.tourPath}>Enter Tour</a></nav>
      </header>

      <section className="project-detail-hero">
        <img src={project.cover} alt={project.coverAlt} />
        <span className="project-detail-veil" />
        <div>
          <small>{project.type} · {project.year}</small>
          <h1>{project.title}</h1>
          <p>{project.location}</p>
          <a href={project.tourPath}>{project.tourCta || 'ENTER THE 3D EXPERIENCE'} <b>↗</b></a>
        </div>
      </section>

      <section className="project-detail-intro">
        <div><small>PROJECT READING / 01</small><h2>{project.introHeading || 'A solid white volume, opened by inhabitable voids.'}</h2></div>
        <div><p>{project.description}</p><p>{project.intro || 'The project reconsiders a suburban villa as more than a collection of rooms. Its main architectural idea is a sequence of open, semi-open and enclosed voids that allow movement, light and visual connection across three levels.'}</p></div>
      </section>

      <section className="project-facts" aria-label="Project facts">
        {project.facts.map(([label, value]) => <dl key={label}><dt>{label}</dt><dd>{value}</dd></dl>)}
      </section>

      <section className="project-story">
        <header><small>HISTORY &amp; DESIGN EVOLUTION / 02</small><h2>{project.storyHeading || 'From suburban retreat to a connected spatial landscape.'}</h2></header>
        <div className="project-story-grid">
          {(project.story || [
            ['Context', 'The villa was developed in Koohsar, west of Tehran, where weekend houses support leisure, sociability and a slower way of moving through landscape.'],
            ['Programme', 'Leisure spaces occupy the lower level, shared living spaces sit on the ground floor and private night-time rooms rise above.'],
            ['Void system', 'Open and covered voids connect the full height of the house and bring daylight deeper into the plan.'],
            ['Memory and material', 'White room volumes contrast with brick-toned circulation and voids.'],
          ]).map(([title, body], index) => <article key={title}><b>{String(index + 1).padStart(2, '0')}</b><h3>{title}</h3><p>{body}</p></article>)}
        </div>
      </section>

      {project.questions?.length > 0 && <section className="project-questions" aria-labelledby="project-questions-title">
        <header><small>ARCHITECTURAL QUESTIONS / 03</small><h2 id="project-questions-title">Why is the project shaped this way?</h2></header>
        <div>{project.questions.map(([question, answer], index) => <article key={question}><span>{String(index + 1).padStart(2, '0')}</span><h3>{question}</h3><p>{answer}</p></article>)}</div>
      </section>}

      <section className="project-actions">
        <div><small>EXPLORE &amp; DOWNLOAD / {project.questions?.length ? '04' : '03'}</small><h2>Walk it. Read it. Study it.</h2></div>
        <div>
          <a className="is-primary" href={project.tourPath}><span>01</span><b>{project.tourActionLabel || 'Open the interactive 3D tour'}</b><em>WALK ↗</em></a>
          {project.guidePath && <a href={project.guidePath} download><span>02</span><b>Download the English project guide</b><em>PDF ↓</em></a>}
          {project.drawingPackPath && <a href={project.drawingPackPath} download><span>03</span><b>Download the English drawing pack</b><em>ZIP ↓</em></a>}
        </div>
      </section>

      {project.drawings?.length > 0 && <section className="project-drawings" aria-labelledby="project-drawings-title">
        <header><small>DRAWING ARCHIVE / {project.questions?.length ? '05' : '04'}</small><h2 id="project-drawings-title">Plans, elevations &amp; sections</h2><p>English-language project drawings for architectural study. They must not be used as construction documents.</p></header>
        <div>{project.drawings.map(([label, image]) => <button type="button" key={label} onClick={() => setZoomed([label, image])}><img src={image} alt={`${project.title} ${label}`} loading="lazy" /><span><b>{label}</b><em>ENLARGE ↗</em></span></button>)}</div>
      </section>}

      {project.gallery?.length > 0 && <section className="project-photo-gallery" aria-labelledby="project-gallery-title">
        <header><small>REAL PROJECT PHOTOGRAPHY / 06</small><h2 id="project-gallery-title">Documented views</h2><p>Photography by Mohammad Hassan Ettefagh. The downloadable PDF contains the complete thirty-image archive.</p></header>
        <div>{project.gallery.map((image, index) => <button type="button" key={image} onClick={() => setZoomed([`Project photograph ${index + 1}`, image])}><img src={image} alt={`${project.title} documented project view ${index + 1}`} loading="lazy" /></button>)}</div>
      </section>}

      <section className="project-sources">
        <small>RESEARCH &amp; REPRESENTATION NOTE</small>
        <p>{project.representationNote || 'Project facts and the architects’ stated design intentions were checked against the original project archive and a secondary architecture publication. The 360 tour uses source-locked photographs with AI-assisted peripheral completion and must not be treated as a measured survey.'}</p>
        <div><a href={project.sourceUrl} target="_blank" rel="noopener noreferrer">PRIMARY PROJECT ARCHIVE ↗</a>{project.secondarySourceUrl && <a href={project.secondarySourceUrl} target="_blank" rel="noopener noreferrer">SECONDARY REFERENCE ↗</a>}</div>
      </section>

      {zoomed && <div className="project-lightbox" role="dialog" aria-modal="true" aria-label={zoomed[0]}><button type="button" onClick={() => setZoomed(null)}>×</button><img src={zoomed[1]} alt={`${project.title} ${zoomed[0]}`} /><span>{zoomed[0]}</span></div>}
    </main>
  );
}
