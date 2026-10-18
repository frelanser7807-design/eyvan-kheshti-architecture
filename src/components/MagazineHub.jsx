import { assetUrl } from '../lib/assetUrl.js';
import { magazines } from '../data/magazines.js';
import { magazineCategories, publishedMagazineArticles } from '../data/magazineCategories.js';
import { editorialArticles, editorialPath } from '../data/newsletters.js';
import './MagazineHub.css';

function ArticleCard({ article, featured = false }) {
  return (
    <article className={`wj-magazine-card${featured ? ' is-featured' : ''}`}>
      <a className="wj-magazine-card-image" href={`/articles/${article.slug}/`} aria-label={`Read ${article.title}`}>
        <picture>
          {article.imageWebp && <source srcSet={assetUrl(article.imageWebp)} type="image/webp" />}
          <img src={assetUrl(article.image)} alt={article.imageAlt} loading={featured ? 'eager' : 'lazy'} decoding="async" width={article.imageWidth || 1600} height={article.imageHeight || 900} />
        </picture>
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
          <div className="wj-magazine-intro-foot"><span>{String(articles.length).padStart(2, '0')} published {articles.length === 1 ? 'story' : 'stories'}</span><span>Edited by World Arch Journal</span></div>
        </section>

        <nav className="wj-magazine-topics" aria-label="Magazine topics">
          <a href="/magazine/" aria-current={!category ? 'page' : undefined}>All stories <span>{publishedMagazineArticles.length}</span></a>
          {magazineCategories.map((topic) => <a href={`/magazine/${topic.slug}/`} aria-current={category?.slug === topic.slug ? 'page' : undefined} key={topic.slug}>{topic.title} <span>{topic.articles.length}</span></a>)}
        </nav>

        {lead && <section className="wj-magazine-stories" aria-label={category ? `${category.title} articles` : 'Latest architecture articles'}>
          <div className="wj-magazine-section-title"><span>01 / {category ? 'IN THIS TOPIC' : 'LATEST STORIES'}</span><span>Editorial archive</span></div>
          <ArticleCard article={lead} featured />
          {rest.length > 0 && <div className="wj-magazine-grid">{rest.map((article) => <ArticleCard article={article} key={article.slug} />)}</div>}
        </section>}

        {!category && issue && <section className="wj-magazine-issue" aria-labelledby="wj-magazine-issue-title">
          <div className="wj-magazine-issue-copy"><span className="wj-magazine-kicker">02 / THE CURATED ISSUE</span><h2 id="wj-magazine-issue-title">One theme.<br />A deeper reading.</h2><p>{issue.excerpt}</p><a href={`/magazine/${issue.slug}/`}>Explore Issue {issue.number} <span aria-hidden="true">↗</span></a></div>
          <a className="wj-magazine-issue-cover" href={`/magazine/${issue.slug}/`} aria-label={`Explore ${issue.title}`}><img src={assetUrl(issue.image)} alt={issue.imageAlt} loading="lazy" decoding="async" /></a>
        </section>}

        {!category && <section className="wj-magazine-stories" aria-label="Analysis and field notes"><div className="wj-magazine-section-title"><span>03 / ANALYSIS & FIELD NOTES</span><a href="/magazine/analysis/">View separate archive ↗</a></div><div className="wj-magazine-grid">{editorialArticles.map((entry) => <article className="wj-magazine-card" key={entry.slug}><a className="wj-magazine-card-image" href={editorialPath(entry)}><img src={assetUrl(entry.image)} alt={entry.imageAlt} loading="lazy" /></a><div className="wj-magazine-card-copy"><span className="wj-magazine-kicker">{entry.format}</span><h2><a href={editorialPath(entry)}>{entry.title}</a></h2><p>{entry.excerpt}</p><div className="wj-magazine-card-foot"><time dateTime={entry.publishedAt}>{entry.publishedAt}</time><a href={editorialPath(entry)}>Read analysis ↗</a></div></div></article>)}</div></section>}
        {!category && <section className="wj-magazine-crosslink" aria-label="Architecture video library"><div><span className="wj-magazine-kicker">ARCHITECTURE IN MOTION</span><h2>See how it works.</h2><p>Short visual lessons with transcripts, technical notes and related evidence-led reading.</p></div><a href="/videos/">Explore architecture videos <span aria-hidden="true">↗</span></a></section>}
        {!category && <section className="wj-magazine-crosslink" aria-label="Architecture newsletter"><div><span className="wj-magazine-kicker">THE WORLD ARCH BRIEFING</span><h2>Three stories. One briefing.</h2><p>Fresh architecture reporting in dated editions, with direct sources and a concise editorial lens.</p></div><a href="/newsletter/">Read the latest edition <span aria-hidden="true">↗</span></a></section>}
        <section className="wj-magazine-crosslink" aria-label="Explore more"><div><span className="wj-magazine-kicker">BEYOND THE JOURNAL</span><h2>Architecture in place.</h2><p>Explore buildings and cities through the World Arch Atlas.</p></div><a href="/atlas/">Explore the Atlas <span aria-hidden="true">↗</span></a></section>
      </main>
      <footer className="wj-magazine-footer"><span>© WORLD ARCH JOURNAL</span><nav aria-label="Footer"><a href="/editorial-policy/">Editorial policy</a><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a></nav></footer>
    </div>
  );
}
