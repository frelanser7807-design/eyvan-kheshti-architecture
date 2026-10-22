import { useEffect, useState } from 'react';
import { assetUrl } from '../lib/assetUrl.js';
import { articles } from '../data/articles.js';
import { magazines } from '../data/magazines.js';
import { projects as studioProjects } from '../data/projects.js';
import { promptCategories, promptItems } from '../data/promptLibrary.js';
import { HomeVirtualToursShowcase } from './ProjectsHub.jsx';

const copy = {
  en: {
    eyebrow: 'BEYOND THE FILM',
    title: 'Architecture, knowledge and places.',
    intro: 'Explore selected work, studio services, original editorial research and carefully staged digital resources.',
    projects: 'Selected Projects',
    services: 'Studio Services',
    tutorials: 'Tutorials',
    prompts: 'AI Prompt Library',
    promptsText: 'Free, copy-ready prompts and crown-marked PRO collections for architecture websites, images, videos, logo motion and animated backgrounds.',
    openPrompts: 'Explore prompts',
    magazine: 'Architecture Magazine',
    magazineText: 'World Arch Journal issues and source-grounded architecture articles, collected in one dedicated editorial section.',
    openMagazine: 'Open Issue 00',
    articles: 'Articles',
    articlesText: 'Source-grounded, long-form reading for architects, BIM teams and design professionals. Articles are kept separate from shorter studio journal notes.',
    readArticle: 'Read full article',
    library: 'BIM Object Library',
    atlas: 'WORLD ARCH ATLAS',
    app: 'World Arch Journal App',
    shop: 'Courses & Shop',
    atlasText: 'English city guides connecting architecture, neighbourhoods and useful local experiences. Each guide is researched, source-checked and published only after editorial review.',
    shopText: 'Courses, digital catalogues and architectural resources will appear here after pricing, delivery and payment checks are complete.',
    libraryText: 'A freemium library in development: practical BIM essentials will form the free entry collection, while advanced parametric families are planned as future premium packs.',
    libraryUnavailable: 'No BIM file, download or checkout is active in this preview.',
    appText: 'Install this website as a lightweight app for faster access to projects, tutorials, guides and future commission updates.',
    install: 'Install / Download app',
    installed: 'App installed',
    installHelp: 'Installation help',
    viewAll: 'View collection',
    viewAllArticles: 'View all articles',
    contact: 'Start a project',
    disclosure: 'Affiliate note: future commercial links will be clearly disclosed. No affiliate link is active in this preview.',
    adReserved: 'Editorial advertising space is reserved for a future eligible and approved AdSense account.',
  },
  fa: {
    eyebrow: 'فراتر از روایت فیلم',
    title: 'معماری، دانش و تجربهٔ شهر.',
    intro: 'پروژه‌های منتخب، خدمات استودیو، پژوهش‌های اصیل و راهنماهای شهریِ معماری‌محور را در یک ساختار روشن و قابل اسکرول ببینید.',
    projects: 'پروژه‌های منتخب',
    services: 'خدمات استودیو',
    tutorials: 'آموزش‌ها',
    prompts: 'کتابخانهٔ پرامپ هوش مصنوعی',
    promptsText: 'پرامپ‌های رایگان قابل کپی و مجموعه‌های حرفه‌ای تاج‌دار برای وب‌سایت، تصویر، ویدیو، لوگوموشن و پس‌زمینهٔ متحرک.',
    openPrompts: 'مشاهدهٔ پرامپ‌ها',
    magazine: 'مجلهٔ معماری',
    magazineText: 'شماره‌های ورلد آرک ژورنال و مقاله‌های منبع‌محور معماری، همگی در یک بخش تحریریهٔ مستقل گردآوری می‌شوند.',
    openMagazine: 'بازکردن شمارهٔ صفر',
    articles: 'مقاله‌ها',
    articlesText: 'مطالب بلند و منبع‌محور برای معماران، تیم‌های BIM و متخصصان طراحی؛ جدا از یادداشت‌های کوتاه ژورنال استودیو.',
    readArticle: 'مطالعهٔ مقاله',
    library: 'کتابخانهٔ آبجکت BIM',
    atlas: 'اطلس معماری جهان',
    app: 'اپلیکیشن ورلد آرک ژورنال',
    shop: 'دوره‌ها و فروشگاه',
    atlasText: 'راهنماهای دوزبانهٔ شهر با پیوند میان معماری، محله‌ها و تجربه‌های مفید محلی. هر راهنما پس از پژوهش، کنترل منابع و بازبینی انسانی منتشر می‌شود.',
    shopText: 'دوره‌ها، کاتالوگ‌های دیجیتال و منابع معماری پس از تأیید قیمت، شیوهٔ تحویل و پرداخت در این بخش قرار می‌گیرند.',
    libraryText: 'کتابخانه‌ای فریمیوم در حال توسعه: ملزومات کاربردی BIM در بخش رایگان و فمیلی‌های پارامتریک پیشرفته در بسته‌های حرفه‌ای آینده قرار می‌گیرند.',
    libraryUnavailable: 'در این پیش‌نمایش هنوز فایل BIM، دانلود یا پرداختی فعال نیست.',
    appText: 'این وب‌سایت را برای دسترسی سریع‌تر به پروژه‌ها، آموزش‌ها، راهنماها و به‌روزرسانی‌های آینده به‌صورت اپ نصب کنید.',
    install: 'نصب اپ',
    installed: 'اپ نصب شده',
    installHelp: 'راهنمای نصب',
    viewAll: 'مشاهدهٔ مجموعه',
    viewAllArticles: 'مشاهدهٔ همهٔ مقاله‌ها',
    contact: 'شروع یک پروژه',
    disclosure: 'یادداشت افیلیت: لینک‌های تجاری آینده به‌روشنی مشخص می‌شوند. در این پیش‌نمایش هیچ لینک افیلیت فعالی وجود ندارد.',
    adReserved: 'فضای تبلیغاتی مقالات برای حساب واجد شرایط و تأییدشدهٔ AdSense در آینده رزرو شده است.',
  },
};

function localised(item, key, language) {
  if (!item) return '';
  return language === 'fa' ? (item[`${key}Fa`] || item[key] || '') : (item[key] || '');
}

function PreviewCards({ items, language }) {
  return (
    <div className="ek-editorial-grid">
      {items.slice(0, 3).map((item) => (
        <article key={item.id}>
          {item.image ? <img src={assetUrl(item.image)} alt={localised(item, 'title', language)} loading="lazy" decoding="async" /> : <span className="ek-editorial-mark">WA</span>}
          <div>
            <small>{language === 'fa' ? (item.categoryFa || item.typeFa || item.sceneFa || item.category || item.type || item.scene) : (item.category || item.type || item.scene)}</small>
            <h3>{localised(item, 'title', language)}</h3>
            <p>{localised(item, item.excerpt !== undefined ? 'excerpt' : 'description', language)}</p>
            {/^https?:\/\//i.test(item.url || '') && <a className="ek-editorial-download" href={item.url} target="_blank" rel="noopener noreferrer">Open / Download ↗</a>}
          </div>
        </article>
      ))}
    </div>
  );
}

function AppInstallCard({ text }) {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [status, setStatus] = useState(() => window.matchMedia?.('(display-mode: standalone)')?.matches ? 'installed' : 'idle');

  useEffect(() => {
    const onPrompt = (event) => {
      event.preventDefault();
      setInstallPrompt(event);
    };
    const onInstalled = () => { setStatus('installed'); setInstallPrompt(null); };
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const install = async () => {
    if (!installPrompt) {
      setStatus('help');
      return;
    }
    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    setStatus(choice.outcome === 'accepted' ? 'installed' : 'idle');
    setInstallPrompt(null);
  };

  return (
    <div className="ek-app-install">
      <div className="ek-app-card">
        <span className="ek-app-mark"><img src={assetUrl('/assets/brand/world-arch-wa-mark-v1.png')} alt="" /></span>
        <div><strong>WORLD ARCH JOURNAL</strong><small>ARCHITECTURE MEDIA &amp; DESIGN</small><p>{text.appText}</p></div>
        <button type="button" onClick={install} disabled={status === 'installed'}>{status === 'installed' ? text.installed : installPrompt ? text.install : text.installHelp} ↗</button>
        {status === 'help' && <p className="ek-install-help" role="status">Choose the instructions for your phone below. Installation is available from the browser after the site is served over HTTPS.</p>}
      </div>
      <div className="ek-install-guides" aria-label="App installation guide">
        <article>
          <header><span>ANDROID</span><b>Chrome installation</b></header>
          <ol>
            <li><i aria-hidden="true">1</i><span className="ek-guide-visual ek-guide-browser"><b>WORLD ARCH</b><em>⋮</em></span><p>Open this website in Chrome and tap the three-dot browser menu.</p></li>
            <li><i aria-hidden="true">2</i><span className="ek-guide-visual"><em>＋</em><b>Install app</b></span><p>Choose “Install app” or “Add to Home screen”.</p></li>
            <li><i aria-hidden="true">3</i><span className="ek-guide-visual ek-guide-home"><em>WA</em><b>Home screen</b></span><p>Confirm Install. The World Arch icon will open the site like an app.</p></li>
          </ol>
        </article>
        <article>
          <header><span>IPHONE / IPAD</span><b>Safari installation</b></header>
          <ol>
            <li><i aria-hidden="true">1</i><span className="ek-guide-visual ek-guide-browser"><b>WORLD ARCH</b><em>Safari</em></span><p>Open this website in Safari. Other iPhone browsers may not show the same option.</p></li>
            <li><i aria-hidden="true">2</i><span className="ek-guide-visual"><em>⇧</em><b>Share</b></span><p>Tap the Share icon in Safari’s toolbar.</p></li>
            <li><i aria-hidden="true">3</i><span className="ek-guide-visual ek-guide-home"><em>＋</em><b>Add to Home Screen</b></span><p>Choose “Add to Home Screen”, then confirm Add.</p></li>
          </ol>
        </article>
      </div>
    </div>
  );
}

export default function EditorialSections({ content, language, onExplore, onOpenArticle, onOpenMagazine, onContact }) {
  const text = copy[language] || copy.en;
  const projects = (content?.projects || []).filter((item) => item.published);
  const tutorials = (content?.tutorials || []).filter((item) => item.published);
  const guides = (content?.guides || []).filter((item) => item.published);
  const library = (content?.library || []).filter((item) => item.published);
  const products = (content?.products || []).filter((item) => item.published);
  const socialLinks = (content?.brand?.socialLinks || [])
    .filter((item) => item.enabled !== false && /^https?:\/\//i.test(item.url || ''));
  const featuredMagazine = magazines.find((item) => item.published);
  const publishedArticles = articles.filter((item) => item.published);
  const discoveryMagazine = publishedArticles[0];
  const discoveryHistory = publishedArticles.find((item) => item.slug === 'art-deco-architecture-history-features-buildings') || discoveryMagazine;
  const discoveryTour = studioProjects[0];
  const adsenseReady = content?.monetization?.adsenseEnabled === true && /^ca-pub-\d{10,}$/.test(content?.monetization?.adsensePublisherId || '');

  return (
    <div className={`ek-scroll-site ${language === 'fa' ? 'is-fa' : ''}`} dir={language === 'fa' ? 'rtl' : 'ltr'}>
      <section className="ek-discovery" aria-labelledby="discovery-title">
        <header className="ek-discovery-head">
          <small>START EXPLORING</small>
          <h2 id="discovery-title">Everything, one click from here.</h2>
        </header>
        <div className="ek-discovery-grid">
          <a className="ek-discovery-card" href="/magazine/">
            <span className="ek-discovery-media"><img src={assetUrl(discoveryMagazine?.image)} alt={discoveryMagazine?.imageAlt || 'Latest magazine story cover'} loading="lazy" decoding="async" /></span>
            <span className="ek-discovery-body"><small>MAGAZINE</small><h3>The Magazine</h3><p>Evidence-led architecture stories — villas, cooling, small homes and materials in use.</p><span className="ek-discovery-go">READ THE STORIES →</span></span>
          </a>
          <a className="ek-discovery-card" href="/magazine/architectural-history-styles/">
            <span className="ek-discovery-media"><img src={assetUrl(discoveryHistory?.image)} alt={discoveryHistory?.imageAlt || 'Architectural history cover'} loading="lazy" decoding="async" /></span>
            <span className="ek-discovery-body"><small>HISTORY</small><h3>Architecture History</h3><p>Art Deco, Brutalism, Gothic — learn to read any building&rsquo;s style in five signs.</p><span className="ek-discovery-go">ENTER THE HUB →</span></span>
          </a>
          <a className="ek-discovery-card" href="/materials/">
            <span className="ek-discovery-media"><img src={assetUrl('/assets/material-studio/travertine/ivory/preview.webp')} alt="Travertine stone material preview" loading="lazy" decoding="async" /></span>
            <span className="ek-discovery-body"><small>MATERIALS</small><h3>Materials Library</h3><p>Real scans, room scenes and texture packs — ceramic, travertine and fluted wood.</p><span className="ek-discovery-go">EXPLORE MATERIALS →</span></span>
          </a>
          <a className="ek-discovery-card" href="/projects/">
            <span className="ek-discovery-media"><img src={assetUrl(discoveryTour?.cover)} alt={discoveryTour?.coverAlt || 'Virtual tour cover'} loading="lazy" decoding="async" /></span>
            <span className="ek-discovery-body"><small>VIRTUAL TOURS</small><h3>Virtual Tours</h3><p>Step inside real spaces in 360° — The Voids and Narbon, panorama by panorama.</p><span className="ek-discovery-go">ENTER A TOUR →</span></span>
          </a>
        </div>
      </section>

      <section className="ek-scroll-intro" aria-labelledby="scroll-intro-title">
        <small>00 / {text.eyebrow}</small>
        <h2 id="scroll-intro-title">{text.title}</h2>
        <p>{text.intro}</p>
      </section>

      <div id="projects">
        <HomeVirtualToursShowcase />
      </div>

      <section id="services" className="ek-editorial-section ek-services-band" aria-labelledby="services-title">
        <header><small>02</small><h2 id="services-title">{text.services}</h2><a href="/services/">Explore design services ↗</a></header>
        <ol>{(content?.services || []).map((service) => <li key={service.id}><span>{service.number}</span><b>{localised(service, 'title', language)}</b><small>{localised(service, 'detail', language)}</small></li>)}</ol>
      </section>

      <section id="tutorials" className="ek-editorial-section" aria-labelledby="tutorials-title">
        <header><small>03</small><h2 id="tutorials-title">{text.tutorials}</h2><button type="button" onClick={() => onExplore('tutorials')}>{text.viewAll} ↗</button></header>
        <PreviewCards items={tutorials} language={language} />
      </section>

      <section id="prompts" className="ek-editorial-section ek-prompts-band" aria-labelledby="prompts-title">
        <header><small>04</small><h2 id="prompts-title">{text.prompts}</h2><button type="button" onClick={() => window.location.assign('/prompts/')}>{text.openPrompts} ↗</button></header>
        <p className="ek-prompts-intro">{text.promptsText}</p>
        <div className="ek-prompt-category-grid">
          {promptCategories.map((category) => {
            const freeItem = promptItems.find((item) => item.category === category.slug && item.access === 'free');
            const proItem = promptItems.find((item) => item.category === category.slug && item.access === 'premium');
            return (
              <article key={category.slug}>
                <a href={`/prompts/?category=${category.slug}`}><img src={assetUrl(freeItem?.image || proItem?.image)} alt={`${category.title} prompt collection`} loading="lazy" decoding="async" /></a>
                <div>
                  <small>{category.short}</small><h3>{category.title}</h3><p>{category.description}</p><span><b>FREE</b> + <em>♛ PRO</em></span>
                  <nav className="ek-prompt-card-actions" aria-label={`${category.title} actions`}>
                    {freeItem && <a href={`/prompts/?category=${category.slug}`}>Open prompts <i aria-hidden="true">↗</i></a>}
                    {proItem && <a className="is-pro" href={`/prompts/${proItem.id}/`}>Preview PRO <i aria-hidden="true">♛</i></a>}
                  </nav>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section id="journal" className="ek-editorial-section ek-articles-band" aria-labelledby="journal-title">
        <span id="articles" aria-hidden="true" />
        <header><small>05</small><h2 id="journal-title">{text.magazine}</h2><button type="button" onClick={() => window.location.assign('/magazine/')}>{text.viewAll} ↗</button></header>
        <p className="ek-articles-intro">{text.magazineText}</p>
        <a className="ek-newsletter-entry" href="/newsletter/" aria-label="Read the World Arch Journal architecture news briefing">
          <span>THE WORLD ARCH BRIEFING</span>
          <strong>{language === 'fa' ? 'خبرنامهٔ معماری: تحلیل خبرهای جهان' : 'Architecture news, with context and sources'}</strong>
          <em>{language === 'fa' ? 'شمارهٔ اول را بخوانید ↗' : 'Read the first briefing ↗'}</em>
        </a>
        <div className="ek-magazine-collection-heading">
          <div><small>EDITORIAL LIBRARY</small><h3>{text.articles}</h3></div>
          <span>{String(articles.filter((article) => article.published).length).padStart(2, '0')}{' '}{language === 'fa' ? 'مقالهٔ منتشرشده' : 'PUBLISHED ARTICLES'}</span>
        </div>
        <div className="ek-magazine-article-grid">
          {articles.filter((article) => article.published).slice(0, 6).map((article) => (
            <article className="ek-article-feature" key={article.id}>
              <figure>
                <picture>
                  {article.imageWebp && <source srcSet={assetUrl(article.imageWebp)} type="image/webp" />}
                  <img src={assetUrl(article.image)} alt={article.imageAlt} loading="lazy" decoding="async" width={article.imageWidth || undefined} height={article.imageHeight || undefined} />
                </picture>
                <figcaption>{article.visualLabel}</figcaption>
              </figure>
              <div>
                <small>{article.status} · {article.meta}</small>
                <h3>{article.title}</h3>
                <p>{article.excerpt}</p>
                <ul aria-label="Article topics">{article.tags.slice(0, 4).map((tag) => <li key={tag}>{tag}</li>)}</ul>
                <div className="ek-article-card-actions">
                  <button type="button" onClick={() => onOpenArticle(article)}>{text.readArticle} ↗</button>
                  <a href={`/downloads/articles/${article.slug}.pdf`} download={`${article.slug}.pdf`}>{language === 'fa' ? 'دانلود PDF' : 'Download PDF'} ↓</a>
                </div>
              </div>
            </article>
          ))}
        </div>
        <a className="ek-articles-view-all" href="/magazine/">{text.viewAllArticles} <span aria-hidden="true">↗</span></a>
        {featuredMagazine && <div className="ek-magazine-collection-heading ek-magazine-issue-heading"><div><small>CURATED ISSUE</small><h3>{language === 'fa' ? 'شماره‌های مجله' : 'Magazine Issues'}</h3></div><span>ISSUE {featuredMagazine.number}</span></div>}
        {featuredMagazine && (
          <article className="ek-magazine-feature">
            <figure>
              <img src={assetUrl(featuredMagazine.image)} alt={featuredMagazine.imageAlt} loading="lazy" decoding="async" />
              <figcaption>{featuredMagazine.visualLabel}</figcaption>
            </figure>
            <div>
              <small>{featuredMagazine.category} · {featuredMagazine.meta}</small>
              <span>ISSUE {featuredMagazine.number}</span>
              <h3>{featuredMagazine.title.replace(/^Issue \d+\s*[—-]\s*/, '')}</h3>
              <p>{featuredMagazine.excerpt}</p>
              <button type="button" onClick={() => onOpenMagazine(featuredMagazine)}>{text.openMagazine} ↗</button>
            </div>
          </article>
        )}
        {adsenseReady && <aside className="ek-ad-ready" aria-label={text.adReserved} data-ad-client={content.monetization.adsensePublisherId}><small>ADVERTISEMENT</small><span>{text.adReserved}</span></aside>}
      </section>

      <section id="objects" className="ek-editorial-section ek-library-band" aria-labelledby="objects-title">
        <header><small>06</small><h2 id="objects-title">{text.library}</h2><button type="button" onClick={() => onExplore('library')}>{text.viewAll} ↗</button></header>
        <p>{text.libraryText}</p>
        <div className="ek-access-model-grid" aria-label="Planned BIM library access model">
          {library.slice(0, 2).map((item, index) => (
            <article key={item.id} className={item.accessTier === 'premium' ? 'is-premium' : 'is-free'}>
              <small>{String(index + 1).padStart(2, '0')} / {item.meta}</small>
              <h3>{localised(item, 'title', language)}</h3>
              <p>{localised(item, 'excerpt', language)}</p>
              <span>{text.libraryUnavailable}</span>
            </article>
          ))}
        </div>
      </section>

<section id="atlas" className="ek-editorial-section ek-atlas-band" aria-labelledby="atlas-title">
        <header><small>07</small><h2 id="atlas-title">{text.atlas}</h2><a href="/atlas/">{text.viewAll} ↗</a></header>
        <div className="ek-atlas-copy"><p>{text.atlasText}</p><span>{text.disclosure}</span></div>
        <PreviewCards items={guides} language={language} />
      </section>

      <section id="app" className="ek-editorial-section ek-app-band" aria-labelledby="app-title">
        <header><small>08</small><h2 id="app-title">{text.app}</h2></header>
        <AppInstallCard text={text} />
      </section>

      <section id="shop" className="ek-editorial-section ek-shop-band" aria-labelledby="shop-title">
        <header><small>09</small><h2 id="shop-title">{text.shop}</h2><a href="/shop/">{text.viewAll} ↗</a></header>
        <p>{text.shopText}</p>
        <p><a href="/shop/presentations/">Explore presentation templates and custom cover design ↗</a></p>
        {products.length > 0 && <PreviewCards items={products} language={language} />}
      </section>

      <footer className="ek-scroll-footer">
        <div className="ek-footer-cols">
          <nav aria-label="Read"><h4>Read</h4><a href="/magazine/">Magazine</a><a href="/magazine/architectural-history-styles/">Architecture History</a><a href="/newsletter/">Newsletter</a><a href="/videos/">Videos</a></nav>
          <nav aria-label="Explore"><h4>Explore</h4><a href="/materials/">Materials Library</a><a href="/projects/">Virtual Tours</a><a href="/atlas/">Atlas</a><a href="/projects/">Projects</a></nav>
          <nav aria-label="Studio"><h4>Studio</h4><a href="/services/">Design Services</a><a href="/contact/">Contact</a><a href="/about/">About</a><a href="/editorial-team/">Editorial Team</a></nav>
          <nav aria-label="Shop"><h4>Shop</h4><a href="/shop/">All Products</a><a href="/shop/presentations/">Templates</a><a href="/prompts/">Prompt Packs</a></nav>
        </div>
        <div className="ek-footer-base">
          <span>WORLD ARCH JOURNAL · ARCHITECTURE MEDIA &amp; DESIGN</span>
          {socialLinks.length > 0 && <nav className="ek-social-links" aria-label="Social profiles">{socialLinks.map((item) => <a key={item.id || item.url} href={item.url} target="_blank" rel="me noopener noreferrer">{item.label}</a>)}</nav>}
          <nav aria-label="Legal"><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a><a href="/affiliate-disclosure/">Affiliate Disclosure</a><a href="/editorial-policy/">Editorial Policy</a><a href="/cookie-settings/">Cookie Settings</a></nav>
          <button type="button" onClick={onContact}>{text.contact} ↗</button>
        </div>
      </footer>
    </div>
  );
}
