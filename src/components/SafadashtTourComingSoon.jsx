import { projectBySlug } from '../data/projects.js';

export default function SafadashtTourComingSoon() {
  const project = projectBySlug('villa-safadasht');
  if (!project) return <main className="project-missing"><h1>Project not found.</h1><a href="/projects/">Return to projects</a></main>;
  return (
    <main className="project-detail tour-coming-soon">
      <header className="projects-shell-header is-overlay">
        <a href="/" className="projects-brand">WORLD ARCH JOURNAL </a>
        <nav><a href="/projects/">All Projects</a><a href={project.detailPath}>Project File</a></nav>
      </header>

      <section className="project-detail-hero">
        <img src={project.cover} alt={project.coverAlt} />
        <span className="project-detail-veil" />
        <div>
          <small>VIRTUAL TOUR · IN REBUILD</small>
          <h1>{project.title}</h1>
          <p>{project.location}</p>
          <a href={project.detailPath}>OPEN THE PROJECT FILE <b>↗</b></a>
        </div>
      </section>

      <section className="project-detail-intro">
        <div><small>COMING SOON</small><h2>This virtual tour is being rebuilt.</h2></div>
        <div>
          <p>The previous Villa Safadasht tour did not meet the standard this journal publishes, so we have taken it down while a new tour is prepared. When the tour returns, it will be because it is ready — not before.</p>
          <p>Until then, the complete project file is open: the garden-axis story, schematic plans and sections, and the full PDF project guide.</p>
          <p><a href={project.detailPath}>Read the Villa Safadasht project file</a>{project.guidePath && <> · <a href={project.guidePath} download>Download the PDF project guide</a></>}</p>
        </div>
      </section>
    </main>
  );
}
