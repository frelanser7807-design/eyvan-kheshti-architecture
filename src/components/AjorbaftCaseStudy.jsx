import { ajorbaft } from '../data/ajorbaft.js';
import './AtlasVillaCaseStudy.css';
import './AjorbaftCaseStudy.css';

export default function AjorbaftCaseStudy() {
  return <main className="atlas-case-page ajorbaft-case-page">
    <header><a href="/">WORLD ARCH JOURNAL <span>BY FARNAZ</span></a><nav><a href="/projects/">Selected work</a><a href="/services/">Design services</a></nav></header>
    <section className="atlas-case-hero" style={{ '--atlas-cover': `url("${ajorbaft.cover}")` }}>
      <div><small>DESIGN STUDY · RESIDENTIAL</small><h1>{ajorbaft.title}</h1><p>{ajorbaft.subtitle}</p><span>{ajorbaft.role}</span></div>
    </section>
    <section className="atlas-case-intro">
      <div><small>PROJECT OVERVIEW</small><h2>Brick, light and outdoor living.</h2></div>
      <div><p>{ajorbaft.description}</p><div className="atlas-case-tags">{ajorbaft.tags.map(tag => <span key={tag}>{tag}</span>)}</div></div>
    </section>
    <section className="ajorbaft-notes" aria-label="Design narrative">
      {ajorbaft.notes.map((note, index) => <article key={note.title}><small>0{index + 1}</small><h2>{note.title}</h2><p>{note.text}</p></article>)}
    </section>
    <section className="atlas-case-gallery" aria-label="Ajorbaft selected design images">
      {ajorbaft.images.map((image, index) => <figure className={`atlas-case-image atlas-case-image-${index + 1}${image.board ? ' ajorbaft-board' : ''}`} key={image.src}>
        <a href={image.src} target="_blank" rel="noopener noreferrer" aria-label={`Open full image: ${image.alt}`}><img src={image.src} alt={image.alt} loading="lazy" decoding="async" /></a><figcaption>{image.caption}</figcaption>
      </figure>)}
    </section>
    <section className="atlas-case-package">
      <div><small>THE DIGITAL PROJECT PACKAGE</small><h2>A preview of the Ajorbaft collection.</h2><p>The complete project package is offered for sale on Etsy. This page presents selected preview images only; the paid plans, sections and interior sheets are not provided as free downloads.</p><p>For package information, contact World Arch Journal. No payment is collected on this page.</p></div>
      <a href="/contact/">Ask about the package <span>↗</span></a>
    </section>
    <aside className="ajorbaft-disclosure"><strong>About these images</strong><p>{ajorbaft.disclosure}</p></aside>
    <footer><a href="/projects/atlas-villa/">Next design study: Atlas Villa ↗</a><a href="/projects/">Back to selected work</a></footer>
  </main>;
}

