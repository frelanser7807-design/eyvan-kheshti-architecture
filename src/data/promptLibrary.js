export const promptCategories = [
  { slug: 'website', title: 'Website Prompts', short: 'Web', description: 'Structured prompts for editorial architecture websites, portfolios and landing pages.' },
  { slug: 'image', title: 'Image Prompts', short: 'Image', description: 'Art-directed prompts for facades, interiors, materials and architectural visualisation.' },
  { slug: 'video', title: 'Video Prompts', short: 'Video', description: 'Camera, light and transformation prompts for short architectural motion.' },
  { slug: 'logo-motion', title: 'Logo Motion Prompts', short: 'Logo Motion', description: 'Concise motion systems for architectural marks, monograms and title cards.' },
  { slug: 'animated-backgrounds', title: 'Animated Backgrounds', short: 'Backgrounds', description: 'Loop-ready moving backgrounds for architectural reels, titles, websites and presentations.' },
];

export const promptItems = [
  {
    id: 'editorial-architecture-homepage',
    category: 'website',
    access: 'free',
    title: 'Editorial Architecture Homepage',
    summary: 'A refined, magazine-led homepage for an architecture studio or journal.',
    image: '/assets/articles/bim-vs-cad/photos/architecture-studio-plans.jpg',
    tool: 'Gemini · ChatGPT · Claude · AI site builders',
    promptLabel: 'Website prompt',
    prompt: 'Design a responsive editorial website for an international architecture studio and journal. Use a restrained warm-neutral palette, generous whitespace, a refined serif display typeface, a highly legible sans-serif body typeface and a modular grid. The homepage must include one cinematic hero, selected projects, evidence-led magazine stories, an architecture atlas, services, a clear contact action and a minimal footer. Keep navigation simple, loading fast and mobile behaviour deliberate. Avoid generic agency cards, excessive gradients, glassmorphism, fake awards and decorative motion that delays reading. Return the information architecture, desktop and mobile layout, component list, accessibility notes and production-ready interface copy.',
    secondaryLabel: 'Mobile refinement prompt',
    secondaryPrompt: 'Refine the proposed architecture homepage for a 390px mobile viewport. Preserve editorial hierarchy, reduce decorative motion, use touch targets of at least 44px, keep the hero readable without autoplay audio, lazy-load below-the-fold media and make every primary section reachable within two taps.',
  },
  {
    id: 'cinematic-studio-website-system',
    category: 'website',
    access: 'premium',
    title: 'Cinematic Studio Website System',
    summary: 'A complete multi-page prompt system covering brand, UX, motion, SEO and conversion states.',
    image: '/assets/candidates/office-world/scene-04-upper-floor-atelier-v1.png',
    tool: 'Professional pack · 12 coordinated prompts',
  },
  {
    id: 'warm-brick-facade',
    category: 'image',
    access: 'free',
    title: 'Warm Brick Facade',
    summary: 'Turn a simple residential mass into a believable, climate-aware brick facade.',
    image: '/assets/articles/climate-responsive-facades/climate-responsive-facade-hero-v1.jpg',
    tool: 'Gemini · ChatGPT Image · Midjourney',
    promptLabel: 'Image prompt',
    prompt: 'Transform this simple architectural massing into a photorealistic contemporary residential facade. Use warm handmade brick, deep recessed windows, slim dark-metal frames, climate-responsive horizontal shading, a clearly defined entrance, realistic construction joints and restrained native landscaping. Preserve the original building proportions and camera position. Soft late-afternoon daylight, natural shadows, realistic material weathering, professional architectural photography, eye-level view, 35mm lens, high spatial clarity, no fantasy geometry, no distorted windows, no text, no logos, no people.',
    secondaryLabel: 'Negative prompt',
    secondaryPrompt: 'distorted structure, impossible cantilevers, random windows, melted brick, plastic materials, excessive reflections, oversaturated sky, fisheye lens, text, watermark, logo, duplicated objects, fantasy vegetation',
  },
  {
    id: 'climate-facade-visual-pack',
    category: 'image',
    access: 'premium',
    title: 'Climate-Responsive Facade Visual Pack',
    summary: 'A tested family of facade prompts organised by climate, orientation, material and camera.',
    image: '/assets/articles/biophilic-design/oasia-hotel-downtown.jpg',
    tool: 'Professional pack · 24 image prompts',
  },
  {
    id: 'facade-material-reveal',
    category: 'video',
    access: 'free',
    title: 'Facade Material Reveal',
    summary: 'Animate a still facade as materials assemble without changing the architecture.',
    image: '/assets/articles/adaptive-reuse-architecture/adaptive-reuse-concept-v1.webp',
    tool: 'Veo · Kling · Runway · image-to-video',
    promptLabel: 'Video prompt',
    prompt: 'Create a 7-second image-to-video shot from the supplied architectural facade image. Keep the building geometry, window positions, camera and surrounding context locked. Begin with a quiet neutral massing, then reveal the final brick, dark metal and glass materials through a controlled left-to-right construction sweep. Add only subtle movement in nearby planting and soft late-afternoon light. Finish with a stable two-second hero frame. No camera orbit, no new floors, no moving windows, no warped edges, no text and no people.',
    secondaryLabel: 'Motion settings',
    secondaryPrompt: 'Duration 7 seconds · 24 fps · vertical 9:16 · locked eye-level camera · low motion strength · final-frame hold 2 seconds',
  },
  {
    id: 'architectural-day-night-motion-pack',
    category: 'video',
    access: 'premium',
    title: 'Architectural Day-to-Night Motion Pack',
    summary: 'Camera-safe transitions, interior-light cues and weather variants for short-form video.',
    image: '/assets/articles/adaptive-reuse-architecture/coal-drops-yard-v1.webp',
    tool: 'Professional pack · 18 video prompts',
  },
  {
    id: 'ai-construction-video',
    category: 'video',
    access: 'free',
    title: 'AI Construction Video',
    summary: 'Turn one architectural reference image into a fast cinematic construction sequence while protecting the identity of the final building.',
    image: '/assets/prompts/ai-construction-video/cover.png',
    video: '/assets/prompts/ai-construction-video/example-reel.mp4',
    tool: 'Veo · Kling · Runway · image-to-video',
    promptLabel: 'Free master prompt',
    prompt: `Ultra-photorealistic 10-second construction action commercial, one continuous high-energy camera move, physically realistic CGI.

STRICT REFERENCE IMAGE LOCK — CRITICAL: The uploaded reference image is the absolute visual target for the final completed building. Preserve its exact architecture, massing, proportions, floors, facade composition, windows, balconies, materials, colours, roofline, landscaping and visible details. Do not redesign, simplify, add or remove any part of the building.

Begin inside an active construction site. Use physically believable cranes, steel members, concrete panels, machinery, dust and workers to create a rapid but spatially continuous construction sequence. Track upward through the structural frame as beams, panels and glazing are installed with visible weight, cable tension, hydraulic response and realistic motion blur. Avoid magical assembly or unexplained transformations.

Finish by pulling back into a stable architectural hero reveal of the completed building in natural daylight. The final frame must match the uploaded reference building exactly. Reference identity has priority over cinematic action.

Camera language: energetic tracking, low angles, close fly-bys, controlled whip pans, foreground wipes and one smooth final pull-back. NORMAL → FAST → brief slow motion at the strongest impact → FAST → calm final reveal.

No portals, glow, neon, holograms, sci-fi, levitation, impossible physics, teleportation, extra floors, altered windows, warped balconies, changed materials, text, logos or architectural hallucination.`,
    secondaryLabel: 'Vertical Reel settings',
    secondaryPrompt: 'Duration 8–10 seconds · vertical 9:16 · 24 fps · reference strength high · architecture lock high · motion strength medium · final hero hold 1.5 seconds · keep the main building inside the centre-safe area · AI-generated visualisation, not a construction or safety guide.',
  },
  {
    id: 'monogram-line-reveal',
    category: 'logo-motion',
    access: 'free',
    title: 'Architectural Monogram Line Reveal',
    summary: 'A minimal logo reveal built from measured drafting lines and one confident lock-up.',
    image: '/assets/brand/world-arch-wa-mark-v1.png',
    tool: 'Veo · After Effects AI · motion generators',
    promptLabel: 'Logo motion prompt',
    prompt: 'Animate the supplied architectural monogram on a deep charcoal background. Begin with three fine construction lines drawing the hidden grid, then reveal the monogram with one precise upward stroke and a restrained warm-gold light pass. Keep the original logo proportions, spacing and colours unchanged. Finish on a perfectly still centred mark with generous negative space. Premium editorial pacing, 5 seconds, no particles, no lens flare, no 3D extrusion, no extra symbols and no distortion.',
    secondaryLabel: 'Export settings',
    secondaryPrompt: '5 seconds · 1080 × 1920 and 1920 × 1080 · 24 fps · clean loop-safe final frame · transparent-background version when supported',
  },
  {
    id: 'architectural-logo-motion-suite',
    category: 'logo-motion',
    access: 'premium',
    title: 'Architectural Logo Motion Suite',
    summary: 'A coordinated set of grid, line, material and spatial logo reveals for multiple formats.',
    image: '/assets/candidates/office-world/scene-06-material-model-lab-v1.png',
    tool: 'Professional pack · 16 motion systems',
  },
  {
    id: 'architectural-grid-background',
    category: 'animated-backgrounds',
    access: 'free',
    title: 'Architectural Grid Background',
    summary: 'A quiet looping background built from measured lines, soft depth and architectural light.',
    image: '/assets/candidates/office-world/scene-05-client-presentation-room-v1.png',
    tool: 'Veo · Kling · Runway · motion generators',
    promptLabel: 'Animated background prompt',
    prompt: 'Create a seamless 8-second animated background inspired by architectural drawing grids. Deep charcoal field, very fine warm-grey construction lines, one restrained amber highlight moving slowly across the grid, subtle parallax depth and faint paper texture. The centre must remain visually quiet for readable title text. Elegant editorial motion, premium architecture journal mood, no buildings, no logos, no words, no particles, no sudden flashes and no camera shake. The first and last frames must match for a clean infinite loop.',
    secondaryLabel: 'Motion settings',
    secondaryPrompt: '8 seconds · seamless loop · 24 fps · 16:9 and 9:16 · low motion · centre-safe composition · no audio · compression-safe gradients',
  },
  {
    id: 'cinematic-architecture-background-pack',
    category: 'animated-backgrounds',
    access: 'premium',
    title: 'Cinematic Architecture Background Pack',
    summary: 'A coordinated PRO set of loopable material, grid, shadow and spatial backgrounds.',
    image: '/assets/candidates/office-world/scene-07-principal-design-desk-v3.png',
    tool: 'Professional pack · 20 animated backgrounds',
  },
];

export const freePromptItems = promptItems.filter((item) => item.access === 'free');
export const promptById = (id) => promptItems.find((item) => item.id === id);

