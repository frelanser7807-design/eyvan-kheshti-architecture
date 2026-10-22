import { articles } from '../../src/data/articles.js';
import { createHash } from 'node:crypto';

const payloadPath = (article) => `assets/article-content/${article.slug}-${createHash('sha256').update(JSON.stringify(article)).digest('hex').slice(0, 12)}.json`;

// Keep the complete articles in generated HTML and individual payloads, rather
// than shipping every article body to every visitor in the entry JavaScript.
export function articleClientBundle() {
  return {
    name: 'article-client-bundle',
    apply: 'build',
    transform(source, id) {
      if (!id.replaceAll('\\', '/').endsWith('/src/data/articles.js')) return null;
      const catalog = articles.map(({ contentHtml, ...metadata }) => ({ ...metadata, contentUrl: `/${payloadPath(articles.find((item) => item.slug === metadata.slug))}` }));
      return {
        code: `export const articles = ${JSON.stringify(catalog)};\n${source.slice(source.indexOf('export function articleBySlug'))}`,
        map: null,
      };
    },
    generateBundle() {
      for (const article of articles.filter((item) => item.published)) {
        this.emitFile({
          type: 'asset',
          fileName: payloadPath(article),
          source: JSON.stringify(article),
        });
      }
    },
  };
}
