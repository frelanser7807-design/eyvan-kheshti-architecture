import { useState } from 'react';
import { assetUrl } from '../lib/assetUrl.js';
import { submitSubscriber } from '../lib/dataAdapter.js';
import { historyDeepById } from '../data/historyDeep.js';
import BookCover3D from './BookCover3D.jsx';
import ProductPage from './ProductPage.jsx';
import './MagazineHub.css';
import './HistoryDeepPage.css';

function DownloadGate({ page }) {
  const [status, setStatus] = useState('idle');
  async function submit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    setStatus('saving');
    try {
      await submitSubscriber(values.get('email'), values.get('consent') === 'yes', values.get('website'));
      form.reset();
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }
  return (
    <section className="wj-deep-gate" id="get-the-book" aria-labelledby="wj-gate-title">
      <span className="wj-magazine-kicker">The book · PDF edition</span>
      <h2 id="wj-gate-title">Get the PDF — join The World Arch Briefing</h2>
      <p className="wj-deep-gate-file"><strong>art-nouveau.pdf</strong> — {page.bookTitle} · {page.series}, Book {page.bookNumber} · {page.readerPages} pages · PDF</p>
      {status === 'success' ? (
        <div className="wj-deep-gate-success">
          <p role="status">Check your inbox for a confirmation link to complete your subscription.</p>
          <a className="wj-deep-download" href={page.pdf} download>Download the book (PDF)</a>
        </div>
      ) : (
        <form className="wj-deep-gate-form" onSubmit={submit}>
          <label htmlFor="wj-gate-email">Email address</label>
          <div className="wj-deep-gate-row">
            <input id="wj-gate-email" type="email" name="email" autoComplete="email" required placeholder="you@example.com" />
            <button type="submit" disabled={status === 'saving'}>{status === 'saving' ? 'Joining…' : 'Join & get the PDF'}</button>
          </div>
          <label className="wj-deep-gate-consent"><input type="checkbox" name="consent" value="yes" required /> I agree to receive The World Arch Briefing. See our <a href="/privacy/">privacy policy</a>.</label>
          <input className="wj-deep-gate-trap" name="website" tabIndex="-1" autoComplete="off" aria-hidden="true" />
          {status === 'error' && <p role="alert" className="wj-deep-gate-error">We could not process this request. Please try again.</p>}
        </form>
      )}
      <p className="wj-deep-gate-terms">Free for personal use; no redistribution or resale. © World Arch Journal. Reading the book online is always free, with no signup — <a href={page.readPath}>open the reader</a>.</p>
    </section>
  );
}

function DeepFigure({ page, imageKey, eager = false }) {
  const image = page.images[imageKey];
  if (!image) return null;
  return (
    <figure className="wj-deep-figure">
      <img src={assetUrl(image.src)} alt={image.alt} loading={eager ? 'eager' : 'lazy'} decoding="async" />
      <figcaption>{image.credit}</figcaption>
    </figure>
  );
}

function ChapterSection({ page, section }) {
  return (
    <div className="wj-deep-section">
      {section.heading && <h3>{section.heading}</h3>}
      {(section.paras || []).map((paragraph) => <p key={paragraph.slice(0, 40)}>{paragraph}</p>)}
      {section.figure && <DeepFigure page={page} imageKey={section.figure} />}
    </div>
  );
}

function HistoryDeepPageView({ page }) {
  const hero = page.images[page.hero];
  return (
    <div className="wj-magazine-page wj-deep-page">
      <header className="wj-magazine-header">
        <a className="wj-magazine-brand" href="/" aria-label="World Arch Journal home">
          <img src={assetUrl('/assets/brand/world-arch-wa-mark-v1.png')} alt="" width="39" height="39" />
          <span>WORLD ARCH <strong>JOURNAL</strong></span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="/magazine/">Magazine</a>
          <a href="/videos/">Videos</a>
          <a href="/newsletter/">Newsletter</a>
          <a href="/atlas/">Atlas</a>
          <a href="/#services">Studio</a>
          <a href="/#contact">Contact</a>
        </nav>
      </header>

      <main id="main-content">
        <article className="wj-deep-article">
          <nav className="wj-deep-breadcrumb" aria-label="Breadcrumb">
            <a href="/magazine/">Magazine</a>
            <span aria-hidden="true">/</span>
            <a href={page.hubPath}>Architectural History Styles</a>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{page.title}</span>
          </nav>

          <header className="wj-deep-head">
            <span className="wj-magazine-kicker">{page.series} · Book {page.bookNumber} · Web edition</span>
            <h1>{page.bookTitle}</h1>
            <p className="wj-deep-subtitle">{page.subtitle}</p>
            <p className="wj-deep-standfirst">{page.standfirst}</p>
            <div className="wj-deep-actions">
              <a className="wj-deep-download" href={page.readPath}>Read the book</a>
              <a className="wj-deep-readlink" href="#get-the-book">Download the book (PDF)</a>
              <span className="wj-deep-meta">Published {page.publishedAt} · {page.chapters.length} chapters · Free to read</span>
            </div>
          </header>

          <section className="wj-deep-bookshow" aria-label="The book">
            <BookCover3D src={page.cover} title={page.bookTitle} className="wj-deep-bookcover" />
            <div className="wj-deep-bookshow-copy">
              <span className="wj-magazine-kicker">{page.series} · Book {page.bookNumber}</span>
              <h2>The book</h2>
              <p>This page is the web edition of the World Arch Journal book. Read it here in the page-flip reader, chapter by chapter below, or take the print-quality PDF.</p>
              <div className="wj-deep-actions">
                <a className="wj-deep-download" href={page.readPath}>Read the book</a>
                <a className="wj-deep-readlink" href="#get-the-book">Get the PDF</a>
              </div>
              <p className="wj-deep-meta">{page.readerPages} pages · {Object.keys(page.images).length} credited illustrations · {page.coverCredit}</p>
            </div>
          </section>

          {hero && (
            <figure className="wj-deep-hero">
              <img src={assetUrl(hero.src)} alt={hero.alt} loading="eager" decoding="async" />
              <figcaption>{hero.credit}</figcaption>
            </figure>
          )}

          <dl className="wj-deep-facts">
            {page.keyFacts.map(([label, value]) => (
              <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
            ))}
          </dl>

          <nav className="wj-deep-toc" aria-label="Contents">
            <h2>Contents</h2>
            <ol>
              {page.chapters.map((chapter) => (
                <li key={chapter.id}><a href={`#chapter-${chapter.id}`}>Chapter {chapter.numeral} — {chapter.title}</a></li>
              ))}
              <li><a href="#deep-timeline">Timeline: the style in dates</a></li>
              <li><a href="#deep-gazetteer">Gazetteer: where to see the style</a></li>
              <li><a href="#deep-figures">Key figures</a></li>
              <li><a href="#deep-glossary">Glossary</a></li>
              <li><a href="#deep-sources">Sources &amp; bibliography</a></li>
              <li><a href="#deep-credits">Illustration credits</a></li>
            </ol>
          </nav>

          <section className="wj-deep-intro" aria-label="Introduction">
            {page.intro.map((paragraph) => <p key={paragraph.slice(0, 40)}>{paragraph}</p>)}
          </section>

          {page.chapters.map((chapter) => (
            <section className="wj-deep-chapter" id={`chapter-${chapter.id}`} key={chapter.id} aria-labelledby={`wj-chapter-${chapter.id}`}>
              <span className="wj-magazine-kicker">Chapter {chapter.numeral}</span>
              <h2 id={`wj-chapter-${chapter.id}`}>{chapter.title}</h2>
              {chapter.id === 'reading' && (
                <ol className="wj-deep-signs">
                  {page.fiveSigns.map((sign, index) => (
                    <li key={sign.name}>
                      <DeepFigure page={page} imageKey={sign.img} />
                      <div>
                        <h3><span aria-hidden="true">{index + 1}.</span> {sign.name}</h3>
                        <p>{sign.look}</p>
                        <p className="wj-deep-sign-limit"><strong>Limit:</strong> {sign.limit}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              )}
              {chapter.sections.map((section, index) => <ChapterSection page={page} section={section} key={index} />)}
            </section>
          ))}

          <section className="wj-deep-chapter" id="deep-timeline" aria-labelledby="wj-deep-timeline-title">
            <span className="wj-magazine-kicker">Reference</span>
            <h2 id="wj-deep-timeline-title">Timeline: the style in dates</h2>
            <dl className="wj-deep-timeline">
              {page.timeline.map(([date, event]) => (
                <div key={date}><dt>{date}</dt><dd>{event}</dd></div>
              ))}
            </dl>
          </section>

          <section className="wj-deep-chapter" id="deep-gazetteer" aria-labelledby="wj-deep-gazetteer-title">
            <span className="wj-magazine-kicker">Reference</span>
            <h2 id="wj-deep-gazetteer-title">Gazetteer: where to see the style</h2>
            <dl className="wj-deep-figures">
              {page.gazetteer.map(([place, text]) => (
                <div key={place}><dt>{place}</dt><dd>{text}</dd></div>
              ))}
            </dl>
          </section>

          <section className="wj-deep-chapter" id="deep-figures" aria-labelledby="wj-deep-figures-title">
            <span className="wj-magazine-kicker">Reference</span>
            <h2 id="wj-deep-figures-title">Key figures</h2>
            <dl className="wj-deep-figures">
              {page.figures.map(([name, bio]) => (
                <div key={name}><dt>{name}</dt><dd>{bio}</dd></div>
              ))}
            </dl>
          </section>

          <section className="wj-deep-chapter" id="deep-glossary" aria-labelledby="wj-deep-glossary-title">
            <span className="wj-magazine-kicker">Reference</span>
            <h2 id="wj-deep-glossary-title">Glossary</h2>
            <dl className="wj-deep-glossary">
              {page.glossary.map(([term, definition]) => (
                <div key={term}><dt>{term}</dt><dd>{definition}</dd></div>
              ))}
            </dl>
          </section>

          <section className="wj-deep-chapter" id="deep-sources" aria-labelledby="wj-deep-sources-title">
            <span className="wj-magazine-kicker">Reference</span>
            <h2 id="wj-deep-sources-title">Sources &amp; bibliography</h2>
            <h3>Sources consulted</h3>
            <ul className="wj-deep-sources">
              {page.sources.map((source) => (
                <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.name} ↗</a></li>
              ))}
            </ul>
            <h3>Bibliography</h3>
            <ul className="wj-deep-bibliography">
              {page.bibliography.map((entry) => <li key={entry}>{entry}</li>)}
            </ul>
          </section>

          <section className="wj-deep-chapter" id="deep-credits" aria-labelledby="wj-deep-credits-title">
            <span className="wj-magazine-kicker">Reference</span>
            <h2 id="wj-deep-credits-title">Illustration credits</h2>
            <p>All photographs are reproduced from Wikimedia Commons under the licences stated. No image has been cropped; each is shown whole, as published by its author.</p>
            <ul className="wj-deep-credits">
              {Object.values(page.images).map((image) => (
                <li key={image.src}><a href={image.sourceUrl} target="_blank" rel="noopener noreferrer">{image.title}</a> — {image.credit}</li>
              ))}
            </ul>
          </section>

          <DownloadGate page={page} />

          <footer className="wj-deep-foot">
            <a className="wj-deep-download" href={page.readPath}>Read the book</a>
            <a className="wj-deep-back" href={page.hubPath}>← Back to Architectural History Styles</a>
            <p>© World Arch Journal. {page.series}, Book {page.bookNumber}. The printed edition of this book is the PDF above; this page is its web edition.</p>
          </footer>
        </article>
      </main>
      <footer className="wj-magazine-footer"><span>© WORLD ARCH JOURNAL</span><nav aria-label="Footer"><a href="/editorial-policy/">Editorial policy</a><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a></nav></footer>
    </div>
  );
}

export default function HistoryDeepPage({ slug }) {
  const page = historyDeepById(slug);
  if (!page) return <ProductPage missing />;
  return <HistoryDeepPageView page={page} />;
}
