function reply(status, body) {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
}

function authorized(request) {
  const expected = process.env.AGENT_MANAGER_SHARED_SECRET;
  return Boolean(expected) && request.headers.get('authorization') === `Bearer ${expected}`;
}

const actionTools = {
  facebook: { slug: 'FACEBOOK_CREATE_POST', label: 'انتشار پست در صفحه Facebook' },
  linkedin: { slug: 'LINKEDIN_CREATE_LINKED_IN_POST', label: 'انتشار پست در LinkedIn' },
  pinterest: { slug: 'PINTEREST_CREATE_PIN', label: 'ساخت Pin در Pinterest' },
  whatsapp: { slug: 'WHATSAPP_SEND_MESSAGE', label: 'ارسال پیام WhatsApp' },
  youtube: { slug: 'YOUTUBE_MULTIPART_UPLOAD_VIDEO', label: 'بارگذاری ویدئو در YouTube' },
};

function cleanCommand(value) {
  const text = String(value || '').trim();
  if (text.length < 8 || text.length > 6000) throw new Error('فرمان اجرایی باید بین ۸ تا ۶۰۰۰ نویسه باشد.');
  return text;
}

async function activeAccount(toolkit) {
  const response = await fetch('https://backend.composio.dev/api/v3/connected_accounts?limit=100&account_type=ALL', {
    headers: { 'x-api-key': process.env.COMPOSIO_API_KEY },
    signal: AbortSignal.timeout(30000),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload?.message || 'حساب‌های متصل Composio دریافت نشدند.');
  const matches = (Array.isArray(payload.items) ? payload.items : []).filter((item) =>
    String(item?.toolkit?.slug || '').toLowerCase() === toolkit && item.status === 'ACTIVE' && !item.is_disabled);
  return matches.find((item) => item.is_default) || matches[0] || null;
}

async function execute(action, command) {
  if (!process.env.COMPOSIO_API_KEY) throw new Error('کلید محدود Composio در سرور تنظیم نشده است.');
  const account = await activeAccount(action.toolkit);
  if (!account) throw new Error(`حساب فعال ${action.toolkit} در Composio پیدا نشد.`);
  const response = await fetch(`https://backend.composio.dev/api/v3.1/tools/execute/${encodeURIComponent(action.slug)}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': process.env.COMPOSIO_API_KEY },
    body: JSON.stringify({ connected_account_id: account.id, version: 'latest', text: command }),
    signal: AbortSignal.timeout(120000),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload?.message || payload?.error || `اجرای ${action.label} ناموفق بود.`);
  return payload;
}

export default async function handler(request) {
  if (!authorized(request)) return reply(401, { error: { message: 'کلید ورود پنل صحیح نیست.' } });
  if (request.method !== 'POST') return reply(405, { error: { message: 'POST only.' } });
  try {
    const body = await request.json();
    const destination = String(body.destination || '').toLowerCase();
    const config = actionTools[destination];
    if (!config) throw new Error('این مقصد هنوز اجرای مستقیم ندارد؛ ابتدا پیش‌نویس را بسازید.');
    const command = cleanCommand(body.command);
    const action = { ...config, toolkit: destination };
    if (body.phase !== 'execute') {
      return reply(200, {
        mode: 'approval_required',
        actionPlan: { destination, toolSlug: action.slug, label: action.label, command },
        warning: 'این عمل می‌تواند محتوای عمومی منتشر یا پیام واقعی ارسال کند. فقط پس از بازبینی دکمه تأیید و اجرا را بزنید.',
      });
    }
    if (body.confirmation !== 'EXECUTE_APPROVED') return reply(409, { error: { message: 'تأیید نهایی اجرا دریافت نشده است.' } });
    const execution = await execute(action, command);
    return reply(200, { mode: 'executed', destination, toolSlug: action.slug, execution, executedAt: new Date().toISOString() });
  } catch (error) {
    return reply(400, { error: { message: error instanceof Error ? error.message : 'فرمان نامعتبر است.' } });
  }
}
