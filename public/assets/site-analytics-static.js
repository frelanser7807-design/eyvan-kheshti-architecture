(() => {
  const script = document.currentScript;
  const measurementId = String(script?.dataset?.measurementId || '').trim();
  const clarityProjectId = String(script?.dataset?.clarityId || '').trim();
  if (!measurementId && !clarityProjectId) return;

  const consentKey = 'world_arch_analytics_consent_v1';
  const attributionKey = 'world_arch_attribution_v1';
  const affiliateHosts = /(^|\.)(travelpayouts\.com|tp\.media|booking\.com|hotellook\.com|aviasales\.(com|ru)|getyourguide\.com|viator\.com)$/i;

  const captureAttribution = () => {
    const params = new URLSearchParams(window.location.search);
    const campaign = Object.fromEntries(['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']
      .map((key) => [key, params.get(key) || ''])
      .filter(([, value]) => value));
    if (!Object.keys(campaign).length) return null;
    const payload = { ...campaign, landing_page: window.location.pathname, captured_at: new Date().toISOString() };
    localStorage.setItem(attributionKey, JSON.stringify(payload));
    return payload;
  };

  const updateConsent = (value) => {
    if (typeof window.gtag !== 'function') return;
    window.gtag('consent', 'update', {
      analytics_storage: value === 'granted' ? 'granted' : 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });
  };

  const loadAnalytics = () => {
    if (!measurementId) return;
    if (document.getElementById('world-arch-ga4')) return;
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
    updateConsent('granted');
    window.gtag('config', measurementId, {
      anonymize_ip: true,
      allow_google_signals: false,
      send_page_view: true,
    });
    const attribution = captureAttribution();
    if (attribution && sessionStorage.getItem(`${attributionKey}_sent`) !== 'true') {
      window.gtag('event', 'campaign_landing', attribution);
      sessionStorage.setItem(`${attributionKey}_sent`, 'true');
    }
    const tag = document.createElement('script');
    tag.id = 'world-arch-ga4';
    tag.async = true;
    tag.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    document.head.appendChild(tag);
  };

  const updateClarityConsent = (value) => {
    if (typeof window.clarity !== 'function') return;
    window.clarity('consentv2', {
      ad_Storage: 'denied',
      analytics_Storage: value === 'granted' ? 'granted' : 'denied',
    });
  };

  const loadClarity = () => {
    if (!clarityProjectId || document.getElementById('world-arch-clarity')) return;
    window.clarity = window.clarity || function clarity() {
      (window.clarity.q = window.clarity.q || []).push(arguments);
    };
    updateClarityConsent('granted');
    const tag = document.createElement('script');
    tag.id = 'world-arch-clarity';
    tag.async = true;
    tag.src = `https://www.clarity.ms/tag/${encodeURIComponent(clarityProjectId)}`;
    document.head.appendChild(tag);
  };

  const track = (name, parameters = {}) => {
    if (localStorage.getItem(consentKey) !== 'granted' || typeof window.gtag !== 'function') return;
    window.gtag('event', name, parameters);
  };

  const addStyles = () => {
    if (document.getElementById('wa-static-consent-style')) return;
    const style = document.createElement('style');
    style.id = 'wa-static-consent-style';
    style.textContent = '.wa-static-consent{position:fixed;z-index:2147483000;right:18px;bottom:18px;left:18px;display:flex;justify-content:space-between;gap:20px;align-items:center;max-width:760px;margin-left:auto;padding:18px;background:#171a18;color:#f5f1e9;border:1px solid #8d7658;box-shadow:0 18px 55px rgba(0,0,0,.28);font:14px/1.5 Arial,sans-serif}.wa-static-consent p{margin:4px 0}.wa-static-consent a{color:#dec496}.wa-static-consent-actions{display:flex;gap:8px;flex-wrap:wrap}.wa-static-consent button,.wa-static-privacy{border:1px solid #bda47b;background:#171a18;color:#f5f1e9;padding:10px 13px;cursor:pointer}.wa-static-consent button:last-child{background:#d6b77e;color:#171a18}.wa-static-privacy{position:fixed;z-index:2147482999;right:16px;bottom:16px;font-size:12px}@media(max-width:620px){.wa-static-consent{align-items:flex-start;flex-direction:column}.wa-static-consent-actions{width:100%}.wa-static-consent button{flex:1}}';
    document.head.appendChild(style);
  };

  const showChoices = () => {
    document.querySelector('.wa-static-consent')?.remove();
    document.querySelector('.wa-static-privacy')?.remove();
    const panel = document.createElement('aside');
    panel.className = 'wa-static-consent';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Privacy choices');
    const copy = document.createElement('div');
    const strong = document.createElement('strong');
    strong.textContent = 'Privacy choices';
    const paragraph = document.createElement('p');
    paragraph.textContent = 'We use optional Google Analytics and Microsoft Clarity only with your permission. Advertising storage remains disabled.';
    const privacy = document.createElement('a');
    privacy.href = '/privacy/';
    privacy.textContent = 'Privacy policy';
    copy.append(strong, paragraph, privacy);
    const actions = document.createElement('div');
    actions.className = 'wa-static-consent-actions';
    const essential = document.createElement('button');
    essential.type = 'button';
    essential.textContent = 'Essential only';
    const allow = document.createElement('button');
    allow.type = 'button';
    allow.textContent = 'Allow analytics';
    essential.addEventListener('click', () => saveChoice('denied'));
    allow.addEventListener('click', () => saveChoice('granted'));
    actions.append(essential, allow);
    panel.append(copy, actions);
    document.body.appendChild(panel);
  };

  const showTrigger = () => {
    document.querySelector('.wa-static-consent')?.remove();
    document.querySelector('.wa-static-privacy')?.remove();
    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'wa-static-privacy';
    trigger.textContent = 'Privacy choices';
    trigger.addEventListener('click', showChoices);
    document.body.appendChild(trigger);
  };

  function saveChoice(value) {
    localStorage.setItem(consentKey, value);
    if (value === 'granted') {
      loadAnalytics();
      loadClarity();
    } else {
      updateConsent('denied');
      updateClarityConsent('denied');
    }
    showTrigger();
  }

  addStyles();
  const choice = localStorage.getItem(consentKey);
  if (choice === 'granted') {
    loadAnalytics();
    loadClarity();
    showTrigger();
  } else if (choice === 'denied') {
    showTrigger();
  } else {
    showChoices();
  }

  document.addEventListener('click', (event) => {
    const link = event.target.closest?.('a[href]');
    if (!link) return;
    let url;
    try { url = new URL(link.href, window.location.href); } catch { return; }
    const label = String(link.textContent || link.getAttribute('aria-label') || '').trim().slice(0, 100);
    if (url.protocol === 'mailto:' || url.protocol === 'tel:' || /(^|\.)wa\.me$/i.test(url.hostname)) {
      track('contact_click', { contact_method: url.protocol.replace(':', '') || 'whatsapp', link_text: label });
    } else if (affiliateHosts.test(url.hostname) || link.dataset.affiliate === 'true') {
      track('affiliate_click', { link_domain: url.hostname, link_text: label });
    } else if (url.origin === window.location.origin && /\.(pdf|zip)$/i.test(url.pathname)) {
      track('file_download', {
        file_name: url.pathname.split('/').pop() || 'download',
        file_extension: url.pathname.split('.').pop().toLowerCase(),
        link_url: url.pathname,
        link_text: label,
      });
    } else if (url.origin !== window.location.origin) {
      track('outbound_click', { link_domain: url.hostname, link_text: label });
    } else if (/^\/articles\//.test(url.pathname)) {
      track('article_click', { link_url: url.pathname, link_text: label });
    } else if (/^\/videos\//.test(url.pathname)) {
      track('video_story_click', { link_url: url.pathname, link_text: label });
    } else if (url.origin === window.location.origin && /^\/(projects|virtual-tours)(\/|$)/.test(url.pathname)) {
      track('project_navigation_click', { link_url: url.pathname, link_text: label });
    }
  });

  document.addEventListener('click', (event) => {
    const button = event.target.closest?.('button[data-analytics-event][data-analytics-label]');
    if (!button || button.disabled) return;
    track(button.dataset.analyticsEvent, {
      cta_name: button.dataset.analyticsLabel,
      page_path: window.location.pathname,
    });
  });

  let deepScrollSent = false;
  window.addEventListener('scroll', () => {
    if (deepScrollSent) return;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollable > 0 && window.scrollY / scrollable >= 0.9) {
      deepScrollSent = true;
      track('scroll_depth', { percent_scrolled: 90, page_path: window.location.pathname });
    }
  }, { passive: true });
})();
