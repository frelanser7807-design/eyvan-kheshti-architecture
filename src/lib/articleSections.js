const utilityHeadings = new Set([
  'contents',
  'evidence and source notes',
  'frequently asked questions',
  'further reading',
  'project file',
  'related architecture stories',
  'related reading',
  'source notes',
]);

const reservedIds = new Set([
  'article-faq-title',
  'article-related-title',
  'article-reader-title',
  'article-sources-title',
  'article-toc-title',
  'main-content',
]);

const namedEntities = {
  amp: '&',
  apos: "'",
  copy: '©',
  deg: '°',
  gt: '>',
  hellip: '…',
  laquo: '«',
  ldquo: '“',
  lsquo: '‘',
  lt: '<',
  mdash: '—',
  middot: '·',
  nbsp: ' ',
  ndash: '–',
  quot: '"',
  raquo: '»',
  rdquo: '”',
  reg: '®',
  rsquo: '’',
  trade: '™',
};

function decodeEntities(value = '') {
  return String(value).replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (entity, code) => {
    if (code.startsWith('#x') || code.startsWith('#X')) {
      const number = Number.parseInt(code.slice(2), 16);
      return Number.isFinite(number) ? String.fromCodePoint(number) : entity;
    }
    if (code.startsWith('#')) {
      const number = Number.parseInt(code.slice(1), 10);
      return Number.isFinite(number) ? String.fromCodePoint(number) : entity;
    }
    return namedEntities[code.toLowerCase()] ?? entity;
  });
}

export function articleHeadingText(value = '') {
  return decodeEntities(String(value).replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
}

export function slugifyArticleHeading(value = '') {
  const slug = articleHeadingText(value)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ')
    .replace(/['’]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || 'section';
}

function uniqueArticleId(base, used) {
  let candidate = base;
  let suffix = 2;
  while (used.has(candidate)) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
  used.add(candidate);
  return candidate;
}

function attributesWithoutId(attributes = '') {
  return attributes
    .replace(/\s+id\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .trim();
}

function existingId(attributes = '') {
  const match = attributes.match(/\bid\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
  return (match?.[1] || match?.[2] || match?.[3] || '').trim();
}

function normalizedHeading(value = '') {
  return slugifyArticleHeading(value).replace(/-/g, ' ');
}

export function prepareArticleHtml(html = '') {
  const source = String(html || '');
  const used = new Set(reservedIds);
  for (const match of source.matchAll(/\bid\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi)) {
    const id = (match[1] || match[2] || match[3] || '').trim();
    if (id) used.add(id);
  }

  const sections = [];
  const preparedHtml = source.replace(/<h2\b([^>]*)>([\s\S]*?)<\/h2>/gi, (match, attributes, innerHtml) => {
    const label = articleHeadingText(innerHtml);
    const currentId = existingId(attributes);
    const hasCurrentId = /^[a-z0-9][a-z0-9-]*$/i.test(currentId);

    // Remove a valid current ID from the pre-seeded set before deciding
    // whether this heading may keep it; other occurrences remain reserved.
    if (hasCurrentId && !reservedIds.has(currentId)) {
      const occurrences = [...source.matchAll(new RegExp(`\\bid\\s*=\\s*(?:"${currentId}"|'${currentId}'|${currentId}(?=[\\s>]))`, 'gi'))].length;
      if (occurrences === 1) used.delete(currentId);
    }

    const baseId = hasCurrentId ? currentId : slugifyArticleHeading(label);
    const id = uniqueArticleId(baseId, used);
    const remainingAttributes = attributesWithoutId(attributes);

    if (label && !utilityHeadings.has(normalizedHeading(label))) {
      sections.push({ id, label });
    }

    return `<h2 id="${id}"${remainingAttributes ? ` ${remainingAttributes}` : ''}>${innerHtml}</h2>`;
  });

  return { html: preparedHtml, sections };
}
