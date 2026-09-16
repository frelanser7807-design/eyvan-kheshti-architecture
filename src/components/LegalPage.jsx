const pages = {
  '/privacy/': {
    eyebrow: 'LEGAL',
    title: 'Privacy Policy',
    intro: 'This policy explains the limited information World Arch Journal may receive through this website and how it is handled.',
    sections: [
      ['Information you provide', 'If you submit a project enquiry or newsletter request, we may receive the name, contact detail and message you choose to provide. Do not send payment details, passwords or confidential project records through a public form.'],
      ['Technical information', 'The hosting provider may process standard security and delivery logs such as IP address, browser type, requested page and time of access. Analytics and advertising cookies remain disabled until a compliant consent system and approved providers are configured.'],
      ['How information is used', 'Information is used to respond to enquiries, operate the website, prevent abuse and improve published content. It is not sold. A production retention schedule and data-request contact will be added before live form storage is enabled.'],
      ['Third-party services', 'Future integrations may include hosting, analytics, embedded media, payment, affiliate and advertising services. Their use will be disclosed here before activation, and consent will be requested where required.'],
      ['Your choices', 'You may decline optional cookies. When a production contact address is published, you may request access, correction or deletion of information associated with your enquiry, subject to applicable law.'],
    ],
  },
  '/terms/': {
    eyebrow: 'LEGAL',
    title: 'Terms of Use',
    intro: 'These terms govern access to the public information and portfolio material on this website.',
    sections: [
      ['Informational use', 'Published articles, city guides and project material are provided for general information and inspiration. They are not a substitute for project-specific architectural, engineering, legal, financial, travel, safety or accessibility advice.'],
      ['Intellectual property', 'Original text, visual identity, commissioned media and project presentations belong to World Arch Journal or their identified rights holders. No licence to copy, republish or commercially reuse them is granted unless stated in writing.'],
      ['Accuracy and availability', 'Reasonable care is taken during editorial review, but places, prices, regulations, opening hours and third-party services can change. Availability of the website or a specific feature is not guaranteed.'],
      ['Commercial services', 'A project enquiry does not create a contract. Scope, fees, schedule, jurisdiction, deliverables and payment terms require a separate written agreement. Store and payment features remain unavailable until their terms are published.'],
    ],
  },
  '/affiliate-disclosure/': {
    eyebrow: 'TRANSPARENCY',
    title: 'Affiliate Disclosure',
    intro: 'No affiliate links are active in the current preview. Future commercial relationships will be labelled clearly.',
    sections: [
      ['How affiliate links may work', 'A future WORLD ARCH ATLAS guide may include a clearly identified link to a third-party hotel, experience, transport or design product. World Arch Journal may receive a commission after a qualifying action without changing the user-facing price.'],
      ['Editorial independence', 'Commercial eligibility does not guarantee inclusion or a positive recommendation. Research, architecture relevance, usefulness and disclosure are required. Paid placement and affiliate relationships will be distinguished from editorial selection.'],
      ['User responsibility', 'Third-party availability, safety, pricing, cancellation, accessibility and service quality must be checked directly with the provider before booking or purchase.'],
    ],
  },
  '/editorial-policy/': {
    eyebrow: 'EDITORIAL',
    title: 'Editorial Policy',
    intro: 'World Arch Journal publishes original English architecture, interiors and architecture-led city content through a review-led workflow.',
    sections: [
      ['Sources and verification', 'Each automated research draft requires at least two independent, reviewable sources. RSS is used for discovery only. Material facts are checked and attributed before publication.'],
      ['AI-assisted workflow', 'AI tools may assist research organisation, drafting and image briefs. No draft is published automatically: a human editor reviews factual accuracy, originality, English quality, source links, media rights, SEO fields and advertising compliance.'],
      ['Images and rights', 'Source images are not reused by default. Published visuals must be original, commissioned, owner-supplied with permission, licensed for the intended use or otherwise documented as lawful.'],
      ['Corrections', 'Material errors should be corrected promptly and transparently. A public corrections contact will be added before editorial launch.'],
    ],
  },
  '/cookie-settings/': {
    eyebrow: 'PRIVACY',
    title: 'Cookie Settings',
    intro: 'Only essential website storage is intended for the current preview. Advertising and non-essential analytics remain disabled.',
    sections: [
      ['Current status', 'The preview may use browser storage for interface preferences and local demonstrations. It does not currently activate an AdSense advertising tag.'],
      ['Future consent controls', 'Before personalised advertising or non-essential analytics is activated, this page will provide real consent controls. Where required, a Google-certified consent management platform will record and communicate your choices.'],
    ],
  },
};

export function legalPageForPath(pathname) {
  const normalized = pathname.endsWith('/') ? pathname : `${pathname}/`;
  return pages[normalized] || null;
}

export default function LegalPage({ page }) {
  return (
    <main className="ek-legal-page" id="main-content">
      <a className="ek-legal-brand" href="/">WORLD ARCH JOURNAL <small>ARCHITECTURE &amp; INTERIORS</small></a>
      <article>
        <small>{page.eyebrow}</small>
        <h1>{page.title}</h1>
        <p className="ek-legal-intro">{page.intro}</p>
        <p className="ek-legal-date">Last updated: 8 September 2026</p>
        {page.sections.map(([title, body]) => <section key={title}><h2>{title}</h2><p>{body}</p></section>)}
      </article>
      <footer><a href="/">Return to the studio</a><span>Legal information will be reviewed again before commercial launch.</span></footer>
    </main>
  );
}

