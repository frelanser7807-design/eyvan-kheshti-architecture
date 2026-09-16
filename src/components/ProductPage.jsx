import { assetUrl } from '../lib/assetUrl.js';

function validCheckoutUrl(value) {
  try {
    const url = new URL(String(value || ''));
    return url.protocol === 'https:' && /(^|\.)gumroad\.com$/i.test(url.hostname) ? url.href : '';
  } catch {
    return '';
  }
}

export default function ProductPage({ product, products = [], missing = false }) {
  if (missing) {
    return (
      <main id="main-content" className="ek-commerce-page ek-commerce-empty">
        <a className="ek-commerce-brand" href="/">WORLD ARCH JOURNAL <small>BY FARNAZ</small></a>
        <section><small>404</small><h1>This page is not available.</h1><p>The requested editorial item is unpublished or does not exist.</p><a href="/">Return to the journal ↗</a></section>
      </main>
    );
  }

  if (!product) {
    return (
      <main id="main-content" className="ek-commerce-page">
        <a className="ek-commerce-brand" href="/">WORLD ARCH JOURNAL <small>BY FARNAZ</small></a>
        <header><small>CURATED DIGITAL PRODUCTS</small><h1>Architecture Shop</h1><p>Original BIM resources, architecture e-books and learning products will appear here only after technical, rights, delivery and payment checks.</p></header>
        <section className="ek-commerce-grid" aria-label="Published products">
          {products.length ? products.map((item) => <ProductCard item={item} key={item.id} />) : <article className="ek-commerce-notice"><small>OPENING SOON</small><h2>The catalogue is under review.</h2><p>No purchase or download is active yet.</p></article>}
        </section>
      </main>
    );
  }

  const checkoutUrl = validCheckoutUrl(product.gumroadUrl || product.checkoutUrl || product.url);
  return (
    <main id="main-content" className="ek-commerce-page">
      <a className="ek-commerce-brand" href="/">WORLD ARCH JOURNAL <small>BY FARNAZ</small></a>
      <article className="ek-product-detail">
        <figure><img src={assetUrl(product.image)} alt={product.imageAlt || product.title} /></figure>
        <div><small>{product.category}</small><h1>{product.title}</h1><p>{product.excerpt}</p>
          {product.price && <strong>{product.currency || 'USD'} {product.price}</strong>}
          {checkoutUrl ? <a className="ek-checkout-button" href={checkoutUrl} target="_blank" rel="noopener noreferrer">Buy securely on Gumroad ↗</a> : <span className="ek-checkout-disabled">Checkout opens after final product approval</span>}
        </div>
      </article>
    </main>
  );
}

function ProductCard({ item }) {
  const slug = item.slug || item.id;
  return <article><img src={assetUrl(item.image)} alt={item.imageAlt || item.title} /><small>{item.category}</small><h2>{item.title}</h2><p>{item.excerpt}</p><a href={`/shop/${slug}/`}>View product ↗</a></article>;
}

