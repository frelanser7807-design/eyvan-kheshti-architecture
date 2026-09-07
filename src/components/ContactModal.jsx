import { useEffect, useRef, useState } from 'react';
import { dataMode, submitLead } from '../lib/dataAdapter.js';

function SocialIcon({ type }) {
  if (type === 'instagram') return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4.2" /><circle className="fill" cx="17.4" cy="6.7" r="1" /></svg>;
  if (type === 'telegram') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 4 3.8 10.6c-1.2.5-1.2 1.2-.2 1.5l4.4 1.4 1.7 5.1c.2.7.1 1 .8 1 .6 0 .9-.3 1.2-.6l2.2-2.1 4.6 3.4c.9.5 1.5.3 1.7-.8L23 6c.3-1.4-.5-2-2-2Z" /><path d="m8.6 13.3 10.2-6.4c.5-.3.9-.1.5.2l-8.4 7.6-.3 3.5" /></svg>;
  if (type === 'youtube') return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="5.5" width="19" height="13" rx="4" /><path className="fill" d="m10 9 5 3-5 3Z" /></svg>;
  if (type === 'linkedin') return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M8 10v7M8 7.4v.1M12 17v-4c0-1.8 1-3 2.6-3 1.5 0 2.4 1 2.4 3v4M12 10v7" /></svg>;
  if (type === 'pinterest') return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M10.4 18.2c.7-2.2.9-3 1.3-4.8-.6-1-.1-3 1.1-3 1 0 1.4.7 1.4 1.6 0 1-.6 2.5-1 3.8-.4 1.1.6 2 1.7 2 2 0 3.5-2.1 3.5-5.1 0-2.7-2-4.6-4.8-4.6-3.2 0-5.1 2.4-5.1 4.9 0 1 .4 2 1.1 2.5.1.1.1.2.1.4l-.4 1.5c-.1.4-.4.5-.8.3-1.5-.7-2.4-2.7-2.4-4.4 0-3.6 2.6-6.8 7.5-6.8 3.9 0 7 2.8 7 6.6 0 3.9-2.5 7.1-5.9 7.1-1.2 0-2.2-.6-2.6-1.3l-.7 2.7" /></svg>;
  if (type === 'whatsapp') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 11.7a8.4 8.4 0 0 1-12.4 7.4L3 20.5l1.4-5a8.4 8.4 0 1 1 16.1-3.8Z" /><path d="M8.2 7.7c.2-.5.5-.5.8-.5h.5c.2 0 .4.1.5.4l.8 2c.1.3.1.5-.1.8l-.6.8c-.2.2-.2.4 0 .7.7 1.2 1.7 2.1 3 2.7.3.1.5.1.7-.1l.9-1.1c.2-.3.5-.3.8-.2l2 .9c.3.1.5.3.5.6 0 .4-.2 1.5-1.1 2.1-.6.5-1.5.8-2.5.6-1.2-.2-2.8-.8-4.6-2.4-1.5-1.3-2.6-3-3-4.2-.4-1.2 0-2.5.5-3.1Z" /></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M8.5 12h7M12 8.5v7" /></svg>;
}

function socialUrl(type, value) {
  const cleaned = String(value || '').trim();
  if (!cleaned) return '';
  if (/^https?:\/\//i.test(cleaned)) return cleaned;
  if (type === 'whatsapp') {
    const digits = cleaned.replace(/\D/g, '');
    return digits ? `https://wa.me/${digits}` : '';
  }
  if (type === 'youtube' || type === 'linkedin' || type === 'pinterest' || type === 'custom') return '';
  const handle = cleaned.replace(/^@/, '').replace(/^\/+|\/+$/g, '');
  if (!handle) return '';
  return type === 'telegram' ? `https://t.me/${handle}` : `https://instagram.com/${handle}`;
}

const interfaceCopy = {
  en: {
    close: 'Close contact form', eyebrow: 'START A CONVERSATION', title: 'Where does your next project begin?',
    successTitle: 'Your enquiry has been saved.', successText: 'Your message is now in the studio enquiry list.', return: 'Return to the site',
    name: 'Full name', namePlaceholder: 'Your name', contact: 'Email or phone', contactPlaceholder: 'How may we reach you?',
    type: 'Project type', residential: 'Residential', commercial: 'Commercial', interior: 'Interior Design', renovation: 'Renovation', other: 'Other',
    message: 'Tell us about your project', messagePlaceholder: 'Location, scale, timeline or any important detail…',
    privacy: 'Your information is used only to respond to this enquiry.', error: 'The enquiry could not be saved. Please try again.', saving: 'Saving…', submit: 'Submit enquiry', soon: 'will be available soon', contactOn: 'Contact us on', email: 'Email',
  },
  fa: {
    close: 'بستن فرم ارتباط', eyebrow: 'شروع یک گفت‌وگو', title: 'پروژهٔ بعدی شما از کجا آغاز می‌شود؟',
    successTitle: 'درخواست شما ثبت شد.', successText: 'پیام شما در فهرست درخواست‌های استودیو ذخیره شد.', return: 'بازگشت به سایت',
    name: 'نام و نام خانوادگی', namePlaceholder: 'نام شما', contact: 'ایمیل یا تلفن', contactPlaceholder: 'چگونه با شما تماس بگیریم؟',
    type: 'نوع پروژه', residential: 'مسکونی', commercial: 'تجاری', interior: 'طراحی داخلی', renovation: 'بازسازی', other: 'سایر',
    message: 'دربارهٔ پروژه بگویید', messagePlaceholder: 'مکان، مقیاس، زمان‌بندی یا هر نکتهٔ مهم…',
    privacy: 'اطلاعات شما فقط برای پاسخ‌گویی به این درخواست استفاده می‌شود.', error: 'درخواست ذخیره نشد؛ دوباره تلاش کنید.', saving: 'در حال ذخیره…', submit: 'ثبت درخواست', soon: 'به‌زودی فعال می‌شود', contactOn: 'ارتباط از طریق', email: 'ایمیل',
  },
};

export default function ContactModal({ open, onClose, brand = {}, language = 'en' }) {
  const dialogRef = useRef(null);
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    if (!open) return undefined;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    const focusTimer = window.setTimeout(() => dialogRef.current?.querySelector('input')?.focus(), 80);
    document.body.style.overflow = 'hidden';
    setStatus('idle');

    const onKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = [...(dialogRef.current?.querySelectorAll('button, input, select, textarea, [href]') || [])]
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

  const submit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus('saving');
    const data = new FormData(form);
    try {
      await submitLead({
        name: String(data.get('name') || '').trim(),
        contact: String(data.get('contact') || '').trim(),
        projectType: data.get('projectType'),
        message: String(data.get('message') || '').trim(),
      });
      form.reset();
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  if (!open) return null;
  const copy = interfaceCopy[language] || interfaceCopy.en;

  const fallbackSocials = [
    { id: 'whatsapp', platform: 'whatsapp', label: 'WhatsApp', url: brand.whatsapp },
    { id: 'telegram', platform: 'telegram', label: 'Telegram', url: brand.telegram },
    { id: 'instagram', platform: 'instagram', label: 'Instagram', url: brand.instagram },
    { id: 'youtube', platform: 'youtube', label: 'YouTube', url: brand.youtube },
    { id: 'linkedin', platform: 'linkedin', label: 'LinkedIn', url: brand.linkedin },
    { id: 'pinterest', platform: 'pinterest', label: 'Pinterest', url: brand.pinterest },
  ];
  const socialLinks = Array.isArray(brand.socialLinks) && brand.socialLinks.length ? brand.socialLinks : fallbackSocials;
  const socials = socialLinks
    .filter((item) => item.enabled !== false)
    .map((item) => {
      const legacyValue = brand[item.platform] || '';
      return [item.platform || 'custom', item.label || 'Website', socialUrl(item.platform || 'custom', item.url || legacyValue), item.id];
    });

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section ref={dialogRef} className={`contact-modal ${language === 'fa' ? 'is-fa' : ''}`} dir={language === 'fa' ? 'rtl' : 'ltr'} role="dialog" aria-modal="true" aria-labelledby="contact-title">
        <button className="modal-close" onClick={onClose} aria-label={copy.close}>×</button>
        <p className="eyebrow"><span />{copy.eyebrow}</p>
        <h2 id="contact-title">{copy.title}</h2>
        <div className="contact-direct" aria-label="Direct contact channels">
          {socials.map(([type, label, href, id]) => href ? (
            <a key={id || `${type}-${label}`} href={href} target="_blank" rel="noopener noreferrer" aria-label={`${copy.contactOn} ${label}`}><SocialIcon type={type} /><span>{label}</span></a>
          ) : (
            <span className="is-disabled" key={id || `${type}-${label}`} aria-label={`${label} ${copy.soon}`}><SocialIcon type={type} /><span>{label}</span></span>
          ))}
          {brand.email && <a className="contact-email" href={`mailto:${brand.email}`}><b>{brand.email}</b><span>{copy.email}</span></a>}
        </div>
        {status === 'success' ? (
          <div className="form-success" role="status">
            <i>✓</i>
            <h3>{copy.successTitle}</h3>
            <p>{dataMode === 'local-preview' ? (language === 'fa' ? 'پیش‌نمایش: پیام فقط در همین مرورگر ذخیره شد و به استودیو ارسال نشده است.' : 'Preview: saved only in this browser. This message has not been sent to the studio.') : copy.successText}</p>
            <button className="button button-primary" onClick={onClose}>{copy.return}</button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <label><span>{copy.name}</span><input name="name" autoComplete="name" required minLength="2" maxLength="100" placeholder={copy.namePlaceholder} /></label>
            <label><span>{copy.contact}</span><input name="contact" autoComplete="email" required minLength="3" maxLength="200" placeholder={copy.contactPlaceholder} dir="ltr" /></label>
            <label><span>{copy.type}</span>
              <select name="projectType" defaultValue="Residential">
                <option value="Residential">{copy.residential}</option><option value="Commercial">{copy.commercial}</option><option value="Interior Design">{copy.interior}</option><option value="Renovation">{copy.renovation}</option><option value="Other">{copy.other}</option>
              </select>
            </label>
            <label className="form-wide"><span>{copy.message}</span><textarea name="message" rows="4" maxLength="2000" placeholder={copy.messagePlaceholder} /></label>
            <p className="privacy-note">{copy.privacy}</p>
            {status === 'error' && <p className="form-error" role="alert">{copy.error}</p>}
            <button className="button button-primary form-submit" disabled={status === 'saving'}>{status === 'saving' ? copy.saving : copy.submit}<span>↗</span></button>
          </form>
        )}
      </section>
    </div>
  );
}
