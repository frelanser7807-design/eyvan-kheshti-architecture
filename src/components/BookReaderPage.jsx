import { useCallback, useEffect, useRef, useState } from 'react';
import { assetUrl } from '../lib/assetUrl.js';
import './MagazineHub.css';
import './BookReader.css';

/* Self-hosted flipbook reader. Pages are reading-resolution images rendered
   from the book PDF and hosted on this site — no third-party embed.
   Desktop: two-page spread with a CSS 3D sheet turn. Mobile: one page,
   swipe or tap to turn. */
export default function BookReaderPage({ page }) {
  const total = page.readerPages;
  const srcFor = useCallback((n) => assetUrl(`${page.readerBase}page-${String(n).padStart(3, '0')}.jpg`), [page]);
  const [spread, setSpread] = useState(0); // index of left page in spread mode (1-based); 0 = cover alone
  const [single, setSingle] = useState(1); // current page in single mode (1-based)
  const [flip, setFlip] = useState(null); // { dir: 'next'|'prev', front: n, back: n }
  const [wide, setWide] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 820);
  const touchX = useRef(null);
  const busy = useRef(false);

  useEffect(() => {
    const onResize = () => setWide(window.innerWidth >= 820);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Preload neighbours.
  useEffect(() => {
    const around = wide ? [spread - 2, spread - 1, spread, spread + 1, spread + 2, spread + 3, spread + 4] : [single - 1, single, single + 1, single + 2];
    around.filter((n) => n >= 1 && n <= total).forEach((n) => { const img = new Image(); img.src = srcFor(n); });
  }, [spread, single, wide, total, srcFor]);

  const maxSpreadStart = total % 2 === 0 ? total - 1 : total; // last spread's left page (odd index) or final single
  const turn = useCallback((dir) => {
    if (busy.current) return;
    if (wide) {
      if (dir === 'next' && spread >= maxSpreadStart) return;
      if (dir === 'prev' && spread <= 0) return;
      busy.current = true;
      if (dir === 'next') {
        // Front of the turning sheet: current right page (or cover); back: next spread's left page.
        const front = spread === 0 ? 1 : spread + 1;
        const back = spread === 0 ? 2 : spread + 2;
        setFlip({ dir, front, back });
        window.setTimeout(() => { setSpread(spread === 0 ? 2 : spread + 2); setFlip(null); busy.current = false; }, 640);
      } else {
        // The moving leaf starts over the current left page: front = current
        // left page, back = the previous spread's right page it will reveal.
        setFlip({ dir, front: spread, back: spread - 1 });
        window.setTimeout(() => { setSpread(spread - 2 <= 0 ? 0 : spread - 2); setFlip(null); busy.current = false; }, 640);
      }
    } else {
      setSingle((n) => Math.min(total, Math.max(1, n + (dir === 'next' ? 1 : -1))));
    }
  }, [wide, spread, maxSpreadStart, total]);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'ArrowRight') turn('next');
      if (event.key === 'ArrowLeft') turn('prev');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [turn]);

  const onTouchStart = (event) => { touchX.current = event.touches[0].clientX; };
  const onTouchEnd = (event) => {
    if (touchX.current == null) return;
    const dx = event.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 42) turn(dx < 0 ? 'next' : 'prev');
    touchX.current = null;
  };

  const leftPage = spread === 0 ? null : spread;
  const rightPage = spread === 0 ? 1 : spread + 1 <= total ? spread + 1 : null;
  const label = wide
    ? (spread === 0 ? `Cover · page 1 of ${total}` : `Pages ${leftPage}–${rightPage || leftPage} of ${total}`)
    : `Page ${single} of ${total}`;

  return (
    <div className="wj-magazine-page wj-reader-page">
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

      <main id="main-content" className="wj-reader-main">
        <nav className="wj-reader-crumb" aria-label="Breadcrumb">
          <a href={page.path}>{page.bookTitle} — web edition</a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Read the book</span>
        </nav>
        <h1 className="wj-reader-title">{page.bookTitle}</h1>
        <p className="wj-reader-sub">{page.series} · Book {page.bookNumber} · Free to read on this page — no signup. Print quality lives in the PDF.</p>

        <div
          className={`wj-reader-book${wide ? ' is-spread' : ' is-single'}${flip ? ` is-flipping-${flip.dir}` : ''}`}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {wide ? (
            <>
              <div className="wj-reader-spread">
                <div className="wj-reader-leaf is-left">
                  {leftPage ? <img src={srcFor(leftPage)} alt={`Page ${leftPage} of ${page.bookTitle}`} draggable="false" /> : <div className="wj-reader-blank" aria-hidden="true" />}
                </div>
                <div className="wj-reader-leaf is-right">
                  {rightPage ? <img src={srcFor(rightPage)} alt={`Page ${rightPage} of ${page.bookTitle}`} draggable="false" /> : <div className="wj-reader-blank" aria-hidden="true" />}
                </div>
                {flip && (
                  <div className={`wj-reader-flip is-${flip.dir}`} aria-hidden="true">
                    <div className="wj-reader-flip-face is-front"><img src={srcFor(flip.front)} alt="" draggable="false" /></div>
                    <div className="wj-reader-flip-face is-back"><img src={srcFor(flip.back)} alt="" draggable="false" /></div>
                  </div>
                )}
              </div>
              <button type="button" className="wj-reader-zone is-prev" aria-label="Previous pages" onClick={() => turn('prev')} disabled={spread <= 0} />
              <button type="button" className="wj-reader-zone is-next" aria-label="Next pages" onClick={() => turn('next')} disabled={spread >= maxSpreadStart} />
            </>
          ) : (
            <div className="wj-reader-single">
              <img src={srcFor(single)} alt={`Page ${single} of ${page.bookTitle}`} draggable="false" />
            </div>
          )}
        </div>

        <div className="wj-reader-controls">
          <button type="button" onClick={() => turn('prev')} disabled={wide ? spread <= 0 : single <= 1}>← Previous</button>
          <span className="wj-reader-count" role="status">{label}</span>
          <button type="button" onClick={() => turn('next')} disabled={wide ? spread >= maxSpreadStart : single >= total}>Next →</button>
        </div>
        <div className="wj-reader-progress" aria-hidden="true"><span style={{ width: `${((wide ? (rightPage || 1) : single) / total) * 100}%` }} /></div>

        <p className="wj-reader-foot">
          <a href={`${page.path}#get-the-book`}>Get the PDF — join The World Arch Briefing</a>
          <span aria-hidden="true"> · </span>
          <a href={page.path}>Read the web edition (HTML)</a>
          <span aria-hidden="true"> · </span>
          <a href={page.hubPath}>Back to Architectural History Styles</a>
        </p>
        <p className="wj-reader-note">© World Arch Journal. Free for personal reading; no redistribution or resale.</p>
      </main>
      <footer className="wj-magazine-footer"><span>© WORLD ARCH JOURNAL</span><nav aria-label="Footer"><a href="/editorial-policy/">Editorial policy</a><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a></nav></footer>
    </div>
  );
}
