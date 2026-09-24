import { useState } from 'react';
import { assetUrl } from '../lib/assetUrl.js';
import { promptCategories } from '../data/promptLibrary.js';
import { copyPromptText, PromptSiteHeader } from './PromptLibrary.jsx';
import './PromptLibrary.css';

function CopyPanel({ label, value, copied, onCopy }) {
  return (
    <section className="prompt-detail-copy-panel">
      <header><span>{label}</span><button type="button" onClick={() => onCopy(value)}>{copied ? 'COPIED ✓' : 'COPY PROMPT'}</button></header>
      <p>{value}</p>
    </section>
  );
}

export default function PromptDetail({ item }) {
  const [copied, setCopied] = useState('');
  const premium = item.access === 'premium';
  const category = promptCategories.find((entry) => entry.slug === item.category);
  const copyValue = async (key, value) => {
    await copyPromptText(value);
    setCopied(key);
    window.setTimeout(() => setCopied(''), 1600);
  };

  return (
    <main id="main-content" className="prompt-library-page prompt-detail-page">
      <PromptSiteHeader />
      <nav className="prompt-breadcrumb" aria-label="Breadcrumb"><a href="/prompts/">Prompt Library</a><span>/</span><a href={`/prompts/?category=${item.category}`}>{category?.title}</a></nav>
      <article className={`prompt-detail ${premium ? 'is-pro' : 'is-free'}`}>
        <div className="prompt-detail-intro">
          <figure><img src={assetUrl(item.image)} alt={`${item.title} prompt preview`} fetchPriority="high" /><span>{premium ? '♛ PRO' : 'FREE'}</span></figure>
          <header><small>{category?.title} · {item.tool}</small><h1>{item.title}</h1><p>{item.summary}</p></header>
        </div>
        {premium ? (
          <section className="prompt-detail-lock">
            <b>♛</b><small>WORLD ARCH PRO</small><h2>Professional prompt collection</h2><p>The full prompt, tested variations and production settings are locked. Secure purchase and automatic delivery will be activated only after the payment, rights and refund workflow is verified.</p><span>NO CHECKOUT IS ACTIVE YET</span>
          </section>
        ) : (
          <div className="prompt-detail-content">
            <CopyPanel label={item.promptLabel} value={item.prompt} copied={copied === 'primary'} onCopy={(value) => copyValue('primary', value)} />
            <CopyPanel label={item.secondaryLabel} value={item.secondaryPrompt} copied={copied === 'secondary'} onCopy={(value) => copyValue('secondary', value)} />
            <aside><strong>How to use it</strong><ol><li>Upload or describe your architectural reference.</li><li>Paste the main prompt into the selected AI tool.</li><li>Add the settings or negative prompt.</li><li>Review geometry, materials and rights before publishing.</li></ol></aside>
          </div>
        )}
      </article>
      <footer className="prompt-library-footer"><a href="/prompts/">← All prompts</a><a href="/editorial-policy/">Editorial policy</a><a href="/privacy/">Privacy</a></footer>
    </main>
  );
}
