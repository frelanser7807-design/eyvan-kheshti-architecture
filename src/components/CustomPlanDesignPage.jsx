import { useState } from 'react';
import { dataMode, submitLead } from '../lib/dataAdapter.js';
import './CustomPlanDesignPage.css';

const roles = ['Homeowner', 'Architect', 'Interior Designer', 'Developer', 'Contractor', 'Other'];
const services = ['Villa / residential design', 'Floor plan design', 'Facade design', 'Kitchen design', 'Living / reception design', 'Bathroom design', 'Courtyard / garden design', 'Roof garden design', 'Render-only concept options', 'Combined design package', 'Other'];
const budgets = ['Under £250', '£250–£500', '£500–£1,000', '£1,000–£2,500', '£2,500+', 'Not decided'];

export default function CustomPlanDesignPage({ brand = {} }) {
  const [status, setStatus] = useState('idle');
  const requestedService = new URLSearchParams(window.location.search).get('service') || '';
  const serviceValue = ({ 'villa-design': 'Villa / residential design', 'floor-plan': 'Floor plan design', facade: 'Facade design', kitchen: 'Kitchen design', 'living-reception': 'Living / reception design', bathroom: 'Bathroom design', 'courtyard-garden': 'Courtyard / garden design', 'roof-garden': 'Roof garden design', 'renders-only': 'Render-only concept options', 'combined-package': 'Combined design package' })[requestedService] || '';

  const submit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus('saving');
    const details = [
      `Client role: ${data.get('role')}`,
      `Service requested: ${data.get('service')}`,
      `Project location: ${data.get('location') || 'Not provided'}`,
      `Approximate area: ${data.get('area') || 'Not provided'}`,
      `Floors / rooms: ${data.get('scope') || 'Not provided'}`,
      `Budget range: ${data.get('budget')}`,
      `Target date: ${data.get('deadline') || 'Not provided'}`,
      '',
      'Project brief:',
      String(data.get('brief') || '').trim(),
    ].join('\n');

    try {
      await submitLead({
        name: String(data.get('name') || '').trim(),
        contact: String(data.get('contact') || '').trim(),
        projectType: `Custom Plan Design — ${data.get('service')}`,
        message: details,
      });
      form.reset();
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  const whatsapp = String(brand.whatsapp || '').replace(/\D/g, '');
  const whatsappUrl = whatsapp ? `https://wa.me/${whatsapp}?text=${encodeURIComponent('Hello, I would like to request a custom architectural plan design.')}` : '';

  return (
    <main className="plan-design-page">
      <a className="plan-design-brand" href="/">WORLD ARCH JOURNAL <small>BY FARNAZ</small></a>
      <section className="plan-design-hero">
        <div>
          <p className="plan-design-eyebrow">ARCHITECTURE &amp; INTERIOR DESIGN ENQUIRY</p>
          <h1>Tell us what you need.<br />We’ll shape the scope.</h1>
          <p className="plan-design-intro">For a single room, facade, garden, floor plan or a coordinated villa design. Tell us about your project and we’ll confirm the right service, deliverables, timing and fee before work begins.</p>
          <ul>
            <li>Choose one focused design service or combine several</li>
            <li>Render-only concepts are scoped separately from drawing packages</li>
            <li>Prices and deliverables will be confirmed before you commit</li>
          </ul>
          <p className="plan-design-note">Concept and presentation service only. Construction documents, engineering and local approvals must be completed or verified by appropriately licensed professionals.</p>
        </div>
        <aside aria-label="How the service works">
          <span>01</span><p><strong>Submit the brief</strong>Share the project type, size, location and goal.</p>
          <span>02</span><p><strong>Scope review</strong>We review fit, deliverables, timing and available references.</p>
          <span>03</span><p><strong>Proposal</strong>You receive a clear scope, price and next step before work begins.</p>
        </aside>
      </section>

      <section className="plan-design-form-section" id="request">
        <header>
          <p className="plan-design-eyebrow">PROJECT REQUEST</p>
          <h2>Start a design-service enquiry</h2>
          <p>Complete the essentials below. No payment is taken at this stage.</p>
        </header>

        {status === 'success' ? (
          <div className="plan-design-success" role="status">
            <b>✓</b>
            <h2>Your request has been received.</h2>
            <p>{dataMode === 'local-preview' ? 'Preview mode: the request was saved only in this browser.' : 'We will review the project information and reply through your chosen contact.'}</p>
            <a href="/">Return to World Arch Journal</a>
          </div>
        ) : (
          <form className="plan-design-form" onSubmit={submit}>
            <label><span>Full name *</span><input name="name" required minLength="2" maxLength="100" autoComplete="name" /></label>
            <label><span>Email or WhatsApp *</span><input name="contact" required minLength="3" maxLength="200" autoComplete="email" dir="ltr" /></label>
            <label><span>I am a… *</span><select name="role" required defaultValue=""><option value="" disabled>Select your role</option>{roles.map((role) => <option key={role}>{role}</option>)}</select></label>
            <label><span>Service needed *</span><select name="service" required defaultValue={serviceValue}><option value="" disabled>Select a service</option>{services.map((service) => <option key={service}>{service}</option>)}</select></label>
            <label><span>Project city / country</span><input name="location" maxLength="160" /></label>
            <label><span>Approximate area</span><input name="area" maxLength="80" placeholder="e.g. 180 m² / 1,900 sq ft" /></label>
            <label><span>Floors / rooms</span><input name="scope" maxLength="160" placeholder="e.g. 2 floors, 4 bedrooms" /></label>
            <label><span>Working budget *</span><select name="budget" required defaultValue="Not decided">{budgets.map((budget) => <option key={budget}>{budget}</option>)}</select></label>
            <label><span>Target date</span><input name="deadline" type="date" /></label>
            <label className="plan-design-wide"><span>Project brief *</span><textarea name="brief" required minLength="20" maxLength="3000" rows="6" placeholder="Tell us what exists now, what needs to change, and what a successful result looks like." /></label>
            <label className="plan-design-consent plan-design-wide"><input type="checkbox" required /> <span>I agree that my information may be used to review and respond to this project request.</span></label>
            {status === 'error' && <p className="plan-design-error plan-design-wide" role="alert">The request could not be saved. Please try again or use the direct contact option.</p>}
            <div className="plan-design-actions plan-design-wide">
              <button type="submit" disabled={status === 'saving'}>{status === 'saving' ? 'Submitting…' : 'Submit project request'} <span>↗</span></button>
              {whatsappUrl && <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">Prefer WhatsApp?</a>}
            </div>
          </form>
        )}
      </section>
    </main>
  );
}
