import { onRequestPost as subscribe } from './api/newsletter/subscribe.js';
import { onRequestGet as confirmGet, onRequestPost as confirmPost } from './api/newsletter/confirm.js';
import { onRequestGet as unsubscribeGet, onRequestPost as unsubscribePost } from './api/newsletter/unsubscribe.js';
import { canonicalRedirect, applyHostIndexing } from './lib/site-host.js';
import { searchRobots } from './lib/search-robots.js';

const handlers = {
  '/api/newsletter/subscribe': { POST: subscribe },
  '/api/newsletter/confirm': { GET: confirmGet, POST: confirmPost },
  '/api/newsletter/unsubscribe': { GET: unsubscribeGet, POST: unsubscribePost },
};

export default {
  async fetch(request, env, ctx) {
    const redirect = canonicalRedirect(request);
    if (redirect) return redirect;
    const path = new URL(request.url).pathname;
    if (path === '/robots.txt' && ['GET', 'HEAD'].includes(request.method)) {
      return applyHostIndexing(request, new Response(request.method === 'HEAD' ? null : searchRobots, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=0, must-revalidate' },
      }));
    }
    const route = handlers[path];
    if (!route) return applyHostIndexing(request, await env.ASSETS.fetch(request));
    const handler = route[request.method];
    if (!handler) return new Response('Method not allowed', { status: 405, headers: { Allow: Object.keys(route).join(', ') } });
    return handler({ request, env, ctx });
  },
};
