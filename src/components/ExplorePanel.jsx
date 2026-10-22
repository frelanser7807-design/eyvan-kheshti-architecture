import { useEffect, useMemo, useRef, useState } from 'react';
import { submitSubscriber } from '../lib/dataAdapter.js';
import { assetUrl } from '../lib/assetUrl.js';
import { articles } from '../data/articles.js';
import { magazines } from '../data/magazines.js';

const views = [
  ['services', 'Services', 'خدمات'],
  ['projects', 'Projects', 'پروژه‌ها'],
  ['tutorials', 'Tutorials', 'آموزش‌ها'],
  ['magazines', 'Magazine', 'مجلهٔ معماری'],
  ['guides', 'EYVAN ATLAS', 'ایوان اطلس'],
  ['library', 'BIM Library', 'کتابخانهٔ BIM'],
  ['products', 'Courses & Shop', 'دوره‌ها و فروشگاه'],
];

const interfaceCopy = {
  en: {
    library: 'WORLD ARCH JOURNAL / DIGITAL LIBRARY', title: 'Explore the Studio', close: 'Close the studio library',
    viewCourse: 'View course', viewItem: 'View item', readArticle: 'Read article', openMagazine: 'Open issue', comingSoon: 'Coming soon', studioService: 'Studio service', preview: 'Preview item',
    freePlanned: 'Free release planned', premiumPlanned: 'Premium release planned',
    empty: 'This collection is being curated.', journal: 'STUDIO JOURNAL',
    newsletterTitle: 'Architecture, material and process — occasionally in your inbox.', email: 'Email address',
    join: 'Join the journal', saving: 'Sending…', success: 'If this address is not already subscribed, check your inbox for a confirmation link.', error: 'Subscription is temporarily unavailable. Please try again later.',
    consent: 'I agree to receive occasional World Arch Journal emails. I can unsubscribe at any time.',
  },
  fa: {
    library: 'ورلد آرک ژورنال / کتابخانهٔ دیجیتال', title: 'استودیو را کشف کنید', close: 'بستن کتابخانهٔ استودیو',
    viewCourse: 'مشاهدهٔ دوره', viewItem: 'مشاهده', readArticle: 'مطالعهٔ مقاله', openMagazine: 'بازکردن شماره', comingSoon: 'به‌زودی', studioService: 'خدمات استودیو', preview: 'پیش‌نمایش',
    freePlanned: 'انتشار رایگان برنامه‌ریزی شده', premiumPlanned: 'انتشار حرفه‌ای برنامه‌ریزی شده',
    empty: 'این مجموعه در حال تکمیل است.', journal: 'ژورنال استودیو',
    newsletterTitle: 'معماری، متریال و فرایند طراحی؛ گاهی در صندوق ایمیل شما.', email: 'نشانی ایمیل',
    join: 'عضویت در ژورنال', saving: 'در حال ارسال…', success: 'اگر این نشانی قبلاً عضو نشده باشد، لینک تأیید را در ایمیل خود بررسی کنید.', error: 'عضویت فعلاً در دسترس نیست؛ لطفاً بعداً دوباره تلاش کنید.',
    consent: 'با دریافت گه‌گاه ایمیل‌های ورلد آرک ژورنال موافقم و هر زمان می‌توانم لغو عضویت کنم.',
  },
};

function localised(item, key, language) {
  if (!item) return '';
  return language === 'fa' ? (item[`${key}Fa`] || item[key] || '') : (item[key] || '');
}

function safeHref(value) {
  if (!value) return '';
  if (value.startsWith('/') || value.startsWith('#')) return value;
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
  } catch {
    return '';
  }
}

export default function ExplorePanel({ open, onClose, content, initialView = 'projects', language = 'en', onOpenArticle, onOpenMagazine }) {
  const [active, setActive] = useState('projects');
  const [newsletterStatus, setNewsletterStatus] = useState('idle');
  const panelRef = useRef(null);
  const collections = useMemo(() => ({
    services: (content?.services || []).map((item) => ({
      ...item,
      published: true,
      category: item.detail,
      categoryFa: item.detailFa,
      excerpt: item.text,
      excerptFa: item.textFa,
    })),
    projects: (content?.projects || []).filter((item) => item.published),
    tutorials: (content?.tutorials || []).filter((item) => item.published),
    magazines: [
      ...magazines.filter((item) => item.published).map((item) => ({ ...item, collectionType: 'issue' })),
      ...articles.filter((item) => item.published).map((item) => ({ ...item, collectionType: 'article' })),
    ],
    guides: (content?.guides || []).filter((item) => item.published),
    library: (content?.library || []).filter((item) => item.published),
    products: (content?.products || []).filter((item) => item.published),
  }), [content]);

  useEffect(() => {
    const targetView = initialView === 'articles' ? 'magazines' : initialView;
    if (open && views.some(([id]) => id === targetView)) setActive(targetView);
  }, [initialView, open]);

  useEffect(() => {
    if (!open) return undefined;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusTimer = window.setTimeout(() => panelRef.current?.querySelector('button')?.focus(), 80);
    const onKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = [...(panelRef.current?.querySelectorAll('button, input, [href]') || [])]
        .filter((element) => !element.disabled);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;
  const items = collections[active] || [];
  const copy = interfaceCopy[language] || interfaceCopy.en;

  const subscribe = async (event) => {
    event.preventDefault();
    setNewsletterStatus('saving');
    const form = event.currentTarget;
    try {
      const fields = new FormData(form);
      await submitSubscriber(fields.get('email'), fields.get('consent') === 'yes', fields.get('website'));
      form.reset();
      setNewsletterStatus('success');
    } catch {
      setNewsletterStatus('error');
    }
  };

  return (
    <div className="ek-library-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section ref={panelRef} className={`ek-library ${language === 'fa' ? 'is-fa' : ''}`} dir={language === 'fa' ? 'rtl' : 'ltr'} role="dialog" aria-modal="true" aria-labelledby="library-title">
        <header>
          <div><small>{copy.library}</small><h2 id="library-title">{copy.title}</h2></div>
          <button className="ek-library-close" type="button" onClick={onClose} aria-label={copy.close}>×</button>
        </header>

        <nav className="ek-library-tabs" aria-label="Studio content">
          {views.map(([id, label, labelFa]) => (
            <button key={id} type="button" aria-current={active === id ? 'page' : undefined} className={active === id ? 'is-active' : ''} onClick={() => setActive(id)}>
              <span>{language === 'fa' ? labelFa : label}</span><small>{String(collections[id].length).padStart(2, '0')}</small>
            </button>
          ))}
        </nav>

        <div className="ek-library-grid">
          {items.map((item, index) => {
            const href = safeHref(item.url);
            const inactiveLabel = active === 'library'
                ? (item.accessTier === 'premium' ? copy.premiumPlanned : copy.freePlanned)
                : active === 'products'
                  ? copy.comingSoon
                  : active === 'services'
                    ? copy.studioService
                    : copy.preview;
            return (
              <article className="ek-library-card" key={item.id}>
                <div className="ek-library-image">
                  {item.image ? <img src={assetUrl(item.image)} alt={localised(item, 'title', language)} loading="lazy" decoding="async" /> : <span>EK</span>}
                  <small>{String(index + 1).padStart(2, '0')}</small>
                  {item.visualLabel && <b className="ek-library-visual-label">{item.visualLabel}</b>}
                </div>
                <div className="ek-library-copy">
                  <p>{language === 'fa' ? (item.categoryFa || item.typeFa || item.sceneFa || item.category || item.type || item.scene) : (item.category || item.type || item.scene)} {item.meta || item.year ? <span>· {item.meta || item.year}</span> : null}{item.price ? <span> · {item.currency || 'USD'} {item.price}</span> : null}</p>
                  <h3>{language === 'fa' ? localised(item, 'title', language) : (item.latinTitle || item.title)}</h3>
                  <span>{localised(item, item.excerpt !== undefined ? 'excerpt' : 'description', language)}</span>
                  {active === 'magazines'
                    ? item.collectionType === 'article'
                      ? <button className="ek-library-action" type="button" onClick={() => onOpenArticle(item)}>{copy.readArticle} <i>↗</i></button>
                      : <button className="ek-library-action" type="button" onClick={() => onOpenMagazine(item)}>{copy.openMagazine} <i>↗</i></button>
                    : href
                      ? <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">{active === 'products' ? copy.viewCourse : copy.viewItem} <i>↗</i></a>
                      : <em>{inactiveLabel}</em>}
                </div>
              </article>
            );
          })}
          {!items.length && <div className="ek-library-empty"><span>EK</span><p>{copy.empty}</p></div>}
        </div>

        <section className="ek-newsletter" aria-labelledby="newsletter-title">
          <div><small>{copy.journal}</small><h3 id="newsletter-title">{copy.newsletterTitle}</h3></div>
          {newsletterStatus === 'success' ? <p className="ek-newsletter-success" role="status">{copy.success}</p> : (
            <form onSubmit={subscribe}>
              <label><span>{copy.email}</span><input type="email" name="email" autoComplete="email" required placeholder="you@example.com" dir="ltr" /></label>
              <label className="ek-newsletter-consent"><input type="checkbox" name="consent" value="yes" required /><span>{copy.consent} <a href="/privacy/">Privacy policy</a></span></label>
              <input className="ek-newsletter-trap" type="text" name="website" tabIndex="-1" autoComplete="off" aria-hidden="true" />
              <button type="submit" disabled={newsletterStatus === 'saving'}>{newsletterStatus === 'saving' ? copy.saving : copy.join} <i>↗</i></button>
              {newsletterStatus === 'error' && <p role="alert">{copy.error}</p>}
            </form>
          )}
        </section>
      </section>
    </div>
  );
}
