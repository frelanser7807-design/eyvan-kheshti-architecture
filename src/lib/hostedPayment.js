export function paypalPaymentUrl(value) {
  try {
    const url = new URL(String(value || '').trim());
    if (url.protocol !== 'https:' || !['www.paypal.com', 'paypal.com'].includes(url.hostname)) return '';
    if (url.username || url.password || url.port || url.hash) return '';
    if (!/^\/ncp\/payment\/[a-z0-9_-]{6,64}\/?$/i.test(url.pathname)) return '';
    return url.href;
  } catch { return ''; }
}

export function configuredPaymentUrl(settings) {
  if (!settings?.enabled) return '';
  const url = paypalPaymentUrl(settings.paypalHostedLink);
  if (!url) throw new Error('An enabled payment page requires the receiving account’s official PayPal Payment Link.');
  return url;
}
