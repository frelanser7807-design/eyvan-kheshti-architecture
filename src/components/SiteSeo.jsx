import { useEffect } from 'react';
import { assetUrl } from '../lib/assetUrl.js';
import { publishedMagazineArticles } from '../data/magazineCategories.js';
import { promptItems } from '../data/promptLibrary.js';

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
    return url.protocol === 'https:' && /(^|\.)gumroad\.com$/i.test(url.hostname) ? url.href : '';
  } catch { return ''; }
}

const legalTitles = {
  '/privacy/': 'Privacy Policy',
  '/terms/': 'Terms of Use',
  '/affiliate-disclosure/': 'Affiliate Disclosure',
  '/editorial-policy/': 'Editorial Policy',
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
    const isMissing = ['article', 'magazine', 'magazine-category', 'product', 'prompt'].includes(route?.name) && !item;

    let title = 'WORLD ARCH JOURNAL | Facade, Spatial Design & Visualisation';
    let description = 'Explore global architecture, bespoke facade design, spatial design, architectural visualisation, BIM and Revit resources, original magazines and evidence-led research by Farnaz Ghaffarian.';
    let image = absoluteAsset(siteUrl, DEFAULT_IMAGE);
    let ogType = 'website';

    if (legalTitle) {
      title = `${legalTitle} | ${name}`;
      description = `${legalTitle} for the WORLD ARCH JOURNAL architecture platform.`;
    } else if (route?.name === 'magazine-hub') {
      title = `Architecture Magazine | ${name}`;
      description = 'Read original, evidence-led architecture stories on climate design, facades, adaptive reuse and concept studies in World Arch Journal.';
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
    } else if (route?.name === 'shop') {
      title = `Architecture Shop | ${name}`;
      description = 'Original BIM and Revit resources, architecture e-books and learning products by WORLD ARCH JOURNAL.';
    } else if (route?.name === 'product' && item) {
      title = `${item.title} | ${name}`;
      description = item.excerpt;
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
    setMeta('meta[name="robots"]', { name: 'robots', content: route?.name === 'admin' || isMissing ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' });

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

    if (route?.name === 'magazine-hub' || (route?.name === 'magazine-category' && item)) {
      const listedArticles = route?.name === 'magazine-hub' ? publishedMagazineArticles : item.articles;
      structuredData = { '@context': 'https://schema.org', '@type': 'CollectionPage', name: title, description, url: canonicalUrl, inLanguage: 'en', publisher, hasPart: listedArticles.map((article) => ({ '@type': 'Article', name: article.title, url: `${siteUrl}/articles/${article.slug}/` })) };
    } else if (route?.name === 'article' && item) {
      structuredData = {
        '@context': 'https://schema.org',
        '@graph': [
          { '@type': 'Article', headline: item.title, description: item.metaDescription || item.excerpt, mainEntityOfPage: canonicalUrl, image: [image], author: { '@type': 'Person', name: item.author || brand.founderName }, publisher, articleSection: item.category, keywords: (item.tags || []).join(', '), inLanguage: 'en', ...(item.publishedAt ? { datePublished: item.publishedAt } : {}), ...(item.modifiedAt ? { dateModified: item.modifiedAt } : {}) },
          ...(item.faq?.length ? [{ '@type': 'FAQPage', mainEntity: item.faq.map((entry) => ({ '@type': 'Question', name: entry.question, acceptedAnswer: { '@type': 'Answer', text: entry.answer } })) }] : []),
        ],
      };
    } else if (route?.name === 'magazine' && item) {
      structuredData = { '@context': 'https://schema.org', '@type': 'PublicationIssue', name: item.title, description: item.excerpt, url: canonicalUrl, image, issueNumber: item.number, inLanguage: 'en', publisher, hasPart: (item.features || []).map((feature) => ({ '@type': 'Article', name: feature.title, url: `${siteUrl}/articles/${feature.article?.slug || feature.id}/` })) };
    } else if (route?.name === 'shop') {
      structuredData = { '@context': 'https://schema.org', '@type': 'CollectionPage', name: title, description, url: canonicalUrl, inLanguage: 'en', publisher };
    } else if (route?.name === 'product' && item) {
      const checkoutUrl = validCheckoutUrl(item.gumroadUrl || item.checkoutUrl || item.url);
      structuredData = checkoutUrl && item.price ? { '@context': 'https://schema.org', '@type': 'Product', name: item.title, description: item.excerpt, image: [image], url: canonicalUrl, brand: publisher, offers: { '@type': 'Offer', url: checkoutUrl, price: item.price, priceCurrency: item.currency || 'USD', availability: 'https://schema.org/InStock' } } : { '@context': 'https://schema.org', '@type': 'WebPage', name: item.title, description: item.excerpt, url: canonicalUrl, inLanguage: 'en' };
    } else if (route?.name === 'prompt-library') {
      structuredData = { '@context': 'https://schema.org', '@type': 'CollectionPage', name: title, description, url: canonicalUrl, inLanguage: 'en', publisher, hasPart: promptItems.map((prompt) => ({ '@type': 'CreativeWork', name: prompt.title, description: prompt.summary, url: `${siteUrl}/prompts/${prompt.id}/`, image: absoluteAsset(siteUrl, prompt.image), isAccessibleForFree: prompt.access === 'free' })) };
    } else if (route?.name === 'prompt' && item) {
      structuredData = { '@context': 'https://schema.org', '@type': 'CreativeWork', name: item.title, description, url: canonicalUrl, image, inLanguage: 'en', creator: publisher, isAccessibleForFree: item.access === 'free', learningResourceType: 'Prompt', about: item.category, ...(item.access === 'free' ? { text: item.prompt } : {}) };
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
