import { defaultContent } from '../data/defaultContent.js';

const CONTENT_KEY = 'eyvan_kheshti_content_v2';
const LEADS_KEY = 'eyvan_kheshti_leads_v2';
const SUBSCRIBERS_KEY = 'eyvan_kheshti_subscribers_v1';
const DATA_EVENT = 'eyvan-kheshti:data-changed';
const apiBase = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
const remoteMode = import.meta.env.VITE_DATA_MODE === 'remote' && Boolean(apiBase);

const clone = (value) => JSON.parse(JSON.stringify(value));

function normalizeSocialLinks(value) {
  const savedLinks = Array.isArray(value) ? value : [];
  const savedByKey = new Map(savedLinks.flatMap((item) => [item?.id, item?.platform].filter(Boolean).map((key) => [key, item])));
  const knownKeys = new Set(defaultContent.brand.socialLinks.flatMap((item) => [item.id, item.platform]));
  const links = defaultContent.brand.socialLinks.map((fallback) => {
    const saved = savedByKey.get(fallback.id) || savedByKey.get(fallback.platform) || {};
    const merged = { ...fallback, ...saved };
    if (fallback.id === 'linkedin') {
      merged.url = fallback.url;
      merged.enabled = true;
      merged.status = 'active';
    }
    if (!String(saved.url || '').trim() && fallback.url) {
      merged.url = fallback.url;
      merged.enabled = true;
      merged.status = fallback.status || 'active';
    }
    return merged;
  });
  const extras = savedLinks.filter((item) => item?.id && !knownKeys.has(item.id) && !knownKeys.has(item.platform));
  return [...links, ...extras];
}

function normalizeContent(value = {}) {
  const savedServices = Array.isArray(value.services) ? value.services : [];
  const savedById = new Map(savedServices.map((service) => [service.id, service]));
  const knownIds = new Set(defaultContent.services.map((service) => service.id));
  const services = defaultContent.services.map((fallback, index) => ({
    ...fallback,
    ...(savedById.get(fallback.id) || savedServices[index] || {}),
  }));
  const extraServices = savedServices.filter((service) => service?.id && !knownIds.has(service.id));

  // Keep newly released catalogue items visible when a visitor already has an
  // older saved copy of the site content in localStorage (or the remote CMS).
  const savedProducts = Array.isArray(value.products) ? value.products : [];
  const savedProductsByKey = new Map(
    savedProducts.flatMap((product) => [product?.id, product?.slug].filter(Boolean).map((key) => [key, product])),
  );
  const knownProductKeys = new Set(
    defaultContent.products.flatMap((product) => [product?.id, product?.slug].filter(Boolean)),
  );
  const products = defaultContent.products.map((fallback) => ({
    ...fallback,
    ...(savedProductsByKey.get(fallback.id) || savedProductsByKey.get(fallback.slug) || {}),
  }));
  const extraProducts = savedProducts.filter(
    (product) =>
      product?.id &&
      !knownProductKeys.has(product.id) &&
      (!product.slug || !knownProductKeys.has(product.slug)),
  );

  const savedBrand = value.brand || {};
  const brand = { ...defaultContent.brand, ...savedBrand };
  brand.linkedin = defaultContent.brand.linkedin;
  for (const key of ['name', 'latinName', 'founderName', 'founderRole', 'heroDescription']) {
    brand[key] = defaultContent.brand[key];
  }
  for (const key of ['whatsapp', 'instagram', 'youtube', 'pinterest']) {
    if (!String(brand[key] || '').trim()) brand[key] = defaultContent.brand[key];
  }
  if (brand.name === 'WORLD ARCH' || brand.name === 'EYVAN KHESHTI') brand.name = defaultContent.brand.name;
  brand.socialLinks = normalizeSocialLinks(savedBrand.socialLinks);
  if (brand.city === 'LONDON / INTERNATIONAL' && brand.cityFa === 'لندن / بین‌المللی') {
    brand.city = defaultContent.brand.city;
    brand.cityFa = defaultContent.brand.cityFa;
  }

  return {
    ...clone(defaultContent),
    ...value,
    brand,
    projects: Array.isArray(value.projects) ? value.projects : clone(defaultContent.projects),
    services: [...services, ...extraServices],
    tutorials: Array.isArray(value.tutorials) ? value.tutorials : clone(defaultContent.tutorials),
    insights: Array.isArray(value.insights) ? value.insights : clone(defaultContent.insights),
    guides: Array.isArray(value.guides) ? value.guides : clone(defaultContent.guides),
    library: Array.isArray(value.library) ? value.library : clone(defaultContent.library),
    ebooks: Array.isArray(value.ebooks) ? value.ebooks : clone(defaultContent.ebooks),
    products: [...products, ...extraProducts],
    story: Array.isArray(value.story) ? value.story.map((item) => {
      if (item.id !== 'arrival') return item;
      const identity = defaultContent.story.find((story) => story.id === 'arrival');
      return { ...item, code: identity.code, title: identity.title, lines: clone(identity.lines), text: identity.text };
    }) : clone(defaultContent.story),
    commerce: {
      ...defaultContent.commerce,
      ...(value.commerce || {}),
      providers: Array.isArray(value.commerce?.providers) ? value.commerce.providers : clone(defaultContent.commerce.providers),
    },
    monetization: { ...defaultContent.monetization, ...(value.monetization || {}) },
    settings: { ...defaultContent.settings, ...(value.settings || {}) },
  };
}

async function apiRequest(path, options = {}) {
  const response = await fetch(apiBase + path, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
  });
  if (!response.ok) throw new Error('API ' + response.status);
  return response.status === 204 ? null : response.json();
}

export async function getContent() {
  if (remoteMode) return normalizeContent(await apiRequest('/v1/site-content'));
  const saved = localStorage.getItem(CONTENT_KEY);
  return saved ? normalizeContent(JSON.parse(saved)) : clone(defaultContent);
}

export async function saveContent(content) {
  if (remoteMode) return apiRequest('/v1/site-content', { method: 'PUT', body: JSON.stringify(content) });
  localStorage.setItem(CONTENT_KEY, JSON.stringify(content));
  window.dispatchEvent(new CustomEvent(DATA_EVENT));
  return content;
}

export async function resetContent() {
  if (remoteMode) throw new Error('بازنشانی محتوای راه‌دور از پنل غیرفعال است.');
  localStorage.removeItem(CONTENT_KEY);
  window.dispatchEvent(new CustomEvent(DATA_EVENT));
  return clone(defaultContent);
}

export async function getLeads() {
  if (remoteMode) return apiRequest('/v1/leads');
  return JSON.parse(localStorage.getItem(LEADS_KEY) || '[]');
}

export async function deleteLead(id) {
  if (!id) throw new Error('missing-lead-id');
  if (remoteMode) return apiRequest(`/v1/leads/${encodeURIComponent(id)}`, { method: 'DELETE' });
  const leads = await getLeads();
  localStorage.setItem(LEADS_KEY, JSON.stringify(leads.filter((lead) => lead.id !== id)));
  return null;
}

export async function submitLead(payload) {
  const leadPayload = {
    name: String(payload?.name || '').trim(),
    contact: String(payload?.contact || '').trim(),
    projectType: String(payload?.projectType || 'Other').trim(),
    message: String(payload?.message || '').trim(),
  };
  if (leadPayload.name.length < 2 || leadPayload.contact.length < 3) throw new Error('invalid-lead');
  if (remoteMode) return apiRequest('/v1/leads', { method: 'POST', body: JSON.stringify(leadPayload) });
  const leads = await getLeads();
  const lead = { ...leadPayload, id: crypto.randomUUID(), status: 'new', createdAt: new Date().toISOString() };
  localStorage.setItem(LEADS_KEY, JSON.stringify([lead, ...leads]));
  return lead;
}

export async function getSubscribers() {
  if (remoteMode) return apiRequest('/v1/subscribers');
  return JSON.parse(localStorage.getItem(SUBSCRIBERS_KEY) || '[]');
}

export async function deleteSubscriber(id) {
  if (!id) throw new Error('missing-subscriber-id');
  if (remoteMode) return apiRequest(`/v1/subscribers/${encodeURIComponent(id)}`, { method: 'DELETE' });
  const subscribers = await getSubscribers();
  localStorage.setItem(SUBSCRIBERS_KEY, JSON.stringify(subscribers.filter((subscriber) => subscriber.id !== id)));
  return null;
}

export async function submitSubscriber(email, consent = false, website = '') {
  const normalized = String(email || '').trim().toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(normalized)) throw new Error('invalid-email');
  if (!consent) throw new Error('consent-required');
  const response = await fetch('/api/newsletter/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: normalized, consent: true, website: String(website || '') }),
  });
  if (!response.ok) throw new Error('newsletter-unavailable');
  return response.json();
}

export async function createCheckout(payload) {
  if (!remoteMode) throw new Error('checkout-not-connected');
  return apiRequest('/v1/checkout-sessions', { method: 'POST', body: JSON.stringify(payload) });
}

export function subscribeToContent(callback) {
  const handler = () => callback();
  window.addEventListener(DATA_EVENT, handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener(DATA_EVENT, handler);
    window.removeEventListener('storage', handler);
  };
}

export const dataMode = remoteMode ? 'remote' : 'local-preview';
