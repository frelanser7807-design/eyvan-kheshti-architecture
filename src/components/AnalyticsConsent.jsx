import { useEffect, useState } from 'react';

const CONSENT_KEY = 'world_arch_analytics_consent_v1';
const MEASUREMENT_ID = String(import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-KWCNH012H1').trim();
const CLARITY_PROJECT_ID = String(import.meta.env.VITE_CLARITY_PROJECT_ID || '').trim();
const ATTRIBUTION_KEY = 'world_arch_attribution_v1';

function captureAttribution() {
  const params = new URLSearchParams(window.location.search);
  const campaign = Object.fromEntries(['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']
    .map((key) => [key, params.get(key) || ''])
    .filter(([, value]) => value));
  if (!Object.keys(campaign).length) return null;
  const payload = { ...campaign, landing_page: window.location.pathname, captured_at: new Date().toISOString() };
  localStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(payload));
  return payload;
}

function updateGoogleConsent(value) {
  if (typeof window.gtag !== 'function') return;
  window.gtag('consent', 'update', {
    analytics_storage: value === 'granted' ? 'granted' : 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
}

function loadGoogleAnalytics() {
  if (!MEASUREMENT_ID || document.getElementById('world-arch-ga4')) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    wait_for_update: 500,
  });
  updateGoogleConsent('granted');
  window.gtag('config', MEASUREMENT_ID, {
    anonymize_ip: true,
    allow_google_signals: false,
    send_page_view: true,
  });
  const attribution = captureAttribution();
  if (attribution && sessionStorage.getItem(`${ATTRIBUTION_KEY}_sent`) !== 'true') {
    window.gtag('event', 'campaign_landing', attribution);
    sessionStorage.setItem(`${ATTRIBUTION_KEY}_sent`, 'true');
  }
  const script = document.createElement('script');
  script.id = 'world-arch-ga4';
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(MEASUREMENT_ID)}`;
  document.head.appendChild(script);
}

function updateClarityConsent(value) {
  if (typeof window.clarity !== 'function') return;
  window.clarity('consentv2', {
    ad_Storage: 'denied',
    analytics_Storage: value === 'granted' ? 'granted' : 'denied',
  });
}

function loadMicrosoftClarity() {
  if (!CLARITY_PROJECT_ID || document.getElementById('world-arch-clarity')) return;
  window.clarity = window.clarity || function clarity() {
    (window.clarity.q = window.clarity.q || []).push(arguments);
  };
  updateClarityConsent('granted');
  const script = document.createElement('script');
  script.id = 'world-arch-clarity';
  script.async = true;
  script.src = `https://www.clarity.ms/tag/${encodeURIComponent(CLARITY_PROJECT_ID)}`;
  document.head.appendChild(script);
}

export function trackSiteEvent(name, parameters = {}) {
  if (localStorage.getItem(CONSENT_KEY) !== 'granted' || typeof window.gtag !== 'function') return;
  window.gtag('event', name, parameters);
}

export default function AnalyticsConsent() {
  const [choice, setChoice] = useState(() => localStorage.getItem(CONSENT_KEY) || 'unset');
  const [open, setOpen] = useState(() => !localStorage.getItem(CONSENT_KEY));

  useEffect(() => {
    if (choice === 'granted') {
      loadGoogleAnalytics();
      loadMicrosoftClarity();
    }
    if (choice === 'denied') {
      updateGoogleConsent('denied');
      updateClarityConsent('denied');
    }
  }, [choice]);

  useEffect(() => {
    if (choice !== 'granted') return undefined;

    const affiliateHosts = /(^|\.)(travelpayouts\.com|tp\.media|booking\.com|hotellook\.com|aviasales\.(com|ru)|getyourguide\.com|viator\.com)$/i;
    const handleClick = (event) => {
      const link = event.target.closest?.('a[href]');
      if (!link) return;
      let url;
      try { url = new URL(link.href, window.location.href); } catch { return; }
      const label = String(link.textContent || link.getAttribute('aria-label') || '').trim().slice(0, 100);

      if (url.protocol === 'mailto:' || url.protocol === 'tel:' || /(^|\.)wa\.me$/i.test(url.hostname)) {
        trackSiteEvent('contact_click', { contact_method: url.protocol.replace(':', '') || 'whatsapp', link_text: label });
      } else if (affiliateHosts.test(url.hostname) || link.dataset.affiliate === 'true') {
        trackSiteEvent('affiliate_click', { link_domain: url.hostname, link_text: label });
      } else if (url.origin === window.location.origin && /\.(pdf|zip)$/i.test(url.pathname)) {
        trackSiteEvent('file_download', {
          file_name: url.pathname.split('/').pop() || 'download',
          file_extension: url.pathname.split('.').pop().toLowerCase(),
          link_url: url.pathname,
          link_text: label,
        });
      } else if (url.origin !== window.location.origin) {
        trackSiteEvent('outbound_click', { link_domain: url.hostname, link_text: label });
      } else if (/^\/articles\//.test(url.pathname)) {
        trackSiteEvent('article_click', { link_url: url.pathname, link_text: label });
      } else if (/^\/videos\//.test(url.pathname)) {
        trackSiteEvent('video_story_click', { link_url: url.pathname, link_text: label });
      } else if (/^\/(projects|virtual-tours)(\/|$)/.test(url.pathname)) {
        trackSiteEvent('project_navigation_click', { link_url: url.pathname, link_text: label });
      }
    };
    const handleButtonClick = (event) => {
      const button = event.target.closest?.('button[data-analytics-event][data-analytics-label]');
      if (!button || button.disabled) return;
      trackSiteEvent(button.dataset.analyticsEvent, {
        cta_name: button.dataset.analyticsLabel,
        page_path: window.location.pathname,
      });
    };

    let deepScrollSent = false;
    const handleScroll = () => {
      if (deepScrollSent) return;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable > 0 && window.scrollY / scrollable >= 0.9) {
        deepScrollSent = true;
        trackSiteEvent('scroll_depth', { percent_scrolled: 90, page_path: window.location.pathname });
      }
    };

    document.addEventListener('click', handleClick);
    document.addEventListener('click', handleButtonClick);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('click', handleButtonClick);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [choice]);

  if (!MEASUREMENT_ID && !CLARITY_PROJECT_ID) return null;

  const saveChoice = (value) => {
    localStorage.setItem(CONSENT_KEY, value);
    setChoice(value);
    setOpen(false);
  };

  return (
    <>
      {open && (
        <aside className="wa-consent" role="dialog" aria-modal="false" aria-labelledby="wa-consent-title">
          <div>
            <strong id="wa-consent-title">Privacy choices</strong>
            <p>We use optional Google Analytics and Microsoft Clarity only with your permission to understand which public pages are useful. Advertising storage remains disabled.</p>
            <a href="/privacy/">Privacy policy</a>
          </div>
          <div className="wa-consent-actions">
            <button type="button" onClick={() => saveChoice('denied')}>Essential only</button>
            <button className="is-primary" type="button" onClick={() => saveChoice('granted')}>Allow analytics</button>
          </div>
        </aside>
      )}
      {!open && <button className="wa-privacy-trigger" type="button" onClick={() => setOpen(true)}>Privacy choices</button>}
    </>
  );
}
