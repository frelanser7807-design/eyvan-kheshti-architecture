import { useEffect, useMemo, useState } from 'react';
import { assetUrl } from '../lib/assetUrl.js';
import { promptCategories, promptItems } from '../data/promptLibrary.js';
import './PromptLibrary.css';
import './PromptLibraryMobile.css';

export async function copyPromptText(value) {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(value);
  const field = document.createElement('textarea');
  field.value = value;
  field.setAttribute('readonly', '');
  field.style.position = 'fixed';
  field.style.opacity = '0';
  document.body.appendChild(field);
  field.select();
  document.execCommand('copy');
  field.remove();
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
  const [copied, setCopied] = useState('');
  const filtered = useMemo(() => active === 'all' ? promptItems : promptItems.filter((item) => item.category === active), [active]);

  useEffect(() => {
    const query = active === 'all' ? '' : `?category=${active}`;
    window.history.replaceState({}, '', `/prompts/${query}`);
  }, [active]);

  const copyPrompt = async (item) => {
    if (item.access !== 'free' || !item.prompt) return;
    await copyPromptText(item.prompt);
    setCopied(item.id);
    window.setTimeout(() => setCopied(''), 1600);
  };

  return (
    <main id="main-content" className="prompt-library-page">
      <PromptSiteHeader />
      <section className="prompt-library-hero">
        <div><small>WORLD ARCH PROMPT LAB · FREE + PRO</small><h1>AI prompts for architecture, image and motion.</h1></div>
        <div><p>Copy tested free prompts for websites, architectural images, short videos, logo motion and animated backgrounds. Crown-marked collections are professional packs and remain securely locked.</p><span>05 FREE PROMPTS · 05 ♛ PRO COLLECTIONS</span></div>
      </section>

      <nav className="prompt-filter" aria-label="Prompt categories">
        <button type="button" className={active === 'all' ? 'is-active' : ''} onClick={() => setActive('all')}>All <span>{promptItems.length}</span></button>
        {promptCategories.map((category) => <button type="button" className={active === category.slug ? 'is-active' : ''} onClick={() => setActive(category.slug)} key={category.slug}>{category.title} <span>{promptItems.filter((item) => item.category === category.slug).length}</span></button>)}
      </nav>

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
      </section>

      <section className="prompt-category-notes" aria-label="Prompt category guide">
        {promptCategories.map((category) => <article key={category.slug}><small>{category.short}</small><p>{category.description}</p><button type="button" onClick={() => setActive(category.slug)}>View category ↗</button></article>)}
      </section>

      <aside className="prompt-disclosure"><strong>Editorial note</strong><p>AI outputs are concept studies, not built projects or construction documents. Results vary by model and version. Professional packs will open only after rights, payment, delivery and refund terms are verified.</p></aside>
      <footer className="prompt-library-footer"><span>© WORLD ARCH JOURNAL</span><a href="/editorial-policy/">Editorial policy</a><a href="/terms/">Terms</a><a href="/privacy/">Privacy</a></footer>
    </main>
  );
}
