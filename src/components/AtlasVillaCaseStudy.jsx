import { atlasVilla } from '../data/atlasVilla.js';
import './AtlasVillaCaseStudy.css';

export default function AtlasVillaCaseStudy() {
  return (
    <main className="atlas-case-page">
      <header><a href="/">WORLD ARCH JOURNAL </a><nav><a href="/projects/">Selected work</a><a href="/services/">Design services</a></nav></header>
      <section className="atlas-case-hero" style={{ '--atlas-cover': `url("${atlasVilla.cover}")` }}>
        <div><small>STUDIO DESIGN STUDY · RESIDENTIAL</small><h1>Atlas Villa</h1><p>{atlasVilla.subtitle}</p><span>{atlasVilla.role}</span></div>
      </section>
      <section className="atlas-case-intro"><div><small>PROJECT OVERVIEW</small><h2>A courtyard-centred home shaped around light and outdoor living.</h2></div><div><p>{atlasVilla.description}</p><div className="atlas-case-tags">{atlasVilla.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div></section>
      <section className="atlas-case-gallery" aria-label="Atlas Villa selected design images">
        {atlasVilla.images.map((image, index) => <figure className={`atlas-case-image atlas-case-image-${index + 1}`} key={image.src}><img src={image.src} alt={image.alt} loading="lazy" /><figcaption>{['INTERIOR CONCEPT · LIVING', 'INTERIOR CONCEPT · BATHROOM', 'GROUND FLOOR PLAN PRESENTATION'][index]}</figcaption></figure>)}
      </section>
      <section className="atlas-case-package"><div><small>THE DIGITAL PROJECT PACKAGE</small><h2>Explore the complete Atlas Villa package.</h2><p>Open the Etsy listing to review the current package contents, file formats, licence, price and delivery details before purchase.</p></div><a href={atlasVilla.etsyUrl} target="_blank" rel="noopener noreferrer">View package on Etsy <span>↗</span></a></section>
      {atlasVilla.relatedLinks?.length > 0 && <section className="atlas-case-related"><small>RELATED READING</small><h2>Continue in the journal</h2><ul>{atlasVilla.relatedLinks.map((link) => <li key={link.url}><a href={link.url}>{link.label}</a></li>)}</ul></section>}
      <footer><a href="/projects/ajorbaft/">Next design study: Ajorbaft ↗</a><a href="/projects/">Back to selected work</a></footer>
    </main>
  );
}

