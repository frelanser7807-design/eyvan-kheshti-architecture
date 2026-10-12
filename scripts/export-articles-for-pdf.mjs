import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { articles } from '../src/data/articles.js';

const args = process.argv.slice(2);
const outputArg = args.find((arg) => arg.startsWith('--output='))?.slice('--output='.length);
const slugs = args.filter((arg) => !arg.startsWith('--'));
const target = resolve(process.cwd(), outputArg || 'tmp/pdfs/article-pdf-source.json');
const candidates = articles
  .filter((article) => article.published)
  .filter((article) => !slugs.length || slugs.includes(article.slug));
if (slugs.length && slugs.some((slug) => !candidates.some((article) => article.slug === slug))) {
  throw new Error('One or more requested published article slugs were not found.');
}
const published = candidates
  .map((article) => ({
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    author: article.author,
    category: article.category,
    status: article.status,
    readingTime: article.meta,
    publishedAt: article.publishedAt,
    image: article.image,
    imageAlt: article.imageAlt,
    visualLabel: article.visualLabel,
    contentHtml: article.contentHtml,
    scope: article.scope,
    faq: article.faq || [],
    evidence: article.evidence || [],
    visuals: (article.visuals || [])
      .filter((visual) => /\.(?:jpe?g|png|webp)$/i.test(visual.src || ''))
      .slice(0, 3)
      .map((visual) => ({
      src: visual.src,
      alt: visual.alt,
      caption: visual.caption,
      sourceUrl: visual.sourceUrl,
      sourceLabel: visual.sourceLabel,
      })),
  }));

await writeFile(target, JSON.stringify(published, null, 2), 'utf8');
console.log(`Prepared ${published.length} published articles for PDF generation.`);
