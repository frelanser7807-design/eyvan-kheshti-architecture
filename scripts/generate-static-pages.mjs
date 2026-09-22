import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { articles } from '../src/data/articles.js';
import { magazines } from '../src/data/magazines.js';
import { magazineCategories, publishedMagazineArticles } from '../src/data/magazineCategories.js';
import { defaultContent } from '../src/data/defaultContent.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const indexPath = path.join(dist, 'index.html');
const siteUrl = String(process.env.VITE_SITE_URL || 'https://worldarchjournal.com').replace(/\/$/, '');
const siteName = 'WORLD ARCH JOURNAL';
const template = await readFile(indexPath, 'utf8');

const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const plainText = (value = '') => String(value).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const absoluteUrl = (value = '') => /^https?:\/\//i.test(value) ? value : `${siteUrl}${String(value).startsWith('/') ? value : `/${value}`}`;
const normalizedPath = (value) => value.endsWith('/') ? value : `${value}/`;

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
  html = html.replace('</head>', `    <link rel="canonical" href="${escapeHtml(canonical)}" />\n    ${preloadImage ? `<link rel="preload" as="image" href="${escapeHtml(preloadImage)}" data-static-preload fetchpriority="high" />` : ''}\n    <script type="application/ld+json" data-static-schema>${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>\n    <style>.seo-route-fallback{min-height:100vh;padding:5vw 8vw 8vw;background:#eeeae2;color:#23231f;font-family:Arial,sans-serif}.seo-route-fallback>a{color:#6c4f2e}.seo-route-fallback header,.seo-route-fallback article,.seo-route-fallback section{width:min(900px,100%);margin:4rem auto}.seo-route-fallback h1{max-width:17ch;font:400 clamp(2.8rem,7vw,6.5rem)/.92 Georgia,serif}.seo-route-fallback h2{font:400 clamp(1.8rem,4vw,3.2rem)/1 Georgia,serif}.seo-route-fallback p,.seo-route-fallback li{line-height:1.75}.seo-route-fallback figure{margin:2rem 0}.seo-route-fallback img{width:100%;height:auto}.seo-route-fallback small{letter-spacing:.14em;color:#826541}.seo-route-fallback nav{display:flex;gap:1rem;flex-wrap:wrap}</style>\n  </head>`);
  return html;
}

async function emit(pathname, html) {
  const directory = pathname === '/' ? dist : path.join(dist, ...pathname.split('/').filter(Boolean));
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, 'index.html'), html, 'utf8');
}

const publisher = {
  '@type': 'Organization',
  name: siteName,
  url: siteUrl,
  logo: { '@type': 'ImageObject', url: absoluteUrl('/assets/brand/world-arch-wa-mark-v1.png') },
  sameAs: [defaultContent.brand.youtube, defaultContent.brand.instagram, defaultContent.brand.pinterest, defaultContent.brand.whatsapp].filter(Boolean),
};

const homeDescription = 'Explore global architecture, bespoke facade design, spatial design, architectural visualisation, BIM and Revit resources, original magazines and evidence-led research by Farnaz Ghaffarian.';
const homeSchema = { '@context': 'https://schema.org', '@type': 'ProfessionalService', name: siteName, url: siteUrl, description: homeDescription, image: absoluteUrl('/assets/editorial/issue-00/courtyard-wind-house-cover.jpg'), areaServed: 'International', availableLanguage: ['English'], sameAs: publisher.sameAs, founder: { '@type': 'Person', name: defaultContent.brand.founderName, jobTitle: defaultContent.brand.founderRole }, serviceType: defaultContent.services.map((service) => service.title) };
await emit('/', preparePage({ pathname: '/', title: 'WORLD ARCH JOURNAL | Facade, Spatial Design & Visualisation', description: homeDescription, image: '/assets/editorial/issue-00/courtyard-wind-house-cover.jpg', schema: homeSchema, body: template.match(/<div id="root">([\s\S]*?)<\/div>/i)?.[1] || '' }));

for (const article of articles.filter((item) => item.published)) {
  const pathname = `/articles/${article.slug}/`;
  const articleSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Article', headline: article.title, description: article.metaDescription || article.excerpt, mainEntityOfPage: `${siteUrl}${pathname}`, image: [absoluteUrl(article.image)], author: { '@type': 'Person', name: article.author || defaultContent.brand.founderName }, publisher, articleSection: article.category, keywords: (article.tags || []).join(', '), inLanguage: 'en', isAccessibleForFree: true, ...(article.publishedAt ? { datePublished: article.publishedAt } : {}), ...(article.modifiedAt ? { dateModified: article.modifiedAt } : {}) },
      ...(article.faq?.length ? [{ '@type': 'FAQPage', mainEntity: article.faq.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })) }] : []),
    ],
  };
  const facts = (article.facts || []).map(([label, value]) => `<li><b>${escapeHtml(label)}:</b> ${escapeHtml(value)}</li>`).join('');
  const visuals = (article.visuals || []).map((visual) => `<figure>${visual.srcWebp ? `<picture><source srcset="${escapeHtml(visual.srcWebp)}" type="image/webp" />` : ''}<img src="${escapeHtml(visual.src)}" alt="${escapeHtml(visual.alt)}" loading="lazy" decoding="async" />${visual.srcWebp ? '</picture>' : ''}<figcaption>${escapeHtml(visual.caption)}</figcaption></figure>`).join('');
  const sources = (article.evidence || []).map((source) => `<li><a href="${escapeHtml(source.source_url)}">${escapeHtml(source.publisher)}</a> — ${escapeHtml(source.claim)}</li>`).join('');
  const toc = (article.toc || []).map(([id, label]) => `<li><a href="#${escapeHtml(id)}">${escapeHtml(label)}</a></li>`).join('');
  const hero = `<figure>${article.imageWebp ? `<picture><source srcset="${escapeHtml(article.imageWebp)}" type="image/webp" />` : ''}<img src="${escapeHtml(article.image)}" alt="${escapeHtml(article.imageAlt)}" width="${Number(article.imageWidth) || 1600}" height="${Number(article.imageHeight) || 900}" fetchpriority="high" />${article.imageWebp ? '</picture>' : ''}<figcaption>${escapeHtml(article.visualLabel)}</figcaption></figure>`;
  const body = `<main class="seo-route-fallback"><a href="/#articles">WORLD ARCH JOURNAL / ARTICLES</a><article><header><small>${escapeHtml(article.status)}</small><h1>${escapeHtml(article.title)}</h1><p>${escapeHtml(article.excerpt)}</p><p>By ${escapeHtml(article.author || defaultContent.brand.founderName)}${article.publishedAt ? ` · <time datetime="${escapeHtml(article.publishedAt)}">${escapeHtml(article.publishedAt)}</time>` : ''}</p></header>${hero}${facts ? `<section><h2>Project file</h2><ul>${facts}</ul></section>` : ''}${toc ? `<nav aria-label="Article contents"><h2>Contents</h2><ol>${toc}</ol></nav>` : ''}<section>${article.contentHtml}</section>${visuals}<section><h2>Evidence and source notes</h2><ol>${sources}</ol></section></article></main>`;
  await emit(pathname, preparePage({ pathname, title: article.seoTitle || `${article.title} | ${siteName}`, description: article.metaDescription || article.excerpt, image: article.image, imageAlt: article.imageAlt, type: 'article', schema: articleSchema, body, preloadImage: article.imageWebp || article.image }));
}

for (const landing of [{ pathname: '/magazine/', title: 'Architecture Magazine', description: 'Original, evidence-led architecture stories on climate design, facades, adaptive reuse and concept studies.', articles: publishedMagazineArticles }, ...magazineCategories.map((category) => ({ pathname: `/magazine/${category.slug}/`, title: `${category.title} Articles`, description: category.description, articles: category.articles }))]) {
  const image = landing.articles[0]?.image || '/assets/editorial/issue-00/courtyard-wind-house-cover.jpg';
  const links = landing.articles.map((article) => `<li><a href="/articles/${escapeHtml(article.slug)}/">${escapeHtml(article.title)}</a><p>${escapeHtml(article.excerpt)}</p></li>`).join('');
  const categories = magazineCategories.map((category) => `<a href="/magazine/${escapeHtml(category.slug)}/">${escapeHtml(category.title)}</a>`).join(' · ');
  const body = `<main class="seo-route-fallback"><a href="/">WORLD ARCH JOURNAL</a><header><small>ARCHITECTURE / IDEAS / EVIDENCE</small><h1>${escapeHtml(landing.title)}</h1><p>${escapeHtml(landing.description)}</p></header><nav aria-label="Magazine topics"><a href="/magazine/">All stories</a> · ${categories}</nav><section><h2>Published stories</h2><ol>${links}</ol></section></main>`;
  const schema = { '@context': 'https://schema.org', '@type': 'CollectionPage', name: landing.title, description: landing.description, url: `${siteUrl}${landing.pathname}`, inLanguage: 'en', publisher, hasPart: landing.articles.map((article) => ({ '@type': 'Article', name: article.title, url: `${siteUrl}/articles/${article.slug}/` })) };
  await emit(landing.pathname, preparePage({ pathname: landing.pathname, title: `${landing.title} | ${siteName}`, description: landing.description, image, schema, body }));
}

for (const magazine of magazines.filter((item) => item.published)) {
  const pathname = `/magazine/${magazine.slug}/`;
  const schema = { '@context': 'https://schema.org', '@type': 'PublicationIssue', name: magazine.title, description: magazine.excerpt, url: `${siteUrl}${pathname}`, image: absoluteUrl(magazine.image), issueNumber: magazine.number, inLanguage: 'en', publisher, hasPart: magazine.features.map((feature) => ({ '@type': 'Article', name: feature.title, url: `${siteUrl}/articles/${feature.article?.slug || feature.id}/` })) };
  const features = magazine.features.map((feature) => `<li><a href="/articles/${escapeHtml(feature.article?.slug || feature.id)}/">${escapeHtml(feature.title)}</a><p>${escapeHtml(feature.deck)}</p></li>`).join('');
  const spreads = (magazine.spreads || []).map((spread) => `<figure><img src="${escapeHtml(spread.image)}" alt="${escapeHtml(spread.alt)}" loading="lazy" /><figcaption>${escapeHtml(spread.pages)} · ${escapeHtml(spread.title)} — ${escapeHtml(spread.caption)}</figcaption></figure>`).join('');
  const body = `<main class="seo-route-fallback"><a href="/magazine/">WORLD ARCH JOURNAL / MAGAZINE</a><article><header><small>${escapeHtml(magazine.status)}</small><h1>${escapeHtml(magazine.title)}</h1><p>${escapeHtml(magazine.excerpt)}</p></header><figure><img src="${escapeHtml(magazine.image)}" alt="${escapeHtml(magazine.imageAlt)}" /></figure><section><h2>Contents</h2><ol>${features}</ol></section>${spreads}</article></main>`;
  await emit(pathname, preparePage({ pathname, title: `${magazine.title} | ${siteName}`, description: magazine.excerpt, image: magazine.image, imageAlt: magazine.imageAlt, type: 'article', schema, body }));
}

const shopPath = '/shop/';
const shopDescription = 'Original BIM and Revit resources, architecture e-books and learning products by WORLD ARCH JOURNAL.';
const publishedProducts = (defaultContent.products || []).filter((item) => item.published);
const shopBody = `<main class="seo-route-fallback"><a href="/">WORLD ARCH JOURNAL</a><header><small>CURATED DIGITAL PRODUCTS</small><h1>Architecture Shop</h1><p>${escapeHtml(shopDescription)}</p></header><section><h2>${publishedProducts.length ? 'Published products' : 'Opening soon'}</h2><p>${publishedProducts.length ? 'Explore the verified catalogue.' : 'No purchase or download is active yet.'}</p></section></main>`;
await emit(shopPath, preparePage({ pathname: shopPath, title: `Architecture Shop | ${siteName}`, description: shopDescription, image: '/assets/candidates/office-world/scene-06-material-model-lab-v1.png', schema: { '@context': 'https://schema.org', '@type': 'CollectionPage', name: `Architecture Shop | ${siteName}`, description: shopDescription, url: `${siteUrl}${shopPath}`, inLanguage: 'en', publisher }, body: shopBody }));

for (const product of publishedProducts) {
  const slug = product.slug || product.id;
  const pathname = `/shop/${slug}/`;
  const checkout = String(product.gumroadUrl || product.checkoutUrl || product.url || '');
  const verifiedCheckout = /^https:\/\/([^/]+\.)?gumroad\.com\//i.test(checkout) ? checkout : '';
  const schema = verifiedCheckout && product.price ? { '@context': 'https://schema.org', '@type': 'Product', name: product.title, description: product.excerpt, image: [absoluteUrl(product.image)], url: `${siteUrl}${pathname}`, brand: publisher, offers: { '@type': 'Offer', url: verifiedCheckout, price: product.price, priceCurrency: product.currency || 'USD', availability: 'https://schema.org/InStock' } } : { '@context': 'https://schema.org', '@type': 'WebPage', name: product.title, description: product.excerpt, url: `${siteUrl}${pathname}`, inLanguage: 'en' };
  const body = `<main class="seo-route-fallback"><a href="/shop/">WORLD ARCH JOURNAL / SHOP</a><article><header><small>${escapeHtml(product.category)}</small><h1>${escapeHtml(product.title)}</h1><p>${escapeHtml(product.excerpt)}</p></header><figure><img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.imageAlt || product.title)}" /></figure>${verifiedCheckout ? `<a href="${escapeHtml(verifiedCheckout)}">Buy securely on Gumroad</a>` : '<p>Checkout opens after final product approval.</p>'}</article></main>`;
  await emit(pathname, preparePage({ pathname, title: `${product.title} | ${siteName}`, description: product.excerpt, image: product.image, imageAlt: product.imageAlt || product.title, type: verifiedCheckout ? 'product' : 'website', schema, body }));
}

const sitemapPaths = ['/', '/privacy/', '/terms/', '/affiliate-disclosure/', '/editorial-policy/', '/cookie-settings/', '/atlas/', '/atlas/turkiye/istanbul/', '/atlas/turkiye/antalya/', '/atlas/turkiye/cappadocia/', '/magazine/', ...magazineCategories.map((category) => `/magazine/${category.slug}/`), ...articles.filter((item) => item.published).map((item) => `/articles/${item.slug}/`), ...magazines.filter((item) => item.published).map((item) => `/magazine/${item.slug}/`), shopPath, ...publishedProducts.map((item) => `/shop/${item.slug || item.id}/`)];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...new Set(sitemapPaths)].map((item) => `  <url><loc>${siteUrl}${item === '/' ? '' : item}</loc></url>`).join('\n')}\n</urlset>\n`;
await writeFile(path.join(dist, 'sitemap.xml'), sitemap, 'utf8');
await writeFile(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /#/admin\n\nUser-agent: OAI-SearchBot\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`, 'utf8');

console.log(`Generated ${articles.filter((item) => item.published).length} article page(s), ${magazines.filter((item) => item.published).length} magazine page(s), ${publishedProducts.length} product page(s), shop, sitemap and robots.`);
