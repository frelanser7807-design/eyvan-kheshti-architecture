function reply(status, body) {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
}

function authorized(request) {
  const expected = process.env.AGENT_MANAGER_SHARED_SECRET;
  return Boolean(expected) && request.headers.get('authorization') === `Bearer ${expected}`;
}

function safePrompt(input) {
  const value = String(input || '').trim();
  if (value.length < 8 || value.length > 12000) throw new Error('فرمان باید بین ۸ تا ۱۲۰۰۰ نویسه باشد.');
  return value;
}

const CONTROL_CHANNELS = ['whatsapp', 'youtube', 'instagram', 'facebook', 'linkedin', 'pinterest', 'netlify', 'gmail'];

async function listComposioConnections() {
  if (!process.env.COMPOSIO_API_KEY) throw new Error('Composio هنوز در محیط امن سایت تنظیم نشده است.');
  const response = await fetch('https://backend.composio.dev/api/v3/connected_accounts?limit=100&account_type=ALL', {
    headers: { 'x-api-key': process.env.COMPOSIO_API_KEY },
    signal: AbortSignal.timeout(30000),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data?.message || 'وضعیت اتصال‌های Composio دریافت نشد.');
  const items = Array.isArray(data.items) ? data.items : [];
  return CONTROL_CHANNELS.map((slug) => {
    const matches = items.filter((item) => String(item?.toolkit?.slug || '').toLowerCase() === slug);
    const active = matches.find((item) => item.status === 'ACTIVE' && !item.is_disabled);
    return {
      slug,
      status: active ? 'connected' : matches.length ? 'attention' : 'not_connected',
      accountCount: matches.length,
      connectedAccountId: active?.id || null,
    };
  });
}

async function callGemini(prompt, references = []) {
  if (!process.env.GEMINI_API_KEY || !process.env.GEMINI_MODEL) throw new Error('Gemini هنوز در محیط امن سایت تنظیم نشده است.');
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(process.env.GEMINI_MODEL)}:generateContent`;
  const parts = [{ text: prompt }, ...references.map((item) => ({ inline_data: { mime_type: item.mimeType, data: item.data } }))];
  const response = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY }, body: JSON.stringify({ contents: [{ role: 'user', parts }] }), signal: AbortSignal.timeout(90000) });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data?.error?.message || 'Gemini پاسخ نداد.');
  return (data?.candidates?.[0]?.content?.parts || []).map((part) => part.text || '').join('\n');
}

async function callOpenAI(prompt, references = []) {
  if (!process.env.OPENAI_API_KEY || !process.env.OPENAI_MODEL) throw new Error('GPT API هنوز در محیط امن سایت تنظیم نشده است.');
  const content = [{ type: 'input_text', text: prompt }, ...references.map((item) => ({ type: 'input_image', image_url: `data:${item.mimeType};base64,${item.data}` }))];
  const response = await fetch('https://api.openai.com/v1/responses', { method: 'POST', headers: { 'content-type': 'application/json', authorization: `Bearer ${process.env.OPENAI_API_KEY}` }, body: JSON.stringify({ model: process.env.OPENAI_MODEL, input: [{ role: 'user', content }] }), signal: AbortSignal.timeout(90000) });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data?.error?.message || 'GPT پاسخ نداد.');
  if (typeof data.output_text === 'string') return data.output_text;
  return (data.output || []).flatMap((item) => item.content || []).map((part) => part.text || '').join('\n');
}

async function callAnthropic(prompt, references = []) {
  if (!process.env.ANTHROPIC_API_KEY || !process.env.ANTHROPIC_MODEL) throw new Error('Claude API هنوز در محیط امن سایت تنظیم نشده است.');
  const content = [{ type: 'text', text: prompt }, ...references.map((item) => ({ type: 'image', source: { type: 'base64', media_type: item.mimeType, data: item.data } }))];
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: process.env.ANTHROPIC_MODEL, max_tokens: 4096, messages: [{ role: 'user', content }] }),
    signal: AbortSignal.timeout(90000),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data?.error?.message || 'Claude پاسخ نداد.');
  return (data.content || []).filter((item) => item.type === 'text').map((item) => item.text || '').join('\n');
}

async function ollamaModels() {
  const base = String(process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434').replace(/\/$/, '');
  const response = await fetch(`${base}/api/tags`, { signal: AbortSignal.timeout(5000) });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error('هوش مصنوعی رایگان محلی در دسترس نیست.');
  return Array.isArray(data.models) ? data.models.map((item) => item.name).filter(Boolean) : [];
}

async function callOllama(prompt) {
  const base = String(process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434').replace(/\/$/, '');
  const available = await ollamaModels();
  const preferred = String(process.env.OLLAMA_MODEL || 'qwen3:4b');
  const model = available.find((name) => name === preferred) || available.find((name) => name.startsWith(`${preferred}:`)) || available[0];
  if (!model) throw new Error('مدل رایگان محلی هنوز در حال دانلود است؛ بعد از پایان دانلود دوباره امتحان کنید.');
  const response = await fetch(`${base}/api/chat`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ model, stream: false, messages: [{ role: 'user', content: prompt }], options: { temperature: 0.35 } }),
    signal: AbortSignal.timeout(180000),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data?.error || 'مدل رایگان محلی پاسخ نداد.');
  return String(data?.message?.content || '').trim();
}

async function providerStatus() {
  let localModels = [];
  try { localModels = await ollamaModels(); } catch {}
  return {
    ollama: { configured: localModels.length > 0, freeLocal: true, models: localModels },
    gemini: { configured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_MODEL) },
    openai: { configured: Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_MODEL) },
    anthropic: { configured: Boolean(process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_MODEL) },
  };
}

async function createGeminiImage(prompt, references = []) {
  if (!process.env.GEMINI_API_KEY) throw new Error('کلید Gemini برای تولید تصویر در محیط امن سایت تنظیم نشده است.');
  const model = process.env.GEMINI_IMAGE_MODEL || 'gemini-3.1-flash-image';
  const parts = [{ text: prompt }, ...references.map((item) => ({ inlineData: { mimeType: item.mimeType, data: item.data } }))];
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, { method: 'POST', headers: { 'content-type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY }, body: JSON.stringify({ contents: [{ role: 'user', parts }], generationConfig: { responseModalities: ['IMAGE'] } }), signal: AbortSignal.timeout(120000) });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data?.error?.message || 'تولید تصویر Gemini انجام نشد.');
  return (data.candidates || []).flatMap((candidate) => candidate.content?.parts || []).map((part) => part.inlineData || part.inline_data).filter((item) => item?.data).map((item) => ({ mimeType: item.mimeType || item.mime_type || 'image/png', data: item.data }));
}

export default async function handler(request) {
  if (!authorized(request)) return reply(401, { error: { message: 'کلید ورود پنل صحیح نیست.' } });
  if (request.method === 'GET') {
    try {
      const [connections, providers] = await Promise.all([listComposioConnections(), providerStatus()]);
      return reply(200, { connections, providers, checkedAt: new Date().toISOString() });
    } catch (error) {
      return reply(503, { error: { message: error instanceof Error ? error.message : 'Connection check failed.' } });
    }
  }
  if (request.method !== 'POST') return reply(405, { error: { message: 'GET or POST only.' } });
  try {
    const body = await request.json();
    const prompt = safePrompt(body.prompt);
    const provider = ['ollama', 'gemini', 'openai', 'anthropic', 'all'].includes(body.provider) ? body.provider : 'ollama';
    const destination = String(body.destination || 'draft');
    const references = Array.isArray(body.references) ? body.references.slice(0, 12).filter((item) => /^image\//.test(item?.mimeType || '') && typeof item?.data === 'string' && item.data.length < 2_000_000) : [];
    const magazineSpec = destination === 'magazine' ? `\nMAGAZINE FACTORY REQUIREMENTS\nAnalyze the reference material's high-level editorial system without copying protected wording, logos, photographs, or distinctive page artwork. Produce a complete original issue package with: issue thesis and audience; cover direction; table of contents; page-by-page flatplan; editor's letter; project facts; design narrative; spatial/technical analysis; diagram and drawing briefs; image list with captions and rights status; complete English copy for every page; credits and cited sources; SEO title, description and schema notes; website article extracts; YouTube, Instagram, LinkedIn, Pinterest and Facebook launch copy; and a final production/quality checklist. Clearly label any missing factual input instead of inventing it.` : '';
    const articleSpec = destination === 'article' ? `\nINTERNATIONAL ARTICLE REQUIREMENTS\nWrite for an international English-speaking architecture audience. Return a search-friendly slug; SEO title (maximum 60 characters); meta description (150–160 characters); primary and supporting keywords; H1/H2 structure; complete original article; cited source links; image placement plan with captions and descriptive alt text; media-rights status; Article JSON-LD schema notes; canonical URL and EN/FA hreflang notes; website excerpt; and launch copy for Instagram, YouTube, LinkedIn, Pinterest and Facebook. Never invent project facts, sources, measurements, credits or URLs; label missing inputs for review.` : '';
    const system = `You are the private content operator for World Arch Journal. Destination: ${destination}. The owner may write in Persian; understand Persian commands and explain status, errors and next steps in Persian. Deliverables for the international website and social channels should be in polished English unless the owner explicitly requests Persian. Produce an original, factual draft. Never claim publication. Never publish, send, buy, delete, or modify an external account. Mark uncertain facts, missing sources, URLs and media-rights issues for human review.${articleSpec}${magazineSpec}`;
    const fullPrompt = `${system}\n\nOWNER REQUEST\n${prompt}`;
    const providerMap = { gemini: callGemini, openai: callOpenAI, anthropic: callAnthropic };
    if (provider === 'ollama') {
      const text = await callOllama(fullPrompt);
      return reply(200, { mode: 'draft_only', destination, outputs: [{ provider: 'ollama', text }], council: [], councilComplete: false, errors: [], images: [], referenceCount: references.length, publication: { allowed: false, humanApprovalRequired: true }, createdAt: new Date().toISOString() });
    }
    const jobs = provider === 'all' ? Object.entries(providerMap) : [[provider, providerMap[provider]]];
    const settled = await Promise.allSettled(jobs.map(async ([name, run]) => ({ provider: name, text: await run(fullPrompt, references) })));
    const outputs = settled.filter((item) => item.status === 'fulfilled').map((item) => item.value);
    const errors = settled.flatMap((item, index) => item.status === 'rejected' ? [{ provider: jobs[index][0], message: item.reason?.message || 'Provider failed.' }] : []);
    if (!outputs.length) return reply(503, { error: { message: errors.map((item) => item.message).join(' | ') }, errors });
    let council = [];
    if (provider === 'all' && outputs.length === 3) {
      const proposals = outputs.map((item) => `--- ${item.provider.toUpperCase()} PROPOSAL ---\n${item.text}`).join('\n\n');
      const councilPrompt = `${system}\n\nAI COUNCIL ROUND\nAll three initial proposals are below. Review them together. Return a concise final recommendation with: DECISION, WHY, RISKS, NEXT ACTION, CONFIDENCE. Prefer factual agreement; explicitly name unresolved disagreement.\n\n${proposals}`;
      const councilSettled = await Promise.allSettled(Object.entries(providerMap).map(async ([name, run]) => ({ provider: name, text: await run(councilPrompt, references) })));
      council = councilSettled.filter((item) => item.status === 'fulfilled').map((item) => item.value);
      councilSettled.forEach((item, index) => {
        if (item.status === 'rejected') errors.push({ provider: `${Object.keys(providerMap)[index]}-council`, message: item.reason?.message || 'Council review failed.' });
      });
    }
    let images = [];
    if (body.generateImage) {
      try {
        images = await createGeminiImage(`${prompt}\nCreate an original World Arch Journal visual informed by the reference's high-level composition only. Do not copy logos, text, distinctive protected artwork, or a real person's identity.`, references);
      } catch (error) {
        errors.push({ provider: 'gemini-image', message: error instanceof Error ? error.message : 'Image generation failed.' });
      }
    }
    return reply(200, { mode: 'draft_only', destination, outputs, council, councilComplete: council.length === 3, errors, images, referenceCount: references.length, publication: { allowed: false, humanApprovalRequired: true }, createdAt: new Date().toISOString() });
  } catch (error) {
    return reply(400, { error: { message: error instanceof Error ? error.message : 'Invalid request.' } });
  }
}
