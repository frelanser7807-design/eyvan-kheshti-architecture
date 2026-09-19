function requireKey() {
  const key = String(process.env.COMPOSIO_API_KEY || '').trim();
  if (!key.startsWith('ak_') || key.length < 20) {
    throw new Error('COMPOSIO_API_KEY is unavailable. Start the agent with local-agent/start.ps1.');
  }
  return key;
}

export async function listConnectedAccounts(config, fetchImpl = fetch) {
  if (!config?.enabled) throw new Error('Composio is disabled in local-agent/config.json.');
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), config.requestTimeoutMs || 15000);
  try {
    const url = new URL('/api/v3/connected_accounts', config.baseUrl);
    url.searchParams.set('limit', '100');
    const response = await fetchImpl(url, {
      headers: { 'x-api-key': requireKey(), accept: 'application/json' },
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`Composio returned HTTP ${response.status}.`);
    const payload = await response.json();
    const items = Array.isArray(payload?.items) ? payload.items : [];
    return {
      connected: true,
      total: items.length,
      accounts: items.map((item) => ({
        id: item.id,
        toolkit: item.toolkit?.slug || 'unknown',
        status: item.status || 'UNKNOWN',
        disabled: Boolean(item.is_disabled),
      })),
    };
  } finally {
    clearTimeout(timer);
  }
}
