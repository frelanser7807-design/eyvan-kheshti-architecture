import { assetUrl } from '../lib/assetUrl.js';
import { watchVideoForSource, watchPagePath } from '../data/watchVideos.js';

function validCheckoutUrl(value) {
  try {
    const url = new URL(String(value || ''));
    const isGumroad = /(^|\.)gumroad\.com$/i.test(url.hostname);
    const isEtsyListing = url.hostname === 'www.etsy.com' && /^\/(?:[a-z]{2}\/)?listing\/\d+(?:\/|$)/i.test(url.pathname);
    return url.protocol === 'https:' && (isGumroad || isEtsyListing) ? url.href : '';
  } catch {
    return '';
  }
}

function validEtsyUrl(value) {
  try {
    const url = new URL(String(value || ''));
    return url.protocol === 'https:' && (
      url.hostname === 'worldarchjournal.etsy.com' ||
      (url.hostname === 'www.etsy.com' && /^\/shop\/worldarchjournal\/?$/i.test(url.pathname))
    ) ? url.href : '';
  } catch {
    return '';
  }
}

const presentationCategories = [
  { code: '01 / INTERIOR', title: 'Interior design presentations', text: 'Room narratives, material palettes, plans and visual sequences that help clients understand how an interior will feel and work.' },
  { code: '02 / EXTERIOR', title: 'Exterior & facade presentations', text: 'Clear concept boards for massing, facade rhythm, environmental ideas and material choices, arranged for review rather than decoration alone.' },
  { code: '03 / BOARDS', title: 'Architectural boards & slide decks', text: 'Layouts for PowerPoint presentations, portfolio pages and competition-style boards, with room for drawings, renders and concise project evidence.' },
  { code: '04 / SOCIAL', title: 'Reels & post cover systems', text: 'Consistent Instagram and Pinterest covers that retain the World Arch visual discipline while giving each project a recognisable, brighter visual focus.' },
];

function checkoutProvider(value) {
  try { return new URL(value).hostname === 'www.etsy.com' ? 'Etsy' : 'Gumroad'; }
  catch { return 'checkout'; }
}

function formatPrice(price, currency = 'USD') {
  const amount = Number(price);
  if (!Number.isFinite(amount)) return `${currency} ${price}`;
  try { return new Intl.NumberFormat('en-GB', { style: 'currency', currency }).format(amount); }
  catch { return `${currency} ${price}`; }
}

export default function ProductPage({ product, products = [], missing = false, presentationStudio = false, etsyUrl = '', whatsappUrl = '' }) {
  const shopUrl = validEtsyUrl(etsyUrl);
  if (missing) {
    return (
      <main id="main-content" className="ek-commerce-page ek-commerce-empty">
        <a className="ek-commerce-brand" href="/">WORLD ARCH JOURNAL </a>
        <section><small>404</small><h1>This page is not available.</h1><p>The requested editorial item is unpublished or does not exist.</p><a href="/">Return to the journal ↗</a></section>
      </main>
    );
  }

  if (presentationStudio) {
    const contactUrl = /^https:\/\/wa\.me\/[0-9]+$/.test(String(whatsappUrl || '')) ? whatsappUrl : '';
    const presentationProducts = products.filter((item) => /presentation|powerpoint|slide/i.test(`${item.category} ${item.title}`));
    return <main id="main-content" className="ek-commerce-page ek-presentation-page">
      <a className="ek-commerce-brand" href="/">WORLD ARCH JOURNAL </a>
      <nav className="ek-commerce-breadcrumb" aria-label="Breadcrumb"><a href="/shop/">Shop</a><span>/</span><span>Presentation Studio</span></nav>
      <header><small>ARCHITECTURAL COMMUNICATION</small><h1>Presentation Studio</h1><p>Architecture deserves a presentation that explains the idea, not just a beautiful cover. Explore the four formats we are developing for ready-to-edit templates and tailored commissions.</p><div className="ek-commerce-actions">{shopUrl && <a className="ek-checkout-button" href={shopUrl} target="_blank" rel="noopener noreferrer">Browse the Etsy shop ↗</a>}{contactUrl && <a className="ek-commerce-outline" href={contactUrl} target="_blank" rel="noopener noreferrer">Discuss a custom project ↗</a>}</div><small className="ek-commerce-note">Available files, formats and prices are confirmed on each Etsy listing. No on-site checkout is active.</small></header>
      {presentationProducts.length > 0 && <section className="ek-commerce-featured" aria-labelledby="ready-made-templates"><div><small>READY-MADE TEMPLATE</small><h2 id="ready-made-templates">Shop editable presentation templates</h2><p>Review the preview, price and licence on the product page, then complete payment and delivery securely on Etsy.</p></div><div className="ek-commerce-grid">{presentationProducts.map((item) => <ProductCard item={item} key={item.id} />)}</div></section>}
      <section className="ek-commerce-grid" aria-label="Presentation design categories">{presentationCategories.map((category) => <article key={category.code}><small>{category.code}</small><h2>{category.title}</h2><p>{category.text}</p></article>)}</section>
      <section className="ek-commerce-guidance"><h2>Ready-made or bespoke?</h2><div><p>A ready-made template is a useful starting structure when you already have project images, drawings and copy. Check the actual listing for editable file type, aspect ratio, font requirements, image placeholders, licence and delivery terms before ordering.</p><p>A bespoke presentation starts with your audience and decision: a client review, design competition, portfolio, investor introduction or social launch. We then set a visual hierarchy for concept, drawings, materials, renders and next steps. Final scope, price, revisions and delivery date should be agreed in writing before payment.</p></div><p>These are service and category descriptions, not a claim that every pictured format is currently on sale. We will add individual previews and product pages only as rights-cleared files and verified listings are ready.</p></section>
    </main>;
  }

  if (!product) {
    return (
      <main id="main-content" className="ek-commerce-page">
        <a className="ek-commerce-brand" href="/">WORLD ARCH JOURNAL </a>
        <header><small>CURATED DIGITAL PRODUCTS &amp; SERVICES</small><h1>Architecture Shop</h1><p>Explore architecture presentation formats, original BIM resources, editorial e-books and learning products. Ready-made files will be listed with their actual formats, licences and prices after review; bespoke work begins with a clear brief.</p><div className="ek-commerce-actions"><a className="ek-checkout-button" href="/shop/presentations/">Explore Presentation Studio ↗</a>{shopUrl && <a className="ek-commerce-outline" href={shopUrl} target="_blank" rel="noopener noreferrer">Visit our Etsy shop ↗</a>}</div><small className="ek-commerce-note">Etsy purchases complete on Etsy. This website does not collect card details or process payments.</small></header>
        <section className="ek-commerce-grid" aria-label="Published products">
          {products.length ? products.map((item) => <ProductCard item={item} key={item.id} />) : <article className="ek-commerce-notice"><small>OPENING SOON</small><h2>The catalogue is under review.</h2><p>No purchase or download is active yet.</p></article>}
        </section>
      </main>
    );
  }

  const checkoutUrl = validCheckoutUrl(product.gumroadUrl || product.checkoutUrl || product.url);
  const provider = checkoutProvider(checkoutUrl);
  const dedicatedWatchPage = watchVideoForSource(`/shop/${product.slug || product.id}/`);
  return (
    <main id="main-content" className="ek-commerce-page">
      <a className="ek-commerce-brand" href="/">WORLD ARCH JOURNAL </a>
      <article className="ek-product-detail">
        <figure>{product.video ? <video controls muted playsInline preload="metadata" poster={assetUrl(product.image)} aria-label={`${product.title} video preview`}><source src={assetUrl(product.video)} type="video/mp4" />Your browser does not support embedded video.</video> : <img src={assetUrl(product.image)} alt={product.imageAlt || product.title} />}</figure>
        <div><small>{product.category}</small><h1>{product.title}</h1><p>{product.excerpt}</p>
          {dedicatedWatchPage && <p><a href={watchPagePath(dedicatedWatchPage)}>Watch the dedicated video preview ↗</a></p>}
          {product.price && <strong>{formatPrice(product.price, product.currency)}</strong>}
          {checkoutUrl ? <a className="ek-checkout-button" href={checkoutUrl} target="_blank" rel="noopener noreferrer">Buy securely on {provider} ↗</a> : <span className="ek-checkout-disabled">Checkout opens after final product approval</span>}
          {provider === 'Etsy' && <small className="ek-commerce-note">Payment, download delivery and order support are completed on Etsy. WORLD ARCH JOURNAL does not collect card details.</small>}
        </div>
      </article>
      {product.gallery?.length > 0 && <section className="ek-product-gallery" aria-labelledby="product-gallery-title"><header><small>SLIDE PREVIEW</small><h2 id="product-gallery-title">Inside the template</h2><p>Preview the visual system, presentation structure and editable architecture layouts before purchasing on Etsy.</p></header><div>{product.gallery.map((image, index) => <figure key={image}><img src={assetUrl(image)} alt={`${product.title} preview ${index + 2}`} loading="lazy" /></figure>)}</div></section>}
    </main>
  );
}

function ProductCard({ item }) {
  const slug = item.slug || item.id;
  return <article><img src={assetUrl(item.image)} alt={item.imageAlt || item.title} /><small>{item.category}</small><h2>{item.title}</h2><p>{item.excerpt}</p><a href={`/shop/${slug}/`}>View product ↗</a></article>;
}
