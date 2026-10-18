import { useState } from 'react';
import { defaultContent } from '../data/defaultContent.js';
import { submitLead } from '../lib/dataAdapter.js';

const shell = {
  background: 'var(--ink)',
  color: 'var(--paper)',
  minHeight: '100vh',
  padding: 'clamp(48px, 8vw, 110px) clamp(20px, 6vw, 72px) 80px',
};

const inner = { maxWidth: '1080px', margin: '0 auto' };
const eyebrow = {
  fontSize: '0.72rem',
  letterSpacing: '0.32em',
  textTransform: 'uppercase',
  color: 'var(--sand)',
  margin: '0 0 18px',
};
const title = {
  fontFamily: 'Georgia, serif',
  fontWeight: 400,
  fontSize: 'clamp(2rem, 5vw, 3.4rem)',
  lineHeight: 1.15,
  margin: '0 0 16px',
};
const intro = { color: 'var(--muted)', lineHeight: 1.8, maxWidth: '720px', margin: '0 0 12px' };

const columns = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '1px',
  background: 'var(--line)',
  border: '1px solid var(--line)',
  marginBottom: '56px',
};
const channelCard = { background: 'var(--ink)', padding: '28px' };
const channelLabel = { fontSize: '0.72rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--sand)', margin: '0 0 10px' };
const channelLink = { color: 'var(--paper)', fontSize: '1.05rem', textDecoration: 'none', borderBottom: '1px solid var(--sand)', paddingBottom: '2px' };
const channelHint = { color: 'var(--muted)', fontSize: '0.85rem', marginTop: '10px', lineHeight: 1.6 };

const formTitle = { fontFamily: 'Georgia, serif', fontSize: 'clamp(1.4rem, 2.6vw, 2rem)', fontWeight: 400, margin: '0 0 8px' };
const formHint = { color: 'var(--muted)', margin: '0 0 28px', lineHeight: 1.7 };
const field = { marginBottom: '20px' };
const label = { display: 'block', fontSize: '0.78rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '8px' };
const input = {
  width: '100%',
  boxSizing: 'border-box',
  background: 'transparent',
  border: '1px solid var(--line)',
  color: 'var(--paper)',
  padding: '13px 16px',
  fontSize: '1rem',
  fontFamily: 'inherit',
};
const submit = {
  padding: '14px 40px',
  border: '1px solid var(--sand)',
  background: 'var(--sand)',
  color: 'var(--ink)',
  letterSpacing: '0.18em',
  fontSize: '0.78rem',
  textTransform: 'uppercase',
  cursor: 'pointer',
  marginTop: '8px',
};
const submitDisabled = { ...submit, opacity: 0.55, cursor: 'wait' };
const note = { marginTop: '20px', lineHeight: 1.7 };
const noteOk = { ...note, color: 'var(--sand)' };
const noteErr = { ...note, color: '#e08a8a' };

export default function ContactPage() {
  const brand = defaultContent.brand || {};
  const services = defaultContent.services || [];
  const [form, setForm] = useState({ name: '', contact: '', projectType: 'Other', message: '' });
  const [status, setStatus] = useState('idle');

  const set = (key) => (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (status === 'sending') return;
    setStatus('sending');
    try {
      await submitLead(form);
      setStatus('sent');
      setForm({ name: '', contact: '', projectType: 'Other', message: '' });
    } catch {
      setStatus('error');
    }
  };

  const channels = [
    brand.whatsapp ? { label: 'WhatsApp', href: brand.whatsapp, text: 'Chat on WhatsApp', hint: 'Fastest reply — usually within a day.' } : null,
    brand.instagram ? { label: 'Instagram', href: brand.instagram, text: 'World Arch Journal', hint: 'See latest work and send a DM.' } : null,
    brand.linkedin ? { label: 'LinkedIn', href: brand.linkedin, text: 'World Arch Journal', hint: 'For professional enquiries.' } : null,
  ].filter(Boolean);

  return (
    <main style={shell}>
      <div style={inner}>
        <p style={eyebrow}>Contact</p>
        <h1 style={title}>Start your project.</h1>
        <p style={intro}>
          Tell us about your project — a facade, an interior, a set of visuals, or a presentation
          that needs to convince. We reply within 2 working days.
        </p>

        {channels.length > 0 ? (
          <div style={columns}>
            {channels.map((channel) => (
              <div key={channel.label} style={channelCard}>
                <p style={channelLabel}>{channel.label}</p>
                <a style={channelLink} href={channel.href} target="_blank" rel="noreferrer">{channel.text}</a>
                <p style={channelHint}>{channel.hint}</p>
              </div>
            ))}
          </div>
        ) : null}

        <h2 style={formTitle}>Project enquiry</h2>
        <p style={formHint}>Prefer writing? Send the brief below — it lands directly with the studio.</p>

        {status === 'sent' ? (
          <p style={noteOk}>Thank you — your enquiry was received. We will reply within 2 working days.</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={field}>
              <label style={label} htmlFor="contact-name">Name</label>
              <input style={input} id="contact-name" value={form.name} onChange={set('name')} required minLength={2} autoComplete="name" />
            </div>
            <div style={field}>
              <label style={label} htmlFor="contact-way">Email or phone</label>
              <input style={input} id="contact-way" value={form.contact} onChange={set('contact')} required minLength={3} autoComplete="email" dir="ltr" />
            </div>
            <div style={field}>
              <label style={label} htmlFor="contact-type">Project type</label>
              <select style={{ ...input, background: 'var(--ink)' }} id="contact-type" value={form.projectType} onChange={set('projectType')}>
                <option value="Other">Other</option>
                {services.map((service) => (
                  <option key={service.id} value={service.title}>{service.title}</option>
                ))}
              </select>
            </div>
            <div style={field}>
              <label style={label} htmlFor="contact-message">About the project</label>
              <textarea style={{ ...input, minHeight: '140px', resize: 'vertical' }} id="contact-message" value={form.message} onChange={set('message')} />
            </div>
            <button style={status === 'sending' ? submitDisabled : submit} type="submit" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending…' : 'Send enquiry'}
            </button>
            {status === 'error' ? (
              <p style={noteErr}>Something went wrong sending your enquiry. Please try WhatsApp or Instagram instead.</p>
            ) : null}
          </form>
        )}
      </div>
    </main>
  );
}
