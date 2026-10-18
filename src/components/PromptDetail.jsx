import { useState } from 'react';
import { assetUrl } from '../lib/assetUrl.js';
import { promptCategories, promptItems } from '../data/promptLibrary.js';
import { watchVideoForSource, watchPagePath } from '../data/watchVideos.js';
import { copyPromptText, PromptSiteHeader } from './PromptLibrary.jsx';
import { trackSiteEvent } from './AnalyticsConsent.jsx';
import './PromptLibrary.css';
import './PromptDetailVideo.css';

function CopyPanel({ label, value, copied, onCopy }) {
  return (
    <section className="prompt-detail-copy-panel">
      <header><span>{label}</span><button type="button" onClick={() => onCopy(value)}>{copied === 'done' ? 'COPIED ✓' : copied === 'error' ? 'SELECT TEXT BELOW' : 'COPY PROMPT'}</button></header>
      <p>{value}</p>
    </section>
  );
}

export default function PromptDetail({ item }) {
  const [copied, setCopied] = useState('');
  const premium = item.access === 'premium';
  const category = promptCategories.find((entry) => entry.slug === item.category);
  const related = promptItems.filter((entry) => entry.id !== item.id && entry.category === item.category).slice(0, 3);
  const dedicatedWatchPage = watchVideoForSource(`/prompts/${item.id}/`);
  const howToUse = item.howToUse || [
    'Upload a rights-cleared architectural reference image.',
    'Paste the main prompt into your image-to-video tool.',
    'Add the vertical settings for a Reel or Story output.',
    'Check building identity, motion and media rights before publishing.',
  ];
  const copyValue = async (key, value) => {
    try { await copyPromptText(value); setCopied(key); trackSiteEvent('prompt_copy', { prompt_id: item.id, prompt_category: item.category, prompt_part: key, placement: 'prompt_detail' }); }
    catch { setCopied(`error-${key}`); }
    window.setTimeout(() => setCopied(''), 1600);
  };

  return (
    <main id="main-content" className="prompt-library-page prompt-detail-page">
      <PromptSiteHeader />
      <nav className="prompt-breadcrumb" aria-label="Breadcrumb"><a href="/prompts/">Prompt Library</a><span>/</span><a href={`/prompts/?category=${item.category}`}>{category?.title}</a></nav>
      <article className={`prompt-detail ${premium ? 'is-pro' : 'is-free'}`}>
        <div className="prompt-detail-intro">
          <figure>
            {item.video
              ? <video src={assetUrl(item.video)} poster={assetUrl(item.image)} controls playsInline preload="metadata" aria-label={`${item.title} example video`} />
              : <img src={assetUrl(item.image)} alt={`${item.title} prompt preview`} fetchPriority="high" />}
            <span>{premium ? '♛ PRO' : 'FREE'}</span>
          </figure>
          {dedicatedWatchPage && <p><a href={watchPagePath(dedicatedWatchPage)}>Watch this example on its dedicated video page ↗</a></p>}
          <header><small>{category?.title} · {item.tool}</small><h1>{item.title}</h1><p>{item.summary}</p>{!premium && <div className="prompt-detail-quick-actions"><button type="button" onClick={() => copyValue('primary', item.prompt)}>{copied === 'primary' ? 'COPIED ✓' : copied === 'error-primary' ? 'SELECT PROMPT BELOW' : 'COPY FULL PROMPT'}</button><a href="#master-prompt">View the full prompt ↓</a></div>}</header>
        </div>
        {item.referenceFrames?.length > 0 && (
          <section className="prompt-reference-frames" aria-labelledby="prompt-reference-title">
            <header><small>REFERENCE PACKAGE</small><h2 id="prompt-reference-title">{item.referenceFrames.length === 1 ? 'Final-frame reference' : 'Start and end frames'}</h2><p>{item.referenceFrames.length === 1 ? 'Use this image with the master prompt to lock the completed architectural composition.' : 'Use these two images with the single master prompt to lock the opening and completed construction states.'}</p></header>
            <div>{item.referenceFrames.map((frame) => <figure key={frame.label}><img src={assetUrl(frame.src)} alt={frame.alt} loading="lazy" /><figcaption><span>{frame.label}</span><a href={assetUrl(frame.src)} download>DOWNLOAD JPG</a></figcaption></figure>)}</div>
            {item.sourceGuide && <p><a href={assetUrl(item.sourceGuide)} download>Download the supplied PDF prompt guide</a></p>}
          </section>
        )}
        {premium ? (
          <section className="prompt-detail-lock">
            <b>♛</b><small>WORLD ARCH PRO</small><h2>Professional prompt collection</h2><p>The full prompt, tested variations and production settings are locked. Secure purchase and automatic delivery will be activated only after the payment, rights and refund workflow is verified.</p><span>NO CHECKOUT IS ACTIVE YET</span><a href="/newsletter/#briefing-signup-title" onClick={() => trackSiteEvent('pro_prompt_waitlist_click', { prompt_id: item.id, prompt_category: item.category })}>Get the launch notice →</a>
          </section>
        ) : (
          <div className="prompt-detail-content">
            <div id="master-prompt"><CopyPanel label={item.promptLabel} value={item.prompt} copied={copied === 'primary' ? 'done' : copied === 'error-primary' ? 'error' : ''} onCopy={(value) => copyValue('primary', value)} /></div>
            <CopyPanel label={item.secondaryLabel} value={item.secondaryPrompt} copied={copied === 'secondary' ? 'done' : copied === 'error-secondary' ? 'error' : ''} onCopy={(value) => copyValue('secondary', value)} />
            <aside><strong>How to use it</strong><ol>{howToUse.map((step) => <li key={step}>{step}</li>)}</ol><p>{item.disclosure || 'Disclosure: this is an AI-generated visualisation, not a construction method or safety guide.'}</p></aside>
          </div>
        )}
      </article>
      {related.length > 0 && <section className="prompt-related" aria-labelledby="related-prompts-title"><small>CONTINUE EXPLORING</small><h2 id="related-prompts-title">Related prompts</h2><div>{related.map((entry) => <a href={`/prompts/${entry.id}/`} key={entry.id}><span>{entry.access === 'premium' ? '♛ PRO' : 'FREE'}</span><strong>{entry.title}</strong><small>{entry.tool}</small></a>)}</div></section>}
      <footer className="prompt-library-footer"><a href="/prompts/">← All prompts</a><a href="/editorial-policy/">Editorial policy</a><a href="/privacy/">Privacy</a></footer>
    </main>
  );
}
