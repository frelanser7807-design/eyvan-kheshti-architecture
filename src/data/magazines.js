import issueZero from '../../agent-system/examples/pilot-magazine-issue.json' with { type: 'json' };
import { articleBySlug } from './articles.js';

const source = issueZero;
const publishedFeatures = source.features
  .map((feature) => ({
    ...feature,
    article: feature.id === 'courtyard-wind-house-passive-cooling'
      ? articleBySlug('courtyard-wind-house-passive-cooling')
      : null,
  }))
  .filter((feature) => feature.article?.published);
const leadArticle = publishedFeatures[0]?.article;

export const magazines = [
  {
    id: `magazine-${source.issue.slug}`,
    number: source.issue.number,
    slug: source.issue.slug,
    title: source.issue.title,
    category: 'WORLD ARCH JOURNAL',
    meta: `${publishedFeatures.length} COMPLETE FEATURE · 5 ORIGINAL VISUALS`,
    excerpt: source.issue.summary,
    status: 'ISSUE PREVIEW · NOT FOR SALE',
    image: '/assets/editorial/issue-00/courtyard-wind-house-cover.jpg',
    imageAlt: 'Original Courtyard Wind House concept used for the architecture magazine Issue 00 cover',
    visualLabel: 'ORIGINAL CONCEPT COVER · WORLD ARCH JOURNAL, 2026',
    theme: source.editorial.theme,
    sourcePolicy: source.editorial.sourcePolicy,
    notebookLmRole: source.editorial.notebookLmRole,
    features: publishedFeatures,
    projectFacts: leadArticle?.facts || [],
    projectScope: leadArticle?.scope || '',
    spreads: [
      {
        pages: '04—05',
        kicker: 'STORY + CONCEPT',
        title: 'The House After the Grid',
        image: '/assets/editorial/issue-00/courtyard-wind-house-interior.jpg',
        alt: 'Courtyard Wind House concept interior opening onto a shaded planted court',
        caption: 'A deep veranda and a shaded courtyard turn the threshold into inhabitable climatic space. Original concept visualisation.',
      },
      {
        pages: '06—07',
        kicker: 'SPATIAL DIAGRAM',
        title: 'Five Moves, One Spatial System',
        image: '/assets/editorial/issue-00/courtyard-wind-house-passive-diagram.jpg',
        alt: 'Exploded axonometric showing five passive cooling ideas',
        caption: 'Shade, a complete air path, stack exhaust, thermal mass and night purge are separated for inspection. Performance not yet simulated.',
      },
      {
        pages: '08—09',
        kicker: 'PLAN + SECTION',
        title: 'Reading the Climate Through the Drawing',
        image: '/assets/editorial/issue-00/courtyard-wind-house-plan-section.jpg',
        alt: 'Concept plan and longitudinal section of Courtyard Wind House',
        caption: 'The paired drawing shows the continuous shaded route, planted courts and the proposed high-level exhaust path. Not for construction; not to scale.',
      },
      {
        pages: '10—11',
        kicker: 'IMAGE GALLERY · MATERIAL STUDY',
        title: 'Depth, Porosity and Shadow',
        image: '/assets/editorial/issue-00/courtyard-wind-house-material-detail.jpg',
        alt: 'Earthen wall, stone threshold, timber opening and terracotta screen detail',
        caption: 'A mineral and timber palette is studied as an environmental assembly, not surface decoration. Final build-ups require local verification.',
      },
    ],
    cover: source.cover,
    reviewFlags: source.qa.reviewFlags,
    published: true,
  },
];

export function magazineBySlug(slug) {
  return magazines.find((magazine) => magazine.slug === slug);
}
