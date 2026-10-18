import { legalPages } from '../data/legalPages.js';

export function legalPageForPath(pathname) {
  const normalized = pathname.endsWith('/') ? pathname : `${pathname}/`;
  return legalPages[normalized] || null;
}

export default function LegalPage({ page }) {
  return (
    <main className="ek-legal-page" id="main-content">
      <a className="ek-legal-brand" href="/">WORLD ARCH JOURNAL <small>ARCHITECTURE &amp; INTERIORS</small></a>
      <article>
        <small>{page.eyebrow}</small>
        <h1>{page.title}</h1>
        {page.portrait ? <div className="ek-publisher-intro">
          <p className="ek-legal-intro">{page.intro}</p>
          <figure className="ek-publisher-portrait">
            <picture><source srcSet={page.portrait.srcWebp} type="image/webp" /><img src={page.portrait.src} alt={page.portrait.alt} width={page.portrait.width} height={page.portrait.height} decoding="async" /></picture>
            <figcaption>{page.portrait.caption}</figcaption>
          </figure>
        </div> : <p className="ek-legal-intro">{page.intro}</p>}
        <p className="ek-legal-date">Last updated: <time dateTime={page.lastUpdated || '2026-09-27'}>{new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${page.lastUpdated || '2026-09-27'}T12:00:00Z`))}</time></p>
        {page.sections.map(([title, body]) => <section key={title}><h2>{title}</h2>{Array.isArray(body) ? <ul>{body.map((item) => <li key={item}>{item}</li>)}</ul> : <p>{body}</p>}</section>)}
        {page.links?.length > 0 && <nav aria-label="Related editorial information">{page.links.map((link) => <p key={link.url}><a href={link.url}>{link.label} ↗</a></p>)}</nav>}
      </article>
      <footer><a href="/">Return to the studio</a><span>{page.eyebrow === 'EDITORIAL' || page.eyebrow === 'ABOUT THE PUBLISHER' ? 'Independent publishing. Attributed sources. Transparent corrections.' : 'Legal information will be reviewed again before commercial launch.'}</span></footer>
    </main>
  );
}
