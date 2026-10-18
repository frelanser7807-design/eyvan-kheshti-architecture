import { paymentSettings, paymentPage } from '../data/paymentSettings.js';
import { configuredPaymentUrl } from '../lib/hostedPayment.js';
import './PaymentsPage.css';

export default function PaymentsPage() {
  const checkoutUrl = configuredPaymentUrl(paymentSettings);
  return (
    <main className="wj-payments" id="main-content">
      <header className="wj-payments-nav"><a href="/">WORLD ARCH JOURNAL <span>ARCHITECTURE &amp; INTERIORS</span></a><nav aria-label="Payment page navigation"><a href="/services/">Design services</a><a href="/contact/">Contact</a></nav></header>
      <div className="wj-payments-inner">
        <header className="wj-payments-heading"><small>PROJECT PAYMENTS</small><h1>{paymentPage.heading}</h1><p>{paymentPage.intro}</p></header>
        <div className="wj-payments-grid">
          <section className="wj-payments-guide" aria-labelledby="payment-details"><h2 id="payment-details">Clear details. A straightforward next step.</h2><ol>{paymentPage.steps.map(([title, text]) => <li key={title}><h3>{title}</h3><p>{text}</p></li>)}</ol></section>
          <section className="wj-payments-checkout" aria-labelledby="secure-checkout">
            <div className="wj-payments-icon" aria-hidden="true"><svg width="40" height="30" viewBox="0 0 40 30" fill="none"><rect x="1" y="1" width="38" height="28" rx="5" stroke="currentColor" strokeWidth="1.5"/><path d="M1 10h38M8 21h9" stroke="currentColor" strokeWidth="2"/></svg></div>
            <small>PAYMENT OPTIONS</small><h2 id="secure-checkout">PayPal &amp; cards</h2>
            {checkoutUrl ? <><p>Continue to PayPal to review the payment amount, currency and available payment methods.</p><a className="wj-payments-button" href={checkoutUrl} rel="noopener noreferrer" target="_blank">Continue to secure checkout ↗</a><p className="wj-payments-note">Card details are entered on PayPal. Available options depend on your country and transaction.</p></> : <><p>Secure payment links are issued with your project invoice. Contact the studio to receive the link for your agreed payment.</p><a className="wj-payments-button" href="/contact/">Request your payment link ↗</a><p className="wj-payments-note">Have your project or invoice reference ready so we can direct you to the correct checkout.</p></>}
            <a className="wj-payments-help" href="/contact/">A question about your invoice? Contact us →</a>
          </section>
        </div>
        <aside className="wj-payments-products"><div><small>DIGITAL PRODUCTS</small><h2>Looking for a ready-made design resource?</h2><p>Use the product’s own checkout for its price, licence and delivery details.</p></div><a href="/shop/">Browse the architecture shop ↗</a></aside>
        <footer className="wj-payments-footer"><span>WORLD ARCH JOURNAL · FARNAZ GHAFFARIAN</span><nav aria-label="Payment information"><a href="/terms/">Terms</a><a href="/privacy/">Privacy</a><a href="/contact/">Contact</a></nav></footer>
      </div>
    </main>
  );
}
