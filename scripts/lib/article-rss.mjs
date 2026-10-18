export const articleFeedUrl = 'https://worldarchjournal.com/rss.xml';
export const articleFeedLink = `<link rel="alternate" type="application/rss+xml" title="World Arch Journal" href="${articleFeedUrl}" />`;

const escapeXml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;',
})[character]);

function publicationDate(article) {
  const value = article.publishedAt;
  const date = new Date(value);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '') || !Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    throw new Error(`Published article ${article.slug} needs a valid publishedAt date for RSS.`);
  }
  return date;
}

export function createArticleRss(articles) {
  const entries = articles.filter((article) => article.published).map((article) => {
    if (!article.title || !article.slug || !article.excerpt) throw new Error(`Incomplete RSS article: ${article.slug || '(missing slug)'}`);
    return { article, date: publicationDate(article), url: `https://worldarchjournal.com/articles/${article.slug}/` };
  }).sort((a, b) => b.date - a.date || a.article.slug.localeCompare(b.article.slug));
  if (new Set(entries.map((entry) => entry.url)).size !== entries.length) throw new Error('Duplicate article URL in RSS.');
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>World Arch Journal</title>
    <link>https://worldarchjournal.com/</link>
    <description>Practical architecture guides — facades, materials, passive cooling, daylight, villa design.</description>
    <language>en-us</language>
    <atom:link href="${articleFeedUrl}" rel="self" type="application/rss+xml" />
${entries.length ? `    <lastBuildDate>${entries[0].date.toUTCString()}</lastBuildDate>\n` : ''}${entries.map(({ article, date, url }) => `    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${escapeXml(url)}</link>
      <description>${escapeXml(article.excerpt)}</description>
      <pubDate>${date.toUTCString()}</pubDate>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
    </item>`).join('\n')}
  </channel>
</rss>
`;
}

// Covers copied standalone pages (Atlas, offline and 404) as well as generated pages.
// Idempotent so the main HTML template and this final pass cannot create duplicates.
export function withArticleFeedLink(html) {
  const withoutExisting = html.replace(/[ \t]*<link\b(?=[^>]*\brel=["']alternate["'])(?=[^>]*\btype=["']application\/rss\+xml["'])(?=[^>]*\bhref=["']https:\/\/worldarchjournal\.com\/rss\.xml["'])[^>]*>\s*/gi, '');
  if (!/<\/head\s*>/i.test(withoutExisting)) throw new Error('HTML page has no head for RSS discovery.');
  return withoutExisting.replace(/<\/head\s*>/i, `    ${articleFeedLink}\n  </head>`);
}
