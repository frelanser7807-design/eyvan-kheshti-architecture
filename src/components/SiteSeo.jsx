import { useEffect } from 'react';

function setMeta(selector, attributes) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
}

function socialUrl(value) {
  const candidate = String(value || '').trim();
  if (!/^https?:\/\//i.test(candidate)) return '';
  try { return new URL(candidate).href; } catch { return ''; }
}

export default function SiteSeo({ content }) {
  useEffect(() => {
    const brand = content?.brand || {};
    const name = brand.name || 'Eyvan Kheshti';
    const title = `${name} | Architecture & Interior Design Studio`;
    const description = brand.heroDescription || 'International architecture, interior design, facade design and architectural visualisation.';
    const siteUrl = String(import.meta.env.VITE_SITE_URL || '').replace(/\/$/, '');
    const imagePath = '/assets/candidates/office-world/scene-00-bishopsgate-tower-entry-v1.png';
    document.title = title;
    setMeta('meta[name="description"]', { name: 'description', content: description });
    setMeta('meta[property="og:title"]', { property: 'og:title', content: title });
    setMeta('meta[property="og:description"]', { property: 'og:description', content: description });
    setMeta('meta[property="og:image"]', { property: 'og:image', content: siteUrl ? `${siteUrl}${imagePath}` : imagePath });
    setMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title });
    setMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description });

    if (siteUrl) {
      let canonical = document.head.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
      }
      canonical.href = siteUrl;
      setMeta('meta[property="og:url"]', { property: 'og:url', content: siteUrl });
    }

    const sameAs = [brand.instagram, brand.youtube, brand.linkedin, brand.telegram, brand.pinterest, ...(brand.socialLinks || []).map((item) => item.enabled === false ? '' : item.url)]
      .map(socialUrl)
      .filter(Boolean);
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name,
      description,
      ...(siteUrl ? { url: siteUrl, image: `${siteUrl}${imagePath}` } : {}),
      ...(brand.email ? { email: brand.email } : {}),
      ...(brand.phone ? { telephone: brand.phone } : {}),
      ...(sameAs.length ? { sameAs } : {}),
      areaServed: 'International',
      availableLanguage: ['English', 'Persian'],
      serviceType: (content?.services || []).map((service) => service.title),
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Architecture and design services',
        itemListElement: (content?.services || []).map((service, index) => ({
          '@type': 'Offer',
          position: index + 1,
          itemOffered: { '@type': 'Service', name: service.title, description: service.text },
        })),
      },
      ...(brand.founderName ? { founder: { '@type': 'Person', name: brand.founderName, jobTitle: brand.founderRole || 'Founder & Creative Director' } } : {}),
    };
    let script = document.head.querySelector('script[data-eyvan-schema]');
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.dataset.eyvanSchema = 'true';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(structuredData);
  }, [content]);

  return null;
}
