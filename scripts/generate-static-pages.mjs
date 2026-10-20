import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { emitMaterialCollections, materialCollectionSitemap } from './material-collection-pages.mjs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { articles, relatedArticlesFor } from '../src/data/articles.js';
import { magazines } from '../src/data/magazines.js';
import { magazineCategories, publishedMagazineArticles } from '../src/data/magazineCategories.js';
import { promptCategories, promptItems } from '../src/data/promptLibrary.js';
import { defaultContent } from '../src/data/defaultContent.js';
import { legalPages } from '../src/data/legalPages.js';
import { newsletterIssues, editorialArticles, editorialPath } from '../src/data/newsletters.js';
import { projects } from '../src/data/projects.js';
import { publishedVideoStories } from '../src/data/videoStories.js';
import { watchVideoEntries, watchPagePath, watchVideoForSource } from '../src/data/watchVideos.js';
import { atlasVilla } from '../src/data/atlasVilla.js';
import { ajorbaft } from '../src/data/ajorbaft.js';
import { createArticleRss, withArticleFeedLink } from './lib/article-rss.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.resolve(process.env.DIST_DIR || path.join(root, 'dist'));
const indexPath = path.join(dist, 'index.html');
const siteUrl = String(process.env.VITE_SITE_URL || 'https://worldarchjournal.com').replace(/\/$/, '');
const gaMeasurementId = String(process.env.VITE_GA_MEASUREMENT_ID || 'G-KWCNH012H1').trim();
const clarityProjectId = String(process.env.VITE_CLARITY_PROJECT_ID || '').trim();
const siteName = 'WORLD ARCH JOURNAL';
const template = await readFile(indexPath, 'utf8');
if (template.includes('data-static-schema')) {
  throw new Error('Static pages require a fresh Vite output. Run npm run build; do not regenerate over an already generated release.');
}

const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const escapeXml = escapeHtml;
const editorialDate = (value) => new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${value}T12:00:00Z`));
const plainText = (value = '') => String(value).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const absoluteUrl = (value = '') => /^https?:\/\//i.test(value) ? value : `${siteUrl}${String(value).startsWith('/') ? value : `/${value}`}`;
const normalizedPath = (value) => value.endsWith('/') ? value : `${value}/`;
const verifiedCheckoutUrl = (value = '') => {
  try {
    const url = new URL(String(value));
    const isGumroad = /(^|\.)gumroad\.com$/i.test(url.hostname);
    const isEtsyListing = url.hostname === 'www.etsy.com' && /^\/(?:[a-z]{2}\/)?listing\/\d+(?:\/|$)/i.test(url.pathname);
    return url.protocol === 'https:' && (isGumroad || isEtsyListing) ? url.href : '';
  } catch { return ''; }
};
const checkoutProvider = (value = '') => {
  try { return new URL(value).hostname === 'www.etsy.com' ? 'Etsy' : 'Gumroad'; }
  catch { return 'checkout'; }
};
const breadcrumbSchema = (items) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: `${siteUrl}${item.pathname === '/' ? '' : item.pathname}`,
  })),
});

function replaceMeta(html, key, value, attribute = 'name') {
  const expression = new RegExp(`<meta\\s+${attribute}=["']${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["'][^>]*>`, 'i');
  const tag = `<meta ${attribute}="${key}" content="${escapeHtml(value)}" />`;
  return expression.test(html) ? html.replace(expression, tag) : html.replace('</head>', `    ${tag}\n  </head>`);
}

function preparePage({ pathname, title, description, image, imageAlt, type = 'website', schema, body, preloadImage = '', robots = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' }) {
  const canonical = `${siteUrl}${pathname === '/' ? '' : normalizedPath(pathname)}`;
  let html = template
    .replace(/<link\s+rel=["']canonical["'][^>]*>\s*/gi, '')
    .replace(/<link[^>]*data-static-preload[^>]*>\s*/gi, '')
    .replace(/<script[^>]*data-static-schema[^>]*>[\s\S]*?<\/script>\s*/gi, '')
    .replace(/<style>\.seo-route-fallback[\s\S]*?<\/style>\s*/gi, '')
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`)
    .replace(/<div id="root">[\s\S]*?<\/div>/i, `<div id="root">${body}</div>`);
  html = replaceMeta(html, 'description', description);
  html = replaceMeta(html, 'robots', robots);
  html = replaceMeta(html, 'og:type', type, 'property');
  html = replaceMeta(html, 'og:site_name', siteName, 'property');
  html = replaceMeta(html, 'og:title', title, 'property');
  html = replaceMeta(html, 'og:description', description, 'property');
  html = replaceMeta(html, 'og:image', absoluteUrl(image), 'property');
  html = replaceMeta(html, 'og:image:alt', imageAlt || `${siteName} editorial`, 'property');
  html = replaceMeta(html, 'og:url', canonical, 'property');
  html = replaceMeta(html, 'twitter:card', 'summary_large_image');
  html = replaceMeta(html, 'twitter:title', title);
  html = replaceMeta(html, 'twitter:description', description);
  html = replaceMeta(html, 'twitter:image', absoluteUrl(image));
  html = html.replace('</head>', '    <style>.article-download-link{display:inline-flex;align-items:center;gap:.5rem;padding:.8rem 1rem;border:1px solid #826541;color:#3f3020;font-weight:700;text-decoration:none}.article-download-link:hover{background:#e7ddcf}</style>\n  </head>');
  html = html.replace('</head>', `    <link rel="canonical" href="${escapeHtml(canonical)}" />\n    ${pathname.startsWith('/newsletter/') ? `<link rel="alternate" type="application/rss+xml" title="World Arch Journal briefing" href="${siteUrl}/newsletter/feed.xml" />` : ''}\n    ${preloadImage ? `<link rel="preload" as="image" href="${escapeHtml(preloadImage)}" data-static-preload fetchpriority="high" />` : ''}\n    <script type="application/ld+json" data-static-schema>${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>\n    <style>.seo-route-fallback{min-height:100vh;padding:5vw 8vw 8vw;background:#eeeae2;color:#23231f;font-family:Arial,sans-serif}.seo-route-fallback>a{color:#6c4f2e}.seo-route-fallback header,.seo-route-fallback article,.seo-route-fallback section{width:min(900px,100%);margin:4rem auto}.seo-route-fallback h1{max-width:17ch;font:400 clamp(2.8rem,7vw,6.5rem)/.92 Georgia,serif}.seo-route-fallback h2{font:400 clamp(1.8rem,4vw,3.2rem)/1 Georgia,serif}.seo-route-fallback p,.seo-route-fallback li{line-height:1.75}.seo-route-fallback figure{margin:2rem 0}.seo-route-fallback img{width:100%;height:auto}.seo-route-fallback small{letter-spacing:.14em;color:#826541}.seo-route-fallback nav{display:flex;gap:1rem;flex-wrap:wrap}</style>\n  </head>`);
  if (pathname.startsWith('/newsletter/') || pathname.startsWith('/magazine/analysis/')) html = html.replace('</head>', `<style>.seo-route-fallback .newsletter-archive-card{display:grid;grid-template-columns:minmax(180px,300px) 1fr;gap:30px;align-items:start;border-top:1px solid #c9c0b2;padding:28px 0;margin:0 auto;max-width:900px}.seo-route-fallback .newsletter-archive-card img{display:block;width:100%;height:auto;max-height:340px;object-fit:cover}.seo-route-fallback .newsletter-archive-card h3{font:400 clamp(1.8rem,3vw,2.7rem)/1.05 Georgia,serif;margin:12px 0}.seo-route-fallback .newsletter-editorial-analysis{background:#252c27;color:#f6efe5;padding:28px;margin:40px 0}.seo-route-fallback .newsletter-editorial-analysis small{color:#d9b379}.seo-route-fallback .newsletter-reading{border-left:4px solid #b38c55;background:#e7ddcf;padding:18px 22px;margin:20px 0}@media(max-width:650px){.seo-route-fallback .newsletter-archive-card{grid-template-columns:1fr}.seo-route-fallback .newsletter-archive-card img{max-height:280px}}</style></head>`);
  return html;
}

async function emit(pathname, html) {
  const directory = pathname === '/' ? dist : path.join(dist, ...pathname.split('/').filter(Boolean));
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, 'index.html'), html, 'utf8');
}

async function injectArticleFeedLinks(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) await injectArticleFeedLinks(target);
    else if (entry.isFile() && entry.name.endsWith('.html')) {
      await writeFile(target, withArticleFeedLink(await readFile(target, 'utf8')), 'utf8');
    }
  }
}

async function injectStaticAnalytics(directory) {
  if (!gaMeasurementId) return;
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await injectStaticAnalytics(target);
      continue;
    }
    if (!entry.isFile() || entry.name !== 'index.html') continue;
    const html = await readFile(target, 'utf8');
    if (/site-analytics-static\.js/i.test(html) || /<script[^>]+src=["']\/assets\/index-/i.test(html)) continue;
    const tag = `<script defer src="/assets/site-analytics-static.js" data-measurement-id="${escapeHtml(gaMeasurementId)}" data-clarity-id="${escapeHtml(clarityProjectId)}"></script>`;
    await writeFile(target, html.includes('</body>') ? html.replace('</body>', `${tag}</body>`) : `${html}\n${tag}\n`, 'utf8');
  }
}

const publisher = {
  '@type': 'Organization',
  name: siteName,
  url: siteUrl,
  logo: { '@type': 'ImageObject', url: absoluteUrl('/assets/brand/world-arch-wa-mark-v1.png') },
  sameAs: [defaultContent.brand.youtube, defaultContent.brand.instagram, defaultContent.brand.facebook, defaultContent.brand.linkedin, defaultContent.brand.pinterest, defaultContent.brand.whatsapp].filter(Boolean),
};

const homeDescription = 'Explore global architecture, bespoke facade design, spatial design, architectural visualisation, BIM and Revit resources, original magazines and evidence-led research by World Arch Journal.';
const homeSchema = { '@context': 'https://schema.org', '@graph': [
  { '@type': 'WebSite', name: siteName, url: siteUrl, inLanguage: 'en', publisher },
  { '@type': 'ProfessionalService', name: siteName, url: siteUrl, description: homeDescription, image: absoluteUrl('/assets/editorial/issue-00/courtyard-wind-house-cover.jpg'), areaServed: 'International', availableLanguage: ['English'], sameAs: publisher.sameAs, serviceType: defaultContent.services.map((service) => service.title) },
] };
const homeArticleLinks = articles.filter((item) => item.published).slice(0, 6).map((item) => `<li><a href="/articles/${escapeHtml(item.slug)}/">${escapeHtml(item.title)}</a><p>${escapeHtml(item.excerpt)}</p></li>`).join('');
const homeServiceLinks = defaultContent.services.map((service) => `<li><strong>${escapeHtml(service.title)}</strong> — ${escapeHtml(service.description || service.excerpt || '')}</li>`).join('');
const homeBody = `<main class="seo-route-fallback"><header><small>WORLD ARCH JOURNAL · ARCHITECTURE / INTERIORS / LANDSCAPE / BIM / PLACES</small><h1>Architecture, evidence and design services by World Arch Journal</h1><p>${escapeHtml(homeDescription)}</p><nav><a href="/magazine/">Read the magazine</a><a href="/videos/">Watch architecture videos</a><a href="/newsletter/">Latest architecture briefing</a><a href="/shop/">Architecture shop</a><a href="/editorial-team/">Publisher and contact</a></nav></header><section><h2>Latest evidence-led architecture stories</h2><p>World Arch Journal publishes original guides, field notes and concept studies that distinguish sourced facts, editorial analysis and unverified design propositions. Every substantial story includes an author, source notes, image credits and a clear scope.</p><ol>${homeArticleLinks}</ol></section><section><h2>Architecture and presentation services</h2><p>Studio work is developed for real communication needs: explaining a facade decision, organising a spatial proposal, presenting a project to a client or turning technical information into a readable visual narrative.</p><ul>${homeServiceLinks}</ul></section><section><h2>Continue with the journal</h2><p>Read the <a href="/newsletter/">latest dated briefing</a>, browse <a href="/magazine/analysis/">analysis and field notes</a>, watch <a href="/videos/">architecture explained in motion</a>, explore <a href="/prompts/">free architecture prompts</a> or review <a href="/shop/presentations/">presentation templates and bespoke design</a>.</p></section></main>`;
await emit('/', preparePage({ pathname: '/', title: 'WORLD ARCH JOURNAL | Facade, Spatial Design & Visualisation', description: homeDescription, image: '/assets/editorial/issue-00/courtyard-wind-house-cover.jpg', schema: homeSchema, body: homeBody }));

for (const article of articles.filter((item) => item.published)) {
  const pathname = `/articles/${article.slug}/`;
  const articleSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Article', headline: article.title, description: article.metaDescription || article.excerpt, mainEntityOfPage: `${siteUrl}${pathname}`, image: [absoluteUrl(article.image)], author: { '@type': 'Organization', name: article.author || 'World Arch Journal', url: `${siteUrl}/editorial-team/` }, publisher, articleSection: article.category, keywords: (article.tags || []).join(', '), inLanguage: 'en', isAccessibleForFree: true, ...(article.publishedAt ? { datePublished: article.publishedAt } : {}), ...(article.modifiedAt ? { dateModified: article.modifiedAt } : {}) },
      breadcrumbSchema([{ name: 'Home', pathname: '/' }, { name: 'Magazine', pathname: '/magazine/' }, { name: article.title, pathname }]),
      ...(article.faq?.length ? [{ '@type': 'FAQPage', mainEntity: article.faq.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })) }] : []),
    ],
  };
  const facts = (article.facts || []).map(([label, value]) => `<li><b>${escapeHtml(label)}:</b> ${escapeHtml(value)}</li>`).join('');
  const renderVisual = (visual) => `<figure>${visual.srcWebp ? `<picture><source srcset="${escapeHtml(visual.srcWebp)}" type="image/webp" />` : ''}<img src="${escapeHtml(visual.src)}" alt="${escapeHtml(visual.alt)}" loading="lazy" decoding="async"${visual.width && visual.height ? ` width="${Number(visual.width)}" height="${Number(visual.height)}"` : ''} />${visual.srcWebp ? '</picture>' : ''}<figcaption>${escapeHtml(visual.caption)}${visual.sourceUrl ? ` <a href="${escapeHtml(visual.sourceUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(visual.sourceLabel || 'View licensed source')}</a>` : ''}</figcaption></figure>`;
  const visuals = article.inlineVisuals ? '' : (article.visuals || []).map(renderVisual).join('');
  const articleBody = article.inlineVisuals
    ? article.contentHtml.split(/(?=<h2\b)/i).map((section, index) => section + (article.visuals || []).filter((visual) => visual.afterSection === index - 1).map(renderVisual).join('')).join('')
    : article.contentHtml;
  const sources = (article.evidence || []).map((source) => `<li><a href="${escapeHtml(source.source_url)}">${escapeHtml(source.publisher)}</a> — ${escapeHtml(source.claim)}</li>`).join('');
  const toc = (article.toc || []).map(([id, label]) => `<li><a href="#${escapeHtml(id)}">${escapeHtml(label)}</a></li>`).join('');
  const hero = `<figure>${article.imageWebp ? `<picture><source srcset="${escapeHtml(article.imageWebp)}" type="image/webp" />` : ''}<img src="${escapeHtml(article.image)}" alt="${escapeHtml(article.imageAlt)}" width="${Number(article.imageWidth) || 1600}" height="${Number(article.imageHeight) || 900}" fetchpriority="high" />${article.imageWebp ? '</picture>' : ''}<figcaption>${escapeHtml(article.visualLabel)}${article.imageSourceUrl ? ` <a href="${escapeHtml(article.imageSourceUrl)}" target="_blank" rel="noopener noreferrer">Source and licence</a>` : ''}</figcaption></figure>`;
  const related = relatedArticlesFor(article).map((item) => `<li><a href="/articles/${escapeHtml(item.slug)}/">${escapeHtml(item.title)}</a><p>${escapeHtml(item.excerpt)}</p></li>`).join('');
  const body = `<main class="seo-route-fallback"><a href="/magazine/">WORLD ARCH JOURNAL / ARTICLES</a><article><header><small>${escapeHtml(article.status)}</small><h1>${escapeHtml(article.title)}</h1><p>${escapeHtml(article.excerpt)}</p><p>By ${escapeHtml(article.author || 'World Arch Journal')}${article.publishedAt ? ` · <time datetime="${escapeHtml(article.publishedAt)}">${escapeHtml(article.publishedAt)}</time>` : ''}</p><p><a class="article-download-link" href="/downloads/articles/${escapeHtml(article.slug)}.pdf" download>Download the illustrated article as a PDF · English ↓</a></p></header>${hero}${facts ? `<section><h2>Project file</h2><ul>${facts}</ul></section>` : ''}${toc ? `<nav aria-label="Article contents"><h2>Contents</h2><ol>${toc}</ol></nav>` : ''}<section>${articleBody}</section>${visuals}<section><h2>Evidence and source notes</h2><ol>${sources}</ol></section><section><h2>Related architecture stories</h2><ol>${related}</ol></section></article></main>`;
  await emit(pathname, preparePage({ pathname, title: article.seoTitle || `${article.title} | ${siteName}`, description: article.metaDescription || article.excerpt, image: article.image, imageAlt: article.imageAlt, type: 'article', schema: articleSchema, body, preloadImage: article.imageWebp || article.image }));
}

const newsletterArchiveCard = (issue) => `<article class="newsletter-archive-card"><a href="${editorialPath(issue)}"><img src="${escapeHtml(issue.image)}" alt="${escapeHtml(issue.imageAlt)}" loading="lazy" width="480"/></a><div><small>${escapeHtml(issue.format)} · <time datetime="${escapeHtml(issue.publishedAt)}">${escapeHtml(editorialDate(issue.publishedAt))}</time></small><h3><a href="${editorialPath(issue)}">${escapeHtml(issue.title)}</a></h3><p>${escapeHtml(issue.excerpt)}</p>${issue.imageAttribution ? `<p><small>Photo: ${escapeHtml(issue.imageAttribution.creator)} · ${escapeHtml(issue.imageAttribution.licenseLabel)}; <a href="${escapeHtml(issue.imageAttribution.sourceUrl)}">source</a> and <a href="${escapeHtml(issue.imageAttribution.licenseUrl)}">licence</a>.</small></p>` : ''}<p><strong>${escapeHtml(issue.analysisSummary)}</strong></p><a href="${editorialPath(issue)}">Read the full story ↗</a></div></article>`;
for (const archive of [{ pathname: '/newsletter/', title: 'Architecture Newsletter', heading: 'The world, in brief.', description: 'Dated architecture news editions with fresh reporting, direct source links and original editorial commentary.', entries: newsletterIssues, image: newsletterIssues[0].image }, { pathname: '/magazine/analysis/', title: 'Architecture Analysis & Field Notes', heading: 'Beyond the headline.', description: 'Long-form architecture analysis and practical field notes, separate from our dated news editions.', entries: editorialArticles, image: editorialArticles[0].image }]) {
  const body = `<main class="seo-route-fallback"><a href="/magazine/">WORLD ARCH JOURNAL / MAGAZINE</a><header><small>${archive.pathname === '/newsletter/' ? 'THE WORLD ARCH BRIEFING' : 'ANALYSIS & FIELD NOTES'}</small><h1>${archive.heading}</h1><p>${archive.description}</p><nav><a href="/editorial-policy/">Editorial standards</a><a href="/editorial-team/">Publisher and contact</a><a href="/newsletter/feed.xml">Newsletter RSS</a><a href="${archive.pathname === '/newsletter/' ? '/magazine/analysis/' : '/newsletter/'}">${archive.pathname === '/newsletter/' ? 'Separate analysis archive' : 'Dated newsletter editions'}</a></nav></header><section><h2>${archive.pathname === '/newsletter/' ? 'Latest dated editions' : 'Analysis and field notes'}</h2>${archive.entries.map(newsletterArchiveCard).join('')}</section></main>`;
  await emit(archive.pathname, preparePage({ pathname: archive.pathname, title: `${archive.title} | ${siteName}`, description: archive.description, image: archive.image, schema: { '@context': 'https://schema.org', '@type': 'CollectionPage', name: archive.title, url: `${siteUrl}${archive.pathname}`, inLanguage: 'en', publisher, hasPart: archive.entries.map((issue) => ({ '@type': 'Article', name: issue.title, url: `${siteUrl}${editorialPath(issue)}` })) }, body }));
}
for (const issue of [...newsletterIssues, ...editorialArticles]) {
  const pathname = editorialPath(issue);
  const sections = issue.sections.map((section) => `<section><h2>${escapeHtml(section.heading)}</h2>${section.sourcePublishedAt ? `<p>Source published: <time datetime="${section.sourcePublishedAt}">${editorialDate(section.sourcePublishedAt)}</time></p>` : ''}${section.photo ? `<figure><img src="${escapeHtml(section.photo.src)}" alt="${escapeHtml(section.photo.alt)}" loading="lazy"/><figcaption>${escapeHtml(section.photo.caption)} <a href="${escapeHtml(section.photo.sourceUrl)}">Photo source ↗</a> · <a href="${escapeHtml(section.photo.licenseUrl)}">${escapeHtml(section.photo.licenseLabel)}</a></figcaption></figure>` : ''}${section.illustration ? `<figure><img src="${escapeHtml(section.illustration)}" alt="${escapeHtml(section.illustrationAlt)}" width="1200" height="600"/><figcaption>${escapeHtml(section.illustrationCredit || 'World Arch Journal original conceptual diagram — not project photography.')}</figcaption></figure>` : ''}${section.paragraphs.map((paragraph) => paragraph.startsWith('Our reading:') ? `<aside class="newsletter-reading"><strong>OUR ANALYSIS</strong><p>${escapeHtml(paragraph.replace(/^Our reading:\s*/, ''))}</p></aside>` : `<p>${escapeHtml(paragraph)}</p>`).join('')}${section.source ? `<p><a href="${escapeHtml(section.source.url)}">Read source: ${escapeHtml(section.source.label)}</a></p>` : ''}${(section.corroboratingSources || []).map((source) => `<p><a href="${escapeHtml(source.url)}">Cross-check: ${escapeHtml(source.label)}</a></p>`).join('')}</section>`).join('');
  const sources = issue.sources.map((source) => `<li><a href="${escapeHtml(source.url)}">${escapeHtml(source.label)}</a></li>`).join('');
  const related = issue.related.map((link) => `<li><a href="${escapeHtml(link.url)}">${escapeHtml(link.label)}</a></li>`).join('');
  const isNews = issue.format !== 'Technical field note';
  const intro = issue.intro || 'At a terrace door, water control is an assembly problem. The paving, drain, membrane, frame, structure and interior floor must work together. This field note turns a construction animation into questions a design team can use.';
  const corrections = (issue.corrections || []).map((entry) => `<li><time datetime="${escapeHtml(entry.date)}">${escapeHtml(editorialDate(entry.date))}</time>: ${escapeHtml(entry.text)}</li>`).join('');
  const heroCredit = `${escapeHtml(issue.imageCredit)}${issue.imageAttribution ? ` <a href="${escapeHtml(issue.imageAttribution.sourceUrl)}">Photo source ↗</a> · <a href="${escapeHtml(issue.imageAttribution.licenseUrl)}">${escapeHtml(issue.imageAttribution.licenseLabel)}</a>` : ''}`;
  const analysis = issue.editorialAnalysis ? `<aside class="newsletter-editorial-analysis" id="editorial-analysis"><small>EDITORIAL ANALYSIS</small><h2>What these stories mean together</h2><p>${escapeHtml(issue.editorialAnalysis.thesis)}</p><ul>${issue.editorialAnalysis.questions.map((question) => `<li>${escapeHtml(question)}</li>`).join('')}</ul><p>${escapeHtml(issue.editorialAnalysis.limit)}</p></aside>` : '';
  const body = `<main class="seo-route-fallback"><a href="${issue.format === 'Daily briefing' ? '/newsletter/' : '/magazine/analysis/'}">WORLD ARCH JOURNAL / ${issue.format === 'Daily briefing' ? 'THE WORLD ARCH BRIEFING' : 'ANALYSIS & FIELD NOTES'}</a><article><header><small>${escapeHtml(issue.format)} · ${escapeHtml(issue.topic)}</small><h1>${escapeHtml(issue.title)}</h1><p>${escapeHtml(issue.excerpt)}</p><p>By <a href="${escapeHtml(issue.authorUrl)}">${escapeHtml(issue.author)}</a> · Published <time datetime="${escapeHtml(issue.publishedAt)}">${escapeHtml(editorialDate(issue.publishedAt))}</time>${issue.updatedAt ? ` · Updated <time datetime="${escapeHtml(issue.updatedAt)}">${escapeHtml(editorialDate(issue.updatedAt))}</time>` : ''} · <a href="/downloads/newsletter/${escapeHtml(issue.slug)}.pdf" download>Download PDF ↓</a></p></header><figure><img src="${escapeHtml(issue.image)}" alt="${escapeHtml(issue.imageAlt)}"/><figcaption>${heroCredit}</figcaption></figure><p>${escapeHtml(intro)}</p><aside><strong>${escapeHtml(issue.format)}.</strong> Sources checked <time datetime="${escapeHtml(issue.sourcesCheckedAt)}">${escapeHtml(editorialDate(issue.sourcesCheckedAt))}</time>. <a href="/editorial-policy/">Editorial standards</a>.</aside>${analysis}${sections}<section><h2>Further reading</h2><ul>${related}</ul></section><section><h2>Source notes</h2><p>${isNews ? 'Official announcements, source reporting and World Arch Journal commentary are distinguished. No sponsored placement is included in this edition.' : 'These references inform the principles discussed here; they do not approve a particular threshold assembly.'}</p><ol>${sources}</ol></section>${corrections ? `<section><h2>Corrections</h2><ol>${corrections}</ol></section>` : ''}<p>Found an error or rights concern? <a href="/editorial-team/">Contact the publisher</a>.</p></article></main>`;
  const archivePath = issue.format === 'Daily briefing' ? '/newsletter/' : '/magazine/analysis/';
  const schema = { '@context': 'https://schema.org', '@graph': [
    { '@type': issue.format === 'Daily briefing' ? 'NewsArticle' : 'Article', headline: issue.title, description: issue.description, mainEntityOfPage: `${siteUrl}${pathname}`, image: [absoluteUrl(issue.image)], author: { '@type': 'Organization', name: issue.author, url: `${siteUrl}${issue.authorUrl}` }, publisher, datePublished: issue.publishedAt, ...(issue.updatedAt ? { dateModified: issue.updatedAt } : {}), articleSection: issue.format, inLanguage: 'en', isAccessibleForFree: true },
    breadcrumbSchema([{ name: 'Home', pathname: '/' }, { name: issue.format === 'Daily briefing' ? 'Newsletter' : 'Analysis', pathname: archivePath }, { name: issue.title, pathname }]),
  ] };
  await emit(pathname, preparePage({ pathname, title: issue.seoTitle, description: issue.description, image: issue.image, imageAlt: issue.imageAlt, type: 'article', schema, body }));
}
const briefingFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel>
<title>World Arch Journal — The World Arch Briefing</title>
<link>${siteUrl}/newsletter/</link>
<description>Dated architecture news editions with direct source links and original editorial commentary.</description>
<language>en</language>
<atom:link href="${siteUrl}/newsletter/feed.xml" rel="self" type="application/rss+xml" />
${newsletterIssues.map((issue) => `<item><title>${escapeXml(issue.title)}</title><link>${siteUrl}/newsletter/${escapeXml(issue.slug)}/</link><guid isPermaLink="true">${siteUrl}/newsletter/${escapeXml(issue.slug)}/</guid>${issue.feedPublishedAt ? `<pubDate>${new Date(issue.feedPublishedAt).toUTCString()}</pubDate>` : ''}<category>${escapeXml(issue.format)}</category><description>${escapeXml(issue.excerpt)}</description></item>`).join('\n')}
</channel></rss>
`;
await writeFile(path.join(dist, 'newsletter', 'feed.xml'), briefingFeed, 'utf8');

for (const landing of [{ pathname: '/magazine/', title: 'Architecture Magazine', description: 'Original, evidence-led architecture stories on climate design, facades, adaptive reuse and concept studies.', articles: publishedMagazineArticles, overview: [] }, ...magazineCategories.map((category) => ({ pathname: `/magazine/${category.slug}/`, title: `${category.title} Articles`, description: category.description, overview: category.overview || [], articles: category.articles }))]) {
  const image = landing.articles[0]?.image || '/assets/editorial/issue-00/courtyard-wind-house-cover.jpg';
  const links = landing.articles.map((article) => `<li><a href="/articles/${escapeHtml(article.slug)}/">${escapeHtml(article.title)}</a><p>${escapeHtml(article.excerpt)}</p></li>`).join('');
  const categories = magazineCategories.map((category) => `<a href="/magazine/${escapeHtml(category.slug)}/">${escapeHtml(category.title)}</a>`).join(' · ');
  const overview = landing.overview.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('');
  const body = `<main class="seo-route-fallback"><a href="/">WORLD ARCH JOURNAL</a><header><small>ARCHITECTURE / IDEAS / EVIDENCE</small><h1>${escapeHtml(landing.title)}</h1><p>${escapeHtml(landing.description)}</p>${overview}</header><nav aria-label="Magazine topics"><a href="/magazine/">All stories</a> · ${categories}</nav><section><h2>Published stories</h2><ol>${links}</ol></section>${landing.pathname === '/magazine/' ? `<section><h2>Analysis and field notes</h2><p><a href="/magazine/analysis/">Separate analysis archive</a> · <a href="/newsletter/">Latest dated newsletter</a></p><ol>${editorialArticles.map((entry) => `<li><a href="${editorialPath(entry)}">${escapeHtml(entry.title)}</a><p>${escapeHtml(entry.excerpt)}</p></li>`).join('')}</ol></section>` : ''}</main>`;
  const schema = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'CollectionPage', name: landing.title, description: landing.description, url: `${siteUrl}${landing.pathname}`, inLanguage: 'en', publisher, hasPart: landing.articles.map((article) => ({ '@type': 'Article', name: article.title, url: `${siteUrl}/articles/${article.slug}/` })) },
    breadcrumbSchema(landing.pathname === '/magazine/' ? [{ name: 'Home', pathname: '/' }, { name: 'Magazine', pathname: '/magazine/' }] : [{ name: 'Home', pathname: '/' }, { name: 'Magazine', pathname: '/magazine/' }, { name: landing.title, pathname: landing.pathname }]),
  ] };
  await emit(landing.pathname, preparePage({ pathname: landing.pathname, title: `${landing.title} | ${siteName}`, description: landing.description, image, schema, body }));
}

for (const magazine of magazines.filter((item) => item.published)) {
  const pathname = `/magazine/${magazine.slug}/`;
  const schema = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'PublicationIssue', name: magazine.title, description: magazine.excerpt, url: `${siteUrl}${pathname}`, image: absoluteUrl(magazine.image), issueNumber: magazine.number, inLanguage: 'en', publisher, hasPart: magazine.features.map((feature) => ({ '@type': 'Article', name: feature.title, url: `${siteUrl}/articles/${feature.article?.slug || feature.id}/` })) },
    breadcrumbSchema([{ name: 'Home', pathname: '/' }, { name: 'Magazine', pathname: '/magazine/' }, { name: magazine.title, pathname }]),
  ] };
  const features = magazine.features.map((feature) => `<li><a href="/articles/${escapeHtml(feature.article?.slug || feature.id)}/">${escapeHtml(feature.title)}</a><p>${escapeHtml(feature.deck)}</p></li>`).join('');
  const spreads = (magazine.spreads || []).map((spread) => `<figure><img src="${escapeHtml(spread.image)}" alt="${escapeHtml(spread.alt)}" loading="lazy" /><figcaption>${escapeHtml(spread.pages)} · ${escapeHtml(spread.title)} — ${escapeHtml(spread.caption)}</figcaption></figure>`).join('');
  const body = `<main class="seo-route-fallback"><a href="/magazine/">WORLD ARCH JOURNAL / MAGAZINE</a><article><header><small>${escapeHtml(magazine.status)}</small><h1>${escapeHtml(magazine.title)}</h1><p>${escapeHtml(magazine.excerpt)}</p></header><figure><img src="${escapeHtml(magazine.image)}" alt="${escapeHtml(magazine.imageAlt)}" /></figure><section><h2>Contents</h2><ol>${features}</ol></section>${spreads}</article></main>`;
  await emit(pathname, preparePage({ pathname, title: `${magazine.title} | ${siteName}`, description: magazine.excerpt, image: magazine.image, imageAlt: magazine.imageAlt, type: 'article', schema, body }));
}

const videosPath = '/videos/';
const videosDescription = 'Watch concise architecture videos with transcripts, technical notes and related evidence-led reading from World Arch Journal.';
const videoLinks = publishedVideoStories.map((video) => `<article><img src="${escapeHtml(video.thumbnail)}" alt="${escapeHtml(`${video.title} video cover`)}" /><h2><a href="/videos/${escapeHtml(video.slug)}/">${escapeHtml(video.title)}</a></h2><p>${escapeHtml(video.description)}</p></article>`).join('');
const watchVideoLinks = watchVideoEntries.map((video) => `<article><a href="${watchPagePath(video)}"><img src="${escapeHtml(video.thumbnail)}" alt="${escapeHtml(video.title)}" loading="lazy" /><h2>${escapeHtml(video.title)}</h2></a><p>${escapeHtml(video.description)}</p></article>`).join('');
const videosSchema = { '@context': 'https://schema.org', '@graph': [
  { '@type': 'CollectionPage', name: 'Architecture Videos & Visual Guides', description: videosDescription, url: `${siteUrl}${videosPath}`, inLanguage: 'en', publisher, hasPart: [...publishedVideoStories.map((video) => ({ '@type': 'WebPage', name: video.title, url: `${siteUrl}/videos/${video.slug}/` })), ...watchVideoEntries.map((video) => ({ '@type': 'WebPage', name: video.title, url: `${siteUrl}${watchPagePath(video)}` }))] },
  breadcrumbSchema([{ name: 'Home', pathname: '/' }, { name: 'Videos', pathname: videosPath }]),
] };
const videosBody = `<main class="seo-route-fallback"><a href="/">WORLD ARCH JOURNAL</a><header><small>ARCHITECTURE / STRUCTURE / MATERIAL</small><h1>Architecture, explained in motion.</h1><p>${escapeHtml(videosDescription)}</p></header><section><h2>Video library</h2>${videoLinks}</section><section><h2>Video previews and architectural motion examples</h2>${watchVideoLinks}</section></main>`;
await emit(videosPath, preparePage({ pathname: videosPath, title: `Architecture Videos & Visual Guides | ${siteName}`, description: videosDescription, image: publishedVideoStories[0]?.thumbnail || '/assets/editorial/issue-00/courtyard-wind-house-cover.jpg', schema: videosSchema, body: videosBody }));

for (const video of publishedVideoStories) {
  const pathname = `/videos/${video.slug}/`;
  const schema = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'VideoObject', name: video.title, description: video.description, thumbnailUrl: [video.thumbnail], uploadDate: video.uploadDate, duration: video.duration, embedUrl: `https://www.youtube-nocookie.com/embed/${video.youtubeId}`, contentUrl: `https://www.youtube.com/shorts/${video.youtubeId}`, mainEntityOfPage: `${siteUrl}${pathname}`, publisher },
    breadcrumbSchema([{ name: 'Home', pathname: '/' }, { name: 'Videos', pathname: videosPath }, { name: video.title, pathname }]),
  ] };
  const transcript = video.transcript.map((line) => `<li>${escapeHtml(line)}</li>`).join('');
  const related = articles.filter((article) => article.published && video.relatedArticleSlugs.includes(article.slug)).map((article) => `<li><a href="/articles/${escapeHtml(article.slug)}/">${escapeHtml(article.title)}</a></li>`).join('');
  const body = `<main class="seo-route-fallback"><a href="/videos/">WORLD ARCH JOURNAL / VIDEOS</a><article><header><small>${escapeHtml(video.category)}</small><h1>${escapeHtml(video.title)}</h1><p>${escapeHtml(video.description)}</p></header><figure><iframe src="https://www.youtube-nocookie.com/embed/${escapeHtml(video.youtubeId)}" title="${escapeHtml(video.title)}" loading="eager" style="display:block;width:100%;aspect-ratio:16/9;border:0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe><figcaption>Watch this architecture video here, then read the accessible sequence below. <a href="https://www.youtube.com/shorts/${escapeHtml(video.youtubeId)}">Open on YouTube</a></figcaption></figure><section><h2>What the sequence shows</h2><ol>${transcript}</ol></section><aside><strong>Technical note:</strong> ${escapeHtml(video.disclaimer)}</aside>${related ? `<section><h2>Continue reading</h2><ul>${related}</ul></section>` : ''}</article></main>`;
  await emit(pathname, preparePage({ pathname, title: `${video.seoTitle} | ${siteName}`, description: video.description, image: video.thumbnail, imageAlt: `${video.title} video cover`, type: 'video.other', schema, body }));
}


// Dedicated, crawlable video watch pages. The video is the primary visible
// content rather than a secondary preview on a shop, prompt or home page.
// These standalone pages intentionally omit the SPA module script: /videos/watch
// has no client router and would otherwise render the application's 404 view.
for (const video of watchVideoEntries) {
  const pathname = watchPagePath(video);
  const canonical = `${siteUrl}${pathname}`;
  const schema = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'WebPage', name: video.title, description: video.description, url: canonical, mainEntity: { '@id': `${canonical}#video` }, inLanguage: 'en', publisher },
    { '@type': 'VideoObject', '@id': `${canonical}#video`, name: video.title, description: video.description, thumbnailUrl: [absoluteUrl(video.thumbnail)], contentUrl: absoluteUrl(video.file), uploadDate: video.publishedAt, isAccessibleForFree: true, mainEntityOfPage: canonical, publisher },
    breadcrumbSchema([{ name: 'Home', pathname: '/' }, { name: 'Videos', pathname: '/videos/' }, { name: video.title, pathname }]),
  ] };
  const body = `<main class="seo-route-fallback wj-watch" id="main-content">
    <nav aria-label="Video navigation"><a href="/videos/">WORLD ARCH JOURNAL / VIDEO LIBRARY</a></nav>
    <article><header><small>ARCHITECTURE VIDEO · WATCH</small><h1>${escapeHtml(video.title)}</h1></header>
    <figure><video controls playsinline preload="metadata" poster="${escapeHtml(video.thumbnail)}" aria-label="${escapeHtml(video.title)}">
      <source src="${escapeHtml(video.file)}" type="video/mp4" />Your browser does not support embedded video.
    </video><figcaption>${escapeHtml(video.description)}</figcaption></figure>
    <section><h2>About this video</h2><p>${escapeHtml(video.description)}</p>
    <p>This is a visual preview or illustrative motion example, not a construction instruction or engineering specification.</p>
    <p><a href="${escapeHtml(video.sourcePath)}">Read the related ${escapeHtml(video.sourceLabel)}</a> for the full project or prompt context.</p></section>
    <nav aria-label="More videos"><a href="/videos/">More architecture videos</a> · <a href="/magazine/">Architecture magazine</a></nav></article></main>`;
  const watchCss = '<style>.wj-watch{padding-top:2rem}.wj-watch article{width:min(980px,100%);margin:1.2rem auto}.wj-watch header{width:auto;margin:0 0 1.2rem}.wj-watch h1{max-width:24ch;font-size:clamp(2.1rem,4.6vw,4.2rem);line-height:1.05}.wj-watch figure{margin:0}.wj-watch video{display:block;width:100%;max-height:72vh;aspect-ratio:16/9;object-fit:contain;background:#0c0c0d}.wj-watch figcaption{font-size:1rem;line-height:1.65;margin-top:1rem}.wj-watch section{width:auto;margin:2rem 0}.wj-watch nav{margin:1.2rem 0}</style>';
  const html = preparePage({ pathname, title: `${video.title} | ${siteName}`, description: video.description, image: video.thumbnail, imageAlt: video.title, type: 'video.other', schema, body })
    .replace(/<script\b(?=[^>]*\btype=["']module["'])[^>]*><\/script>/gi, '')
    .replace('</head>', `${watchCss}</head>`);
  await emit(pathname, html);
}

const projectsPath = '/projects/';
const projectsDescription = 'Explore Atlas Villa and Ajorbaft residential design studies alongside documented architecture, immersive tours, plans and project guides.';
const studioProjects = [atlasVilla, ajorbaft];
const projectsBody = `<main class="seo-route-fallback"><a href="/">WORLD ARCH JOURNAL</a><header><small>ARCHITECTURE & DESIGN STUDIES</small><h1>Projects to enter, study and keep.</h1><p>${escapeHtml(projectsDescription)}</p></header><section><h2>Selected immersive projects</h2>${projects.map((project) => `<article><img src="${escapeHtml(project.cover)}" alt="${escapeHtml(project.coverAlt)}" /><h2>${escapeHtml(project.title)}</h2><p>${escapeHtml(project.description)}</p><a href="${escapeHtml(project.detailPath)}">View project</a></article>`).join('')}</section><section><h2>Selected design studies</h2>${studioProjects.map(project => `<article><img src="${escapeHtml(project.cover)}" alt="${escapeHtml(project.title)} residential design study" /><h2>${escapeHtml(project.title)}</h2><p>${escapeHtml(project.description)}</p><a href="${escapeHtml(project.path)}">View design study</a></article>`).join('')}</section></main>`;
await emit(projectsPath, preparePage({ pathname: projectsPath, title: `Architecture Projects & Design Studies | ${siteName}`, description: projectsDescription, image: projects[0]?.cover, imageAlt: projects[0]?.coverAlt, schema: { '@context': 'https://schema.org', '@type': 'CollectionPage', name: `Architecture Projects & Design Studies | ${siteName}`, description: projectsDescription, url: `${siteUrl}${projectsPath}`, inLanguage: 'en', publisher, hasPart: [...projects.map((project) => ({ '@type': 'CreativeWork', name: project.title, url: `${siteUrl}${project.detailPath}`, image: absoluteUrl(project.cover) })), ...studioProjects.map(project => ({ '@type': 'CreativeWork', name: project.title, url: `${siteUrl}${project.path}`, image: absoluteUrl(project.cover) }))] }, body: projectsBody }));

const ajorbaftBody = `<main class="seo-route-fallback"><a href="/projects/">WORLD ARCH JOURNAL / PROJECTS</a><article><header><small>RESIDENTIAL DESIGN STUDY</small><h1>Ajorbaft — Triplex Brick Residence</h1><p>${escapeHtml(ajorbaft.description)}</p><p>${escapeHtml(ajorbaft.role)}</p></header><img src="${ajorbaft.cover}" alt="Ajorbaft brick residence exterior design visualisation at night" />${ajorbaft.notes.map(note => `<section><h2>${escapeHtml(note.title)}</h2><p>${escapeHtml(note.text)}</p></section>`).join('')}<section><h2>Selected project images</h2>${ajorbaft.images.map(image => `<figure><img src="${image.src}" alt="${escapeHtml(image.alt)}" loading="lazy" /><figcaption>${escapeHtml(image.caption)}</figcaption></figure>`).join('')}</section><section><h2>Digital project package</h2><p>The complete project package is offered for sale on Etsy. Selected preview images are shown here; paid plans, sections and interior sheets are not free downloads. No payment is collected on this page.</p><a href="/contact/">Ask about the package</a></section><aside><h2>About these images</h2><p>${escapeHtml(ajorbaft.disclosure)}</p></aside><a href="/projects/atlas-villa/">Explore Atlas Villa</a></article></main>`;
await emit(ajorbaft.path, preparePage({ pathname: ajorbaft.path, title: `Ajorbaft — Triplex Brick Residence | ${siteName}`, description: ajorbaft.description, image: ajorbaft.cover, imageAlt: 'Ajorbaft brick residence design visualisation', schema: { '@context': 'https://schema.org', '@graph': [
  { '@type': 'CreativeWork', name: ajorbaft.title, alternateName: ajorbaft.subtitle, description: ajorbaft.description, url: `${siteUrl}${ajorbaft.path}`, image: absoluteUrl(ajorbaft.cover), inLanguage: 'en', about: ajorbaft.tags, publisher },
  breadcrumbSchema([{ name: 'Home', pathname: '/' }, { name: 'Projects', pathname: projectsPath }, { name: ajorbaft.title, pathname: ajorbaft.path }]),
] }, body: ajorbaftBody }));

const servicesPath = '/services/';
const designServices = [
  ['Villa & Residential Design', 'A coordinated design direction for a new home or substantial residential redesign.', 'villa-design'],
  ['Floor Plan Design', 'Room layouts and circulation studies shaped around supplied dimensions and priorities.', 'floor-plan'],
  ['Facade Design', 'Architectural identity through proportion, openings, material direction and presentation views.', 'facade'],
  ['Kitchen Design', 'Space-specific concepts with render-only and drawing-package scopes kept distinct.', 'kitchen'],
  ['Living & Reception Design', 'Room layouts, focal points, lighting atmosphere, finishes and visual presentation.', 'living-reception'],
  ['Bathroom Design', 'A focused interior concept with an agreed layout, material palette and visual outputs.', 'bathroom'],
  ['Courtyard & Garden Design', 'Outdoor rooms considered for movement, planting, shade, privacy and connection to the home.', 'courtyard-garden'],
  ['Roof Garden Design', 'A roof-level concept shaped around use, views, planting and site constraints.', 'roof-garden'],
  ['Render-Only Concept Options', 'Visual alternatives for decision-making or presentation, without a technical drawing package.', 'renders-only'],
  ['Combined Design Package', 'Several rooms or disciplines coordinated under one residential design brief.', 'combined-package'],
];
const servicesDescription = 'Explore villa and residential design, floor plans, facades, kitchens, living rooms, bathrooms, courtyards, gardens, roof gardens and coordinated design packages by World Arch Journal.';
const servicesCards = designServices.map(([name, detail, id], index) => `<article><small>${String(index + 1).padStart(2, '0')}</small><h2>${escapeHtml(name)}</h2><p>${escapeHtml(detail)}</p><a href="/services/custom-plan-design/?service=${encodeURIComponent(id)}#request">Discuss this service</a></article>`).join('');
const servicesBody = `<main class="seo-route-fallback"><a href="/">WORLD ARCH JOURNAL</a><header><small>DESIGN SERVICES · WORLD ARCH JOURNAL</small><h1>One space, one home, or a complete vision.</h1><p>${escapeHtml(servicesDescription)}</p><p><a href="#service-menu">Explore the services</a></p></header><section id="service-menu"><h2>Architecture & interior design services</h2>${servicesCards}</section><section><h2>One service or a combined scope</h2><p>Choose a single space or combine floor planning, facade, interior and landscape design in one brief. Package contents, revisions, timing and fees are confirmed before work begins. Prices will appear once each package has a final approved scope.</p><p>Engineering, statutory approvals and construction documentation are included only where explicitly agreed and supplied by appropriately qualified professionals.</p><a href="/services/custom-plan-design/">Start a project enquiry</a></section><p><a href="/projects/atlas-villa/">View the Atlas Villa design study</a></p></main>`;
await emit(servicesPath, preparePage({ pathname: servicesPath, title: `Architecture & Interior Design Services | ${siteName}`, description: servicesDescription, image: atlasVilla.cover, imageAlt: 'Atlas Villa residential architecture design study', schema: { '@context': 'https://schema.org', '@type': 'Service', name: `Architecture and Interior Design Services | ${siteName}`, description: servicesDescription, url: `${siteUrl}${servicesPath}`, provider: publisher, areaServed: 'International', availableLanguage: ['English'], serviceType: designServices.map(([name]) => name) }, body: servicesBody }));

await emitMaterialCollections({ emit, preparePage, escapeHtml, siteUrl, siteName });

const atlasPath = atlasVilla.path;
const atlasDescription = 'Explore Atlas Villa, a residential architectural design study by World Arch Journal, with selected interior concepts, a ground-floor plan presentation and a link to the digital project package.';
const atlasBody = `<main class="seo-route-fallback"><a href="/projects/">WORLD ARCH JOURNAL / SELECTED WORK</a><article><header><small>STUDIO DESIGN STUDY · RESIDENTIAL</small><h1>Atlas Villa</h1><p>${escapeHtml(atlasVilla.subtitle)} · ${escapeHtml(atlasVilla.role)}</p></header><figure><img src="${escapeHtml(atlasVilla.cover)}" alt="Atlas Villa contemporary residential architecture design study" /></figure><section><h2>Project overview</h2><p>${escapeHtml(atlasVilla.description)}</p><p>${atlasVilla.tags.map(escapeHtml).join(' · ')}</p></section><section><h2>Selected design images</h2>${atlasVilla.images.map((image) => `<figure><img src="${escapeHtml(image.src)}" alt="${escapeHtml(image.alt)}" loading="lazy" /></figure>`).join('')}</section><section><h2>Digital project package</h2><p>Review the current package contents, file formats, licence, price and delivery details on Etsy.</p><a href="${escapeHtml(atlasVilla.etsyUrl)}" rel="noopener noreferrer">View the Atlas Villa package on Etsy</a></section><p><a href="/services/">Explore architecture and interior design services</a></p></article></main>`;
// Static SEO fallback for the contact route (client route renders ContactPage).
const contactPath = '/contact/';
const contactDescription = 'Start your architecture or interior design project with World Arch Journal — villa and residential design, floor plans, facades and interiors.';
const contactBody = `<main class="seo-route-fallback"><a href="/">WORLD ARCH JOURNAL</a><header><small>CONTACT</small><h1>Start your project.</h1><p>${escapeHtml(contactDescription)}</p></header><section><h2>Design enquiries</h2><p>Share your project brief — villa and residential design, floor plans, facades, interiors and coordinated design packages.</p><p><a href="/services/">Explore design services</a></p><p><a href="/projects/">View selected projects</a></p></section></main>`;
await emit(contactPath, preparePage({ pathname: contactPath, title: `Contact | ${siteName}`, description: contactDescription, schema: { '@context': 'https://schema.org', '@type': 'ContactPage', name: `Contact | ${siteName}`, url: `${siteUrl}${contactPath}` }, body: contactBody }));

await emit(atlasPath, preparePage({ pathname: atlasPath, title: `Atlas Villa — Residential Architecture Design Study | ${siteName}`, description: atlasDescription, image: atlasVilla.cover, imageAlt: 'Atlas Villa residential architecture design study', schema: { '@context': 'https://schema.org', '@type': 'CreativeWork', name: atlasVilla.title, alternateName: atlasVilla.subtitle, description: atlasDescription, url: `${siteUrl}${atlasPath}`, image: absoluteUrl(atlasVilla.cover), inLanguage: 'en', creator: { '@type': 'Organization', name: 'World Arch Journal' }, about: atlasVilla.tags, subjectOf: { '@type': 'Product', name: 'Atlas Villa digital project package', url: atlasVilla.etsyUrl }, publisher }, body: atlasBody }));

for (const project of projects) {
  const pathname = project.detailPath;
  const facts = project.facts.map(([label, value]) => `<li><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</li>`).join('');
  const drawings = project.drawings.map(([label, image]) => `<figure><img src="${escapeHtml(image)}" alt="${escapeHtml(`${project.title} ${label}`)}" loading="lazy" /><figcaption>${escapeHtml(label)} · English editorial redraw</figcaption></figure>`).join('');
  const body = `<main class="seo-route-fallback"><a href="/projects/">WORLD ARCH JOURNAL / PROJECTS</a><article><header><small>${escapeHtml(project.type)} · ${escapeHtml(project.year)}</small><h1>${escapeHtml(project.title)}</h1><p>${escapeHtml(project.description)}</p></header><figure><img src="${escapeHtml(project.cover)}" alt="${escapeHtml(project.coverAlt)}" /></figure><p><a href="${escapeHtml(project.tourPath)}">Enter the interactive tour</a> · <a href="${escapeHtml(project.guidePath)}">Download PDF guide</a> · <a href="${escapeHtml(project.drawingPackPath)}">Download English drawing pack</a></p><section><h2>Project file</h2><ul>${facts}</ul></section><section><h2>Design evolution</h2><p>The villa is organised as a sequence of open, semi-open and enclosed voids connecting leisure, living and private levels. A north garden, a protected south court and a semi-central courtyard structure the relationship between daylight, movement and privacy.</p></section><section><h2>Plans and sections</h2>${drawings}</section></article></main>`;
  const schema = { '@context': 'https://schema.org', '@type': 'CreativeWork', name: project.title, description: project.description, url: `${siteUrl}${pathname}`, image: absoluteUrl(project.cover), inLanguage: 'en', creator: { '@type': 'Organization', name: project.studio }, locationCreated: { '@type': 'Place', name: project.location }, publisher };
  await emit(pathname, preparePage({ pathname, title: `${project.title}: 3D Tour, Plans & Project Guide | ${siteName}`, description: project.description, image: project.cover, imageAlt: project.coverAlt, schema, body }));

  const tourDescription = `Enter an interactive spatial tour of ${project.title} in ${project.location}, with project context and links to drawings and the complete architecture guide.`;
  const tourSchema = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'CreativeWork', name: `${project.title} Virtual Architecture Tour`, description: tourDescription, url: `${siteUrl}${project.tourPath}`, image: absoluteUrl(project.cover), inLanguage: 'en', about: { '@type': 'ArchitecturalStructure', name: project.title, address: project.location }, creator: publisher, isPartOf: { '@type': 'CreativeWork', name: project.title, url: `${siteUrl}${project.detailPath}` } },
    breadcrumbSchema([{ name: 'Home', pathname: '/' }, { name: 'Projects', pathname: '/projects/' }, { name: project.title, pathname: project.detailPath }, { name: 'Virtual tour', pathname: project.tourPath }]),
  ] };
  const tourBody = `<main class="seo-route-fallback"><a href="${escapeHtml(project.detailPath)}">WORLD ARCH JOURNAL / ${escapeHtml(project.title)}</a><article><header><small>INTERACTIVE ARCHITECTURE TOUR</small><h1>${escapeHtml(project.title)} virtual tour</h1><p>${escapeHtml(tourDescription)}</p></header><figure><img src="${escapeHtml(project.cover)}" alt="${escapeHtml(project.coverAlt)}" width="1600" height="900" fetchpriority="high" /></figure><p>This experience is an editorial spatial interpretation. Use the project page for verified credits, source links, plans and context.</p><p><a href="${escapeHtml(project.detailPath)}">Read the complete project file</a> · <a href="${escapeHtml(project.guidePath)}">Download the project guide</a></p></article></main>`;
  await emit(project.tourPath, preparePage({ pathname: project.tourPath, title: `${project.title} Virtual Architecture Tour | ${siteName}`, description: tourDescription, image: project.cover, imageAlt: project.coverAlt, schema: tourSchema, body: tourBody, preloadImage: project.cover }));
}

const promptsPath = '/prompts/';
const promptsDescription = 'Copy free AI prompts for architecture websites, images, videos, logo motion and animated backgrounds, or explore locked WORLD ARCH PRO collections.';
const promptLinks = promptItems.map((item) => `<li><a href="/prompts/${escapeHtml(item.id)}/">${escapeHtml(item.title)}</a> <b>${item.access === 'premium' ? '♛ PRO · Locked' : 'FREE · Copy-ready'}</b><p>${escapeHtml(item.summary)}</p></li>`).join('');
const promptCategoryLinks = promptCategories.map((category) => `<a href="/prompts/?category=${escapeHtml(category.slug)}">${escapeHtml(category.title)}</a>`).join(' · ');
const promptsBody = `<main class="seo-route-fallback"><a href="/">WORLD ARCH JOURNAL</a><header><small>WORLD ARCH PROMPT LAB · FREE + PRO</small><h1>AI prompts for architecture, image and motion</h1><p>${escapeHtml(promptsDescription)}</p></header><nav aria-label="Prompt categories">${promptCategoryLinks}</nav><section><h2>Prompt library</h2><ol>${promptLinks}</ol></section></main>`;
const promptsSchema = { '@context': 'https://schema.org', '@type': 'CollectionPage', name: `Free & PRO AI Architecture Prompts | ${siteName}`, description: promptsDescription, url: `${siteUrl}${promptsPath}`, inLanguage: 'en', publisher, hasPart: promptItems.map((item) => ({ '@type': 'CreativeWork', name: item.title, description: item.summary, url: `${siteUrl}/prompts/${item.id}/`, image: absoluteUrl(item.image), isAccessibleForFree: item.access === 'free' })) };
await emit(promptsPath, preparePage({ pathname: promptsPath, title: `Free & PRO AI Architecture Prompts | ${siteName}`, description: promptsDescription, image: '/assets/articles/climate-responsive-facades/climate-responsive-facade-hero-v1.jpg', schema: promptsSchema, body: promptsBody }));

for (const item of promptItems) {
  const pathname = `/prompts/${item.id}/`;
  const description = `${item.summary} ${item.access === 'free' ? 'Free, copy-ready architecture prompt with practical production settings.' : 'WORLD ARCH PRO prompt collection.'}`;
  const creativeWork = { '@type': 'CreativeWork', name: item.title, description, url: `${siteUrl}${pathname}`, image: absoluteUrl(item.image), inLanguage: 'en', creator: publisher, isAccessibleForFree: item.access === 'free', learningResourceType: 'Prompt', about: item.category, ...(item.referenceFrames?.length ? { associatedMedia: item.referenceFrames.map((frame) => ({ '@type': 'ImageObject', name: frame.label, contentUrl: absoluteUrl(frame.src), caption: frame.alt })) } : {}), ...(item.access === 'free' ? { text: item.prompt } : {}) };
  const breadcrumb = { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'AI Prompt Library', item: `${siteUrl}/prompts/` }, { '@type': 'ListItem', position: 2, name: item.title, item: `${siteUrl}${pathname}` }] };
  const schema = { '@context': 'https://schema.org', '@graph': [creativeWork, breadcrumb] };
  const category = promptCategories.find((entry) => entry.slug === item.category);
  const accessBody = item.access === 'free'
    ? `<section><h2>${escapeHtml(item.promptLabel)}</h2><button type="button" data-copy-prompt="prompt-master-text">Copy full prompt</button><p>If your browser blocks copying, select the complete text below.</p><pre id="prompt-master-text" style="white-space:pre-wrap;overflow-wrap:anywhere;font:inherit;line-height:1.7">${escapeHtml(item.prompt)}</pre><h2>${escapeHtml(item.secondaryLabel)}</h2><p>${escapeHtml(item.secondaryPrompt)}</p></section><script defer src="/assets/prompt-copy-fallback.js"></script>`
    : '<section><h2>♛ WORLD ARCH PRO</h2><p>This professional prompt collection is locked. No checkout is active yet.</p><p><a href="/newsletter/#briefing-signup-title">Get the launch notice →</a></p></section>';
  const watchVideo = watchVideoForSource(pathname);
  const watchLink = watchVideo ? `<p><a href="${watchPagePath(watchVideo)}">Watch the full-screen video example</a></p>` : '';
  const media = item.video
    ? `<video controls preload="metadata" poster="${escapeHtml(item.image)}"><source src="${escapeHtml(item.video)}" type="video/mp4" />Your browser does not support embedded video.</video>`
    : `<figure><img src="${escapeHtml(item.image)}" alt="${escapeHtml(`${item.title} prompt preview`)}" /></figure>`;
  const frames = item.referenceFrames?.length ? `<section><h2>Start and end frames</h2>${item.referenceFrames.map((frame) => `<figure><img src="${escapeHtml(frame.src)}" alt="${escapeHtml(frame.alt)}" loading="lazy" /><figcaption>${escapeHtml(frame.label)} · <a href="${escapeHtml(frame.src)}" download>Download JPG</a></figcaption></figure>`).join('')}</section>` : '';
  const relatedPrompts = promptItems.filter((entry) => entry.id !== item.id && entry.category === item.category).slice(0, 3).map((entry) => `<li><a href="/prompts/${escapeHtml(entry.id)}/">${escapeHtml(entry.title)}</a> · ${entry.access === 'premium' ? 'PRO' : 'Free'}</li>`).join('');
  const body = `<main class="seo-route-fallback"><a href="/prompts/">WORLD ARCH JOURNAL / PROMPT LAB</a><article><header><small>${escapeHtml(category?.title || item.category)} · ${item.access === 'premium' ? '♛ PRO' : 'FREE'}</small><h1>${escapeHtml(item.title)}</h1><p>${escapeHtml(item.summary)}</p></header>${media}${watchLink}${frames}${accessBody}${relatedPrompts ? `<section><h2>Related prompts</h2><ul>${relatedPrompts}</ul></section>` : ''}</article></main>`;
  await emit(pathname, preparePage({ pathname, title: `${item.title} AI Prompt | ${siteName}`, description, image: item.image, imageAlt: `${item.title} prompt preview`, schema, body, robots: item.access === 'premium' ? 'noindex, follow, max-image-preview:large' : undefined }));
}

for (const [pathname, page] of Object.entries(legalPages)) {
  const sections = page.sections.map(([heading, body]) => `<section><h2>${escapeHtml(heading)}</h2>${Array.isArray(body) ? `<ul>${body.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>` : `<p>${escapeHtml(body)}</p>`}</section>`).join('');
  const links = (page.links || []).map((link) => `<li><a href="${escapeHtml(link.url)}">${escapeHtml(link.label)}</a></li>`).join('');
  const introduction = page.portrait
    ? `<div class="ek-publisher-intro"><p class="ek-legal-intro">${escapeHtml(page.intro)}</p><figure class="ek-publisher-portrait" style="margin:0"><picture>${page.portrait.srcWebp ? `<source srcset="${escapeHtml(page.portrait.srcWebp)}" type="image/webp" />` : ''}<img src="${escapeHtml(page.portrait.src)}" alt="${escapeHtml(page.portrait.alt)}" width="${page.portrait.width}" height="${page.portrait.height}" decoding="async" /></picture><figcaption>${escapeHtml(page.portrait.caption)}</figcaption></figure></div>`
    : `<p>${escapeHtml(page.intro)}</p>`;
  const body = `<main class="seo-route-fallback"><a href="/">WORLD ARCH JOURNAL</a><article><header><small>${escapeHtml(page.eyebrow)}</small><h1>${escapeHtml(page.title)}</h1>${introduction}<p>Last updated: <time datetime="${escapeHtml(page.lastUpdated || '2026-09-27')}">${escapeHtml(page.lastUpdated || '2026-09-27')}</time></p></header>${sections}${links ? `<nav aria-label="Related editorial information"><ul>${links}</ul></nav>` : ''}</article></main>`;
  const schema = { '@context': 'https://schema.org', '@type': 'WebPage', name: page.title, description: page.intro, url: `${siteUrl}${pathname}`, inLanguage: 'en', publisher };
  await emit(pathname, preparePage({ pathname, title: `${page.title} | ${siteName}`, description: page.metaDescription || page.intro, image: page.portrait?.src || '/assets/brand/world-arch-wa-mark-v1.png', schema, body }));
}

const shopPath = '/shop/';
const shopDescription = 'Explore architecture presentation formats, digital resources, original BIM and Revit files and editorial e-books by World Arch Journal, with a clear link to the Etsy shop.';
const publishedProducts = (defaultContent.products || []).filter((item) => item.published);
const productLinks = publishedProducts.map((product) => `<article><img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.imageAlt || product.title)}" /><h2>${escapeHtml(product.title)}</h2><p>${escapeHtml(product.excerpt)}</p><a href="/shop/${escapeHtml(product.slug || product.id)}/">View product</a></article>`).join('');
const shopBody = `<main class="seo-route-fallback"><a href="/">WORLD ARCH JOURNAL</a><header><small>CURATED DIGITAL PRODUCTS AND SERVICES</small><h1>Architecture Shop</h1><p>${escapeHtml(shopDescription)}</p><p><a href="/shop/presentations/">Explore Presentation Studio</a> · <a href="https://worldarchjournal.etsy.com/">Visit our Etsy shop</a></p></header><section><h2>${publishedProducts.length ? 'Published products' : 'Catalogue in development'}</h2>${publishedProducts.length ? productLinks : '<p>Product files, prices and checkout appear only after listing and delivery review. Etsy purchases complete on Etsy.</p>'}</section></main>`;
await emit(shopPath, preparePage({ pathname: shopPath, title: `Architecture Shop | ${siteName}`, description: shopDescription, image: publishedProducts[0]?.image || '/assets/candidates/office-world/scene-06-material-model-lab-v1.png', schema: { '@context': 'https://schema.org', '@type': 'CollectionPage', name: `Architecture Shop | ${siteName}`, description: shopDescription, url: `${siteUrl}${shopPath}`, inLanguage: 'en', publisher, hasPart: publishedProducts.map((product) => ({ '@type': 'Product', name: product.title, url: `${siteUrl}/shop/${product.slug || product.id}/` })) }, body: shopBody }));

const presentationPath = '/shop/presentations/';
const presentationTitle = 'Architecture Presentation Templates & Custom Design';
const presentationDescription = 'Explore interior and exterior architecture presentation formats, editable slide decks, design boards and social cover systems, plus bespoke presentation design by World Arch Journal.';
const presentationProducts = publishedProducts.filter((item) => /presentation|powerpoint|slide/i.test(`${item.category} ${item.title}`));
const presentationBody = `<main class="seo-route-fallback"><a href="/shop/">WORLD ARCH JOURNAL / SHOP</a><article><header><small>ARCHITECTURAL COMMUNICATION</small><h1>Presentation Studio</h1><p>${escapeHtml(presentationDescription)}</p><p><a href="https://worldarchjournal.etsy.com/">Browse the Etsy shop</a> · <a href="/shop/">Back to shop</a></p></header>${presentationProducts.map((product) => `<section><small>READY-MADE TEMPLATE</small><h2>${escapeHtml(product.title)}</h2><img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.imageAlt || product.title)}" /><p>${escapeHtml(product.excerpt)}</p><a href="/shop/${escapeHtml(product.slug || product.id)}/">View template and price</a></section>`).join('')}<section><h2>Interior design presentations</h2><p>Room narratives, material palettes, plans and visual sequences for client decisions.</p></section><section><h2>Exterior and facade presentations</h2><p>Concept boards for massing, facade rhythm, environmental ideas and material choices.</p></section><section><h2>Architectural boards and slide decks</h2><p>PowerPoint-ready structures for portfolios, design reviews and competition-style boards.</p></section><section><h2>Reels and post cover systems</h2><p>Consistent social covers that give each project a clear visual identity.</p></section><section><h2>Ready-made or bespoke?</h2><p>Check an actual Etsy listing for editable format, licence, price and delivery terms. Bespoke scope, revisions and timing are agreed in writing before payment.</p></section></article></main>`;
await emit(presentationPath, preparePage({ pathname: presentationPath, title: `${presentationTitle} | ${siteName}`, description: presentationDescription, image: presentationProducts[0]?.image || '/assets/candidates/office-world/scene-06-material-model-lab-v1.png', schema: { '@context': 'https://schema.org', '@type': 'CollectionPage', name: presentationTitle, description: presentationDescription, url: `${siteUrl}${presentationPath}`, inLanguage: 'en', publisher, hasPart: presentationProducts.map((product) => ({ '@type': 'Product', name: product.title, url: `${siteUrl}/shop/${product.slug || product.id}/` })) }, body: presentationBody }));

for (const product of publishedProducts) {
  const slug = product.slug || product.id;
  const pathname = `/shop/${slug}/`;
  const checkout = String(product.gumroadUrl || product.checkoutUrl || product.url || '');
  const verifiedCheckout = verifiedCheckoutUrl(checkout);
  const provider = checkoutProvider(verifiedCheckout);
  const description = product.metaDescription || product.excerpt;
  const productEntity = verifiedCheckout && product.price ? { '@type': 'Product', name: product.title, description, image: [absoluteUrl(product.image)], url: `${siteUrl}${pathname}`, sku: product.id, brand: publisher, offers: { '@type': 'Offer', url: verifiedCheckout, price: product.price, priceCurrency: product.currency || 'USD', availability: 'https://schema.org/InStock', itemCondition: 'https://schema.org/NewCondition' } } : { '@type': 'WebPage', name: product.title, description, url: `${siteUrl}${pathname}`, inLanguage: 'en' };
  const schema = { '@context': 'https://schema.org', '@graph': [productEntity, breadcrumbSchema([{ name: 'Home', pathname: '/' }, { name: 'Shop', pathname: '/shop/' }, { name: product.title, pathname }])] };
  const watchVideo = watchVideoForSource(pathname);
  const watchLink = watchVideo ? `<p><a href="${watchPagePath(watchVideo)}">Watch the video preview on its dedicated page</a></p>` : '';
  const media = product.video ? `<video controls muted playsinline preload="metadata" poster="${escapeHtml(product.image)}"><source src="${escapeHtml(product.video)}" type="video/mp4" />Your browser does not support embedded video.</video>` : `<figure><img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.imageAlt || product.title)}" /></figure>`;
  const gallery = product.gallery?.length ? `<section><h2>Inside the template</h2>${product.gallery.map((image, index) => `<figure><img src="${escapeHtml(image)}" alt="${escapeHtml(`${product.title} preview ${index + 2}`)}" loading="lazy" /></figure>`).join('')}</section>` : '';
  const body = `<main class="seo-route-fallback"><a href="/shop/">WORLD ARCH JOURNAL / SHOP</a><article><header><small>${escapeHtml(product.category)}</small><h1>${escapeHtml(product.title)}</h1><p>${escapeHtml(product.excerpt)}</p></header>${media}${watchLink}<p><strong>${escapeHtml(product.currency || 'USD')} ${escapeHtml(product.price || '')}</strong></p>${verifiedCheckout ? `<a href="${escapeHtml(verifiedCheckout)}">Buy securely on ${provider}</a>` : '<p>Checkout opens after final product approval.</p>'}${gallery}<section><h2>What this presentation format is designed to solve</h2><p>An architecture presentation should help a reader understand the project sequence, not simply collect attractive images. Use the editable structure to connect site analysis, concept, plans, sections, materials and final visualisations in a consistent hierarchy. Replace every sample image and project statement with your own verified content before presenting it to a client, tutor or competition jury.</p><p>Check the live Etsy listing for the exact editable file type, slide count, aspect ratio, fonts, licence, delivery contents and current price. The website summary supports discovery; Etsy remains the source of truth for checkout and fulfilment.</p></section><section><h2>Ready-made template or bespoke design?</h2><p>A ready-made template suits projects that already have drawings, renders and written content. Bespoke presentation design is better when the narrative, visual hierarchy or audience still needs to be defined. Custom scope, revisions, delivery date and rights are agreed in writing before payment.</p></section><p><a href="/shop/presentations/">Compare architecture presentation options</a> · <a href="/editorial-team/">Ask about bespoke presentation design</a></p></article></main>`;
  await emit(pathname, preparePage({ pathname, title: product.seoTitle || `${product.title} | ${siteName}`, description, image: product.image, imageAlt: product.imageAlt || product.title, type: verifiedCheckout ? 'product' : 'website', schema, body }));
}

const sitemapRecords = [
  { pathname: ajorbaft.path, lastmod: '2026-10-20', image: { loc: ajorbaft.cover, title: 'Ajorbaft Triplex Brick Residence' } },
  { pathname: '/materials/', lastmod: '2026-10-19' },
  ...materialCollectionSitemap,
  { pathname: '/', lastmod: '2026-10-05', image: { loc: '/assets/editorial/issue-00/courtyard-wind-house-cover.jpg', title: 'World Arch Journal architecture editorial and studio' } },
  ...Object.entries(legalPages).map(([pathname, page]) => ({ pathname, lastmod: page.lastUpdated || '2026-09-27' })),
  ...[
    ['/atlas/', '2026-10-08'],
    ['/atlas/turkiye/istanbul/', '2026-10-08'],
    ['/atlas/turkiye/antalya/', '2026-10-08'],
    ['/atlas/turkiye/cappadocia/', '2026-10-08'],
  ].map(([pathname, lastmod]) => ({ pathname, lastmod })),
  { pathname: '/magazine/', lastmod: '2026-10-05', image: { loc: publishedMagazineArticles[0]?.image, title: 'World Arch Journal architecture magazine' } },
  { pathname: videosPath, lastmod: publishedVideoStories[0]?.uploadDate || '2026-10-09', image: { loc: publishedVideoStories[0]?.thumbnail, title: 'World Arch Journal architecture videos' } },
  ...publishedVideoStories.map((video) => ({ pathname: `/videos/${video.slug}/`, lastmod: video.uploadDate, image: { loc: video.thumbnail, title: video.title }, video: { title: video.title, description: video.description, thumbnail: video.thumbnail, player: `https://www.youtube-nocookie.com/embed/${video.youtubeId}`, uploadDate: video.uploadDate, duration: video.duration } })),
  ...watchVideoEntries.map((video) => ({ pathname: watchPagePath(video), lastmod: video.publishedAt, image: { loc: video.thumbnail, title: video.title }, video: { title: video.title, description: video.description, thumbnail: video.thumbnail, content: video.file, uploadDate: video.publishedAt } })),
  { pathname: '/newsletter/', lastmod: newsletterIssues[0]?.publishedAt, image: { loc: newsletterIssues[0]?.image, title: newsletterIssues[0]?.title } },
  { pathname: '/magazine/analysis/', lastmod: editorialArticles[0]?.updatedAt || editorialArticles[0]?.publishedAt, image: { loc: editorialArticles[0]?.image, title: editorialArticles[0]?.title } },
  ...[...newsletterIssues, ...editorialArticles].map((issue) => ({ pathname: editorialPath(issue), lastmod: issue.updatedAt || issue.publishedAt, image: { loc: issue.image, title: issue.title, caption: issue.imageAlt } })),
  ...magazineCategories.map((category) => ({ pathname: `/magazine/${category.slug}/`, lastmod: '2026-10-05', image: { loc: category.articles[0]?.image, title: `${category.title} architecture articles` } })),
  ...articles.filter((item) => item.published).map((item) => ({ pathname: `/articles/${item.slug}/`, lastmod: item.modifiedAt || item.publishedAt, image: { loc: item.image, title: item.title, caption: item.imageAlt } })),
  ...magazines.filter((item) => item.published).map((item) => ({ pathname: `/magazine/${item.slug}/`, lastmod: item.modifiedAt || item.publishedAt, image: { loc: item.image, title: item.title, caption: item.imageAlt } })),
  { pathname: projectsPath, lastmod: '2026-10-06', image: { loc: projects[0]?.cover, title: 'World Arch Journal immersive architecture projects' } },
  { pathname: servicesPath, lastmod: '2026-10-11', image: { loc: atlasVilla.cover, title: 'Architecture and interior design services by World Arch Journal' } },
  { pathname: atlasPath, lastmod: '2026-10-11', image: { loc: atlasVilla.cover, title: 'Atlas Villa residential architecture design study' } },
  ...projects.map((project) => ({ pathname: project.detailPath, lastmod: '2026-10-06', image: { loc: project.cover, title: project.title, caption: project.coverAlt } })),
  ...projects.map((project) => ({ pathname: project.tourPath, lastmod: '2026-10-06', image: { loc: project.cover, title: `${project.title} virtual tour`, caption: project.coverAlt } })),
  { pathname: promptsPath, lastmod: '2026-09-27' },
  ...promptItems.filter((item) => item.access === 'free').map((item) => ({ pathname: `/prompts/${item.id}/`, lastmod: item.modifiedAt || item.publishedAt || '2026-09-27', image: { loc: item.image, title: item.title, caption: item.summary } })),
  { pathname: shopPath, lastmod: '2026-10-05', image: { loc: publishedProducts[0]?.image, title: 'World Arch Journal architecture shop' } },
  { pathname: presentationPath, lastmod: '2026-10-05', image: { loc: presentationProducts[0]?.image, title: presentationTitle } },
  ...publishedProducts.map((item) => ({ pathname: `/shop/${item.slug || item.id}/`, lastmod: item.modifiedAt || item.publishedAt, image: { loc: item.image, title: item.title, caption: item.imageAlt || item.excerpt } })),
];
const uniqueRecords = [...new Map(sitemapRecords.map((record) => [record.pathname, record])).values()];
const atlasPaths = [
  '/atlas/',
  '/atlas/turkiye/istanbul/',
  '/atlas/turkiye/antalya/',
  '/atlas/turkiye/cappadocia/',
];
const atlasRecords = uniqueRecords.filter((record) => atlasPaths.includes(record.pathname));
const serializeSitemap = (records) => `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">\n${records.map((record) => {
  const loc = `${siteUrl}${record.pathname === '/' ? '' : record.pathname}`;
  const lastmod = record.lastmod ? `<lastmod>${escapeHtml(String(record.lastmod).slice(0, 10))}</lastmod>` : '';
  const image = record.image?.loc ? `<image:image><image:loc>${absoluteUrl(record.image.loc)}</image:loc>${record.image.title ? `<image:title>${escapeXml(record.image.title)}</image:title>` : ''}${record.image.caption ? `<image:caption>${escapeXml(record.image.caption)}</image:caption>` : ''}</image:image>` : '';
  const videoLocation = record.video?.player ? `<video:player_loc allow_embed="yes">${escapeXml(record.video.player)}</video:player_loc>` : record.video?.content ? `<video:content_loc>${absoluteUrl(record.video.content)}</video:content_loc>` : '';
  const video = record.video ? `<video:video><video:thumbnail_loc>${absoluteUrl(record.video.thumbnail)}</video:thumbnail_loc><video:title>${escapeXml(record.video.title)}</video:title><video:description>${escapeXml(record.video.description)}</video:description>${videoLocation}${record.video.uploadDate ? `<video:publication_date>${escapeXml(record.video.uploadDate)}</video:publication_date>` : ''}${record.video.duration ? `<video:duration>${Math.max(1, Math.round(Number(String(record.video.duration).match(/PT(\d+)S/)?.[1] || 0)))}</video:duration>` : ''}</video:video>` : '';
  return `  <url><loc>${loc}</loc>${lastmod}${image}${video}</url>`;
}).join('\n')}\n</urlset>\n`;
const sitemap = serializeSitemap(uniqueRecords);
const atlasSitemap = serializeSitemap(atlasRecords);
const articleSitemap = serializeSitemap(uniqueRecords.filter((record) => record.pathname.startsWith('/articles/') || record.pathname.startsWith('/magazine/')));
const videoSitemap = serializeSitemap(uniqueRecords.filter((record) => record.video));
// Google News sitemaps should include only articles from the last two days,
// relative to the build time, not relative to the newest article in the archive.
const newsSitemapBuildTime = Date.now();
const newsWindowMs = 2 * 24 * 60 * 60 * 1000;
const eligibleNewsIssues = newsletterIssues.filter((issue) => {
  const publishedAt = Date.parse(issue.feedPublishedAt || `${issue.publishedAt}T12:00:00Z`);
  return Number.isFinite(publishedAt)
    && publishedAt <= newsSitemapBuildTime
    && publishedAt >= newsSitemapBuildTime - newsWindowMs;
});
const newsSitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n${eligibleNewsIssues.map((issue) => `  <url><loc>${siteUrl}${editorialPath(issue)}</loc><news:news><news:publication><news:name>${siteName}</news:name><news:language>en</news:language></news:publication><news:publication_date>${escapeXml(issue.publishedAt)}</news:publication_date><news:title>${escapeXml(issue.title)}</news:title></news:news></url>`).join('\n')}\n</urlset>\n`;
await writeFile(path.join(dist, 'sitemap.xml'), sitemap, 'utf8');
await writeFile(path.join(dist, 'atlas-sitemap.xml'), atlasSitemap, 'utf8');
await writeFile(path.join(dist, 'article-sitemap.xml'), articleSitemap, 'utf8');
await writeFile(path.join(dist, 'video-sitemap.xml'), videoSitemap, 'utf8');
await writeFile(path.join(dist, 'news-sitemap.xml'), newsSitemap, 'utf8');
await writeFile(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nUser-agent: OAI-SearchBot\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\nSitemap: ${siteUrl}/article-sitemap.xml\nSitemap: ${siteUrl}/video-sitemap.xml\nSitemap: ${siteUrl}/atlas-sitemap.xml\nSitemap: ${siteUrl}/news-sitemap.xml\n`, 'utf8');
await writeFile(path.join(dist, 'rss.xml'), createArticleRss(articles), 'utf8');
await injectArticleFeedLinks(dist);
await injectStaticAnalytics(dist);

console.log(`Generated ${articles.filter((item) => item.published).length} article page(s), ${magazines.filter((item) => item.published).length} magazine page(s), ${promptItems.length} prompt page(s), ${publishedProducts.length} product page(s), shop, sitemap and robots.`);


