import { useEffect } from 'react';
import { assetUrl } from '../lib/assetUrl.js';
import { publishedMagazineArticles } from '../data/magazineCategories.js';
import { promptItems } from '../data/promptLibrary.js';
import { newsletterIssues, editorialArticles, editorialPath } from '../data/newsletters.js';
import { projects } from '../data/projects.js';
import { publishedVideoStories } from '../data/videoStories.js';
import { watchVideoEntries, watchPagePath } from '../data/watchVideos.js';
import { atlasVilla } from '../data/atlasVilla.js';
import { legalPages } from '../data/legalPages.js';

const FALLBACK_SITE_URL = 'https://worldarchjournal.com';
const DEFAULT_IMAGE = '/assets/editorial/issue-00/courtyard-wind-house-cover.jpg';

function setMeta(selector, attributes) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, String(value)));
}

function socialUrl(value) {
  const candidate = String(value || '').trim();
  if (!/^https?:\/\//i.test(candidate)) return '';
  try { return new URL(candidate).href; } catch { return ''; }
}

function absoluteAsset(siteUrl, value) {
  const path = assetUrl(value || DEFAULT_IMAGE);
  return /^https?:\/\//i.test(path) ? path : `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`;
}

function validCheckoutUrl(value) {
  try {
    const url = new URL(String(value || ''));
    const isGumroad = /(^|\.)gumroad\.com$/i.test(url.hostname);
    const isEtsyListing = url.hostname === 'www.etsy.com' && /^\/(?:[a-z]{2}\/)?listing\/\d+(?:\/|$)/i.test(url.pathname);
    return url.protocol === 'https:' && (isGumroad || isEtsyListing) ? url.href : '';
  } catch { return ''; }
}

const legalTitles = {
  '/privacy/': 'Privacy Policy',
  '/terms/': 'Terms of Use',
  '/affiliate-disclosure/': 'Affiliate Disclosure',
  '/editorial-policy/': 'Editorial Standards & Corrections',
  '/editorial-team/': 'Editorial Team & Contact',
  '/cookie-settings/': 'Cookie Settings',
};

export default function SiteSeo({ content, route }) {
  useEffect(() => {
    const brand = content?.brand || {};
    const name = brand.name || 'WORLD ARCH JOURNAL';
    const siteUrl = String(import.meta.env.VITE_SITE_URL || FALLBACK_SITE_URL).replace(/\/$/, '');
    const normalizedPath = window.location.pathname.endsWith('/') ? window.location.pathname : `${window.location.pathname}/`;
    const canonicalUrl = `${siteUrl}${normalizedPath === '/' ? '' : normalizedPath}`;
    const legalTitle = legalTitles[normalizedPath];
    const item = route?.item;
    const isMissing = route?.name === 'not-found' || (['article', 'magazine', 'magazine-category', 'product', 'prompt', 'newsletter-issue', 'analysis-article', 'project', 'video-story'].includes(route?.name) && !item);
    const isCanonicalHost = ['worldarchjournal.com', 'www.worldarchjournal.com'].includes(window.location.hostname);

    let title = 'WORLD ARCH JOURNAL | Facade, Spatial Design & Visualisation';
    let description = 'Explore global architecture, bespoke facade design, spatial design, architectural visualisation, BIM and Revit resources, original magazines and evidence-led research by Farnaz Ghaffarian.';
    let image = absoluteAsset(siteUrl, DEFAULT_IMAGE);
    let ogType = 'website';

    if (legalTitle) {
      title = `${legalPages[normalizedPath]?.title || legalTitle} | ${name}`;
      description = legalPages[normalizedPath]?.metaDescription || `${legalTitle} for the WORLD ARCH JOURNAL architecture platform.`;
      if (legalPages[normalizedPath]?.portrait) image = absoluteAsset(siteUrl, legalPages[normalizedPath].portrait.src);
    } else if (route?.name === 'magazine-hub') {
      title = `Architecture Magazine | ${name}`;
      description = 'Read original, evidence-led architecture stories on climate design, facades, adaptive reuse and concept studies in World Arch Journal.';
    } else if (route?.name === 'video-library') {
      title = `Architecture Videos & Visual Guides | ${name}`;
      description = 'Watch concise architecture videos with transcripts, technical notes and related evidence-led reading from World Arch Journal.';
      image = publishedVideoStories[0]?.thumbnail || image;
    } else if (route?.name === 'video-story' && item) {
      title = item.seoTitle || `${item.title} | ${name}`;
      description = item.description;
      image = item.thumbnail;
      ogType = 'video.other';
    } else if (route?.name === 'newsletter-hub') {
      title = `Architecture Newsletter | ${name}`;
      description = 'Dated architecture news editions with fresh reporting, direct source links and original editorial commentary.';
      image = absoluteAsset(siteUrl, newsletterIssues[0].image);
    } else if (route?.name === 'analysis-hub') {
      title = `Architecture Analysis & Field Notes | ${name}`;
      description = 'Independent long-form architecture analysis and practical building field notes, separate from the daily news briefing.';
      image = absoluteAsset(siteUrl, editorialArticles[0].image);
    } else if (['newsletter-issue', 'analysis-article'].includes(route?.name) && item) {
      title = item.seoTitle;
      description = item.description;
      image = absoluteAsset(siteUrl, item.image);
      ogType = 'article';
    } else if (route?.name === 'magazine-category' && item) {
      title = `${item.title} Articles | ${name}`;
      description = item.description;
      image = absoluteAsset(siteUrl, item.articles[0]?.image);
    } else if (route?.name === 'article' && item) {
      title = item.seoTitle || `${item.title} | ${name}`;
      description = item.metaDescription || item.excerpt;
      image = absoluteAsset(siteUrl, item.image);
      ogType = 'article';
    } else if (route?.name === 'magazine' && item) {
      title = `${item.title} | ${name}`;
      description = item.excerpt;
      image = absoluteAsset(siteUrl, item.image);
      ogType = 'article';
    } else if (route?.name === 'presentation-studio') {
      title = `Architecture Presentation Templates & Custom Design | ${name}`;
      description = 'Explore interior and exterior architecture presentation formats, editable slide decks, design boards and social cover systems, plus bespoke presentation design by World Arch Journal.';
      image = absoluteAsset(siteUrl, '/assets/candidates/office-world/scene-06-material-model-lab-v1.png');
    } else if (route?.name === 'design-services') {
      title = `Architecture & Interior Design Services | ${name}`;
      description = 'Explore villa and residential design, floor plans, facade design, kitchens, living rooms, bathrooms, courtyards, gardens, roof gardens and coordinated design packages by Farnaz Ghaffarian.';
      image = absoluteAsset(siteUrl, atlasVilla.cover);
    } else if (route?.name === 'custom-plan-design') {
      title = `Architecture & Interior Design Project Enquiry | ${name}`;
      description = 'Send a project brief for villa design, floor plans, facade, kitchen, living spaces, bathrooms, gardens, roof gardens, render concepts or a combined architecture package.';
    } else if (route?.name === 'atlas-villa') {
      title = `Atlas Villa — Residential Architecture Design Study | ${name}`;
      description = 'Explore Atlas Villa, a residential architectural design study by Farnaz Ghaffarian, with selected interior concepts, a ground-floor plan presentation and a link to the digital project package.';
      image = absoluteAsset(siteUrl, atlasVilla.cover);
    } else if (route?.name === 'projects-hub') {
      title = `Immersive Architecture Projects | ${name}`;
      description = 'Explore architecture projects through luxury visual covers, interactive walkthroughs, English plans, design history and downloadable project guides.';
      image = absoluteAsset(siteUrl, projects[0]?.cover);
    } else if (route?.name === 'project' && item) {
      title = `${item.title}: 3D Tour, Plans & Project Guide | ${name}`;
      description = item.description;
      image = absoluteAsset(siteUrl, item.cover);
    } else if (['virtual-tour-the-voids', 'virtual-tour-narbon'].includes(route?.name) && item) {
      title = `${item.title} Virtual Architecture Tour | ${name}`;
      description = `Enter an interactive spatial tour of ${item.title} in ${item.location}, with project context and links to drawings and the complete architecture guide.`;
      image = absoluteAsset(siteUrl, item.cover);
    } else if (route?.name === 'shop') {
      title = `Architecture Shop | ${name}`;
      description = 'Explore architecture presentation formats, digital resources, original BIM and Revit files and editorial e-books by World Arch Journal, with a clear link to the Etsy shop.';
    } else if (route?.name === 'product' && item) {
      title = item.seoTitle || `${item.title} | ${name}`;
      description = item.metaDescription || item.excerpt;
      image = absoluteAsset(siteUrl, item.image);
      ogType = 'product';
    } else if (route?.name === 'prompt-library') {
      title = `Free & PRO AI Architecture Prompts | ${name}`;
      description = 'Copy free AI prompts for architecture websites, images, videos, logo motion and animated backgrounds, or explore locked WORLD ARCH PRO collections.';
      image = absoluteAsset(siteUrl, '/assets/articles/climate-responsive-facades/climate-responsive-facade-hero-v1.jpg');
    } else if (route?.name === 'prompt' && item) {
      title = `${item.title} AI Prompt | ${name}`;
      description = `${item.summary} ${item.access === 'free' ? 'Free, copy-ready architecture prompt with practical production settings.' : 'WORLD ARCH PRO prompt collection.'}`;
      image = absoluteAsset(siteUrl, item.image);
    } else if (isMissing) {
      title = `Page not found | ${name}`;
      description = 'The requested WORLD ARCH JOURNAL page is not available.';
    }

    document.title = title;
    setMeta('meta[name="description"]', { name: 'description', content: description });
    setMeta('meta[property="og:type"]', { property: 'og:type', content: ogType });
    setMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: name });
    setMeta('meta[property="og:locale"]', { property: 'og:locale', content: 'en_GB' });
    setMeta('meta[property="og:title"]', { property: 'og:title', content: title });
    setMeta('meta[property="og:description"]', { property: 'og:description', content: description });
    setMeta('meta[property="og:image"]', { property: 'og:image', content: image });
    setMeta('meta[property="og:image:alt"]', { property: 'og:image:alt', content: item?.imageAlt || `${name} architecture editorial` });
    setMeta('meta[property="og:url"]', { property: 'og:url', content: canonicalUrl });
    setMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
    setMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title });
    setMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description });
    setMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: image });
    const isThinPreview = route?.name === 'prompt' && item?.access === 'premium';
    setMeta('meta[name="robots"]', { name: 'robots', content: !isCanonicalHost || route?.name === 'admin' || isMissing ? 'noindex, nofollow, noarchive' : isThinPreview ? 'noindex, follow, max-image-preview:large' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' });

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;
    document.head.querySelectorAll('link[rel="alternate"][hreflang]').forEach((link) => link.remove());

    const sameAs = [...new Set([brand.instagram, brand.youtube, brand.linkedin, brand.telegram, brand.pinterest, brand.whatsapp, ...(brand.socialLinks || []).map((link) => link.enabled === false ? '' : link.url)]
      .map(socialUrl)
      .filter(Boolean))];
    const publisher = {
      '@type': 'Organization',
      name,
      url: siteUrl,
      logo: { '@type': 'ImageObject', url: absoluteAsset(siteUrl, '/assets/brand/world-arch-wa-mark-v1.png') },
      ...(sameAs.length ? { sameAs } : {}),
    };
    const breadcrumbSchema = (items) => ({
      '@type': 'BreadcrumbList',
      itemListElement: items.map((entry, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: entry.name,
        item: `${siteUrl}${entry.pathname === '/' ? '' : entry.pathname}`,
      })),
    });

    let structuredData = {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name,
      url: siteUrl,
      image,
      description,
      ...(brand.email ? { email: brand.email } : {}),
      ...(brand.phone ? { telephone: brand.phone } : {}),
      ...(sameAs.length ? { sameAs } : {}),
      areaServed: 'International',
      availableLanguage: ['English'],
      serviceType: (content?.services || []).map((service) => service.title),
      ...(brand.founderName ? { founder: { '@type': 'Person', name: brand.founderName, jobTitle: brand.founderRole || 'Founder & Creative Director' } } : {}),
    };

    if (route?.name === 'video-library') {
      structuredData = { '@context': 'https://schema.org', '@graph': [
        { '@type': 'CollectionPage', name: title, description, url: canonicalUrl, inLanguage: 'en', publisher, hasPart: [...publishedVideoStories.map((video) => ({ '@type': 'WebPage', name: video.title, url: `${siteUrl}/videos/${video.slug}/` })), ...watchVideoEntries.map((video) => ({ '@type': 'WebPage', name: video.title, url: `${siteUrl}${watchPagePath(video)}` }))] },
        breadcrumbSchema([{ name: 'Home', pathname: '/' }, { name: 'Videos', pathname: '/videos/' }]),
      ] };
    } else if (route?.name === 'video-story' && item) {
      structuredData = { '@context': 'https://schema.org', '@graph': [
        { '@type': 'VideoObject', name: item.title, description: item.description, thumbnailUrl: [item.thumbnail], uploadDate: item.uploadDate, duration: item.duration, embedUrl: `https://www.youtube-nocookie.com/embed/${item.youtubeId}`, contentUrl: `https://www.youtube.com/shorts/${item.youtubeId}`, mainEntityOfPage: canonicalUrl, publisher },
        breadcrumbSchema([{ name: 'Home', pathname: '/' }, { name: 'Videos', pathname: '/videos/' }, { name: item.title, pathname: normalizedPath }]),
      ] };
    } else if (route?.name === 'presentation-studio') {
      structuredData = { '@context': 'https://schema.org', '@type': 'CollectionPage', name: title, description, url: canonicalUrl, inLanguage: 'en', publisher, about: ['Architecture presentation templates', 'Interior design presentations', 'Facade presentation boards', 'Social media cover systems'] };
    } else if (route?.name === 'design-services') {
      structuredData = { '@context': 'https://schema.org', '@type': 'Service', name: title, description, url: canonicalUrl, image, provider: publisher, areaServed: 'International', availableLanguage: ['English'], serviceType: ['Villa and residential design', 'Floor plan design', 'Facade design', 'Kitchen design', 'Living and reception design', 'Bathroom design', 'Courtyard and garden design', 'Roof garden design', 'Architectural visualisation'] };
    } else if (route?.name === 'custom-plan-design') {
      structuredData = { '@context': 'https://schema.org', '@type': 'ContactPage', name: title, description, url: canonicalUrl, inLanguage: 'en', publisher, about: 'Architecture and interior design project enquiries' };
    } else if (route?.name === 'atlas-villa') {
      structuredData = { '@context': 'https://schema.org', '@type': 'CreativeWork', name: atlasVilla.title, alternateName: 'Residential architectural design study', description, url: canonicalUrl, image, inLanguage: 'en', creator: { '@type': 'Person', name: 'Farnaz Ghaffarian' }, about: ['Residential architecture', 'Villa design', 'Interior concepts', 'Architectural visualisation'], subjectOf: { '@type': 'Product', name: 'Atlas Villa digital project package', url: atlasVilla.etsyUrl }, publisher };
    } else if (route?.name === 'projects-hub') {
      structuredData = { '@context': 'https://schema.org', '@type': 'CollectionPage', name: title, description, url: canonicalUrl, inLanguage: 'en', publisher, hasPart: projects.map((project) => ({ '@type': 'CreativeWork', name: project.title, url: `${siteUrl}${project.detailPath}`, image: absoluteAsset(siteUrl, project.cover) })) };
    } else if (route?.name === 'project' && item) {
      structuredData = { '@context': 'https://schema.org', '@type': 'CreativeWork', name: item.title, description, url: canonicalUrl, image, inLanguage: 'en', creator: { '@type': 'Organization', name: item.studio }, locationCreated: { '@type': 'Place', name: item.location }, associatedMedia: [{ '@type': 'MediaObject', contentUrl: `${siteUrl}${item.tourPath}`, encodingFormat: 'text/html' }, { '@type': 'DigitalDocument', contentUrl: `${siteUrl}${item.guidePath}`, encodingFormat: 'application/pdf' }], publisher };
    } else if (['virtual-tour-the-voids', 'virtual-tour-narbon'].includes(route?.name) && item) {
      structuredData = { '@context': 'https://schema.org', '@graph': [
        { '@type': 'CreativeWork', name: `${item.title} Virtual Architecture Tour`, description, url: canonicalUrl, image, inLanguage: 'en', about: { '@type': 'ArchitecturalStructure', name: item.title, address: item.location }, creator: publisher, isPartOf: { '@type': 'CreativeWork', name: item.title, url: `${siteUrl}${item.detailPath}` } },
        breadcrumbSchema([{ name: 'Home', pathname: '/' }, { name: 'Projects', pathname: '/projects/' }, { name: item.title, pathname: item.detailPath }, { name: 'Virtual tour', pathname: normalizedPath }]),
      ] };
    } else if (['newsletter-hub', 'analysis-hub'].includes(route?.name)) {
      const entries = route.name === 'analysis-hub' ? editorialArticles : newsletterIssues;
      structuredData = { '@context': 'https://schema.org', '@type': 'CollectionPage', name: title, description, url: canonicalUrl, inLanguage: 'en', publisher, hasPart: entries.map((issue) => ({ '@type': 'Article', name: issue.title, url: `${siteUrl}${editorialPath(issue)}` })) };
    } else if (['newsletter-issue', 'analysis-article'].includes(route?.name) && item) {
      const archivePath = route.name === 'newsletter-issue' ? '/newsletter/' : '/magazine/analysis/';
      structuredData = { '@context': 'https://schema.org', '@graph': [
        { '@type': route.name === 'newsletter-issue' ? 'NewsArticle' : 'Article', headline: item.title, description, mainEntityOfPage: canonicalUrl, image: [image], author: { '@type': 'Person', name: item.author, url: `${siteUrl}${item.authorUrl}` }, publisher, datePublished: item.publishedAt, ...(item.updatedAt ? { dateModified: item.updatedAt } : {}), articleSection: item.format, inLanguage: 'en', isAccessibleForFree: true },
        breadcrumbSchema([{ name: 'Home', pathname: '/' }, { name: route.name === 'newsletter-issue' ? 'Newsletter' : 'Analysis', pathname: archivePath }, { name: item.title, pathname: normalizedPath }]),
      ] };
    } else if (route?.name === 'magazine-hub' || (route?.name === 'magazine-category' && item)) {
      const listedArticles = route?.name === 'magazine-hub' ? publishedMagazineArticles : item.articles;
      structuredData = { '@context': 'https://schema.org', '@type': 'CollectionPage', name: title, description, url: canonicalUrl, inLanguage: 'en', publisher, hasPart: listedArticles.map((article) => ({ '@type': 'Article', name: article.title, url: `${siteUrl}/articles/${article.slug}/` })) };
    } else if (route?.name === 'article' && item) {
      structuredData = {
        '@context': 'https://schema.org',
        '@graph': [
          { '@type': 'Article', headline: item.title, description: item.metaDescription || item.excerpt, mainEntityOfPage: canonicalUrl, image: [image], author: { '@type': 'Person', name: item.author || brand.founderName, url: `${siteUrl}/editorial-team/` }, publisher, articleSection: item.category, keywords: (item.tags || []).join(', '), inLanguage: 'en', isAccessibleForFree: true, ...(item.publishedAt ? { datePublished: item.publishedAt } : {}), ...(item.modifiedAt ? { dateModified: item.modifiedAt } : {}) },
          breadcrumbSchema([{ name: 'Home', pathname: '/' }, { name: 'Magazine', pathname: '/magazine/' }, { name: item.title, pathname: normalizedPath }]),
          ...(item.faq?.length ? [{ '@type': 'FAQPage', mainEntity: item.faq.map((entry) => ({ '@type': 'Question', name: entry.question, acceptedAnswer: { '@type': 'Answer', text: entry.answer } })) }] : []),
        ],
      };
    } else if (route?.name === 'magazine' && item) {
      structuredData = { '@context': 'https://schema.org', '@type': 'PublicationIssue', name: item.title, description: item.excerpt, url: canonicalUrl, image, issueNumber: item.number, inLanguage: 'en', publisher, hasPart: (item.features || []).map((feature) => ({ '@type': 'Article', name: feature.title, url: `${siteUrl}/articles/${feature.article?.slug || feature.id}/` })) };
    } else if (route?.name === 'shop') {
      structuredData = { '@context': 'https://schema.org', '@type': 'CollectionPage', name: title, description, url: canonicalUrl, inLanguage: 'en', publisher };
    } else if (route?.name === 'product' && item) {
      const checkoutUrl = validCheckoutUrl(item.gumroadUrl || item.checkoutUrl || item.url);
      const product = checkoutUrl && item.price ? { '@type': 'Product', name: item.title, description: item.metaDescription || item.excerpt, image: [image], url: canonicalUrl, sku: item.id, brand: publisher, offers: { '@type': 'Offer', url: checkoutUrl, price: item.price, priceCurrency: item.currency || 'USD', availability: 'https://schema.org/InStock', itemCondition: 'https://schema.org/NewCondition' } } : { '@type': 'WebPage', name: item.title, description: item.excerpt, url: canonicalUrl, inLanguage: 'en' };
      structuredData = { '@context': 'https://schema.org', '@graph': [product, breadcrumbSchema([{ name: 'Home', pathname: '/' }, { name: 'Shop', pathname: '/shop/' }, { name: item.title, pathname: normalizedPath }])] };
    } else if (route?.name === 'prompt-library') {
      structuredData = { '@context': 'https://schema.org', '@type': 'CollectionPage', name: title, description, url: canonicalUrl, inLanguage: 'en', publisher, hasPart: promptItems.map((prompt) => ({ '@type': 'CreativeWork', name: prompt.title, description: prompt.summary, url: `${siteUrl}/prompts/${prompt.id}/`, image: absoluteAsset(siteUrl, prompt.image), isAccessibleForFree: prompt.access === 'free' })) };
    } else if (route?.name === 'prompt' && item) {
      const creativeWork = { '@type': 'CreativeWork', name: item.title, description, url: canonicalUrl, image, inLanguage: 'en', creator: publisher, isAccessibleForFree: item.access === 'free', learningResourceType: 'Prompt', about: item.category, ...(item.access === 'free' ? { text: item.prompt } : {}) };
      structuredData = { '@context': 'https://schema.org', '@graph': [
        creativeWork,
        breadcrumbSchema([{ name: 'Home', pathname: '/' }, { name: 'AI Prompt Library', pathname: '/prompts/' }, { name: item.title, pathname: normalizedPath }]),
      ] };
    } else if (legalTitle) {
      structuredData = { '@context': 'https://schema.org', '@type': 'WebPage', name: legalTitle, description, url: canonicalUrl, inLanguage: 'en', publisher };
    }

    let script = document.head.querySelector('script[data-eyvan-schema], script[data-static-schema]');
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.removeAttribute('data-static-schema');
    script.dataset.eyvanSchema = 'true';
    script.textContent = JSON.stringify(structuredData);
  }, [content, route]);

  return null;
}
