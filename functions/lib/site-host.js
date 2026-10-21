export const canonicalOrigin = 'https://worldarchjournal.com';

const retiredHosts = new Set([
  'www.worldarchjournal.com',
  'world-arch-journal.pages.dev',
  'world-arch-journal-by-farnaz.netlify.app',
]);

// Redirect only known production aliases. Preview deployments stay usable for QA.
export function canonicalRedirect(request) {
  const url = new URL(request.url);
  if (!['GET', 'HEAD'].includes(request.method)) return null;
  if (!retiredHosts.has(url.hostname) && !(url.hostname === 'worldarchjournal.com' && url.protocol !== 'https:')) return null;
  url.protocol = 'https:';
  url.host = 'worldarchjournal.com';
  url.port = '';
  return new Response(null, { status: 301, headers: { Location: url.href } });
}

export function applyHostIndexing(request, response) {
  const host = new URL(request.url).hostname;
  if (host === 'worldarchjournal.com') return response;
  const headers = new Headers(response.headers);
  headers.set('X-Robots-Tag', 'noindex, follow');
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}
