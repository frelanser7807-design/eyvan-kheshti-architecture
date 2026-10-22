import { assetUrl } from '../lib/assetUrl.js';
import { magazines } from '../data/magazines.js';
import { magazineCategories, publishedMagazineArticles } from '../data/magazineCategories.js';
import { editorialArticles, editorialPath } from '../data/newsletters.js';
import './MagazineHub.css';

function ArticleCard({ article, featured = false }) {
  return (
    <article className={`wj-magazine-card${featured ? ' is-featured' : ''}`}>
      <a className={`wj-magazine-card-image${article.cover ? ' has-cover' : ''}`} href={`/articles/${article.slug}/`} aria-label={`Read ${article.title}`}>
        {article.cover ? (
          <>
            <img className="wj-magazine-card-backdrop" src={assetUrl(article.cover)} alt="" aria-hidden="true" loading="lazy" decoding="async" />
            <img className="wj-magazine-card-cover" src={assetUrl(article.cover)} alt={article.coverAlt || article.imageAlt} loading={featured ? 'eager' : 'lazy'} decoding="async" width={article.coverWidth || 900} height={article.coverHeight || 1350} />
          </>
        ) : (
          <picture>
            {article.imageWebp && <source srcSet={assetUrl(article.imageWebp)} type="image/webp" />}
            <img src={assetUrl(article.image)} alt={article.imageAlt} loading={featured ? 'eager' : 'lazy'} decoding="async" width={article.imageWidth || 1600} height={article.imageHeight || 900} />
          </picture>
        )}
      </a>
      <div className="wj-magazine-card-copy">
        <span className="wj-magazine-kicker">{article.category}</span>
        <h2><a href={`/articles/${article.slug}/`}>{article.title}</a></h2>
        <p>{article.excerpt}</p>
        <div className="wj-magazine-card-foot"><span>{article.meta}</span><a href={`/articles/${article.slug}/`}>Read story <span aria-hidden="true">↗</span></a></div>
      </div>
    </article>
  );
}

function hubArticleFor(entry) {
  return entry?.articleSlug ? publishedMagazineArticles.find((article) => article.slug === entry.articleSlug) || null : null;
}

function HubLaneCard({ entry, lane }) {
  const article = hubArticleFor(entry);
  if (!article) {
    return (
      <article className="wj-hub-card wj-hub-prep">
        <span className="wj-magazine-kicker">{lane.title}</span>
        <h3>{entry.title}</h3>
        {entry.period && <p className="wj-hub-period">{entry.period}</p>}
        <p>{entry.learn}</p>
        <span className="wj-hub-soon">In preparation</span>
      </article>
    );
  }
  return (
    <article className="wj-magazine-card wj-hub-card">
      <a className={`wj-magazine-card-image${article.cover ? ' has-cover' : ''}`} href={`/articles/${article.slug}/`} aria-label={`Read ${article.title}`}>
        {article.cover ? (
          <>
            <img className="wj-magazine-card-backdrop" src={assetUrl(article.cover)} alt="" aria-hidden="true" loading="lazy" decoding="async" />
            <img className="wj-magazine-card-cover" src={assetUrl(article.cover)} alt={article.coverAlt || article.imageAlt} loading="lazy" decoding="async" width={article.coverWidth || 900} height={article.coverHeight || 1350} />
          </>
        ) : (
          <picture>
            {article.imageWebp && <source srcSet={assetUrl(article.imageWebp)} type="image/webp" />}
            <img src={assetUrl(article.image)} alt={article.imageAlt} loading="lazy" decoding="async" width={article.imageWidth || 1600} height={article.imageHeight || 900} />
          </picture>
        )}
      </a>
      <div className="wj-magazine-card-copy">
        <span className="wj-magazine-kicker">{lane.title}</span>
        <h3><a href={`/articles/${article.slug}/`}>{entry.title || article.title}</a></h3>
        <p>{entry.learn}</p>
        <div className="wj-magazine-card-foot"><span>{article.meta}</span><a href={`/articles/${article.slug}/`}>Read the guide <span aria-hidden="true">↗</span></a></div>
      </div>
    </article>
  );
}

function HistoryHubSections({ hub }) {
  const [spanStart, spanEnd] = hub.timelineSpan;
  const pct = (year) => ((year - spanStart) / (spanEnd - spanStart)) * 100;
  return (
    <>
      <section className="wj-hub-section" aria-labelledby="wj-hub-start-title">
        <div className="wj-magazine-section-title"><span>01 / START HERE</span><span>A short path into the archive</span></div>
        <h2 id="wj-hub-start-title" className="wj-hub-heading">New to reading buildings? Start here.</h2>
        <ol className="wj-hub-steps">
          {hub.startHere.map((step, index) => (
            <li key={step.title}>
              <span className="wj-hub-step-num" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
              <a href={step.href}>{step.linkLabel} <span aria-hidden="true">↓</span></a>
            </li>
          ))}
        </ol>
      </section>

      <section className="wj-hub-section" aria-labelledby="wj-hub-timeline-title">
        <div className="wj-magazine-section-title"><span>02 / TIMELINE</span><span>Styles overlap — history is not a queue</span></div>
        <h2 id="wj-hub-timeline-title" className="wj-hub-heading">A thousand years, overlapping.</h2>
        <div className="wj-hub-timeline" aria-hidden="true">
          {hub.timeline.map((entry) => (
            <div className="wj-hub-tl-row" key={entry.label}>
              <span className="wj-hub-tl-label">{entry.label}</span>
              <span className="wj-hub-tl-track"><span className={`wj-hub-tl-bar${hubArticleFor(entry) ? ' is-live' : ''}`} style={{ left: `${pct(entry.start)}%`, width: `${Math.max(pct(entry.end) - pct(entry.start), 1.6)}%` }} /></span>
              <span className="wj-hub-tl-period">{entry.period}</span>
            </div>
          ))}
        </div>
        <ul className="wj-hub-timeline-list">
          {hub.timeline.map((entry) => {
            const article = hubArticleFor(entry);
            return (
              <li key={entry.label}>
                <strong>{entry.label}</strong>
                <span>{entry.period}</span>
                {article ? <a href={`/articles/${article.slug}/`}>Read the guide <span aria-hidden="true">↗</span></a> : <em>In preparation</em>}
              </li>
            );
          })}
        </ul>
      </section>

      {hub.lanes.map((lane, laneIndex) => (
        <section className="wj-hub-section" id={lane.id} key={lane.id} aria-labelledby={`wj-hub-lane-${lane.id}`}>
          <div className="wj-magazine-section-title"><span>{String(laneIndex + 3).padStart(2, '0')} / {lane.kicker}</span><span>{lane.aside}</span></div>
          <h2 id={`wj-hub-lane-${lane.id}`} className="wj-hub-heading">{lane.title}</h2>
          <p className="wj-hub-blurb">{lane.blurb}</p>
          <div className="wj-magazine-grid wj-hub-grid">
            {lane.entries.map((entry) => <HubLaneCard entry={entry} lane={lane} key={entry.articleSlug || entry.title} />)}
          </div>
        </section>
      ))}

      <section className="wj-hub-section wj-hub-method" aria-labelledby="wj-hub-method-title">
        <span className="wj-magazine-kicker">{hub.method.kicker}</span>
        <h2 id="wj-hub-method-title">{hub.method.title}</h2>
        <p>{hub.method.text}</p>
      </section>

      <section className="wj-hub-section wj-hub-bridge" id="history-materials" aria-labelledby="wj-hub-bridge-title">
        <div>
          <span className="wj-magazine-kicker">{hub.bridge.kicker}</span>
          <h2 id="wj-hub-bridge-title">{hub.bridge.title}</h2>
          <p>{hub.bridge.text}</p>
        </div>
        <ul className="wj-hub-links">
          {hub.bridge.links.map((link) => (
            <li key={link.href}><a href={link.href}>{link.label} <span aria-hidden="true">↗</span></a></li>
          ))}
        </ul>
      </section>
    </>
  );
}

export default function MagazineHub({ category = null }) {
  const articles = category ? category.articles : publishedMagazineArticles;
  const [lead, ...rest] = articles;
  const issue = magazines.find((item) => item.published);
  const title = category?.title || 'Architecture, considered.';
  const description = category?.description || 'An independent, evidence-led journal on places, materials and the decisions that make architecture matter.';

  return (
    <div className="wj-magazine-page">
      <header className="wj-magazine-header">
        <a className="wj-magazine-brand" href="/" aria-label="World Arch Journal home">
          <img src={assetUrl('/assets/brand/world-arch-wa-mark-v1.png')} alt="" width="39" height="39" />
          <span>WORLD ARCH <strong>JOURNAL</strong></span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="/magazine/" aria-current={!category ? 'page' : undefined}>Magazine</a>
          <a href="/materials/">Materials</a>
          <a href="/magazine/architectural-history-styles/">History</a>
          <a href="/projects/">Virtual Tours</a>
          <a href="/atlas/">Atlas</a>
          <a href="/newsletter/">Newsletter</a>
          <a href="/shop/">Shop</a>
          <a className="wj-magazine-cta" href="/services/">Design Services</a>
        </nav>
      </header>

      <main id="main-content">
        <section className="wj-magazine-intro" aria-labelledby="wj-magazine-title">
          <div className="wj-magazine-overline"><span>WORLD ARCH JOURNAL</span><span>ARCHITECTURE / IDEAS / EVIDENCE</span></div>
          {category && <a className="wj-magazine-back" href="/magazine/">← All stories</a>}
          <h1 id="wj-magazine-title">{title}</h1>
          <p>{description}</p>
          {category?.overview?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          {category?.hub?.promise && <p className="wj-hub-promise">{category.hub.promise}</p>}
          <div className="wj-magazine-intro-foot"><span>{String(articles.length).padStart(2, '0')} published {articles.length === 1 ? 'story' : 'stories'}</span><span>Edited by World Arch Journal</span></div>
        </section>

        <nav className="wj-magazine-topics" aria-label="Magazine topics">
          <a href="/magazine/" aria-current={!category ? 'page' : undefined}>All stories <span>{publishedMagazineArticles.length}</span></a>
          {magazineCategories.map((topic) => <a href={`/magazine/${topic.slug}/`} aria-current={category?.slug === topic.slug ? 'page' : undefined} key={topic.slug}>{topic.title} <span>{topic.articles.length}</span></a>)}
        </nav>

        {category?.hub ? (
          <HistoryHubSections hub={category.hub} />
        ) : lead && (
          <section className="wj-magazine-stories" aria-label={category ? `${category.title} articles` : 'Latest architecture articles'}>
            <div className="wj-magazine-section-title"><span>01 / {category ? 'IN THIS TOPIC' : 'LATEST STORIES'}</span><span>Editorial archive</span></div>
            <ArticleCard article={lead} featured />
            {rest.length > 0 && <div className="wj-magazine-grid">{rest.map((article) => <ArticleCard article={article} key={article.slug} />)}</div>}
          </section>
        )}

        {!category && issue && <section className="wj-magazine-issue" aria-labelledby="wj-magazine-issue-title">
          <div className="wj-magazine-issue-copy"><span className="wj-magazine-kicker">02 / THE CURATED ISSUE</span><h2 id="wj-magazine-issue-title">One theme.<br />A deeper reading.</h2><p>{issue.excerpt}</p><a href={`/magazine/${issue.slug}/`}>Explore Issue {issue.number} <span aria-hidden="true">↗</span></a></div>
          <a className="wj-magazine-issue-cover" href={`/magazine/${issue.slug}/`} aria-label={`Explore ${issue.title}`}><img src={assetUrl(issue.image)} alt={issue.imageAlt} loading="lazy" decoding="async" /></a>
        </section>}

        {!category && <section className="wj-magazine-stories" aria-label="Analysis and field notes"><div className="wj-magazine-section-title"><span>03 / ANALYSIS & FIELD NOTES</span><a href="/magazine/analysis/">View separate archive ↗</a></div><div className="wj-magazine-grid">{editorialArticles.map((entry) => <article className="wj-magazine-card" key={entry.slug}><a className="wj-magazine-card-image" href={editorialPath(entry)}><img src={assetUrl(entry.image)} alt={entry.imageAlt} loading="lazy" /></a><div className="wj-magazine-card-copy"><span className="wj-magazine-kicker">{entry.format}</span><h2><a href={editorialPath(entry)}>{entry.title}</a></h2><p>{entry.excerpt}</p><div className="wj-magazine-card-foot"><time dateTime={entry.publishedAt}>{entry.publishedAt}</time><a href={editorialPath(entry)}>Read analysis ↗</a></div></div></article>)}</div></section>}
        {!category && <section className="wj-magazine-crosslink" aria-label="Architecture video library"><div><span className="wj-magazine-kicker">ARCHITECTURE IN MOTION</span><h2>See how it works.</h2><p>Short visual lessons with transcripts, technical notes and related evidence-led reading.</p></div><a href="/videos/">Explore architecture videos <span aria-hidden="true">↗</span></a></section>}
        {!category && <section className="wj-magazine-crosslink" aria-label="Architecture newsletter"><div><span className="wj-magazine-kicker">THE WORLD ARCH BRIEFING</span><h2>Three stories. One briefing.</h2><p>Fresh architecture reporting in dated editions, with direct sources and a concise editorial lens — the journal's <a href="/newsletter/">architecture newsletter</a>, three sourced stories and one editorial reading in every edition.</p></div><a href="/newsletter/">Read the latest edition <span aria-hidden="true">↗</span></a></section>}
        <section className="wj-magazine-crosslink" aria-label="Explore more"><div><span className="wj-magazine-kicker">BEYOND THE JOURNAL</span><h2>Architecture in place.</h2><p>Explore buildings and cities through the World Arch Atlas.</p></div><a href="/atlas/">Explore the Atlas <span aria-hidden="true">↗</span></a></section>
      </main>
      <footer className="wj-magazine-footer"><span>© WORLD ARCH JOURNAL</span><nav aria-label="Footer"><a href="/editorial-policy/">Editorial policy</a><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a></nav></footer>
    </div>
  );
}
