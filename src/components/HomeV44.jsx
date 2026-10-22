import { useEffect, useMemo, useRef } from 'react';
import { assetUrl } from '../lib/assetUrl.js';
import { newsletterIssues } from '../data/newsletters.js';
import './HomeV44.css';

/*
 * Homepage v4.4 — the owner's approved design (mockup v4.4, locked 2026-10-22).
 * True neutral black, Playfair Display + Inter, glass pills, founder film piece 1
 * as hero, film piece 2 as a full-screen story band, FORMA-style numbered
 * projects, the articles deck (fan-out on arrival, settles into a row),
 * materials / explore / services bands, CTA, briefing, shop strip and footer.
 * The retired cinematic player (CinematicSite.jsx) is no longer routed here;
 * it remains in the repository untouched.
 */

const FILMS = {
  hero: '/assets/film/00-digital-founder-intro.mp4',
  piece2: '/assets/film/founder-intro-plus-entrance.mp4',
  materials: '/assets/film/chapters/06-material-lab.mp4',
  practice: '/assets/film/chapters/07-design-desk.mp4',
};

function FilmVideo({ src, poster, className, label }) {
  const ref = useRef(null);
  useEffect(() => {
    const video = ref.current;
    if (!video) return undefined;
    if (!('IntersectionObserver' in window)) {
      video.play?.().catch(() => undefined);
      return undefined;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) video.play?.().catch(() => undefined);
        else video.pause?.();
      });
    }, { threshold: 0.18 });
    observer.observe(video);
    return () => observer.disconnect();
  }, []);
  return (
    <video
      ref={ref}
      className={className}
      src={assetUrl(src)}
      poster={poster ? assetUrl(poster) : undefined}
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={label}
    />
  );
}

/* Architectural photographs are never cropped: the whole image sits on a
   blurred, darkened copy of itself. */
function FitImage({ src, alt, className }) {
  return (
    <span className={`hv-fit ${className || ''}`}>
      <span className="hv-fit-bg" style={{ backgroundImage: `url(${assetUrl(src)})` }} aria-hidden="true" />
      <img src={assetUrl(src)} alt={alt} loading="lazy" decoding="async" />
    </span>
  );
}

const projects = [
  {
    num: '01',
    title: 'Narbon Villa',
    meta: 'Private Residence · Virtual Tour · 2026',
    src: 'Cover: World Arch Journal',
    cover: '/assets/covers/tour-narbon.jpg',
    alt: 'Narbon Villa — World Arch Journal project cover',
    href: '/projects/narbon-villa/',
  },
  {
    num: '02',
    title: 'The Voids',
    meta: 'Private Residence · Virtual Tour · 2026',
    src: 'Cover: World Arch Journal',
    cover: '/assets/covers/tour-voids.jpg',
    alt: 'The Voids — World Arch Journal project cover',
    href: '/projects/the-voids-villa/',
  },
  {
    num: '03',
    title: 'Ajorbaft Triplex Villa',
    meta: 'Triplex Villa · Design Project · 2026',
    src: 'Cover: World Arch Journal',
    cover: '/assets/covers/project-ajorbaft.jpg',
    alt: 'Ajorbaft Villa — World Arch Journal project cover',
    href: '/projects/',
  },
];

const deckArticles = [
  {
    slug: 'modern-villa-reimagined-7-design-principles',
    kicker: 'Design',
    title: 'Modern Villa Design Reimagined: 7 Principles for Contemporary Living',
    cover: '/assets/covers/article-modern-villa.jpg',
    alt: 'Modern Villa Reimagined article cover',
    source: 'Cover: World Arch Journal',
  },
  {
    slug: 'accessory-dwelling-units-complete-guide',
    kicker: 'Guides',
    title: 'Accessory Dwelling Units (ADUs): The Complete Guide to Costs, Types, Rules and Design',
    cover: '/assets/covers/article-adu.jpg',
    alt: 'Accessory Dwelling Units complete guide cover',
    source: 'Cover: World Arch Journal',
  },
  {
    slug: 'data-centres-good-architecture',
    kicker: 'Technology',
    title: 'Can Data Centres Be Good Architecture?',
    cover: '/assets/covers/article-data-centres.jpg',
    alt: 'Can Data Centres Be Good Architecture? article cover',
    source: 'Cover: World Arch Journal',
    centre: true,
  },
  {
    slug: 'solar-facades-bipv-decisions',
    kicker: 'Facades',
    title: 'Solar Facades: 9 Decisions Before Putting Photovoltaics on Your Building',
    cover: '/assets/covers/article-solar-facades.jpg',
    alt: 'Solar Facades article cover',
    source: 'Cover: World Arch Journal',
  },
  {
    slug: 'art-deco-architecture-history-features-buildings',
    kicker: 'History',
    title: 'Art Deco Architecture Explained: The Style That Sold the Machine Age',
    cover: '/assets/covers/article-art-deco.jpg',
    alt: 'Art Deco Architecture Explained article cover',
    source: 'Cover: World Arch Journal',
  },
];

const finishes = [
  { name: 'Travertine', count: '4 finishes', active: true },
  { name: 'Ceramic & Porcelain', count: '5 finishes' },
  { name: 'Fluted Wood', count: 'Panel' },
  { name: 'Scanned Wood Flooring', count: '5 finishes' },
  { name: 'Exposed Concrete', count: 'Panel' },
  { name: 'Microcement', count: 'Panel' },
  { name: 'Aluminium Composite', count: 'Panel' },
];

const historyStyles = [
  ['01', 'Romanesque', 'Round arches, thick walls.'],
  ['02', 'Gothic', 'Pointed arches, light stone.'],
  ['03', 'Renaissance', 'Proportion returns.'],
  ['04', 'Baroque', 'Drama in stone.'],
  ['05', 'Neoclassical', 'Order and columns.'],
  ['06', 'Victorian', 'The industrial house.'],
  ['07', 'Modernism', 'Form follows function.'],
  ['08', 'Brutalism', 'Raw concrete, honestly.'],
  ['09', 'Art Deco', 'The machine age, gilded.'],
];

export default function HomeV44({ content }) {
  const deckRef = useRef(null);
  const socials = (content?.brand?.socialLinks || [])
    .filter((item) => item.enabled !== false && /^https?:\/\//i.test(item.url || ''));
  const socialBy = (platform) => socials.find((item) => item.platform === platform || item.id === platform);
  const etsyUrl = content?.commerce?.etsyUrl || '/shop/';
  const latestBriefing = useMemo(() => {
    const issues = (newsletterIssues || []).filter((issue) => issue && issue.slug && issue.published !== false);
    issues.sort((a, b) => String(b.publishedAt || b.date || '').localeCompare(String(a.publishedAt || a.date || '')));
    return issues[0] || null;
  }, []);

  useEffect(() => {
    const deck = deckRef.current;
    if (!deck || !('IntersectionObserver' in window)) return undefined;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        deck.classList.add('is-inview');
        observer.disconnect();
      }
    }, { threshold: 0.3 });
    observer.observe(deck);
    return () => observer.disconnect();
  }, []);

  const subscribe = (event) => {
    event.preventDefault();
    window.location.assign('/newsletter/');
  };

  return (
    <div className="hv">
      <header className="hv-header">
        <div className="hv-wrap hv-header-in">
          <a className="hv-logo" href="/" aria-label="World Arch Journal — home">WORLD <b>ARCH</b> JOURNAL</a>
          <nav className="hv-nav" aria-label="Primary navigation">
            <a href="/magazine/">Magazine</a>
            <a href="/materials/">Materials</a>
            <a href="/virtual-tours/the-voids-villa/">Virtual Tours</a>
            <a href="/atlas/">Atlas</a>
            <a href="/services/" className="hv-glass hv-nav-cta">Design Services</a>
          </nav>
        </div>
      </header>

      <main id="main-content">
        {/* 1 · HERO — film piece 1 */}
        <section className="hv-hero" aria-label="Introduction">
          <FilmVideo className="hv-hero-film" src={FILMS.hero} poster="/assets/homepage/hero-poster.jpg" label="Film: the founder in the studio as two golden towers form beside her" />
          <div className="hv-hero-shade" aria-hidden="true" />
          <div className="hv-hero-core">
            <div className="hv-rule" aria-hidden="true" />
            <h1>Architecture worth <i>slowing down</i> for.</h1>
            <p className="hv-subline">Essays, materials and journeys through the built world — from World Arch Journal, and a remote design studio when you are ready to build.</p>
            <a href="/services/" className="hv-btn hv-glass">Design Services</a>
          </div>
          <div className="hv-filmmark"><b>▶</b>&nbsp; FILM · PART ONE</div>
        </section>

        {/* 2 · SELECTED WORK */}
        <section className="hv-section" aria-labelledby="hv-work-title">
          <div className="hv-wrap">
            <div className="hv-tag">Selected Work</div>
            <h2 id="hv-work-title">Three houses, <i>walked through</i></h2>
            <p className="hv-sub">The studio's own projects — two of them open as full virtual tours, the third drawn and detailed by the practice.</p>
            <div className="hv-work">
              {projects.map((project) => (
                <article className="hv-wcard" key={project.num}>
                  <div className="hv-wnum">{project.num}</div>
                  <FitImage className="hv-wimg" src={project.cover} alt={project.alt} />
                  <h3>{project.title}</h3>
                  <div className="hv-meta">{project.meta}</div>
                  <div className="hv-src">{project.src}</div>
                  <a className="hv-view" href={project.href}>View Project</a>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 3 · FILM PIECE 2 — a full section of its own, nothing else */}
        <section className="hv-piece2" aria-label="The architect">
          <FilmVideo className="hv-piece2-film" src={FILMS.piece2} poster="/assets/homepage/piece2-poster.jpg" label="Film: the architect walking toward the studio entrance" />
          <div className="hv-piece2-shade" aria-hidden="true" />
          <div className="hv-piece2-core">
            <div className="hv-wrap">
              <div className="hv-tag">Film · Part Two</div>
              <div className="hv-who">The architect, <i>in person.</i></div>
              <div className="hv-lines">
                <b>Architect &amp; Interior Designer</b><br />
                Founder, World Arch Journal<br />
                Remote — working worldwide
              </div>
            </div>
          </div>
        </section>

        {/* 4 · LATEST STORIES — the deck */}
        <section className="hv-section" aria-labelledby="hv-stories-title">
          <div className="hv-wrap">
            <div className="hv-centred">
              <div className="hv-tag">The Magazine</div>
              <h2 id="hv-stories-title">Latest <i>stories</i></h2>
              <p className="hv-sub">New essays from the journal — the pages fan out as you arrive, then settle into line; open the one that catches your eye.</p>
            </div>
            <div className="hv-deck" ref={deckRef}>
              {deckArticles.map((article) => (
                <a
                  className={`hv-card${article.centre ? ' is-centre' : ''}`}
                  key={article.slug}
                  href={`/articles/${article.slug}/`}
                >
                  <FitImage className="hv-card-img" src={article.cover} alt={article.alt} />
                  <span className="hv-card-k">{article.kicker}</span>
                  <span className="hv-card-t">{article.title}</span>
                  <span className="hv-src">{article.source}</span>
                </a>
              ))}
            </div>
            <div className="hv-centred">
              <a className="hv-btn hv-glass" href="/magazine/">Browse All</a>
            </div>
          </div>
        </section>

        {/* 5 · MATERIALS */}
        <section className="hv-section hv-band-dark" aria-labelledby="hv-materials-title">
          <div className="hv-wrap">
            <div className="hv-tag">Materials Library</div>
            <h2 id="hv-materials-title">Materials, <i>come to life</i></h2>
            <p className="hv-sub">Real scanned surfaces in real rooms — pick a finish, see it at full scale, download the pack.</p>
            <div className="hv-matcover">
              <FilmVideo className="hv-cover-film" src={FILMS.materials} poster="/assets/homepage/materials-poster.jpg" label="Film: the material library studio floor" />
              <div className="hv-covermark"><b>▶</b>&nbsp; FILM · MATERIAL LIBRARY</div>
              <div className="hv-filmbar" aria-hidden="true"><i style={{ width: '47%' }} /></div>
            </div>
            <div className="hv-mat">
              <div>
                <img className="hv-sample" src={assetUrl('/assets/covers/materials-stone-travertine.jpg')} alt="Natural stone and travertine — World Arch Journal materials cover" loading="lazy" decoding="async" />
                <div className="hv-src">Cover: World Arch Journal material lab</div>
              </div>
              <div className="hv-finishes">
                {finishes.map((finish) => (
                  <div className={`hv-fin${finish.active ? ' is-on' : ''}`} key={finish.name}>{finish.name} <span>{finish.count}</span></div>
                ))}
              </div>
            </div>
            <a className="hv-action" href="/materials/">Open the Materials Library</a>
          </div>
        </section>

        {/* 6a · HISTORY frieze */}
        <section className="hv-section" aria-labelledby="hv-history-title">
          <div className="hv-wrap">
            <div className="hv-tag">Architectural History</div>
            <h2 id="hv-history-title">Nine styles, <i>one timeline</i></h2>
            <p className="hv-sub">The history hub, laid out as a frieze — walk it from the Romanesque to Art Deco.</p>
            <div className="hv-frieze">
              {historyStyles.map(([num, name, blurb]) => (
                <div className="hv-hcard" key={num}>
                  <div className="hv-hnum">{num}</div>
                  <h4>{name}</h4>
                  <p>{blurb}</p>
                </div>
              ))}
            </div>
            <a className="hv-action" href="/magazine/architectural-history-styles/">Open the History Hub</a>
          </div>
        </section>

        {/* 6b · EXPLORE — tours + Atlas, one band */}
        <section className="hv-section hv-explore-band" aria-labelledby="hv-explore-title">
          <div className="hv-wrap">
            <div className="hv-tag">Explore</div>
            <h2 id="hv-explore-title">Walk a house, <i>then a city</i></h2>
            <p className="hv-sub">Two slower ways in: full virtual tours of the studio's own houses, and the Atlas — one city's walking guide at a time.</p>
            <div className="hv-explore">
              <div className="hv-door hv-door-tour">
                <img className="hv-door-bg hv-door-bg-fit" src={assetUrl('/assets/covers/tour-voids.jpg')} alt="" aria-hidden="true" loading="lazy" decoding="async" />
                <div className="hv-door-shade" aria-hidden="true" />
                <div className="hv-door-in">
                  <div className="hv-door-k">Virtual Tour · 360°</div>
                  <h3>The Voids</h3>
                  <p>Ten panoramas inside a house built around emptiness — walk it in your browser, no app, no headset.</p>
                  <a href="/virtual-tours/the-voids-villa/" className="hv-btn hv-glass">Enter the Tour</a>
                  <div className="hv-tourswitch">Now showing: <b>The Voids</b> &nbsp;·&nbsp; <a href="/virtual-tours/narbon-villa/">Next: Narbon Villa →</a></div>
                </div>
              </div>
              <div className="hv-door hv-door-atlas">
                <img className="hv-door-bg hv-door-bg-fit" src={assetUrl('/assets/covers/atlas-cities.jpg')} alt="" aria-hidden="true" loading="lazy" decoding="async" />
                <div className="hv-door-shade" aria-hidden="true" />
                <div className="hv-door-in">
                  <div className="hv-tag">World Arch Atlas</div>
                  <a className="hv-search" href="/atlas/">Search a city — try “Dubai”…</a>
                  <a className="hv-city" href="/atlas/uae/dubai/">
                    <span className="hv-live">Live now</span>
                    <h4>Dubai</h4>
                    <p>United Arab Emirates · 9 stops · PDF guide</p>
                  </a>
                  <div className="hv-prep"><b>In preparation</b> Baku · Tbilisi · Doha</div>
                  <a className="hv-action" href="/atlas/uae/dubai/">Open the Dubai Guide</a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7 · DESIGN SERVICES */}
        <section className="hv-section hv-services-band" aria-labelledby="hv-services-title">
          <div className="hv-wrap">
            <div className="hv-tag">Design Services</div>
            <h2 id="hv-services-title">A remote architect, <i>worldwide</i></h2>
            <p className="hv-sub">Fifteen years of practice, working remotely with clients everywhere — villas, façades and interiors for small and large spaces.</p>
            <div className="hv-svccover">
              <FilmVideo className="hv-cover-film" src={FILMS.practice} poster="/assets/homepage/services-poster.jpg" label="Film: drawing a project at the design desk" />
              <div className="hv-covermark"><b>▶</b>&nbsp; FILM · THE DESIGN DESK</div>
              <div className="hv-filmbar" aria-hidden="true"><i style={{ width: '71%' }} /></div>
            </div>
            <div className="hv-svc">
              <div className="hv-scard"><h3>Villa Design</h3><p>New homes from first sketch to a full architectural project package — plans, façades and renders.</p></div>
              <div className="hv-scard"><h3>Façade Design</h3><p>A new face for an existing building, designed and detailed for local construction.</p></div>
              <div className="hv-scard"><h3>Interior Design</h3><p>Interiors and floor-plan optimisation that make small spaces live large.</p></div>
            </div>
            <a className="hv-action hv-action-lg" href="/services/">Start a Project →</a>
          </div>
        </section>

        {/* 8a · CTA band */}
        <div className="hv-ctaband">
          <div className="hv-ctabg" aria-hidden="true" />
          <div className="hv-ctacore">
            <div className="hv-tag">Ready to Create?</div>
            <h2>Let's build something <i>timeless.</i></h2>
            <a href="/contact/" className="hv-btn hv-glass">Start a Project</a>
          </div>
        </div>

        {/* 8b · NEWSLETTER */}
        <div className="hv-news">
          <div className="hv-wrap hv-news-in">
            <div>
              <div className="hv-tag">The World Arch Briefing</div>
              <h2>{latestBriefing ? latestBriefing.title : 'Architecture news, with context and sources'}</h2>
              <p className="hv-sub">One short briefing on the day's architecture — read in three minutes.</p>
            </div>
            <form className="hv-mailbox" onSubmit={subscribe}>
              <label className="hv-field">
                <span className="hv-visually-hidden">Email address</span>
                <input type="email" name="email" placeholder="Your email address" autoComplete="email" />
              </label>
              <button className="hv-btn hv-glass" type="submit">Subscribe</button>
            </form>
          </div>
        </div>

        {/* 8c · SHOP strip */}
        <div className="hv-shopstrip">
          <div className="hv-wrap hv-shoprow">
            <span className="hv-shopname">Shop · <b>The Studio Shelf</b></span>
            <span className="hv-shoplinks">
              <a href="/shop/">Atlas Villa — Project Package</a>
              <a href="/shop/">Templates &amp; Resources</a>
            </span>
            <a className="hv-action hv-shop-action" href={etsyUrl} target={/^https?:\/\//i.test(etsyUrl) ? '_blank' : undefined} rel="noreferrer">Visit the Etsy Shop</a>
          </div>
        </div>
      </main>

      {/* 8d · FOOTER */}
      <footer className="hv-footer">
        <div className="hv-wrap">
          <div className="hv-ftop">
            <div className="hv-fcopy">© 2026 WORLD ARCH JOURNAL</div>
            <div className="hv-socials">
              {socialBy('instagram') && <a href={socialBy('instagram').url} target="_blank" rel="me noopener noreferrer">Instagram</a>}
              {socialBy('linkedin') && <a href={socialBy('linkedin').url} target="_blank" rel="me noopener noreferrer">LinkedIn</a>}
              {socialBy('pinterest') && <a href={socialBy('pinterest').url} target="_blank" rel="me noopener noreferrer">Pinterest</a>}
            </div>
            <a className="hv-fmail" href="mailto:hello@worldarchjournal.com">hello@worldarchjournal.com</a>
          </div>
          <div className="hv-fcols">
            <div>
              <h5>Read</h5>
              <a href="/magazine/">Magazine</a>
              <a href="/magazine/">Latest Stories</a>
              <a href="/magazine/architectural-history-styles/">Architectural History</a>
              <a href="/newsletter/">The World Arch Briefing</a>
            </div>
            <div>
              <h5>Explore</h5>
              <a href="/materials/">Materials Library</a>
              <a href="/virtual-tours/the-voids-villa/">Virtual Tours</a>
              <a href="/atlas/">World Arch Atlas</a>
              <a href="/projects/">Projects</a>
            </div>
            <div>
              <h5>Studio</h5>
              <a href="/services/">Design Services</a>
              <a href="/about/">About the Journal</a>
              <a href="/contact/">Contact</a>
            </div>
            <div>
              <h5>Shop</h5>
              <a href={etsyUrl} target={/^https?:\/\//i.test(etsyUrl) ? '_blank' : undefined} rel="noreferrer">Etsy Shop</a>
              <a href="/shop/">Atlas Villa Package</a>
            </div>
          </div>
          <div className="hv-fnote">WORLD ARCH JOURNAL — an independent architecture magazine and remote design studio.</div>
        </div>
      </footer>
    </div>
  );
}
