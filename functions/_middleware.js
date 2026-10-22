import { canonicalRedirect, applyHostIndexing } from './lib/site-host.js';

export async function onRequest(context) {
  const redirect = canonicalRedirect(context.request);
  if (redirect) return redirect;
  return applyHostIndexing(context.request, await context.next());
}
