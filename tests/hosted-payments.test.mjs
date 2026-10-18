import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { paypalPaymentUrl, configuredPaymentUrl } from '../src/lib/hostedPayment.js';
import { paymentSettings } from '../src/data/paymentSettings.js';

test('hosted checkout accepts an official HTTPS PayPal Payment Link', () => {
  assert.equal(paypalPaymentUrl('https://www.paypal.com/ncp/payment/TESTONLY123'), 'https://www.paypal.com/ncp/payment/TESTONLY123');
});

test('hosted checkout rejects deceptive hosts, credentials and unrelated PayPal routes', () => {
  for (const value of ['javascript:alert(1)', 'http://www.paypal.com/ncp/payment/TESTONLY123', 'https://paypal.com.evil.test/ncp/payment/TESTONLY123', 'https://www.paypal.com@evil.test/ncp/payment/TESTONLY123', 'https://other@www.paypal.com/ncp/payment/TESTONLY123', 'https://www.paypal.com/signin', 'https://www.paypal.com:444/ncp/payment/TESTONLY123', 'https://www.paypal.com/ncp/payment/TESTONLY123#fake']) assert.equal(paypalPaymentUrl(value), '', value);
});

test('payment configuration cannot expose an active checkout without an actual hosted URL', () => {
  assert.equal(configuredPaymentUrl({ enabled: false, paypalHostedLink: '' }), '');
  assert.throws(() => configuredPaymentUrl({ enabled: true, paypalHostedLink: '' }), /official PayPal Payment Link/);
  assert.throws(() => configuredPaymentUrl({ enabled: true, paypalHostedLink: 'https://evil.test/' }), /official PayPal Payment Link/);
  assert.equal(configuredPaymentUrl({ enabled: true, paypalHostedLink: 'https://www.paypal.com/ncp/payment/TESTONLY123' }), 'https://www.paypal.com/ncp/payment/TESTONLY123');
});

test('payment page does not collect card data or infer success from return URL parameters', async () => {
  const source = await readFile(new URL('../src/components/PaymentsPage.jsx', import.meta.url), 'utf8');
  const html = await readFile(new URL('../dist/payments/index.html', import.meta.url), 'utf8');
  assert.ok(!/<(?:input|form)\b/i.test(html));
  assert.ok(!/location\.(?:search|hash)|URLSearchParams|payment.?success/i.test(source));
  assert.ok(html.includes('<h1>Pay for your project.</h1>'));
  assert.ok(html.includes('noindex, follow'));
  assert.ok(html.includes('https://worldarchjournal.com/rss.xml'));
  const sitemap = await readFile(new URL('../dist/sitemap.xml', import.meta.url), 'utf8');
  assert.ok(!sitemap.includes('/payments/'), 'The checkout support page is intentionally excluded from the sitemap.');
  if (!paymentSettings.enabled) {
    assert.ok(html.includes('Request your payment link'));
    assert.ok(!html.includes('Continue to secure checkout'));
    assert.ok(!/href="https:\/\/(?:www\.)?paypal\.com/.test(html));
  }
});
