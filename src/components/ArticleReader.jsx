import { createElement, Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { assetUrl } from '../lib/assetUrl.js';
import { relatedArticlesFor } from '../data/articles.js';

const allowedTags = new Set(['p', 'h2', 'h3', 'strong', 'em', 'blockquote', 'ul', 'ol', 'li', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'a']);

function safeHref(value) {
  const href = String(value || '').trim();
  if (href.startsWith('/') || href.startsWith('#')) return href;
  try {
    const url = new URL(href);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
  } catch {
    return '';
  }
}

function articlePdfHref(article) {
  return `/downloads/articles/${article.slug}.pdf`;
}

function renderControlledNode(node, key) {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent;
  if (node.nodeType !== Node.ELEMENT_NODE) return null;

  const tag = node.tagName.toLowerCase();
  const children = [...node.childNodes].map((child, index) => renderControlledNode(child, `${key}-${index}`));
  if (!allowedTags.has(tag)) return children;

  const props = { key };
  if (['h2', 'h3'].includes(tag)) {
    const id = String(node.getAttribute('id') || '').trim();
    if (/^[a-z0-9][a-z0-9-]*$/i.test(id)) props.id = id;
  }
  if (tag === 'a') {
    const href = safeHref(node.getAttribute('href'));
    if (!href) return createElement('span', props, children);
    props.href = href;
    if (/^https?:/i.test(href)) {
      props.target = '_blank';
      props.rel = 'noopener noreferrer';
    }
  }
  return createElement(tag, props, children);
}

function EditorialFigure({ visual }) {
  return (
    <figure className={`ek-article-inline-visual is-${visual.layout || 'wide'}`}>
      <picture>
        {visual.srcWebp && <source srcSet={assetUrl(visual.srcWebp)} type="image/webp" />}
        <img src={assetUrl(visual.src)} alt={visual.alt} loading="lazy" decoding="async" width={visual.width || undefined} height={visual.height || undefined} />
      </picture>
      <figcaption>
        {visual.caption}
        {visual.sourceUrl && (
          <>
            {' '}
            <a href={visual.sourceUrl} target="_blank" rel="noopener noreferrer">
              {visual.sourceLabel || 'View licensed source'}
            </a>
          </>
        )}
      </figcaption>
    </figure>
  );
}

function ArticleCover({ article }) {
  return (
    <figure className="ek-article-cover">
      <img src={assetUrl(article.cover)} alt={article.coverAlt || article.imageAlt} loading="eager" decoding="async" width={article.coverWidth || 900} height={article.coverHeight || 1350} />
      <figcaption>Cover · World Arch Journal</figcaption>
    </figure>
  );
}

function ArticleHero({ article }) {
  return (
    <figure className="ek-article-hero">
      <picture>
        {article.imageWebp && <source srcSet={assetUrl(article.imageWebp)} type="image/webp" />}
        <img src={assetUrl(article.image)} alt={article.imageAlt} loading="eager" decoding="async" fetchPriority="high" width={article.imageWidth || undefined} height={article.imageHeight || undefined} />
      </picture>
      <figcaption>
        {article.visualLabel}
        {article.imageSourceUrl && (
          <>
            {' '}
            <a href={article.imageSourceUrl} target="_blank" rel="noopener noreferrer">Source and licence</a>
          </>
        )}
      </figcaption>
    </figure>
  );
}

function ControlledArticleHtml({ html, visuals = [] }) {
  const sections = useMemo(() => {
    const documentFragment = new DOMParser().parseFromString(String(html || ''), 'text/html');
    const groups = [{ sectionIndex: -1, nodes: [] }];
    let sectionIndex = -1;
    for (const node of [...documentFragment.body.childNodes]) {
      if (node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() === 'h2') {
        sectionIndex += 1;
        groups.push({ sectionIndex, nodes: [] });
      }
      groups.at(-1).nodes.push(node);
    }
    return groups.filter((group) => group.nodes.length);
  }, [html]);

  return (
    <div className="ek-article-prose">
      {sections.map((section) => (
        <Fragment key={`editorial-section-${section.sectionIndex}`}>
          <section className={section.sectionIndex < 0 ? 'ek-article-intro' : 'ek-article-copy-section'}>
            {section.nodes.map((node, index) => renderControlledNode(node, `article-node-${section.sectionIndex}-${index}`))}
          </section>
          {visuals.filter((visual) => visual.afterSection === section.sectionIndex).map((visual) => (
            <EditorialFigure visual={visual} key={visual.src} />
          ))}
        </Fragment>
      ))}
    </div>
  );
}

const articleRequests = new Map();

export default function ArticleReader(props) {
  const { article } = props;
  const [loaded, setLoaded] = useState(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let active = true;
    setFailed(false);
    if (!article || typeof article.contentHtml === 'string') return undefined;
    const slug = article.slug;
    if (!articleRequests.has(slug)) {
      const request = fetch(assetUrl(article.contentUrl))
        .then((response) => {
          if (!response.ok) throw new Error('Article unavailable');
          return response.json();
        })
        .then((value) => {
          if (value.slug !== slug || typeof value.contentHtml !== 'string') throw new Error('Invalid article');
          return value;
        })
        .catch((error) => { articleRequests.delete(slug); throw error; });
      articleRequests.set(slug, request);
    }
    articleRequests.get(slug).then((value) => active && setLoaded(value)).catch(() => active && setFailed(true));
    return () => { active = false; };
  }, [article]);
  if (!article) return null;
  const complete = typeof article.contentHtml === 'string' ? article : loaded?.slug === article.slug ? loaded : null;
  if (!complete) return <section className="seo-route-fallback" aria-live="polite"><h1>{article.title}</h1><p>{failed ? 'The article could not be loaded. Please reload this page to try again.' : 'Loading the article…'}</p><a href="/magazine/">Return to the magazine</a>{props.onClose && <button type="button" onClick={props.onClose}>Close</button>}</section>;
  return <ResolvedArticleReader {...props} article={complete} />;
}

function ResolvedArticleReader({ article, onClose = () => undefined, standalone = false }) {
  const readerRef = useRef(null);
  const relatedArticles = useMemo(() => relatedArticlesFor(article), [article]);

  useEffect(() => {
    if (!article || standalone) return undefined;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    if (readerRef.current) readerRef.current.scrollTop = 0;
    const focusTimer = window.setTimeout(() => readerRef.current?.querySelector('.ek-article-close')?.focus({ preventScroll: true }), 60);
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = [...(readerRef.current?.querySelectorAll('button, [href], summary') || [])]
        .filter((element) => !element.disabled);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus?.();
    };
  }, [article, onClose, standalone]);

  if (!article) return null;

  return (
    <div id={standalone ? 'main-content' : undefined} className={`ek-article-backdrop ${standalone ? 'is-standalone' : ''}`} role={standalone ? undefined : 'presentation'} onMouseDown={(event) => !standalone && event.target === event.currentTarget && onClose()}>
      <section ref={readerRef} className="ek-article-reader" role={standalone ? undefined : 'dialog'} aria-modal={standalone ? undefined : 'true'} aria-labelledby="article-reader-title">
        <header className="ek-article-reader-bar">
          <a href="/magazine/" onClick={standalone ? undefined : onClose}>WORLD ARCH JOURNAL / MAGAZINE</a>
          {standalone
            ? <a className="ek-reader-return" href="/magazine/" aria-label="Return to magazine">←</a>
            : <button className="ek-article-close" type="button" onClick={onClose} aria-label="Close article">×</button>}
        </header>

        <article>
          {article.cover && <ArticleCover article={article} />}
          {article.imageLead && <ArticleHero article={article} />}
          <div className="ek-article-heading">
            <small>{article.status}</small>
            <h1 id="article-reader-title">{article.title}</h1>
            <p>{article.excerpt}</p>
            <dl>
              <div><dt>AUTHOR</dt><dd>{article.author}</dd></div>
              <div><dt>READING</dt><dd>{article.meta}</dd></div>
              <div><dt>TOPIC</dt><dd>{article.category}</dd></div>
              {article.publishedAt && <div><dt>PUBLISHED</dt><dd><time dateTime={article.publishedAt}>{new Date(`${article.publishedAt}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })}</time></dd></div>}
            </dl>
            <div className="ek-article-download-panel" aria-label="Download this article">
              <div><small>OFFLINE READING</small><strong>Keep the complete illustrated edition.</strong><span>English PDF · sources included · free download</span></div>
              <a href={articlePdfHref(article)} download={`${article.slug}.pdf`}>DOWNLOAD PDF <b aria-hidden="true">↓</b></a>
            </div>
          </div>

          {!article.imageLead && <ArticleHero article={article} />}

          {article.facts?.length > 0 && (
            <section className="ek-article-project-facts" aria-label="Project facts">
              <small>PROJECT FILE</small>
              <dl>
                {article.facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
              </dl>
            </section>
          )}

          {article.toc?.length > 0 && (
            <nav className="ek-article-toc" aria-labelledby="article-toc-title">
              <small>IN THIS ARTICLE</small>
              <h2 id="article-toc-title">Contents</h2>
              <ol>
                {article.toc.map(([id, label]) => <li key={id}><a href={`#${id}`}>{label}</a></li>)}
              </ol>
            </nav>
          )}

          <ControlledArticleHtml html={article.contentHtml} visuals={article.visuals} />

          <aside className="ek-article-boundary" aria-label="Article scope">
            <small>SCOPE</small>
            <p>{article.scope}</p>
          </aside>

          <section className="ek-article-faq" aria-labelledby="article-faq-title">
            <small>COMMON QUESTIONS</small>
            <h2 id="article-faq-title">Frequently asked questions</h2>
            {(article.faq || []).map((item) => (
              <details key={item.question}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </section>

          <section className="ek-article-sources" aria-labelledby="article-sources-title">
            <small>SOURCE NOTES</small>
            <h2 id="article-sources-title">Evidence and source notes</h2>
            <p>Claims are scoped to the cited material. Each note includes the limitation recorded during editorial review.</p>
            <ol>
              {(article.evidence || []).map((source) => (
                <li key={source.source_url}>
                  <a href={safeHref(source.source_url)} target="_blank" rel="noopener noreferrer">{source.publisher} ↗</a>
                  <p>{source.claim}</p>
                  <span>{source.limitations}</span>
                </li>
              ))}
            </ol>
          </section>

          {relatedArticles.length > 0 && (
            <section className="ek-article-related" aria-labelledby="article-related-title">
              <small>CONTINUE READING</small>
              <h2 id="article-related-title">Related architecture stories</h2>
              <div>
                {relatedArticles.map((related) => (
                  <article key={related.slug}>
                    <a href={`/articles/${related.slug}/`}><img src={assetUrl(related.image)} alt={related.imageAlt} loading="lazy" decoding="async" /></a>
                    <span>{related.category}</span>
                    <h3><a href={`/articles/${related.slug}/`}>{related.title}</a></h3>
                    <p>{related.excerpt}</p>
                  </article>
                ))}
              </div>
            </section>
          )}

          <footer className="ek-article-footer">
            <p>{article.cta}</p>
            <div className="ek-article-footer-actions">
              <a className="ek-reader-footer-link is-download" href={articlePdfHref(article)} download={`${article.slug}.pdf`}>Download PDF ↓</a>
              {standalone
                ? <a className="ek-reader-footer-link" href="/#articles">Return to Articles ↗</a>
                : <button type="button" onClick={onClose}>Return to Articles ↗</button>}
            </div>
          </footer>
        </article>
      </section>
    </div>
  );
}
