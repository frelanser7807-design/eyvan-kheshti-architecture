import { useEffect, useState } from 'react';
import { newsletterIssues, editorialArticles, editorialPath } from '../data/newsletters.js';
import { submitSubscriber } from '../lib/dataAdapter.js';
import { assetUrl } from '../lib/assetUrl.js';
import { trackSiteEvent } from './AnalyticsConsent.jsx';
import './NewsletterPage.css';

function formatEditorialDate(value) {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${value}T12:00:00Z`));
}

function issueCard(entry) {
  const isNews = entry.format !== 'Technical field note';
  return <a className={`wj-newsletter-card${isNews ? ' is-news' : ''}`} href={editorialPath(entry)} key={entry.slug}>
    <span>{entry.format.toUpperCase()} · <time dateTime={entry.publishedAt}>{formatEditorialDate(entry.publishedAt)}</time></span>
    <img src={assetUrl(entry.image)} alt={entry.imageAlt} width={isNews ? 1620 : 1080} height={isNews ? 1080 : 1920} loading="lazy" decoding="async" />
    <strong>{entry.title}</strong><small>{entry.excerpt}</small>{entry.imageAttribution && <small className="wj-newsletter-card-credit">Photo: {entry.imageAttribution.creator} · {entry.imageAttribution.licenseLabel}; source and licence in article.</small>}<small className="wj-newsletter-card-analysis">{entry.analysisSummary}</small><em>Read the full story ↗</em>
  </a>;
}

function NewsletterPageView({ article = false, issue = newsletterIssues[0], section = 'newsletter' }) {
  const [status, setStatus] = useState('idle');
  const isNews = issue.format !== 'Technical field note';
  const isAnalysis = section === 'analysis';
  const archivePath = isAnalysis ? '/magazine/analysis/' : '/newsletter/';
  async function subscribe(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    setStatus('saving');
    trackSiteEvent('newsletter_signup_start', { placement: article ? 'newsletter_article' : isAnalysis ? 'analysis_archive' : 'newsletter_archive' });
    try {
      await submitSubscriber(values.get('email'), values.get('consent') === 'yes', values.get('website'));
      form.reset();
      setStatus('success');
      trackSiteEvent('newsletter_signup_success', { placement: article ? 'newsletter_article' : isAnalysis ? 'analysis_archive' : 'newsletter_archive' });
    } catch {
      setStatus('error');
      trackSiteEvent('newsletter_signup_error', { placement: article ? 'newsletter_article' : isAnalysis ? 'analysis_archive' : 'newsletter_archive' });
    }
  }
  return <div className="wj-newsletter-page">
    <header className="wj-newsletter-nav"><a className="wj-newsletter-brand" href="/"><img src={assetUrl('/assets/brand/world-arch-wa-mark-v1.png')} alt="" width="34" height="34" /> WORLD ARCH JOURNAL</a><nav aria-label="Primary"><a href="/magazine/">Magazine</a><a href="/newsletter/">Newsletter</a><a href="/prompts/">Prompt Lab</a></nav></header>
    <main className="wj-newsletter-main" id="main-content">
      <a className="wj-newsletter-back" href={article ? archivePath : '/magazine/'}>← {article ? (isAnalysis ? 'Analysis archive' : 'Dated editions') : 'Magazine'}</a>
      <div className="wj-newsletter-kicker">{isAnalysis ? 'WORLD ARCH / ANALYSIS & FIELD NOTES' : 'THE WORLD ARCH BRIEFING'} · {article ? issue.format.toUpperCase() : 'INDEPENDENT ARCHITECTURE JOURNALISM'}</div>
      {article ? <article>
        <h1>{issue.title}</h1><p className="wj-newsletter-deck">{issue.excerpt}</p><p className="wj-newsletter-byline">By <a href={issue.authorUrl}>{issue.author}</a> · Published <time dateTime={issue.publishedAt}>{formatEditorialDate(issue.publishedAt)}</time>{issue.updatedAt && <> · Updated <time dateTime={issue.updatedAt}>{formatEditorialDate(issue.updatedAt)}</time></>} · <a href={`/downloads/newsletter/${issue.slug}.pdf`} download onClick={() => trackSiteEvent('file_download', { file_name: `${issue.slug}.pdf`, file_extension: 'pdf', content_type: 'newsletter' })}>Download PDF ↓</a></p>
        <figure><img src={assetUrl(issue.image)} alt={issue.imageAlt} width={isNews ? 1620 : 1080} height={isNews ? 1080 : 1920} /><figcaption>{issue.imageCredit} {issue.imageAttribution && <><a href={issue.imageAttribution.sourceUrl} target="_blank" rel="noopener noreferrer">Photo source ↗</a> · <a href={issue.imageAttribution.licenseUrl} target="_blank" rel="noopener noreferrer">{issue.imageAttribution.licenseLabel}</a></>}</figcaption></figure>
        <div className="wj-newsletter-copy"><p className="wj-newsletter-lead">{issue.intro || 'At a terrace door, water control is an assembly problem. The paving, drain, membrane, frame, structure and interior floor must work together. This field note turns a construction animation into five questions a design team can use.'}</p>
          <aside className="wj-newsletter-disclosure"><strong>{issue.format} · {issue.topic}</strong><p>Sources checked <time dateTime={issue.sourcesCheckedAt}>{formatEditorialDate(issue.sourcesCheckedAt)}</time>. Source statements and our interpretation are distinguished below. <a href="/editorial-policy/">How we work ↗</a></p></aside>
          {issue.editorialAnalysis && <aside className="wj-newsletter-analysis" id="editorial-analysis"><span>EDITORIAL ANALYSIS</span><h2>What these stories mean together</h2><p>{issue.editorialAnalysis.thesis}</p><ul>{issue.editorialAnalysis.questions.map((question) => <li key={question}>{question}</li>)}</ul><p className="wj-newsletter-analysis-limit">{issue.editorialAnalysis.limit}</p></aside>}
          {issue.sections.map((section) => <section key={section.heading}><h2>{section.heading}</h2>{section.sourcePublishedAt && <p className="wj-newsletter-source-date">Source published: <time dateTime={section.sourcePublishedAt}>{formatEditorialDate(section.sourcePublishedAt)}</time></p>}{section.photo && <figure className="wj-newsletter-photo"><img src={assetUrl(section.photo.src)} alt={section.photo.alt} loading="lazy" /><figcaption>{section.photo.caption} <a href={section.photo.sourceUrl} target="_blank" rel="noopener noreferrer">Photo source ↗</a> · <a href={section.photo.licenseUrl} target="_blank" rel="noopener noreferrer">{section.photo.licenseLabel}</a></figcaption></figure>}{section.illustration && <figure className="wj-newsletter-illustration"><img src={assetUrl(section.illustration)} alt={section.illustrationAlt} width="1200" height="600" loading="lazy" /><figcaption>{section.illustrationCredit || 'World Arch Journal original conceptual diagram — not project photography.'}</figcaption></figure>}{section.paragraphs.map((paragraph) => paragraph.startsWith('Our reading:') ? <aside className="wj-newsletter-reading" key={paragraph}><strong>OUR ANALYSIS</strong><p>{paragraph.replace(/^Our reading:\s*/, '')}</p></aside> : <p key={paragraph}>{paragraph}</p>)}{section.source && <p className="wj-newsletter-source-link"><a href={section.source.url} target="_blank" rel="noopener noreferrer">Read source: {section.source.label} ↗</a></p>}{section.corroboratingSources?.map((source) => <p className="wj-newsletter-source-link" key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">Cross-check: {source.label} ↗</a></p>)}</section>)}
          {!isNews && <aside><h2>Watch, then interrogate the detail</h2><p>The animation is free to watch and the prompt is free to copy. Compare its visual sequence with the questions above before applying any detail to a real project.</p><a href={issue.related[0].url}>{issue.related[0].label} ↗</a></aside>}
          <section><h2>Further reading</h2><ul>{(isNews ? issue.related : issue.related.slice(1)).map((link) => <li key={link.url}><a href={link.url}>{link.label}</a></li>)}</ul></section>
          <section><h2>Source notes</h2><p>{isNews ? 'Official announcements and source reporting are linked below. Interpretations labelled “Our reading” are World Arch Journal commentary, not claims made by the source organisations. No sponsored placement is included in this edition.' : 'These references inform the principles discussed here; they do not approve a particular threshold assembly. Check local rules, project conditions and product documentation before construction.'}</p><ol>{issue.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.label} ↗</a></li>)}</ol></section>
          {issue.corrections?.length > 0 && <section aria-labelledby="corrections-title"><h2 id="corrections-title">Corrections</h2><ol>{issue.corrections.map((entry) => <li key={`${entry.date}-${entry.text}`}><time dateTime={entry.date}>{formatEditorialDate(entry.date)}</time>: {entry.text}</li>)}</ol></section>}
          <p className="wj-newsletter-report">Found an error or a rights concern? <a href="/editorial-team/">Contact the publisher</a>. Material corrections are logged on this page.</p>
          <p className="wj-newsletter-preferred">Enjoying the Briefing? <a href="https://www.google.com/preferences/source?q=worldarchjournal.com" target="_blank" rel="noopener noreferrer">Add WORLD ARCH JOURNAL as a preferred source on Google →</a></p>
        </div>
      </article> : <section className="wj-newsletter-hub"><h1>{isAnalysis ? 'Beyond the headline.' : 'The world, in brief.'}</h1><p className="wj-newsletter-deck">{isAnalysis ? 'Long-form analysis and practical field notes. These articles are separate from our dated news editions.' : 'Dated architecture news editions: fresh reporting, direct source links and a concise independent editorial lens. Source dates and event dates are never interchangeable.'}</p><p className="wj-newsletter-archive-links"><a href="/editorial-policy/">Editorial standards & corrections ↗</a><a href="/editorial-team/">Publisher & contact ↗</a><a href="/newsletter/feed.xml">Newsletter RSS ↗</a><a href={isAnalysis ? '/newsletter/' : '/magazine/analysis/'}>{isAnalysis ? 'Dated newsletter editions' : 'Separate analysis archive'} ↗</a></p><h2 className="wj-newsletter-archive-title">{isAnalysis ? 'Analysis & field notes' : 'Latest dated editions'}</h2>{(isAnalysis ? editorialArticles : newsletterIssues).map(issueCard)}</section>}
      <section className="wj-newsletter-signup" aria-labelledby="briefing-signup-title"><div><span>THE NEXT BRIEFING</span><h2 id="briefing-signup-title">Good architecture deserves a closer look.</h2><p>Occasional editorial email. Confirm your address to join. No paid gate on this issue.</p></div>{status === 'success' ? <p role="status">Check your inbox for a confirmation link.</p> : <form onSubmit={subscribe}><label htmlFor="briefing-email">Email address</label><input id="briefing-email" type="email" name="email" autoComplete="email" required placeholder="you@example.com" /><label className="wj-newsletter-consent"><input type="checkbox" name="consent" value="yes" required /> I agree to receive the newsletter. See our <a href="/privacy/">privacy policy</a>.</label><input className="wj-newsletter-trap" name="website" tabIndex="-1" autoComplete="off" aria-hidden="true" /><button type="submit" disabled={status === 'saving'}>{status === 'saving' ? 'Joining…' : 'Join the briefing →'}</button>{status === 'error' && <p role="alert">We could not process this request. Please try again.</p>}</form>}</section>
    </main><footer className="wj-newsletter-footer"><a href="/">WORLD ARCH JOURNAL</a><a href="/editorial-team/">Publisher & contact</a><a href="/editorial-policy/">Editorial standards</a><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a></footer>
  </div>;
}

const issueRequests = new Map();

function loadIssuePayload(issue) {
  if (!issueRequests.has(issue.slug)) {
    const request = fetch(assetUrl(issue.contentUrl))
      .then((response) => {
        if (!response.ok) throw new Error('Issue unavailable');
        return response.json();
      })
      .then((value) => {
        if (value.slug !== issue.slug || !Array.isArray(value.sections)) throw new Error('Invalid issue');
        return value;
      })
      .catch((error) => { issueRequests.delete(issue.slug); throw error; });
    issueRequests.set(issue.slug, request);
  }
  return issueRequests.get(issue.slug);
}

// In the production build the issue catalog omits `sections` (see
// newsletter-client-bundle), so article views fetch the full issue payload
// on demand — the same pattern ArticleReader uses. Hub/archive views render
// from the catalog alone and never fetch.
export default function NewsletterPage({ article = false, issue = newsletterIssues[0], section = 'newsletter' }) {
  const [loaded, setLoaded] = useState(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (!article || !issue || Array.isArray(issue.sections)) return undefined;
    let active = true;
    setFailed(false);
    loadIssuePayload(issue).then((value) => active && setLoaded(value)).catch(() => active && setFailed(true));
    return () => { active = false; };
  }, [article, issue]);
  if (article && issue && !Array.isArray(issue.sections)) {
    if (loaded?.slug === issue.slug) return <NewsletterPageView article issue={loaded} section={section} />;
    return (
      <div className="wj-newsletter-page">
        <header className="wj-newsletter-nav"><a className="wj-newsletter-brand" href="/"><img src={assetUrl('/assets/brand/world-arch-wa-mark-v1.png')} alt="" width="34" height="34" /> WORLD ARCH JOURNAL</a><nav aria-label="Primary"><a href="/magazine/">Magazine</a><a href="/newsletter/">Newsletter</a><a href="/prompts/">Prompt Lab</a></nav></header>
        <main className="wj-newsletter-main" id="main-content">
          <h1>{issue.title}</h1>
          <p aria-live="polite">{failed ? 'This edition could not be loaded. Please reload this page to try again.' : 'Loading this edition…'}</p>
        </main>
      </div>
    );
  }
  return <NewsletterPageView article={article} issue={issue} section={section} />;
}
