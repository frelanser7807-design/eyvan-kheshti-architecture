import { useEffect, useRef } from 'react';
import { assetUrl } from '../lib/assetUrl.js';

export default function MagazineReader({ magazine, onClose = () => undefined, onOpenArticle, standalone = false }) {
  const readerRef = useRef(null);

  useEffect(() => {
    if (!magazine || standalone) return undefined;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    if (readerRef.current) readerRef.current.scrollTop = 0;
    const timer = window.setTimeout(() => readerRef.current?.querySelector('.ek-magazine-close')?.focus({ preventScroll: true }), 60);
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key !== 'Tab') return;
      const focusable = [...(readerRef.current?.querySelectorAll('button, [href]') || [])].filter((element) => !element.disabled);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus?.();
    };
  }, [magazine, onClose, standalone]);

  if (!magazine) return null;

  const openFeature = (article) => {
    if (standalone) {
      window.location.assign(`/articles/${article.slug}/`);
      return;
    }
    onClose();
    onOpenArticle?.(article);
  };

  return (
    <div id={standalone ? 'main-content' : undefined} className={`ek-magazine-backdrop ${standalone ? 'is-standalone' : ''}`} role={standalone ? undefined : 'presentation'} onMouseDown={(event) => !standalone && event.target === event.currentTarget && onClose()}>
      <section ref={readerRef} className="ek-magazine-reader" role={standalone ? undefined : 'dialog'} aria-modal={standalone ? undefined : 'true'} aria-labelledby="magazine-reader-title">
        <header className="ek-magazine-reader-bar">
          <a href="/#journal" onClick={standalone ? undefined : onClose}>WORLD ARCH JOURNAL / ISSUE {magazine.number}</a>
          {standalone
            ? <a className="ek-reader-return is-dark" href="/#journal" aria-label="Return to magazine">←</a>
            : <button className="ek-magazine-close" type="button" onClick={onClose} aria-label="Close magazine issue">×</button>}
        </header>

        <article>
          <div className="ek-magazine-cover">
            <figure>
              <img src={assetUrl(magazine.image)} alt={magazine.imageAlt} />
              <figcaption>{magazine.visualLabel}</figcaption>
            </figure>
            <div>
              <div className="ek-magazine-logo" aria-label="World Arch Journal">
                <span><img src={assetUrl('/assets/brand/world-arch-wa-mark-v1.png')} alt="" /></span>
                <div><strong>WORLD ARCH JOURNAL</strong><em>BY FARNAZ · ARCHITECTURE MEDIA &amp; DESIGN</em></div>
              </div>
              <small>{magazine.status}</small>
              <b>ISSUE {magazine.number}</b>
              <h1 id="magazine-reader-title">{magazine.title.replace(/^Issue \d+\s*[—-]\s*/, '')}</h1>
              <p>{magazine.excerpt}</p>
              <span>{magazine.meta}</span>
            </div>
          </div>

          <section className="ek-magazine-contents" aria-labelledby="magazine-contents-title">
            <small>CONTENTS</small>
            <h2 id="magazine-contents-title">One issue, one editorial argument.</h2>
            <p>Issue 00 establishes the visual and evidence standard through one complete architectural dossier: an original concept, its verified evidence boundary, environmental diagram, plan and section, and material study.</p>
            <ol>
              {magazine.features.map((feature, index) => (
                <li key={feature.id}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <div><h3>{feature.title}</h3><p>{feature.deck}</p></div>
                  <button type="button" onClick={() => openFeature(feature.article)}>Read complete feature ↗</button>
                </li>
              ))}
            </ol>
          </section>

          {magazine.projectFacts?.length > 0 && (
            <section className="ek-magazine-project-sheet" aria-labelledby="magazine-project-sheet-title">
              <div>
                <small>PROJECT FILE</small>
                <h2 id="magazine-project-sheet-title">Identity before interpretation.</h2>
                <p>{magazine.projectScope}</p>
              </div>
              <dl>
                {magazine.projectFacts.map(([label, value]) => (
                  <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
                ))}
              </dl>
            </section>
          )}

          <section className="ek-magazine-spreads" aria-label="Issue 00 visual feature">
            {magazine.spreads?.map((spread, index) => (
              <article className={index % 2 ? 'is-reversed' : ''} key={spread.pages}>
                <figure>
                  <img src={assetUrl(spread.image)} alt={spread.alt} loading="lazy" decoding="async" />
                  <figcaption>{spread.caption}</figcaption>
                </figure>
                <div>
                  <span>{spread.pages}</span>
                  <small>{spread.kicker}</small>
                  <h2>{spread.title}</h2>
                  {index === magazine.spreads.length - 1 && magazine.features[0]?.article && (
                    <button type="button" onClick={() => openFeature(magazine.features[0].article)}>Read the complete feature ↗</button>
                  )}
                </div>
              </article>
            ))}
          </section>

          <aside className="ek-magazine-method" aria-label="Magazine editorial method">
            <div><small>SOURCE STANDARD</small><h2>Discovery is not republication.</h2></div>
            <p>ArchDaily, Dezeen, Architectural Digest, Designboom and press-kit networks may alert the team to a subject. Every finished feature must return to primary or official evidence, add independent context, use original or licensed media and pass NotebookLM-assisted source review plus named human approval. The complete linked feature records its evidence and limitations.</p>
          </aside>

          <footer className="ek-magazine-footer">
            <span>No purchase, download, advertisement or affiliate link is active in this preview.</span>
            {standalone
              ? <a className="ek-reader-footer-link is-light" href="/#journal">Return to Magazine ↗</a>
              : <button type="button" onClick={onClose}>Return to Magazine ↗</button>}
          </footer>
        </article>
      </section>
    </div>
  );
}
