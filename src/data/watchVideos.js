// Six existing hosted videos flagged by Google as being embedded in pages
// where the video is not the main content. Give each a dedicated watch page.
// Dates match the original content metadata where available; for clips without
// a historic publish date, they indicate the new watch page's publication date.
export const watchVideoEntries = [
  {
    slug: 'interior-design-presentation-template',
    title: 'Interior Design Presentation Template — Video Preview',
    description: 'Watch a visual preview of the editable interior design PowerPoint presentation, including project boards, room imagery and material presentation.',
    thumbnail: '/assets/shop/presentations/interior-design-presentation-template.png',
    file: '/assets/shop/presentations/interior-design-presentation-template.mp4',
    publishedAt: '2026-10-02',
    sourcePath: '/shop/interior-design-presentation-template/',
    sourceLabel: 'Interior Design Presentation Template',
  },
  {
    slug: 'luxury-bathroom-ai-video',
    title: 'Luxury Bathroom AI Video — Motion Example',
    description: 'Watch an architectural image-to-video example showing how a luxury bathroom concept is assembled into a finished interior visualisation.',
    thumbnail: '/assets/prompts/luxury-bathroom-ai-video/cover-brand-v2.png',
    file: '/assets/prompts/luxury-bathroom-ai-video/example-reel.mp4',
    publishedAt: '2026-10-18',
    sourcePath: '/prompts/luxury-bathroom-ai-video/',
    sourceLabel: 'Free Luxury Bathroom AI Video Prompt',
  },
  {
    slug: 'plan-3-winter-house-pov',
    title: 'Plan 3 Winter House — First-Person Video Example',
    description: 'Watch the short first-person architectural storyboard animation that moves from planning a winter house toward its final visualisation.',
    thumbnail: '/assets/prompts/plan-3-winter-house/storyboard.jpg',
    file: '/assets/prompts/plan-3-winter-house/example-short.mp4',
    publishedAt: '2026-10-03',
    sourcePath: '/prompts/plan-3-winter-house-pov/',
    sourceLabel: 'Plan 3 Winter House POV Prompt',
  },
  {
    slug: 'almora-villa-presentation-template',
    title: 'Almora Villa Architecture Presentation — Video Preview',
    description: 'Watch a short video preview of the Almora Villa architectural presentation layout and visual storytelling approach.',
    thumbnail: '/assets/shop/presentations/almora-villa/cover.jpg',
    file: '/assets/shop/presentations/almora-villa/promo.mp4',
    publishedAt: '2026-10-03',
    sourcePath: '/shop/almora-villa-architecture-presentation-template/',
    sourceLabel: 'Almora Villa Presentation Template',
  },
  {
    slug: 'world-arch-journal-digital-introduction',
    title: 'World Arch Journal — Digital Introduction',
    description: 'Watch a short cinematic introduction to the visual identity and architectural direction of World Arch Journal.',
    thumbnail: '/assets/film/posters/digital-founder-intro.jpg',
    file: '/assets/film/00-digital-founder-intro.mp4',
    publishedAt: '2026-10-18',
    sourcePath: '/',
    sourceLabel: 'World Arch Journal Homepage',
  },
  {
    slug: 'exact-final-frame-architectural-build',
    title: 'Exact Final-Frame Architectural Build — Video Example',
    description: 'Watch an example of a reference-locked animated architectural construction sequence ending on the original design image.',
    thumbnail: '/assets/prompts/exact-final-frame-architectural-build/final-frame.jpg',
    file: '/assets/prompts/exact-final-frame-architectural-build/example-reel.mp4',
    publishedAt: '2026-10-05',
    sourcePath: '/prompts/exact-final-frame-architectural-build/',
    sourceLabel: 'Exact Final-Frame Architectural Build Prompt',
  },
];

export const watchPagePath = (video) => `/videos/watch/${video.slug}/`;
export const watchVideoForSource = (sourcePath) => watchVideoEntries.find((video) => video.sourcePath === sourcePath) || null;
