# Hosted project payments

The owner requested clickable credit/debit-card and PayPal payments. `/payments/` provides a project-payment entry point using a PayPal-hosted Payment Link, with navigation from the home page and design-services page. Existing digital-product checkouts stay on their own product pages.

## Current status

The page is prepared for review, with `paymentSettings.enabled=false` and no merchant URL. It is **not a connected or tested live payment gateway**. Do not merge/deploy this feature as an active payment method until the owner supplies the official receiving-account Payment Link and the destination has been checked. The page currently offers contact for an invoice/payment link; no fake active payment button is shown.

## Connect the merchant

1. Obtain the owner's public official PayPal Payment Link, generated in the receiving PayPal Business account. No password, secret, access token or card details belong in this repository or in chat.
2. Confirm the destination's receiving identity, description, currency/amount rules and available payment options against the owner's intended purchase or invoice flow.
3. Put the actual `https://www.paypal.com/ncp/payment/...` URL in `src/data/paymentSettings.js` and set `enabled=true`. The build fails for an enabled missing or invalid destination.
4. Use a sandbox buyer/merchant setup where supplied for transaction testing. A real-money test needs the owner to complete/approve the transaction; no test charge has been made by this implementation.
5. Complete CI, preview and production checks. Confirm the public payment link opens the expected hosted checkout.

## Scope

This is an external hosted checkout, not an on-site card collector or a store/order backend. The site never receives PAN/CVV and does not infer payment success from query strings, redirects, local storage or a screenshot of a receipt. PayPal provides payment confirmation; the owner must reconcile a transaction with the invoice before confirming a paid milestone. No automatic digital download or fulfilment is unlocked. A future automated store requires server-created orders and verified payment webhooks.

The public landing page is deliberately `noindex, follow` and is absent from the sitemap. This is intentional checkout-page treatment, not an indexing failure. RSS discovery is preserved.

## Primary references checked 18 October 2026

- https://developer.paypal.com/payment-links-buttons/create-payment-link/
- https://developer.paypal.com/payment-links-buttons/customize/
- https://developer.paypal.com/payment-links-buttons/share-payment-link/

PayPal describes fixed and customer-set prices and optional invoice ID fields. Method availability depends on the customer's country and eligibility; the UI does not guarantee card checkout for every payer. The final fixed-price or customer-set merchant link must be selected with the owner based on the actual billing workflow. No receiving email or account identity has been guessed.
