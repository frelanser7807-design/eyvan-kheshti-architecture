export function assetUrl(value) {
  const path = String(value || '').trim();
  if (!path || /^(?:https?:|data:|blob:)/i.test(path)) return path;
  const base = String(import.meta.env.BASE_URL || '/').replace(/\/$/, '');
  if (base === '' || base === '/') return path.startsWith('/') ? path : `/${path}`;
  return `${base}/${path.replace(/^\/+/, '')}`;
}
