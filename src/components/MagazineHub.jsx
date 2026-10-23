import { assetUrl } from '../lib/assetUrl.js';
import BookCover3D from './BookCover3D.jsx';
import { magazines } from '../data/magazines.js';
import { magazineCategories, publishedMagazineArticles } from '../data/magazineCategories.js';
import { editorialArticles, editorialPath } from '../data/newsletters.js';
import ProductPage from './ProductPage.jsx';
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

function HubFigure({ image, className = '' }) {
  if (!image) return null;
  return (
    <figure className={`wj-hub-figure ${className}`}>
      <img src={assetUrl(image.src)} alt={image.alt} loading="lazy" decoding="async" />
      <figcaption>{image.credit}</figcaption>
    </figure>
  );
}

function HubStudy({ study }) {
  const facts = study.facts || {};
  return (
    <article className="wj-hub-study" id={`study-${study.id}`} aria-labelledby={`wj-study-${study.id}`}>
      <header className="wj-hub-study-head">
        <span className="wj-magazine-kicker">Field study</span>
        <h3 id={`wj-study-${study.id}`}>{study.title}</h3>
        <dl className="wj-hub-facts">
          {facts.period && <div><dt>Period</dt><dd>{facts.period}</dd></div>}
          {facts.geography && <div><dt>Geography</dt><dd>{facts.geography}</dd></div>}
          {facts.types && <div><dt>Building types</dt><dd>{facts.types}</dd></div>}
        </dl>
        {facts.note && <p className="wj-hub-fact-note">{facts.note}</p>}
      </header>
      <HubFigure image={study.images.hero} className="wj-hub-study-hero" />
      <div className="wj-hub-study-body">
        <h4>How it emerged</h4>
        {study.context.map((paragraph) => <p key={paragraph.slice(0, 32)}>{paragraph}</p>)}
        <h4>Five signs to check</h4>
        <p className="wj-hub-signs-intro">One sign alone never decides the style — let the five vote together.</p>
        <ol className="wj-hub-signs">
          {study.signs.map((sign, index) => (
            <li key={sign.name}>
              <HubFigure image={study.images[sign.img]} />
              <div>
                <h5><span aria-hidden="true">{index + 1}.</span> {sign.name}</h5>
                <p>{sign.look}</p>
                <p className="wj-hub-sign-limit"><strong>Limit:</strong> {sign.limit}</p>
              </div>
            </li>
          ))}
        </ol>
        {study.diagram && (
          <figure className="wj-hub-figure wj-hub-diagram">
            <img src={assetUrl(study.diagram.src)} alt={study.diagram.caption} loading="lazy" decoding="async" />
            <figcaption>{study.diagram.caption} {study.diagram.credit}.</figcaption>
          </figure>
        )}
        <h4>Materials &amp; construction</h4>
        <p>{study.materials}</p>
        <p className="wj-hub-materials-note">Historic practice is described first; modern equivalents are named separately — the two layers are never merged.</p>
        <h4>Documented examples</h4>
        <ul className="wj-hub-examples">
          {study.examples.map((example) => (
            <li key={example.name}>
              <strong>{example.name}</strong> — {example.place}, {example.date}. {example.look}
              {' '}<a href={example.sourceUrl} target="_blank" rel="noopener noreferrer">Source: {example.sourceName} ↗</a>
            </li>
          ))}
        </ul>
        <aside className="wj-hub-lesson"><span>Lesson for today</span><p>{study.lesson}</p></aside>
        <p className="wj-hub-sources">Sources: {study.sources.map((source, index) => (
          <span key={source.url}>{index > 0 ? ' · ' : ''}<a href={source.url} target="_blank" rel="noopener noreferrer">{source.name}</a></span>
        ))}</p>
        {study.deepRead && <p className="wj-hub-deepread"><a href={study.deepRead}>Read the full guide to {study.title} <span aria-hidden="true">↗</span></a></p>}
        {study.deepPage && (
          <div className="wj-hub-book">
            {study.bookCover && <BookCover3D src={study.bookCover} title={study.title} className="wj-hub-bookcover" />}
            <div className="wj-hub-booklinks">
              <a className="wj-hub-book-read" href={study.deepPage}>Read the complete history <span aria-hidden="true">→</span></a>
              {study.readPath && <a className="wj-hub-book-read" href={study.readPath}>Read the book <span aria-hidden="true">→</span></a>}
              {study.pdf && <a className="wj-hub-book-pdf" href={`${study.deepPage}#get-the-book`}>Download the book (PDF)</a>}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

function HubCompare({ comparison }) {
  return (
    <article className="wj-hub-compare" id={`compare-${comparison.id}`} aria-labelledby={`wj-compare-${comparison.id}`}>
      <h3 id={`wj-compare-${comparison.id}`}>{comparison.title}</h3>
      <p className="wj-hub-compare-intro">{comparison.intro}</p>
      <div className="wj-hub-compare-heads">
        {[comparison.left, comparison.right].map((side) => (
          <div key={side.name}>
            <HubFigure image={side.img} />
            <h4>{side.name}</h4>
            <p>{side.traits}</p>
          </div>
        ))}
      </div>
      <div className="wj-hub-compare-table" role="table" aria-label={`${comparison.title} compared detail by detail`}>
        {comparison.rows.map((row) => (
          <div className="wj-hub-compare-row" role="row" key={row.detail}>
            <span className="wj-hub-compare-detail" role="rowheader">{row.detail}</span>
            <p role="cell"><strong>{comparison.left.name}:</strong> {row.left}</p>
            <p role="cell"><strong>{comparison.right.name}:</strong> {row.right}</p>
          </div>
        ))}
      </div>
      <p><strong>What they share:</strong> {comparison.shared}</p>
      <p><strong>Exceptions:</strong> {comparison.exceptions}</p>
      <p className="wj-hub-sources">Sources: {comparison.sources.map((source, index) => (
        <span key={source.url}>{index > 0 ? ' · ' : ''}<a href={source.url} target="_blank" rel="noopener noreferrer">{source.name}</a></span>
      ))}</p>
      {comparison.deepPage && (
        <div className="wj-hub-book">
          {comparison.bookCover && <BookCover3D src={comparison.bookCover} title={comparison.title} className="wj-hub-bookcover" />}
          <div className="wj-hub-booklinks">
            <a className="wj-hub-book-read" href={comparison.deepPage}>Read the complete history <span aria-hidden="true">→</span></a>
            {comparison.readPath && <a className="wj-hub-book-read" href={comparison.readPath}>Read the book <span aria-hidden="true">→</span></a>}
            {comparison.pdf && <a className="wj-hub-book-pdf" href={`${comparison.deepPage}#get-the-book`}>Download the book (PDF)</a>}
          </div>
        </div>
      )}
    </article>
  );
}

function HubMethodStudy({ methodStudy }) {
  return (
    <section className="wj-hub-section" id="history-method-study" aria-labelledby="wj-hub-method-study-title">
      <div className="wj-magazine-section-title"><span>GUIDED METHOD</span><span>The pillar study</span></div>
      <h2 id="wj-hub-method-study-title" className="wj-hub-heading">How to identify a building's style.</h2>
      <p className="wj-hub-blurb">The five-sign method, worked through step by step on one real facade: {methodStudy.facade.name}, {methodStudy.facade.place}. Read each sign, then check what it can — and cannot — prove.</p>
      <HubFigure image={methodStudy.facade.img} className="wj-hub-method-figure" />
      <ol className="wj-hub-method-steps">
        {methodStudy.steps.map((step, index) => (
          <li key={step.sign}>
            <h3><span aria-hidden="true">{index + 1}.</span> {step.sign}</h3>
            <p><strong>Observe:</strong> {step.observe}</p>
            <p><strong>Conclude:</strong> {step.conclude}</p>
          </li>
        ))}
      </ol>
      <aside className="wj-hub-lesson"><span>Verdict</span><p>{methodStudy.verdict}</p></aside>
      <h3 className="wj-hub-subhead">Three mistakes to avoid</h3>
      <ul className="wj-hub-mistakes">
        {methodStudy.mistakes.map((mistake) => <li key={mistake.slice(0, 28)}>{mistake}</li>)}
      </ul>
    </section>
  );
}

function HubCaseStudy({ caseStudy }) {
  return (
    <section className="wj-hub-section" id="history-case-study" aria-labelledby="wj-hub-case-title">
      <div className="wj-magazine-section-title"><span>CASE STUDY</span><span>One building, read closely</span></div>
      <h2 id="wj-hub-case-title" className="wj-hub-heading">{caseStudy.building.name}.</h2>
      <p className="wj-hub-blurb">{caseStudy.building.date} · Source: <a href={caseStudy.building.sourceUrl} target="_blank" rel="noopener noreferrer">{caseStudy.building.sourceName} ↗</a></p>
      <p className="wj-hub-case-intro">{caseStudy.intro}</p>
      <HubFigure image={caseStudy.images.full} className="wj-hub-study-hero" />
      <HubFigure image={caseStudy.images.detail} />
      <ol className="wj-hub-case-beats">
        {caseStudy.beats.map((beat) => (
          <li key={beat.detail}>
            <h3>{beat.detail}</h3>
            <p>{beat.explanation}</p>
          </li>
        ))}
      </ol>
      <aside className="wj-hub-lesson"><span>Lesson for today</span><p>{caseStudy.lesson}</p></aside>
      <p className="wj-hub-sources">Sources: {caseStudy.sources.map((source, index) => (
        <span key={source.url}>{index > 0 ? ' · ' : ''}<a href={source.url} target="_blank" rel="noopener noreferrer">{source.name}</a></span>
      ))}</p>
    </section>
  );
}

function HubFaq({ faq }) {
  return (
    <section className="wj-hub-section" id="history-faq" aria-labelledby="wj-hub-faq-title">
      <div className="wj-magazine-section-title"><span>QUESTIONS</span><span>Answered from the studies</span></div>
      <h2 id="wj-hub-faq-title" className="wj-hub-heading">Frequently asked questions.</h2>
      <div className="wj-hub-faq-list">
        {faq.map((item) => (
          <details key={item.question}>
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function HubLaneCard({ entry, lane, study = null }) {
  const article = hubArticleFor(entry);
  if (!article) {
    return (
      <article className="wj-hub-card wj-hub-prep">
        {study && (
          <a className="wj-magazine-card-image has-cover" href={`#study-${study.id}`} aria-label={`Read the study: ${study.title}`}>
            <img className="wj-magazine-card-backdrop" src={assetUrl(study.images.hero.src)} alt="" aria-hidden="true" loading="lazy" decoding="async" />
            <img className="wj-magazine-card-cover" src={assetUrl(study.images.hero.src)} alt={study.images.hero.alt} loading="lazy" decoding="async" />
          </a>
        )}
        <span className="wj-magazine-kicker">{lane.title}</span>
        <h3>{entry.title}</h3>
        {entry.period && <p className="wj-hub-period">{entry.period}</p>}
        <p>{entry.learn}</p>
        {study
          ? <a className="wj-hub-studylink" href={`#study-${study.id}`}>Read the study <span aria-hidden="true">↓</span></a>
          : <a className="wj-hub-studylink" href="#history-method-study">Open the comparison studies <span aria-hidden="true">↓</span></a>}
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
            const timelineStudyIds = { Romanesque: 'romanesque', Gothic: 'gothic', Baroque: 'baroque-rococo', Rococo: 'baroque-rococo', Victorian: 'victorian', 'Art Nouveau': 'art-nouveau', Modernism: 'modernism-international-style' };
            const studyId = timelineStudyIds[entry.label];
            return (
              <li key={entry.label}>
                <strong>{entry.label}</strong>
                <span>{entry.period}</span>
                {article ? <a href={`/articles/${article.slug}/`}>Read the guide <span aria-hidden="true">↗</span></a> : studyId ? <a href={`#study-${studyId}`}>Read the study <span aria-hidden="true">↓</span></a> : <em>In preparation</em>}
              </li>
            );
          })}
        </ul>
      </section>

      {hub.lanes.map((lane, laneIndex) => {
        const studyFor = (entry) => (hub.studies || []).find((study) => study.id === entry.id) || null;
        const isComparisons = lane.id === 'history-comparisons';
        return (
          <section className="wj-hub-section" id={lane.id} key={lane.id} aria-labelledby={`wj-hub-lane-${lane.id}`}>
            <div className="wj-magazine-section-title"><span>{String(laneIndex + 3).padStart(2, '0')} / {lane.kicker}</span><span>{lane.aside}</span></div>
            <h2 id={`wj-hub-lane-${lane.id}`} className="wj-hub-heading">{lane.title}</h2>
            <p className="wj-hub-blurb">{lane.blurb}</p>
            {isComparisons ? (
              <>
                {(hub.comparisons || []).map((comparison) => <HubCompare comparison={comparison} key={comparison.id} />)}
                <p className="wj-hub-compare-method-note">The third study in this lane — <a href="#history-method-study">how to identify a building's style</a> — is the guided method section below, worked through on one real facade.</p>
              </>
            ) : (
              <>
                <div className="wj-magazine-grid wj-hub-grid">
                  {lane.entries.map((entry) => <HubLaneCard entry={entry} lane={lane} study={studyFor(entry)} key={entry.articleSlug || entry.title} />)}
                </div>
                {lane.entries.map((entry) => {
                  const study = studyFor(entry);
                  return study ? <HubStudy study={study} key={study.id} /> : null;
                })}
              </>
            )}
          </section>
        );
      })}

      {hub.methodStudy && <HubMethodStudy methodStudy={hub.methodStudy} />}
      {hub.caseStudy && <HubCaseStudy caseStudy={hub.caseStudy} />}
      {hub.faq && <HubFaq faq={hub.faq} />}

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

export default function MagazineHub({ categorySlug = null }) {
  const category = categorySlug ? magazineCategories.find((topic) => topic.slug === categorySlug) || null : null;
  if (categorySlug && !category) return <ProductPage missing />;
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
          <a href="/videos/">Videos</a>
          <a href="/newsletter/">Newsletter</a>
          <a href="/atlas/">Atlas</a>
          <a href="/#services">Studio</a>
          <a href="/#contact">Contact</a>
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
