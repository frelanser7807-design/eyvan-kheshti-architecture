export const videoStories = [
  {
    slug: 'how-stone-arches-carry-load',
    title: 'How Stone Arches Carry Load',
    seoTitle: 'How Stone Arches Carry Load',
    description: 'A concise visual guide to centering, voussoirs, the keystone and the compression path that allows a masonry arch to stand.',
    category: 'Structures Explained',
    youtubeId: '0pE7K9EEYvg',
    thumbnail: 'https://i.ytimg.com/vi/0pE7K9EEYvg/maxresdefault.jpg',
    uploadDate: '2026-10-09',
    duration: 'PT41S',
    transcript: [
      'A flat stone lintel bends and develops tension as the span increases.',
      'Temporary timber centering defines the curve and supports the work during assembly.',
      'Wedge-shaped stones, called voussoirs, are fitted from both springing points toward the crown.',
      'The keystone closes the arch and completes a continuous path of compression.',
      'Once the masonry is stable, the centering can be removed and the load travels through the arch into its supports.',
    ],
    relatedArticleSlugs: ['brutalist-architecture-history-features-buildings', 'prefab-vs-modular-homes'],
    disclaimer: 'Educational concept visualisation only. It is not a construction guide or a substitute for structural engineering and local code review.',
    published: true,
  },
];

export const publishedVideoStories = videoStories.filter((video) => video.published);

export function videoStoryBySlug(slug) {
  return publishedVideoStories.find((video) => video.slug === slug);
}
