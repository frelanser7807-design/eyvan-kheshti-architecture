import { articles } from './articles.js';

// A topic only becomes a public landing page after it has a real article.
const definitions = [
  {
    slug: 'climate-design',
    title: 'Climate Design',
    description: 'Architecture shaped by sun, air, heat and the realities of place.',
    articleSlugs: ['climate-responsive-facades-cooling-design', 'courtyard-wind-house-passive-cooling'],
  },
  {
    slug: 'facades',
    title: 'Facades',
    description: 'Building envelopes explained through performance, detail and design.',
    articleSlugs: ['climate-responsive-facades-cooling-design'],
  },
  {
    slug: 'concept-studies',
    title: 'Concept Studies',
    description: 'Original architectural ideas, with evidence and speculation clearly separated.',
    articleSlugs: ['courtyard-wind-house-passive-cooling'],
  },
  {
    slug: 'adaptive-reuse',
    title: 'Adaptive Reuse',
    description: 'What existing buildings can teach us about value, materials and change.',
    articleSlugs: ['adaptive-reuse-architecture-preserve-value'],
  },
  {
    slug: 'bim-revit',
    title: 'BIM & Revit',
    description: 'Model-based design, documentation and practical digital workflows.',
    articleSlugs: [],
  },
];

export const publishedMagazineArticles = articles.filter((article) => article.published);

export const magazineCategories = definitions
  .map((category) => ({
    ...category,
    articles: publishedMagazineArticles.filter((article) => category.articleSlugs.includes(article.slug)),
  }))
  .filter((category) => category.articles.length > 0);

export function magazineCategoryBySlug(slug) {
  return magazineCategories.find((category) => category.slug === slug);
}
