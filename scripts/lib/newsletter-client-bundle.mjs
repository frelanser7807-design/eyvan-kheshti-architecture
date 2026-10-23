import * as newsletterData from '../../src/data/newsletters.js';
import { createHash } from 'node:crypto';

const payloadPath = (issue) => `assets/newsletter-content/${issue.slug}-${createHash('sha256').update(JSON.stringify(issue)).digest('hex').slice(0, 12)}.json`;

const isIssue = (value) => Boolean(value) && typeof value === 'object' && typeof value.slug === 'string' && Array.isArray(value.sections);

// Keep the complete issues in generated HTML and individual payloads, rather
// than shipping every issue's sections to every visitor in the entry
// JavaScript. Mirrors the articleClientBundle pattern: the browser catalog
// carries all issue metadata (titles, excerpts, images, sources, related
// links) and a contentUrl pointing at the full per-issue JSON payload, which
// NewsletterPage fetches on demand exactly like ArticleReader does.
const catalogEntry = (issue) => {
  const { sections, ...metadata } = issue;
  return { ...metadata, contentUrl: `/${payloadPath(issue)}` };
};

const catalogValue = (value) => {
  if (Array.isArray(value)) return value.map((entry) => (isIssue(entry) ? catalogEntry(entry) : entry));
  if (isIssue(value)) return catalogEntry(value);
  return value;
};

export function newsletterClientBundle() {
  return {
    name: 'newsletter-client-bundle',
    apply: 'build',
    transform(source, id) {
      if (!id.replaceAll('\\', '/').endsWith('/src/data/newsletters.js')) return null;
      const lines = [];
      for (const [name, value] of Object.entries(newsletterData)) {
        if (typeof value === 'function') continue;
        lines.push(`export const ${name} = ${JSON.stringify(catalogValue(value))};`);
      }
      // Functions cannot be serialised; keep them from the original source.
      lines.push(source.slice(source.indexOf('export const editorialPath')));
      return { code: lines.join('\n'), map: null };
    },
    generateBundle() {
      const seen = new Set();
      for (const issue of [...newsletterData.newsletterIssues, ...newsletterData.editorialArticles]) {
        if (!isIssue(issue) || seen.has(issue.slug)) continue;
        seen.add(issue.slug);
        this.emitFile({
          type: 'asset',
          fileName: payloadPath(issue),
          source: JSON.stringify(issue),
        });
      }
    },
  };
}
