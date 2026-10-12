import { useEffect, useMemo, useState } from 'react';
import { assetUrl } from '../lib/assetUrl.js';
import { promptCategories, promptItems } from '../data/promptLibrary.js';
import { trackSiteEvent } from './AnalyticsConsent.jsx';
import './PromptLibrary.css';
import './PromptLibraryMobile.css';
import './PromptEnhancements.css';

export async function copyPromptText(value) {
  if (navigator.clipboard?.writeText) {
    try { await navigator.clipboard.writeText(value); return; }
    catch { /* Some embedded browsers deny Clipboard API; try selection fallback. */ }
  }
  const field = document.createElement('textarea');
  field.value = value;
  field.setAttribute('readonly', '');
  field.style.position = 'fixed';
  field.style.opacity = '0';
  document.body.appendChild(field);
  field.select();
  const copied = document.execCommand('copy');
  field.remove();
  if (!copied) throw new Error('Clipboard access is unavailable');
}

export function PromptSiteHeader() {
  return (
    <header className="prompt-library-header">
      <a className="prompt-library-brand" href="/"><img src={assetUrl('/assets/brand/world-arch-wa-mark-v1.png')} alt="" /><span>WORLD ARCH JOURNAL</span></a>
      <nav aria-label="Primary navigation"><a href="/magazine/">Magazine</a><a href="/atlas/">Atlas</a><a href="/shop/">Shop</a></nav>
    </header>
  );
}

export default function PromptLibrary() {
  const urlCategory = new URLSearchParams(window.location.search).get('category');
  const initialCategory = promptCategories.some((item) => item.slug === urlCategory) ? urlCategory : 'all';
  const [active, setActive] = useState(initialCategory);
  const [query, setQuery] = useState(() => new URLSearchParams(window.location.search).get('q') || '');
  const [copied, setCopied] = useState('');
  const filtered = useMemo(() => {
    const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
    return promptItems.filter((item) => {
      if (active !== 'all' && item.category !== active) return false;
      const haystack = `${item.title} ${item.summary} ${item.tool} ${item.category}`.toLowerCase();
      return terms.every((term) => haystack.includes(term));
    });
  }, [active, query]);
  const freeCount = promptItems.filter((item) => item.access === 'free').length;
  const proCount = promptItems.filter((item) => item.access === 'premium').length;

  useEffect(() => {
    const params = new URLSearchParams();
    if (active !== 'all') params.set('category', active);
    if (query.trim()) params.set('q', query.trim());
    window.history.replaceState({}, '', `/prompts/${params.size ? `?${params}` : ''}`);
  }, [active, query]);

  const copyPrompt = async (item) => {
    if (item.access !== 'free' || !item.prompt) return;
    await copyPromptText(item.prompt);
    trackSiteEvent('prompt_copy', { prompt_id: item.id, prompt_category: item.category, placement: 'prompt_library' });
    setCopied(item.id);
    window.setTimeout(() => setCopied(''), 1600);
  };

  return (
    <main id="main-content" className="prompt-library-page">
      <PromptSiteHeader />
      <section className="prompt-library-hero">
        <div><small>WORLD ARCH PROMPT LAB · FREE + PRO</small><h1>AI prompts for architecture, image and motion.</h1></div>
        <div><p>Copy tested free prompts for websites, architectural images, short videos, logo motion and animated backgrounds. Crown-marked collections are professional packs and remain securely locked.</p><span>{String(freeCount).padStart(2, '0')} FREE PROMPTS · {String(proCount).padStart(2, '0')} ♛ PRO COLLECTIONS</span></div>
      </section>

      <nav className="prompt-filter" aria-label="Prompt categories">
        <button type="button" className={active === 'all' ? 'is-active' : ''} onClick={() => setActive('all')}>All <span>{promptItems.length}</span></button>
        {promptCategories.map((category) => <button type="button" className={active === category.slug ? 'is-active' : ''} onClick={() => setActive(category.slug)} key={category.slug}>{category.title} <span>{promptItems.filter((item) => item.category === category.slug).length}</span></button>)}
      </nav>

      <div className="prompt-search"><label htmlFor="prompt-search-input">Search the Prompt Lab</label><div><input id="prompt-search-input" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try: facade, video, website…" /><span>{filtered.length} {filtered.length === 1 ? 'result' : 'results'}</span></div></div>

      <section className="prompt-grid" aria-live="polite">
        {filtered.map((item) => {
          const category = promptCategories.find((entry) => entry.slug === item.category);
          const premium = item.access === 'premium';
          return (
            <article className={`prompt-card ${premium ? 'is-pro' : 'is-free'}`} key={item.id}>
              <a className="prompt-card-visual" href={`/prompts/${item.id}/`} aria-label={`Open ${item.title}`}>
                <img src={assetUrl(item.image)} alt={`${item.title} architectural prompt preview`} loading="lazy" decoding="async" />
                <span className="prompt-access">{premium ? '♛ PRO' : 'FREE'}</span>
                {premium && <span className="prompt-lock" aria-hidden="true"><b>♛</b><small>PRO</small></span>}
              </a>
              <div className="prompt-card-copy">
                <a href={`/prompts/${item.id}/`}><h2>{item.title}</h2></a>
                <span>{category?.title}</span>
                {premium
                  ? <a className="prompt-card-action is-pro" href={`/prompts/${item.id}/`}><b>♛</b> PRO PROMPT</a>
                  : <button className="prompt-card-action" type="button" onClick={() => copyPrompt(item)}><b>▢</b> {copied === item.id ? 'COPIED ✓' : 'COPY PROMPT'}</button>}
              </div>
            </article>
          );
        })}
        {filtered.length === 0 && <div className="prompt-empty"><h2>No matching prompt yet.</h2><p>Try a broader term or browse all categories.</p><button type="button" onClick={() => { setQuery(''); setActive('all'); }}>Show all prompts</button></div>}
      </section>

      <section className="prompt-category-notes" aria-label="Prompt category guide">
        {promptCategories.map((category) => <article key={category.slug}><small>{category.short}</small><p>{category.description}</p><button type="button" onClick={() => setActive(category.slug)}>View category ↗</button></article>)}
      </section>

      <aside className="prompt-disclosure"><strong>Editorial note</strong><p>AI outputs are concept studies, not built projects or construction documents. Results vary by model and version. Professional packs will open only after rights, payment, delivery and refund terms are verified.</p></aside>
      <footer className="prompt-library-footer"><span>© WORLD ARCH JOURNAL</span><a href="/editorial-policy/">Editorial policy</a><a href="/terms/">Terms</a><a href="/privacy/">Privacy</a></footer>
    </main>
  );
}
