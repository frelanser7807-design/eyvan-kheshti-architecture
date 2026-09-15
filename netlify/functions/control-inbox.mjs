function reply(status, body) {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
}

function authorized(request) {
  const expected = process.env.AGENT_MANAGER_SHARED_SECRET;
  return Boolean(expected) && request.headers.get('authorization') === `Bearer ${expected}`;
}

const sourceSlugs = ['whatsapp', 'instagram', 'facebook', 'linkedin', 'gmail'];

async function connectionSources() {
  if (!process.env.COMPOSIO_API_KEY) return sourceSlugs.map((slug) => ({ slug, status: 'not_connected', reason: 'composio_not_configured' }));
  const response = await fetch('https://backend.composio.dev/api/v3/connected_accounts?limit=100&account_type=ALL', {
    headers: { 'x-api-key': process.env.COMPOSIO_API_KEY },
    signal: AbortSignal.timeout(30000),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data?.message || 'Composio connection check failed.');
  const accounts = Array.isArray(data.items) ? data.items : [];
  return sourceSlugs.map((slug) => {
    const matches = accounts.filter((item) => String(item?.toolkit?.slug || '').toLowerCase() === slug);
    const active = matches.some((item) => item.status === 'ACTIVE' && !item.is_disabled);
    return { slug, status: active ? 'connected' : matches.length ? 'attention' : 'not_connected', webhook: 'pending_configuration' };
  });
}

export default async function handler(request) {
  if (!authorized(request)) return reply(401, { error: { message: 'کلید ورود پنل صحیح نیست.' } });
  if (request.method !== 'GET') return reply(405, { error: { message: 'GET only.' } });
  try {
    const sources = await connectionSources();
    sources.push({ slug: 'sms', status: 'companion_required', webhook: 'android_only' });
    return reply(200, { items: [], unreadCount: 0, sources, liveInbox: false, reason: 'webhooks_and_durable_store_required', checkedAt: new Date().toISOString() });
  } catch (error) {
    return reply(503, { error: { message: error instanceof Error ? error.message : 'Inbox check failed.' } });
  }
}
