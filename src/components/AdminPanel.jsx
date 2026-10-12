import { useEffect, useRef, useState } from 'react';
import { dataMode, deleteLead, deleteSubscriber, getLeads, getSubscribers, resetContent, saveContent } from '../lib/dataAdapter.js';

const sections = [
  ['overview', 'نمای کلی', '⌂'],
  ['identity', 'هویت و متن', 'Aa'],
  ['story', 'متن روی ویدئو', 'T'],
  ['services', 'خدمات', '✦'],
  ['projects', 'پروژه‌ها', '◇'],
  ['tutorials', 'آموزش‌ها', '▷'],
  ['insights', 'مطالب معماری', '≡'],
  ['guides', 'EYVAN ATLAS', '◎'],
  ['library', 'آبجکت و متریال', '▦'],
  ['products', 'دوره‌ها و فروش', '$'],
  ['commerce', 'فروش و پرداخت', '¤'],
  ['monetization', 'افیلیت و AdSense', '◉'],
  ['contact', 'راه‌های ارتباطی', '@'],
  ['leads', 'درخواست‌ها', '↙'],
  ['subscribers', 'اعضای خبرنامه', '✉'],
  ['integration', 'اتصال اپ', '⌁'],
];

function Field({ label, children, wide = false }) {
  return <label className={wide ? 'admin-field wide' : 'admin-field'}><span>{label}</span>{children}</label>;
}

export default function AdminPanel({ initialContent }) {
  const [authorized, setAuthorized] = useState(() => {
    try {
      return sessionStorage.getItem('eyvan_kheshti_demo_admin') === 'yes';
    } catch {
      return false;
    }
  });
  const [active, setActive] = useState('overview');
  const [content, setContent] = useState(initialContent);
  const [leads, setLeads] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [notice, setNotice] = useState('');
  const importRef = useRef(null);

  useEffect(() => setContent(initialContent), [initialContent]);
  useEffect(() => { getLeads().then(setLeads).catch(() => setLeads([])); }, [active]);
  useEffect(() => { getSubscribers().then(setSubscribers).catch(() => setSubscribers([])); }, [active]);

  const enterDemo = () => {
    try {
      sessionStorage.setItem('eyvan_kheshti_demo_admin', 'yes');
    } catch {
      // Session storage is optional in the local preview.
    }
    setAuthorized(true);
  };

  const updateBrand = (key, value) => setContent((current) => ({ ...current, brand: { ...current.brand, [key]: value } }));
  const updateSocialLink = (index, key, value) => setContent((current) => ({
    ...current,
    brand: {
      ...current.brand,
      socialLinks: current.brand.socialLinks.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item),
    },
  }));
  const addSocialLink = () => setContent((current) => ({
    ...current,
    brand: {
      ...current.brand,
      socialLinks: [...current.brand.socialLinks, { id: `social-${Date.now()}`, platform: 'custom', label: 'New Platform', url: '', enabled: false }],
    },
  }));
  const removeSocialLink = (index) => {
    if (!window.confirm('این راه ارتباطی از فهرست حذف شود؟')) return;
    setContent((current) => ({
      ...current,
      brand: { ...current.brand, socialLinks: current.brand.socialLinks.filter((_, itemIndex) => itemIndex !== index) },
    }));
  };
  const updateProject = (index, key, value) => setContent((current) => ({
    ...current,
    projects: current.projects.map((project, projectIndex) => projectIndex === index ? { ...project, [key]: value } : project),
  }));
  const updateService = (index, key, value) => setContent((current) => ({
    ...current,
    services: current.services.map((service, serviceIndex) => serviceIndex === index ? { ...service, [key]: value } : service),
  }));
  const updateStory = (index, key, value) => setContent((current) => ({
    ...current,
    story: current.story.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item),
  }));
  const updateCommerce = (key, value) => setContent((current) => ({ ...current, commerce: { ...current.commerce, [key]: value } }));
  const updateMonetization = (key, value) => setContent((current) => ({ ...current, monetization: { ...current.monetization, [key]: value } }));
  const updatePaymentProvider = (index, key, value) => setContent((current) => ({
    ...current,
    commerce: {
      ...current.commerce,
      providers: current.commerce.providers.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item),
    },
  }));
  const updateCollection = (collection, index, key, value) => setContent((current) => ({
    ...current,
    [collection]: current[collection].map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item),
  }));
  const removeLead = async (id) => {
    if (!window.confirm('این درخواست حذف شود؟')) return;
    try {
      await deleteLead(id);
      setLeads((current) => current.filter((lead) => lead.id !== id));
    } catch {
      setNotice('حذف درخواست انجام نشد.');
    }
  };
  const removeSubscriber = async (id) => {
    if (!window.confirm('این ایمیل از خبرنامه حذف شود؟')) return;
    try {
      await deleteSubscriber(id);
      setSubscribers((current) => current.filter((subscriber) => subscriber.id !== id));
    } catch {
      setNotice('حذف ایمیل انجام نشد.');
    }
  };
  const removeCollectionItem = (collection, index) => {
    if (!window.confirm('این مورد از فهرست حذف شود؟')) return;
    setContent((current) => ({ ...current, [collection]: current[collection].filter((_, itemIndex) => itemIndex !== index) }));
  };

  const persist = async () => {
    try {
      await saveContent(content);
      setNotice('تغییرات ذخیره شد و در پیش‌نمایش سایت قابل مشاهده است.');
    } catch {
      setNotice('ذخیره انجام نشد؛ اتصال داده یا فضای مرورگر را بررسی کنید.');
    }
    window.setTimeout(() => setNotice(''), 3500);
  };

  const addProject = () => setContent((current) => ({
    ...current,
    projects: [...current.projects, {
      id: 'project-' + Date.now(),
      scene: 'فضای تازه',
      title: 'پروژهٔ جدید',
      latinTitle: 'NEW PROJECT',
      type: 'معماری',
      location: 'قابل تغییر',
      year: '۱۴۰۵',
      description: 'توضیح کوتاه پروژه را اینجا بنویسید.',
      image: '',
      url: '',
      color: '#c99d68',
      published: false,
    }],
  }));

  const addEditorialItem = (collection, kind) => setContent((current) => ({
    ...current,
    [collection]: [...current[collection], {
      id: `${collection}-${Date.now()}`,
      title: kind === 'tutorial' ? 'New Tutorial' : kind === 'product' ? 'New Course' : kind === 'guide' ? 'New City Guide' : kind === 'library' ? 'New Library Item' : 'New Architecture Note',
      category: kind === 'tutorial' ? 'Architecture Tutorial' : kind === 'product' ? 'Online Course' : kind === 'guide' ? 'Architecture-led City Guide' : kind === 'library' ? 'Object or Material' : 'Architecture Note',
      meta: kind === 'tutorial' ? '08 MIN' : kind === 'product' ? 'COMING SOON' : kind === 'guide' ? 'DRAFT' : kind === 'library' ? 'FILE REVIEW REQUIRED' : 'EDITORIAL',
      excerpt: 'Write a short English introduction here.',
      image: '',
      url: '',
      ...(kind === 'product' ? { price: '', currency: 'USD' } : {}),
      ...(kind === 'library' ? { fileType: '', licence: '' } : {}),
      published: false,
    }],
  }));

  const exportContent = () => {
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'world-arch-journal-content.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const importContent = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const next = JSON.parse(await file.text());
      const requiredCollections = ['projects', 'services', 'tutorials', 'insights', 'guides', 'library', 'products', 'story'];
      if (!next.brand || !next.settings || !next.commerce || requiredCollections.some((key) => !Array.isArray(next[key]))) throw new Error('invalid');
      setContent(next);
      setNotice('فایل خوانده شد؛ برای اعمال نهایی «ذخیره تغییرات» را بزنید.');
    } catch {
      setNotice('ساختار فایل معتبر نیست.');
    } finally {
      event.target.value = '';
    }
  };

  if (!authorized) {
    return (
      <main className="admin-login">
        <div className="admin-login-art" aria-hidden="true"><span /><span /><span /></div>
        <section>
          <a className="admin-back" href="#home">← بازگشت به سایت</a>
          <p className="admin-kicker">ورلد آرک ژورنال / مرکز مدیریت</p>
          <h1>پنل مدیریت پروژه</h1>
          <p>این ورود، فقط برای مشاهدهٔ دموی محلی است. در نسخهٔ تجاری، احراز هویت سروری و سطح دسترسی مدیر فعال می‌شود.</p>
          <div className="demo-access-card"><i>●</i><div><b>محیط امنِ پیش‌نمایش</b><span>هیچ داده‌ای به اینترنت ارسال نمی‌شود.</span></div></div>
          <button className="admin-primary" onClick={enterDemo}>ورود به دموی مدیریت <span>↙</span></button>
        </section>
      </main>
    );
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <a className="admin-logo" href="#home"><span>ا</span><div><b>{content.brand.name}</b><small>مرکز مدیریت</small></div></a>
        <nav>
          {sections.map(([id, label, icon]) => (
            <button key={id} className={active === id ? 'is-active' : ''} onClick={() => setActive(id)}><i>{icon}</i>{label}</button>
          ))}
        </nav>
        <div className="admin-mode">
          <i className={dataMode === 'remote' ? 'online' : ''} />
          <span><b>{dataMode === 'remote' ? 'API متصل' : 'دموی محلی'}</b><small>{dataMode === 'remote' ? 'همگام با اپ' : 'ذخیره روی مرورگر'}</small></span>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div><p>پنل مدیریت</p><h1>{sections.find(([id]) => id === active)?.[1]}</h1></div>
          <div className="admin-header-actions"><a href="#home">مشاهده سایت ↗</a><button onClick={persist}>ذخیره تغییرات</button></div>
        </header>
        {notice && <div className="admin-notice" role="status">{notice}</div>}

        {active === 'overview' && (
          <section className="admin-section">
            <div className="admin-stat-grid">
              <article><span>پروژه‌های منتشرشده</span><b>{content.projects.filter((p) => p.published).length}</b><small>از {content.projects.length} پروژه</small></article>
              <article><span>درخواست‌های جدید</span><b>{leads.filter((lead) => lead.status === 'new').length}</b><small>ذخیره‌شده در این مرورگر</small></article>
              <article><span>اعضای خبرنامه</span><b>{subscribers.length}</b><small>ایمیل‌های ثبت‌شده</small></article>
              <article><span>وضعیت اپ</span><b className="stat-word">{content.settings.appSyncEnabled ? 'متصل' : 'آماده'}</b><small>API v1 طراحی شده</small></article>
            </div>
            <div className="admin-two-col">
              <article className="admin-card">
                <div className="card-heading"><div><p>وضعیت انتشار</p><h2>آماده‌سازی نسخهٔ مشتری</h2></div><span>PREVIEW</span></div>
                <div className="progress-ring"><b>78%</b><span /></div>
                <ul className="check-list"><li className="done">روایت سینمایی کلیکی</li><li className="done">پنل و مدیریت محتوای محلی</li><li className="done">قرارداد اتصال اپ</li><li>ورود امن و دیتابیس واقعی</li><li>دامنه و انتشار عمومی</li></ul>
              </article>
              <article className="admin-card recent-leads">
                <div className="card-heading"><div><p>آخرین درخواست‌ها</p><h2>صندوق همکاری</h2></div><button onClick={() => setActive('leads')}>مشاهده همه</button></div>
                {leads.length ? leads.slice(0, 3).map((lead) => (
                  <div className="lead-row" key={lead.id}><span>{lead.name?.slice(0, 1)}</span><div><b>{lead.name}</b><small>{lead.projectType} · {new Date(lead.createdAt).toLocaleDateString('fa-IR')}</small></div><i>جدید</i></div>
                )) : <div className="empty-state">هنوز درخواستی ثبت نشده است.</div>}
              </article>
            </div>
          </section>
        )}

        {active === 'identity' && (
          <section className="admin-section admin-form-section">
            <div className="section-title"><p>اطلاعات اصلی</p><h2>هویت و پیام برند</h2><span>متن‌های این بخش بلافاصله در سایت قابل استفاده‌اند.</span></div>
            <div className="admin-form-grid">
              <Field label="نام برند انگلیسی"><input dir="ltr" value={content.brand.name} onChange={(e) => updateBrand('name', e.target.value)} /></Field>
              <Field label="نام برند فارسی"><input value={content.brand.nameFa || ''} onChange={(e) => updateBrand('nameFa', e.target.value)} /></Field>
              <Field label="توضیح انگلیسی برند" wide><input dir="ltr" value={content.brand.latinName} onChange={(e) => updateBrand('latinName', e.target.value)} /></Field>
              <Field label="توضیح فارسی برند" wide><input value={content.brand.latinNameFa || ''} onChange={(e) => updateBrand('latinNameFa', e.target.value)} /></Field>
              <Field label="نام مؤسس به انگلیسی"><input dir="ltr" value={content.brand.founderName || ''} onChange={(e) => updateBrand('founderName', e.target.value)} /></Field>
              <Field label="نام مؤسس به فارسی"><input value={content.brand.founderNameFa || ''} onChange={(e) => updateBrand('founderNameFa', e.target.value)} /></Field>
              <Field label="عنوان حرفه‌ای مؤسس (انگلیسی)"><input dir="ltr" value={content.brand.founderRole || ''} onChange={(e) => updateBrand('founderRole', e.target.value)} /></Field>
              <Field label="عنوان حرفه‌ای مؤسس (فارسی)"><input value={content.brand.founderRoleFa || ''} onChange={(e) => updateBrand('founderRoleFa', e.target.value)} /></Field>
              <Field label="معرفی کوتاه انگلیسی" wide><input dir="ltr" value={content.brand.eyebrow} onChange={(e) => updateBrand('eyebrow', e.target.value)} /></Field>
              <Field label="معرفی کوتاه فارسی" wide><input value={content.brand.eyebrowFa || ''} onChange={(e) => updateBrand('eyebrowFa', e.target.value)} /></Field>
              <Field label="تیتر اصلی انگلیسی" wide><textarea dir="ltr" rows="3" value={content.brand.heroTitle} onChange={(e) => updateBrand('heroTitle', e.target.value)} /></Field>
              <Field label="تیتر اصلی فارسی" wide><textarea rows="3" value={content.brand.heroTitleFa || ''} onChange={(e) => updateBrand('heroTitleFa', e.target.value)} /></Field>
              <Field label="توضیح معرفی انگلیسی" wide><textarea dir="ltr" rows="4" value={content.brand.heroDescription} onChange={(e) => updateBrand('heroDescription', e.target.value)} /></Field>
              <Field label="توضیح معرفی فارسی" wide><textarea rows="4" value={content.brand.heroDescriptionFa || ''} onChange={(e) => updateBrand('heroDescriptionFa', e.target.value)} /></Field>
              <Field label="شهر"><input value={content.brand.city} onChange={(e) => updateBrand('city', e.target.value)} /></Field>
              <Field label="زبان عمومی سایت"><input value="English — locked for public release" dir="ltr" readOnly /></Field>
            </div>
          </section>
        )}

        {active === 'story' && (
          <section className="admin-section">
            <div className="section-title"><p>روایت سینمایی</p><h2>مدیریت تایپوگرافی هر ویدئو</h2><span>فقط اطلاعات واقعی و تأییدشده را وارد کنید. هر خط را در یک سطر جدا بنویسید.</span></div>
            <div className="project-editor-list">
              {content.story.map((item, index) => (
                <article className="project-editor" key={item.id}>
                  <div className="project-editor-index">{String(index + 1).padStart(2, '0')}</div>
                  <div className="project-editor-fields">
                    <Field label="برچسب انگلیسی"><input dir="ltr" value={item.code} onChange={(e) => updateStory(index, 'code', e.target.value)} /></Field>
                    <Field label="برچسب فارسی"><input value={item.codeFa || ''} onChange={(e) => updateStory(index, 'codeFa', e.target.value)} /></Field>
                    <Field label="عنوان انگلیسی"><input dir="ltr" value={item.title} onChange={(e) => updateStory(index, 'title', e.target.value)} /></Field>
                    <Field label="عنوان فارسی"><input value={item.titleFa || ''} onChange={(e) => updateStory(index, 'titleFa', e.target.value)} /></Field>
                    <Field label="خطوط انگلیسی" wide><textarea dir="ltr" rows="3" value={(item.lines || []).join('\n')} onChange={(e) => updateStory(index, 'lines', e.target.value.split('\n').filter(Boolean))} /></Field>
                    <Field label="خطوط فارسی" wide><textarea rows="3" value={(item.linesFa || []).join('\n')} onChange={(e) => updateStory(index, 'linesFa', e.target.value.split('\n').filter(Boolean))} /></Field>
                    <Field label="توضیح انگلیسی" wide><textarea dir="ltr" rows="3" value={item.text || ''} onChange={(e) => updateStory(index, 'text', e.target.value)} /></Field>
                    <Field label="توضیح فارسی" wide><textarea rows="3" value={item.textFa || ''} onChange={(e) => updateStory(index, 'textFa', e.target.value)} /></Field>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {active === 'projects' && (
          <section className="admin-section">
            <div className="section-title section-title-row">
              <div><p>محتوای سایت</p><h2>مدیریت پروژه‌ها</h2><span>سه پروژهٔ نخست در روایت سینمایی استفاده می‌شوند.</span></div>
              <button className="admin-secondary" onClick={addProject}>+ افزودن پروژه</button>
            </div>
            <div className="project-editor-list">
              {content.projects.map((project, index) => (
                <article className="project-editor" key={project.id}>
                  <div className="project-editor-index"><span style={{ background: project.color }} />{String(index + 1).padStart(2, '0')}</div>
                  <div className="project-editor-fields">
                    <Field label="نام پروژه"><input value={project.title} onChange={(e) => updateProject(index, 'title', e.target.value)} /></Field>
                    <Field label="نام فارسی"><input value={project.titleFa || ''} onChange={(e) => updateProject(index, 'titleFa', e.target.value)} /></Field>
                    <Field label="عنوان لاتین"><input dir="ltr" value={project.latinTitle} onChange={(e) => updateProject(index, 'latinTitle', e.target.value)} /></Field>
                    <Field label="نوع"><input value={project.type} onChange={(e) => updateProject(index, 'type', e.target.value)} /></Field>
                    <Field label="مکان"><input value={project.location} onChange={(e) => updateProject(index, 'location', e.target.value)} /></Field>
                    <Field label="سال"><input value={project.year} onChange={(e) => updateProject(index, 'year', e.target.value)} /></Field>
                    <Field label="فصل"><input value={project.scene} onChange={(e) => updateProject(index, 'scene', e.target.value)} /></Field>
                    <Field label="مسیر تصویر" wide><input dir="ltr" value={project.image || ''} placeholder="/assets/project.jpg یا https://…" onChange={(e) => updateProject(index, 'image', e.target.value)} /></Field>
                    <Field label="لینک صفحه پروژه" wide><input dir="ltr" value={project.url || ''} placeholder="https://…" onChange={(e) => updateProject(index, 'url', e.target.value)} /></Field>
                    <Field label="شرح پروژه" wide><textarea rows="3" value={project.description} onChange={(e) => updateProject(index, 'description', e.target.value)} /></Field>
                    <Field label="شرح فارسی" wide><textarea rows="3" value={project.descriptionFa || ''} onChange={(e) => updateProject(index, 'descriptionFa', e.target.value)} /></Field>
                  </div>
                  <label className="publish-toggle"><input type="checkbox" checked={project.published} onChange={(e) => updateProject(index, 'published', e.target.checked)} /><span /><b>{project.published ? 'منتشر' : 'پیش‌نویس'}</b></label>
                  <button className="admin-remove" type="button" onClick={() => removeCollectionItem('projects', index)}>حذف</button>
                </article>
              ))}
            </div>
          </section>
        )}

        {active === 'services' && (
          <section className="admin-section admin-form-section">
            <div className="section-title"><p>خدمات سایت</p><h2>خدمات روی ویدئوها</h2><span>هر ردیف به‌ترتیب روی یکی از فصل‌های سینمایی سایت نمایش داده می‌شود.</span></div>
            <div className="project-editor-list">
              {content.services.map((service, index) => (
                <article className="project-editor" key={service.id}>
                  <div className="project-editor-index">{service.number}</div>
                  <div className="project-editor-fields">
                    <Field label="عنوان انگلیسی"><input dir="ltr" value={service.title} onChange={(e) => updateService(index, 'title', e.target.value)} /></Field>
                    <Field label="عنوان فارسی"><input value={service.titleFa || ''} onChange={(e) => updateService(index, 'titleFa', e.target.value)} /></Field>
                    <Field label="عبارت‌های کلیدی"><input dir="ltr" value={service.detail || ''} onChange={(e) => updateService(index, 'detail', e.target.value)} /></Field>
                    <Field label="عبارت‌های کلیدی فارسی"><input value={service.detailFa || ''} onChange={(e) => updateService(index, 'detailFa', e.target.value)} /></Field>
                    <Field label="توضیح کوتاه" wide><textarea dir="ltr" rows="3" value={service.text} onChange={(e) => updateService(index, 'text', e.target.value)} /></Field>
                    <Field label="توضیح فارسی" wide><textarea rows="3" value={service.textFa || ''} onChange={(e) => updateService(index, 'textFa', e.target.value)} /></Field>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {active === 'tutorials' && (
          <section className="admin-section">
            <div className="section-title section-title-row"><div><p>محتوای آموزشی</p><h2>مدیریت آموزش‌ها</h2><span>عنوان، تصویر، زمان و لینک هر آموزش را وارد کنید.</span></div><button className="admin-secondary" onClick={() => addEditorialItem('tutorials', 'tutorial')}>+ افزودن آموزش</button></div>
            <div className="project-editor-list">
              {content.tutorials.map((item, index) => (
                <article className="project-editor" key={item.id}>
                  <div className="project-editor-index">{String(index + 1).padStart(2, '0')}</div>
                  <div className="project-editor-fields">
                    <Field label="عنوان انگلیسی" wide><input dir="ltr" value={item.title} onChange={(e) => updateCollection('tutorials', index, 'title', e.target.value)} /></Field>
                    <Field label="عنوان فارسی" wide><input value={item.titleFa || ''} onChange={(e) => updateCollection('tutorials', index, 'titleFa', e.target.value)} /></Field>
                    <Field label="دسته‌بندی"><input dir="ltr" value={item.category} onChange={(e) => updateCollection('tutorials', index, 'category', e.target.value)} /></Field>
                    <Field label="زمان یا مشخصات"><input dir="ltr" value={item.meta} onChange={(e) => updateCollection('tutorials', index, 'meta', e.target.value)} /></Field>
                    <Field label="مسیر تصویر" wide><input dir="ltr" value={item.image} placeholder="/assets/tutorial.jpg یا https://…" onChange={(e) => updateCollection('tutorials', index, 'image', e.target.value)} /></Field>
                    <Field label="لینک آموزش" wide><input dir="ltr" value={item.url} placeholder="https://…" onChange={(e) => updateCollection('tutorials', index, 'url', e.target.value)} /></Field>
                    <Field label="توضیح کوتاه انگلیسی" wide><textarea dir="ltr" rows="3" value={item.excerpt} onChange={(e) => updateCollection('tutorials', index, 'excerpt', e.target.value)} /></Field>
                    <Field label="توضیح کوتاه فارسی" wide><textarea rows="3" value={item.excerptFa || ''} onChange={(e) => updateCollection('tutorials', index, 'excerptFa', e.target.value)} /></Field>
                  </div>
                  <label className="publish-toggle"><input type="checkbox" checked={item.published} onChange={(e) => updateCollection('tutorials', index, 'published', e.target.checked)} /><span /><b>{item.published ? 'منتشر' : 'پیش‌نویس'}</b></label>
                  <button className="admin-remove" type="button" onClick={() => removeCollectionItem('tutorials', index)}>حذف</button>
                </article>
              ))}
            </div>
          </section>
        )}

        {active === 'insights' && (
          <section className="admin-section">
            <div className="section-title section-title-row"><div><p>مجله معماری</p><h2>مدیریت مطالب معماری</h2><span>یادداشت‌ها، تحلیل‌ها و اطلاعات معماری سایت را مدیریت کنید.</span></div><button className="admin-secondary" onClick={() => addEditorialItem('insights', 'insight')}>+ افزودن مطلب</button></div>
            <div className="project-editor-list">
              {content.insights.map((item, index) => (
                <article className="project-editor" key={item.id}>
                  <div className="project-editor-index">{String(index + 1).padStart(2, '0')}</div>
                  <div className="project-editor-fields">
                    <Field label="عنوان انگلیسی" wide><input dir="ltr" value={item.title} onChange={(e) => updateCollection('insights', index, 'title', e.target.value)} /></Field>
                    <Field label="عنوان فارسی" wide><input value={item.titleFa || ''} onChange={(e) => updateCollection('insights', index, 'titleFa', e.target.value)} /></Field>
                    <Field label="دسته‌بندی"><input dir="ltr" value={item.category} onChange={(e) => updateCollection('insights', index, 'category', e.target.value)} /></Field>
                    <Field label="تاریخ یا نوع"><input dir="ltr" value={item.meta} onChange={(e) => updateCollection('insights', index, 'meta', e.target.value)} /></Field>
                    <Field label="مسیر تصویر" wide><input dir="ltr" value={item.image} placeholder="/assets/note.jpg یا https://…" onChange={(e) => updateCollection('insights', index, 'image', e.target.value)} /></Field>
                    <Field label="لینک مطلب" wide><input dir="ltr" value={item.url} placeholder="https://…" onChange={(e) => updateCollection('insights', index, 'url', e.target.value)} /></Field>
                    <Field label="خلاصه انگلیسی" wide><textarea dir="ltr" rows="3" value={item.excerpt} onChange={(e) => updateCollection('insights', index, 'excerpt', e.target.value)} /></Field>
                    <Field label="خلاصه فارسی" wide><textarea rows="3" value={item.excerptFa || ''} onChange={(e) => updateCollection('insights', index, 'excerptFa', e.target.value)} /></Field>
                  </div>
                  <label className="publish-toggle"><input type="checkbox" checked={item.published} onChange={(e) => updateCollection('insights', index, 'published', e.target.checked)} /><span /><b>{item.published ? 'منتشر' : 'پیش‌نویس'}</b></label>
                  <button className="admin-remove" type="button" onClick={() => removeCollectionItem('insights', index)}>حذف</button>
                </article>
              ))}
            </div>
          </section>
        )}

        {active === 'guides' && (
          <section className="admin-section">
            <div className="section-title section-title-row"><div><p>Affiliate / EYVAN ATLAS</p><h2>کاتالوگ‌ها و راهنماهای شهری</h2><span>نسخهٔ عمومی انگلیسی است؛ انتشار هر راهنما فقط پس از کنترل منابع، حقوق تصویر و لینک‌های افیلیت انجام می‌شود.</span></div><button className="admin-secondary" onClick={() => addEditorialItem('guides', 'guide')}>+ افزودن راهنما</button></div>
            <div className="project-editor-list">
              {content.guides.map((item, index) => (
                <article className="project-editor" key={item.id}>
                  <div className="project-editor-index">{String(index + 1).padStart(2, '0')}</div>
                  <div className="project-editor-fields">
                    <Field label="عنوان انگلیسی" wide><input dir="ltr" value={item.title} onChange={(e) => updateCollection('guides', index, 'title', e.target.value)} /></Field>
                    <Field label="عنوان فارسی پشتیبان" wide><input value={item.titleFa || ''} onChange={(e) => updateCollection('guides', index, 'titleFa', e.target.value)} /></Field>
                    <Field label="دسته‌بندی"><input dir="ltr" value={item.category} onChange={(e) => updateCollection('guides', index, 'category', e.target.value)} /></Field>
                    <Field label="وضعیت تحقیق"><input dir="ltr" value={item.meta} onChange={(e) => updateCollection('guides', index, 'meta', e.target.value)} /></Field>
                    <Field label="مسیر تصویر" wide><input dir="ltr" value={item.image} placeholder="/assets/guide.jpg" onChange={(e) => updateCollection('guides', index, 'image', e.target.value)} /></Field>
                    <Field label="لینک صفحه راهنما" wide><input dir="ltr" value={item.url} placeholder="/atlas/city-guide" onChange={(e) => updateCollection('guides', index, 'url', e.target.value)} /></Field>
                    <Field label="خلاصه انگلیسی" wide><textarea dir="ltr" rows="3" value={item.excerpt} onChange={(e) => updateCollection('guides', index, 'excerpt', e.target.value)} /></Field>
                    <Field label="یادداشت فارسی مدیر" wide><textarea rows="3" value={item.excerptFa || ''} onChange={(e) => updateCollection('guides', index, 'excerptFa', e.target.value)} /></Field>
                  </div>
                  <label className="publish-toggle"><input type="checkbox" checked={item.published} onChange={(e) => updateCollection('guides', index, 'published', e.target.checked)} /><span /><b>{item.published ? 'نمایش عمومی' : 'پیش‌نویس'}</b></label>
                  <button className="admin-remove" type="button" onClick={() => removeCollectionItem('guides', index)}>حذف</button>
                </article>
              ))}
            </div>
          </section>
        )}

        {active === 'library' && (
          <section className="admin-section">
            <div className="section-title section-title-row"><div><p>Downloads</p><h2>کتابخانهٔ آبجکت و متریال</h2><span>فقط فایل‌هایی را منتشر کنید که مالکیت یا مجوز بازتوزیع آن‌ها مشخص باشد.</span></div><button className="admin-secondary" onClick={() => addEditorialItem('library', 'library')}>+ افزودن فایل</button></div>
            <div className="project-editor-list">
              {content.library.map((item, index) => (
                <article className="project-editor" key={item.id}>
                  <div className="project-editor-index">{String(index + 1).padStart(2, '0')}</div>
                  <div className="project-editor-fields">
                    <Field label="عنوان انگلیسی" wide><input dir="ltr" value={item.title} onChange={(e) => updateCollection('library', index, 'title', e.target.value)} /></Field>
                    <Field label="یادداشت فارسی مدیر" wide><input value={item.titleFa || ''} onChange={(e) => updateCollection('library', index, 'titleFa', e.target.value)} /></Field>
                    <Field label="دسته‌بندی"><input dir="ltr" value={item.category} onChange={(e) => updateCollection('library', index, 'category', e.target.value)} /></Field>
                    <Field label="نوع فایل"><input dir="ltr" value={item.fileType || ''} placeholder="ZIP / SKP / OBJ / PDF" onChange={(e) => updateCollection('library', index, 'fileType', e.target.value)} /></Field>
                    <Field label="نوع مجوز" wide><input dir="ltr" value={item.licence || ''} placeholder="Original / CC0 / Licensed for redistribution" onChange={(e) => updateCollection('library', index, 'licence', e.target.value)} /></Field>
                    <Field label="مسیر تصویر" wide><input dir="ltr" value={item.image} placeholder="/assets/library/item.jpg" onChange={(e) => updateCollection('library', index, 'image', e.target.value)} /></Field>
                    <Field label="لینک دانلود" wide><input dir="ltr" value={item.url} placeholder="https://…" onChange={(e) => updateCollection('library', index, 'url', e.target.value)} /></Field>
                    <Field label="توضیح انگلیسی" wide><textarea dir="ltr" rows="3" value={item.excerpt} onChange={(e) => updateCollection('library', index, 'excerpt', e.target.value)} /></Field>
                  </div>
                  <label className="publish-toggle"><input type="checkbox" checked={item.published} onChange={(e) => updateCollection('library', index, 'published', e.target.checked)} /><span /><b>{item.published ? 'نمایش عمومی' : 'پیش‌نویس'}</b></label>
                  <button className="admin-remove" type="button" onClick={() => removeCollectionItem('library', index)}>حذف</button>
                </article>
              ))}
            </div>
          </section>
        )}

        {active === 'contact' && (
          <section className="admin-section admin-form-section">
            <div className="section-title section-title-row"><div><p>تماس با ما</p><h2>راه‌های ارتباطی</h2><span>شبکه‌های اصلی از پیش آماده‌اند و در آینده هر پلتفرم دیگری را نیز می‌توانید اضافه کنید.</span></div><button className="admin-secondary" type="button" onClick={addSocialLink}>+ افزودن پلتفرم</button></div>
            <div className="admin-form-grid">
              <Field label="ایمیل"><input dir="ltr" value={content.brand.email} placeholder="hello@example.com" onChange={(e) => updateBrand('email', e.target.value)} /></Field>
              <Field label="تلفن"><input dir="ltr" value={content.brand.phone} placeholder="+44…" onChange={(e) => updateBrand('phone', e.target.value)} /></Field>
            </div>
            <div className="social-editor-list">
              {content.brand.socialLinks.map((item, index) => (
                <article className="social-editor-row" key={item.id}>
                  <Field label="نوع پلتفرم"><select dir="ltr" value={item.platform} onChange={(e) => updateSocialLink(index, 'platform', e.target.value)}><option value="whatsapp">WhatsApp</option><option value="telegram">Telegram</option><option value="instagram">Instagram</option><option value="youtube">YouTube</option><option value="linkedin">LinkedIn</option><option value="pinterest">Pinterest</option><option value="custom">Other / Custom</option></select></Field>
                  <Field label="نام نمایشی"><input dir="ltr" value={item.label} onChange={(e) => updateSocialLink(index, 'label', e.target.value)} /></Field>
                  <Field label="لینک یا نام کاربری" wide><input dir="ltr" value={item.url} placeholder="https://… یا @username" onChange={(e) => updateSocialLink(index, 'url', e.target.value)} /></Field>
                  <label className="social-enabled"><input type="checkbox" checked={item.enabled !== false} onChange={(e) => updateSocialLink(index, 'enabled', e.target.checked)} /><span>{item.enabled !== false ? 'نمایش در سایت' : 'مخفی'}</span></label>
                  <button className="admin-remove-inline" type="button" onClick={() => removeSocialLink(index)}>حذف</button>
                </article>
              ))}
            </div>
          </section>
        )}

        {active === 'products' && (
          <section className="admin-section">
            <div className="section-title section-title-row"><div><p>فروش آموزش</p><h2>دوره‌ها و محصولات آموزشی</h2><span>دوره‌ها تا زمان تأیید قیمت و درگاه در حالت پیش‌نویس باقی می‌مانند.</span></div><button className="admin-secondary" onClick={() => addEditorialItem('products', 'product')}>+ افزودن دوره</button></div>
            <div className="project-editor-list">
              {content.products.map((item, index) => (
                <article className="project-editor" key={item.id}>
                  <div className="project-editor-index">{String(index + 1).padStart(2, '0')}</div>
                  <div className="project-editor-fields">
                    <Field label="عنوان انگلیسی" wide><input dir="ltr" value={item.title} onChange={(e) => updateCollection('products', index, 'title', e.target.value)} /></Field>
                    <Field label="عنوان فارسی" wide><input value={item.titleFa || ''} onChange={(e) => updateCollection('products', index, 'titleFa', e.target.value)} /></Field>
                    <Field label="نوع محصول"><input dir="ltr" value={item.category} onChange={(e) => updateCollection('products', index, 'category', e.target.value)} /></Field>
                    <Field label="وضعیت یا مدت"><input dir="ltr" value={item.meta} onChange={(e) => updateCollection('products', index, 'meta', e.target.value)} /></Field>
                    <Field label="قیمت"><input dir="ltr" inputMode="decimal" value={item.price} placeholder="مثلاً 49" onChange={(e) => updateCollection('products', index, 'price', e.target.value)} /></Field>
                    <Field label="واحد پول"><input dir="ltr" value={item.currency} placeholder="USD" onChange={(e) => updateCollection('products', index, 'currency', e.target.value)} /></Field>
                    <Field label="مسیر تصویر" wide><input dir="ltr" value={item.image} placeholder="/assets/course.jpg یا https://…" onChange={(e) => updateCollection('products', index, 'image', e.target.value)} /></Field>
                    <Field label="لینک خرید یا صفحه دوره" wide><input dir="ltr" value={item.url} placeholder="پس از تأیید درگاه وارد شود" onChange={(e) => updateCollection('products', index, 'url', e.target.value)} /></Field>
                    <Field label="معرفی کوتاه انگلیسی" wide><textarea dir="ltr" rows="3" value={item.excerpt} onChange={(e) => updateCollection('products', index, 'excerpt', e.target.value)} /></Field>
                    <Field label="معرفی کوتاه فارسی" wide><textarea rows="3" value={item.excerptFa || ''} onChange={(e) => updateCollection('products', index, 'excerptFa', e.target.value)} /></Field>
                  </div>
                  <label className="publish-toggle"><input type="checkbox" checked={item.published} onChange={(e) => updateCollection('products', index, 'published', e.target.checked)} /><span /><b>{item.published ? 'منتشر' : 'پیش‌نویس'}</b></label>
                  <button className="admin-remove" type="button" onClick={() => removeCollectionItem('products', index)}>حذف</button>
                </article>
              ))}
            </div>
          </section>
        )}

        {active === 'commerce' && (
          <section className="admin-section admin-form-section">
            <div className="section-title"><p>زیرساخت تجاری</p><h2>فروشگاه و درگاه‌های پرداخت</h2><span>درگاه‌ها در این نسخه فقط پیکربندی می‌شوند؛ کلید محرمانه هرگز داخل مرورگر قرار نمی‌گیرد و اتصال نهایی از بک‌اند امن انجام می‌شود.</span></div>
            <div className="admin-form-grid">
              <Field label="ارز پیش‌فرض"><select dir="ltr" value={content.commerce.defaultCurrency || 'USD'} onChange={(e) => updateCommerce('defaultCurrency', e.target.value)}><option>USD</option><option>GBP</option><option>EUR</option><option>AED</option><option>IRR</option><option>IRT</option></select></Field>
              <Field label="لینک فروشگاه Etsy"><input dir="ltr" value={content.commerce.etsyUrl || ''} placeholder="https://www.etsy.com/shop/…" onChange={(e) => updateCommerce('etsyUrl', e.target.value)} /></Field>
              <Field label="وضعیت فروشگاه" wide><select value={content.commerce.storeEnabled ? 'enabled' : 'disabled'} onChange={(e) => updateCommerce('storeEnabled', e.target.value === 'enabled')}><option value="disabled">غیرفعال تا اتصال امن</option><option value="enabled">فعال پس از تکمیل درگاه</option></select></Field>
            </div>
            <div className="social-editor-list">
              {content.commerce.providers.map((provider, index) => (
                <article className="social-editor-row" key={provider.id}>
                  <Field label="درگاه"><input dir="ltr" value={provider.label} readOnly /></Field>
                  <Field label="منطقه"><input dir="ltr" value={provider.region} readOnly /></Field>
                  <Field label="حالت"><select dir="ltr" value={provider.mode || 'test'} onChange={(e) => updatePaymentProvider(index, 'mode', e.target.value)}><option value="test">Test / Sandbox</option><option value="live">Live / Production</option></select></Field>
                  <label className="social-enabled"><input type="checkbox" checked={provider.enabled === true} onChange={(e) => updatePaymentProvider(index, 'enabled', e.target.checked)} /><span>{provider.enabled ? 'آمادهٔ اتصال' : 'غیرفعال'}</span></label>
                </article>
              ))}
            </div>
            <div className="admin-card reset-card"><div><h3>قانون پایداری پرداخت</h3><p>هر تراکنش با شناسهٔ یکتا، وب‌هوک امضاشده، ثبت وضعیت و تلاش مجدد مدیریت می‌شود؛ شکست یک درگاه فقط همان پرداخت را متوقف می‌کند، نه کل سایت را.</p></div><span className="admin-status-badge">BACKEND REQUIRED</span></div>
          </section>
        )}

        {active === 'monetization' && (
          <section className="admin-section admin-form-section">
            <div className="section-title"><p>درآمدزایی مسئولانه</p><h2>Affiliate و Google AdSense</h2><span>کد تبلیغ تا احراز شرایط قانونی، تأیید حساب، صفحات حقوقی و CMP غیرفعال می‌ماند.</span></div>
            <div className="admin-form-grid">
              <Field label="وضعیت افیلیت"><select value={content.monetization.affiliateEnabled ? 'enabled' : 'disabled'} onChange={(e) => updateMonetization('affiliateEnabled', e.target.value === 'enabled')}><option value="disabled">غیرفعال / بدون لینک تجاری</option><option value="enabled">فعال پس از تأیید برنامه</option></select></Field>
              <Field label="شفاف‌سازی افیلیت"><select value={content.monetization.affiliateDisclosureEnabled ? 'enabled' : 'disabled'} onChange={(e) => updateMonetization('affiliateDisclosureEnabled', e.target.value === 'enabled')}><option value="enabled">نمایش اجباری</option><option value="disabled">غیرفعال</option></select></Field>
              <Field label="AdSense Publisher ID" wide><input dir="ltr" value={content.monetization.adsensePublisherId || ''} placeholder="ca-pub-… (بعد از تأیید قانونی)" onChange={(e) => updateMonetization('adsensePublisherId', e.target.value.trim())} /></Field>
              <Field label="وضعیت AdSense"><select value={content.monetization.adsenseEnabled ? 'enabled' : 'disabled'} onChange={(e) => updateMonetization('adsenseEnabled', e.target.value === 'enabled')}><option value="disabled">غیرفعال و امن</option><option value="enabled">فعال‌سازی فنی پس از تأیید</option></select></Field>
              <Field label="محل مجاز تبلیغ"><input dir="ltr" value="Journal & EYVAN ATLAS only" readOnly /></Field>
              <Field label="مدیریت رضایت"><select value={content.monetization.consentPlatform || 'not_configured'} onChange={(e) => updateMonetization('consentPlatform', e.target.value)}><option value="not_configured">هنوز تنظیم نشده</option><option value="google_cmp">Google-certified CMP</option><option value="third_party_cmp">Third-party certified CMP</option></select></Field>
            </div>
            <div className="admin-card reset-card"><div><h3>قانون انتشار</h3><p>تبلیغ در ویدئوی سینمایی، منوها، دکمه‌های دانلود، پنجرهٔ تماس و پنل مدیریت نمایش داده نمی‌شود. فعال‌سازی نهایی نیازمند حساب قانونی واجد شرایط و بازبینی سیاست‌های روز Google است.</p></div><span className="admin-status-badge">POLICY GATED</span></div>
          </section>
        )}

        {active === 'leads' && (
          <section className="admin-section">
            <div className="section-title"><p>ارتباط با مشتری</p><h2>درخواست‌های همکاری</h2><span>در نسخهٔ پیش‌نمایش، درخواست‌ها فقط روی همین مرورگر ذخیره می‌شوند.</span></div>
            <div className="leads-table" role="table" aria-label="درخواست‌های همکاری">
              <div className="leads-head" role="row"><span>نام</span><span>راه ارتباطی</span><span>نوع پروژه</span><span>تاریخ</span><span>وضعیت</span><span>مدیریت</span></div>
              {leads.map((lead) => (
                <div className="leads-row" role="row" key={lead.id}><b>{lead.name}</b><span dir="ltr">{lead.contact}</span><span>{lead.projectType}</span><span>{new Date(lead.createdAt).toLocaleDateString('fa-IR')}</span><i>جدید</i><button className="table-delete" type="button" onClick={() => removeLead(lead.id)}>حذف</button>{lead.message && <p>{lead.message}</p>}</div>
              ))}
              {!leads.length && <div className="empty-state large">هنوز درخواستی در فرم سایت ثبت نشده است.</div>}
            </div>
          </section>
        )}

        {active === 'subscribers' && (
          <section className="admin-section">
            <div className="section-title"><p>خبرنامه معماری</p><h2>ایمیل‌های ثبت‌شده</h2><span>در نسخهٔ پیش‌نمایش، ایمیل‌ها فقط روی همین مرورگر ذخیره می‌شوند.</span></div>
            <div className="subscribers-table" role="table" aria-label="اعضای خبرنامه">
              <div className="subscribers-head" role="row"><span>ایمیل</span><span>تاریخ عضویت</span><span>وضعیت</span><span>مدیریت</span></div>
              {subscribers.map((subscriber) => (
                <div className="subscribers-row" role="row" key={subscriber.id}><b dir="ltr">{subscriber.email}</b><span>{new Date(subscriber.createdAt).toLocaleDateString('fa-IR')}</span><i>فعال</i><button className="table-delete" type="button" onClick={() => removeSubscriber(subscriber.id)}>حذف</button></div>
              ))}
              {!subscribers.length && <div className="empty-state large">هنوز ایمیلی در خبرنامه ثبت نشده است.</div>}
            </div>
          </section>
        )}

        {active === 'integration' && (
          <section className="admin-section">
            <div className="section-title"><p>وب + اپلیکیشن</p><h2>مرکز اتصال داده</h2><span>سایت و اپ آینده از یک قرارداد داده استفاده می‌کنند.</span></div>
            <div className="integration-grid">
              <article className="admin-card api-card">
                <div className="api-status"><i /><span><b>قرارداد اتصال داده</b><small>نسخه 1.0 — آمادهٔ پیاده‌سازی</small></span></div>
                <h3>یک منبع محتوا برای همه‌جا</h3>
                <p>پروژه‌ها، خدمات و درخواست‌ها از مسیرهای ثابت خوانده می‌شوند؛ بنابراین اپ iOS/Android بدون وابستگی به ظاهر سایت توسعه پیدا می‌کند.</p>
                <div className="endpoint"><span>GET</span><code>/v1/site-content</code></div>
                <div className="endpoint"><span>GET</span><code>/v1/projects</code></div>
                <div className="endpoint"><span>GET</span><code>/v1/products</code></div>
                <div className="endpoint post"><span>POST</span><code>/v1/leads</code></div>
                <div className="endpoint post"><span>POST</span><code>/v1/subscribers</code></div>
              </article>
              <article className="admin-card sync-card">
                <div className="phone-mock"><span /><i /><b>W</b><small>اپ ورلد آرک ژورنال</small><em>آمادهٔ همگام‌سازی</em></div>
                <div><p className="eyebrow"><span />مرحلهٔ بعد</p><h3>اتصال بک‌اند واقعی</h3><ul><li>احراز هویت مدیر</li><li>فضای ذخیرهٔ تصاویر و مدل‌ها</li><li>اعلان درخواست‌های تازه در اپ</li><li>همگام‌سازی لحظه‌ای محتوا</li></ul></div>
              </article>
            </div>
            <div className="admin-card data-portability"><div><h3>مالکیت و جابه‌جایی داده</h3><p>محتوای پروژه را برای نسخهٔ پشتیبان یا انتقال به بک‌اند خروجی بگیرید.</p></div><div><button className="admin-secondary" onClick={exportContent}>دریافت JSON</button><button className="admin-secondary" onClick={() => importRef.current?.click()}>ورود JSON</button><input ref={importRef} hidden type="file" accept="application/json" onChange={importContent} /></div></div>
            <div className="admin-card reset-card">
              <div><h3>بازنشانی پیش‌نمایش</h3><p>این کار محتوای محلی را به نسخهٔ اولیه برمی‌گرداند.</p></div>
              <button className="admin-danger" onClick={async () => {
                if (!window.confirm('محتوای محلی بازنشانی شود؟')) return;
                try {
                  setContent(await resetContent());
                  setNotice('محتوای پیش‌نمایش به نسخهٔ اولیه بازگشت.');
                } catch {
                  setNotice('بازنشانی در حالت اتصال به سرور غیرفعال است.');
                }
              }}>بازنشانی محتوا</button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
