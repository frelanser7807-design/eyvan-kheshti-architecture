import { cliffAssemblyPrompt } from './cliffAssemblyPrompt.js';

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
    image: '/assets/prompts/ai-construction-video/cover-brand-v2.png',
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
    id: 'exact-final-frame-architectural-build',
    category: 'video',
    access: 'free',
    title: 'Exact Final-Frame Architectural Build',
    summary: 'Build a complete contemporary residence in ten tactile stages, then return to the supplied image as the locked final frame.',
    image: '/assets/prompts/exact-final-frame-architectural-build/final-frame.jpg',
    video: '/assets/prompts/exact-final-frame-architectural-build/example-reel.mp4',
    publishedAt: '2026-10-05',
    modifiedAt: '2026-10-05',
    tool: 'Veo · Kling · Runway · start/end-frame image-to-video',
    promptLabel: 'Free English master prompt',
    prompt: `Create a 10-second ultra-photorealistic cinematic architectural build sequence in 16:9, using the uploaded reference image as the ABSOLUTE FINAL FRAME.

CRITICAL FINAL-FRAME RULE: the uploaded image is the locked target. At the end of the 10-second video, the completed building, facade geometry, proportions, floors, balconies, windows, materials, colors, landscaping, lighting, camera angle, perspective, framing and composition MUST match the uploaded image EXACTLY. Do not redesign, reinterpret, simplify, replace or modify any visible element. The final frame MUST be visually identical to the input image.

Keep the same building and site throughout. Use realistic daylight, natural shadows and only the materials already visible in the reference. Only masculine hands wearing matte-black gloves appear during construction.

0.0–0.6: extreme macro shot; one finger draws a straight line through sand, exposing the exact footprint of the concrete foundation.

0.6–1.3: a hand places the first structural concrete core; columns, beams and the structural grid mechanically assemble outward.

1.3–2.0: two fingers lift upward; floor slabs, columns and structural levels rise sequentially and lock precisely into position.

2.0–2.7: a hand physically shifts the upper volumes into their exact positions, creating the terraces, setbacks and balconies seen in the uploaded image; short controlled camera orbit.

2.7–3.4: a hand sweeps across the exposed structure; the exact facade materials from the reference mechanically install across the building, including wall surfaces, metal elements, glazing, windows and balcony details.

3.4–4.1: fingers CLICK the final facade panel into position; macro camera glide across the finished facade materials.

4.1–4.8: a finger draws the exterior circulation path; paving, entrance paths and driveway assemble directly behind the movement.

4.8–5.5: a hand installs the main tree and vegetation; the remaining landscaping assembles naturally according to the uploaded reference image.

5.5–6.2: quick hand movements place the remaining exterior details, architectural lighting and vehicles exactly where they belong in the reference.

6.2–7.0: complete the final ground and landscape elements while maintaining realistic physical assembly.

7.0–8.2: fingers make the final precise adjustments; camera pushes through foreground foliage and transitions from miniature construction scale to full real-world scale as the hands disappear.

8.2–10.0: camera emerges into the completed real environment, moves smoothly toward the facade, then returns precisely to the ORIGINAL uploaded-image camera position and framing.

AT 10.0 SECONDS, FREEZE ON THE UPLOADED IMAGE AS THE EXACT FINAL FRAME. Input image = final video frame. Exact same building, exact same geometry, exact same materials, exact same colors, exact same surroundings, exact same perspective, exact same camera position and exact same composition. ZERO visual deviation.

All transformations must feel physical and mechanical: sliding, lifting, assembling, unfolding and locking with realistic mass, contact and shadows. No magic, glow, holograms, LEGO, toys, cranes, workers, text, logos, morphing or spontaneous redesign.`,
    secondaryLabel: 'Vertical Reel / Shorts adaptation',
    secondaryPrompt: 'For the vertical version shown here, change only the first-line aspect ratio from 16:9 to vertical 9:16. Use 10 seconds · 720 × 1280 or 1080 × 1920 · 24 fps · high end-frame/reference strength · centre-safe building composition · exact supplied-image freeze at 10.0 seconds · no generated text or logos.',
    referenceFrames: [
      { label: 'Absolute final-frame reference', src: '/assets/prompts/exact-final-frame-architectural-build/final-frame.jpg', alt: 'Final-frame reference of a contemporary four-storey residence with pale stone frames, timber fins, glass balconies and landscaped frontage' },
    ],
    howToUse: [
      'Upload a rights-cleared image of the exact completed building as the final-frame reference.',
      'Paste the complete English master prompt into a generator that supports image-to-video or start/end-frame control.',
      'Use the landscape instruction for 16:9, or apply only the supplied vertical adaptation for Reels, Shorts and video Pins.',
      'For a truly exact ending, place the original reference still over the final generated frames and hold it through 10.0 seconds.',
      'Check facade geometry, balcony count, glazing, materials, planting, vehicle placement and the final camera position before publishing.',
    ],
    disclosure: 'AI-generated architectural visualisation and prompt study. It is not a built-project record, construction method, structural sequence or safety guide.',
  },
  {
    id: 'luxury-bathroom-ai-video',
    category: 'video',
    access: 'free',
    title: 'AI Luxury Bathroom Build-Up',
    summary: 'Reconstruct a finished luxury bathroom from an empty shell while locking the original interior design and final camera view.',
    image: '/assets/prompts/luxury-bathroom-ai-video/cover-brand-v2.png',
    video: '/assets/prompts/luxury-bathroom-ai-video/example-reel.mp4',
    tool: 'Veo · Kling · Runway · image-to-video',
    promptLabel: 'Free master prompt',
    prompt: `Create a premium 10-second photorealistic bathroom build-up sequence using Image 1 as the exact completed-design reference and final visual target.

Open on the same bathroom as a clean, unfinished architectural shell. From there, a giant realistic human hand progressively assembles the interior, one component at a time. Build the scene in a clear physical sequence: install the floor tiles and wall finishes, then place the vanity and sink, mirror, shower glass, bathtub, toilet, lighting, towels, and decorative elements. Each piece should move naturally into its correct position and lock into place with smooth, satisfying, believable motion.

Keep the transformation continuous and visually readable. Do not use cuts. The hand is the only active assembly element; no people should appear in the scene.

REFERENCE FIDELITY — ABSOLUTE PRIORITY:
Treat Image 1 as the master design reference. The completed bathroom must reproduce the reference as closely as possible, including the exact room proportions, architecture, camera viewpoint, perspective, layout, vanity, sinks, mirrors, shower enclosure, bathtub, toilet, shelving, windows, floor, walls, ceiling, lighting placement, materials, colors, towels, plants, accessories, and visible decorative details.

Do not redesign or reinterpret the bathroom. Do not add, remove, resize, relocate, simplify, substitute, or restyle visible design elements. The assembly animation may begin from an empty shell, but every installed element must progressively reconstruct the bathroom shown in Image 1.

FINAL SHOT:
Finish on a fully photorealistic hero view that matches Image 1 — same composition, geometry, materials, lighting atmosphere, object placement, and camera angle. The result must read as the exact referenced bathroom, not a similar AI-generated alternative.

No people. No text or logos. No cuts. No unrelated objects. No architectural changes. No final-frame redesign.`,
    secondaryLabel: 'Vertical Reel settings',
    secondaryPrompt: 'Duration 8–10 seconds · vertical 9:16 · 24 fps · one continuous shot · reference strength high · interior-design lock high · motion strength medium · one realistic hand only · final hero hold 1.5 seconds · no text or logos.',
    howToUse: [
      'Upload a rights-cleared image of the exact completed bathroom design.',
      'Paste the master prompt into an image-to-video tool and select the reference image as Image 1.',
      'Add the vertical settings and keep reference or identity strength high.',
      'Check every fixture, material and final-frame detail against the source image before publishing.',
    ],
    disclosure: 'Disclosure: this is an AI-generated interior visualisation, not a built-project record, product specification or construction guide.',
  },
  {
    id: 'giant-hands-interior-build',
    category: 'video',
    access: 'free',
    title: 'Giant Hands Interior Build',
    summary: 'Build a luxury miniature living room step by step with gloved giant hands, tactile materials and a precise 10-second hero reveal.',
    image: '/assets/prompts/giant-hands-interior-build/cover.jpg',
    video: '/assets/prompts/giant-hands-interior-build/example-reel.mp4',
    publishedAt: '2026-09-28',
    tool: 'Veo · Kling · Runway · text-to-video',
    promptLabel: 'Free master prompt',
    prompt: `Create a 10-second, 16:9 photorealistic cinematic “Giant Hands Interior Build” sequence.

Show one identical modern single-story luxury house on a vast immaculate green lawn under bright natural sunlight and a clear blue sky. The front remains fully open toward the camera.

Two enormous masculine hands wearing fitted matte-black architectural gloves physically complete the miniature interior. Maintain extreme scale throughout: a chair fits between two fingers, a sofa between both palms, and the complete house can be held by both hands.

Use a stable slightly elevated 35–50mm architectural camera with subtle cinematic push-ins, realistic contact shadows, material weight, compression and believable physics.

0.00–0.70 — Begin with the completely unfinished empty shell. Giant hands enter carrying a full-length natural oak floorboard.

0.70–1.50 — Rapidly install wide oak flooring board-by-board with satisfying physical CLACK sounds. A fingertip precisely pushes the final plank into perfect alignment.

1.50–2.20 — Install a warm-white architectural wall panel and physically smooth it from top to bottom.

2.20–3.00 — Feed and press a cream baseboard along the wall, locking each section into place and finishing a perfect corner.

3.00–3.80 — Install three dark walnut feature panels individually. The final panel receives a tiny fingertip adjustment until the wood grain aligns perfectly.

3.80–4.50 — Both hands lift a substantial pale travertine slab and mount it precisely at the center of the walnut feature wall.

4.50–5.30 — Lift a deep cream bouclé sofa. The giant hands briefly squeeze both sides so the cushions visibly compress and naturally recover, then lower it firmly onto the oak floor.

5.30–6.00 — Place two sculptural cream lounge chairs beside the sofa. Make a tiny fingertip adjustment to establish perfect symmetry.

6.00–6.60 — Lower a sculptural travertine coffee table between the seating and gently rotate it into exact alignment.

6.60–7.30 — Physically unroll a premium cream wool rug beneath the furniture. Install ivory linen curtains and straighten their folds by hand.

7.30–8.00 — Lower a minimal pendant light above the table. One fingertip taps it and the warm light activates.

8.00–8.70 — Camera subtly widens. One giant palm physically sweeps and perfects the surrounding lawn while the second hand plants a small elegant ornamental tree beside the house.

8.70–9.30 — Perform rapid precision finishing touches: sofa slightly backward, chair subtly rotated, table shifted right, curtain fold corrected, cushion pressed and released, rug corner flattened.

9.30–10.00 — Reveal the completed composition in a cinematic hero view. Both giant hands carefully hold the entire miniature house, rotate it approximately 10–15° toward camera, release it, and smoothly leave frame.

FINAL LOOK: A pristine high-end living room with natural oak flooring, dark walnut and pale travertine feature wall, cream bouclé sofa, sculptural chairs, stone coffee table, ivory curtains and warm pendant lighting, surrounded by a flawless green lawn beneath a clean blue sky.

VISUAL SIGNATURE: Elegant architectural-commercial aesthetic, tactile installation choreography, premium material realism, satisfying micro-adjustments, precise craftsmanship and seamless physical interaction.

STRICT: No people. No magic or telekinesis. No self-assembly. No floating objects. No morphing. No extra hands. No duplication. No scale changes. No disappearing installed elements. No particles, text or logos. Every object must be installed, moved or adjusted through visible direct physical contact with the giant hands.`,
    secondaryLabel: 'Vertical Reel & Shorts settings',
    secondaryPrompt: 'For a vertical social version, change only the first-line aspect ratio from 16:9 to 9:16. Use 10 seconds · 720 × 1280 or 1080 × 1920 · 24 fps · centre-safe composition · stable architectural camera · realistic material physics · final hero hold 0.7 seconds · no generated text or logos.',
    howToUse: [
      'Paste the complete master prompt into a text-to-video tool.',
      'Keep the original 16:9 line for landscape output, or use the vertical settings for Reels, Shorts and Pinterest.',
      'Preserve the two gloved hands, the miniature-house scale and the visible physical installation sequence.',
      'Check hand anatomy, object continuity, material contact and the final hero frame before publishing.',
    ],
    disclosure: 'Disclosure: this is an AI-generated architectural visualisation, not a built-project record, construction method or product specification.',
  },
  {
    id: 'plan-3-winter-house-pov',
    category: 'video',
    access: 'free',
    title: 'Plan 3 Winter House: First-Person Build',
    summary: 'Create a reference-locked 7-frame storyboard and a seamless 10-second POV journey from floor-plan selection to a completed winter house.',
    image: '/assets/prompts/plan-3-winter-house/storyboard.jpg',
    video: '/assets/prompts/plan-3-winter-house/example-short.mp4',
    publishedAt: '2026-10-03',
    modifiedAt: '2026-10-03',
    tool: 'Gemini · Veo · Kling · Runway · image-to-video',
    promptLabel: 'Storyboard image prompt',
    prompt: `Using the uploaded house image as the STRICT architectural reference, create ONE vertical 9:16 ultra-photorealistic 7-frame storyboard for a 10-second first-person POV video.

REFERENCE LOCK:
Keep the EXACT same house in every frame: identical roof, massing, stone, timber, black frames, windows, balconies, entrance, pool and proportions. Do not redesign or modify the architecture.

Environment: bright sunny winter day, white snow, deep-blue sky, snowy mountains.
Character: only the same two male hands wearing matte-black gloves. No face or body.

Create 7 consistent frames:

01 — 0–1.5s:
Front view of the exact reference house. Gloved hands hold a smartphone showing 3 floor plans; finger selects Plan 3.

02 — 1.5–3s:
Plan 3 rises from the phone and expands on the snow at real architectural scale.

03 — 3–4.5s:
The exact reference house forms directly from Plan 3. Preserve the original exterior design exactly.

04 — 4.5–5.8s:
First-person view inside its double-height living room: warm wood, natural stone, cream furniture, panoramic black-framed windows.

05 — 5.8–7s:
Same house, modern kitchen with timber cabinetry, stone island and matching materials.

06 — 7–8.2s:
Same house, corridor leading into a warm modern bedroom with panoramic mountain window.

07 — 8.2–10s:
Perfect top-down view of the completed house. Its layout must match Plan 3 exactly.

STRICT CONTINUITY:
Same house, same Plan 3, same materials, same interiors, same winter environment and same black gloves throughout.

No different building, no architectural changes, no random rooms, no layout changes, no extra hands, no text, no logos.`,
    secondaryLabel: 'Seamless video prompt',
    secondaryPrompt: `Create a 10-second vertical 9:16 ultra-photorealistic first-person POV video using the provided storyboard as strict visual reference. One continuous seamless shot.

0–1.5s: gloved hands hold the phone, swipe through 3 floor plans and tap Plan 3.
1.5–3s: Plan 3 rises from the phone, lands on the snow and expands to full scale.
3–4.5s: floor, walls, windows and roof rapidly construct into the exact reference house.
4.5–5.8s: FAST push into the living room → HARD BRAKE → SMOOTH GLIDE.
5.8–7s: accelerate into the kitchen → HARD BRAKE → smooth orbit around the island.
7–8.2s: race through the corridor into the bedroom → HARD BRAKE → smooth lateral reveal.
8.2–10s: rocket vertically above the roof and settle into a perfect top-down view.

STRICT REFERENCE LOCK: preserve the exact house, Plan 3 layout, interiors, materials, windows, furniture, winter environment and black-gloved hands shown in the references. Maintain perfect spatial continuity and realistic physics.

FAST → HARD BRAKE → SMOOTH GLIDE.

No cuts, redesign, new objects, layout changes, teleportation, morphing, geometry drift, extra hands, text or logo.`,
    referenceFrames: [
      { label: 'House reference', src: '/assets/prompts/plan-3-winter-house/reference-house.jpg', alt: 'Reference image of a contemporary stone and timber house with a pool' },
      { label: 'Seven-frame storyboard', src: '/assets/prompts/plan-3-winter-house/storyboard.jpg', alt: 'Seven-frame vertical storyboard showing the Plan 3 winter house transformation and interiors' },
    ],
    howToUse: [
      'Upload the house image as the strict architectural reference and generate the seven-frame storyboard with the first prompt.',
      'Use the approved storyboard as the visual reference for the second, seamless video prompt.',
      'Set a vertical 9:16 output, 10-second duration and high reference or identity strength.',
      'Verify the exterior, room sequence, black-gloved hands and Plan 3 layout before publishing.',
    ],
    disclosure: 'Disclosure: this is an AI-generated architectural concept and motion study, not a built-project record, floor-plan approval or construction guide.',
  },
  {
    id: 'terrace-threshold-waterproofing-drainage',
    category: 'video',
    access: 'free',
    title: 'Terrace Threshold Waterproofing & Drainage',
    summary: 'Animate a fixed terrace-door threshold section from exposed slab to waterproofing, drainage, insulation, paving and a final rainwater test.',
    image: '/assets/prompts/terrace-threshold-drainage/end-frame.jpg',
    video: '/assets/prompts/terrace-threshold-drainage/example-reel.mp4',
    publishedAt: '2026-09-27',
    tool: 'Veo · Kling · Runway · start/end frame video',
    promptLabel: 'Free master prompt',
    prompt: `Create one continuous photorealistic 3D architectural construction animation in a vertical 9:16 format, using the supplied Start Frame as the exact opening state and the supplied End Frame as the exact completed state and final visual target.

Show one fixed, close-up cross-section view of a terrace door threshold. Keep the camera completely still and preserve the exact same geometry, scale, perspective, door position, wall, slab build-up and lighting throughout the video. On the left is an outdoor terrace above a concrete slab; on the right is an interior room with a white wall, timber glazed door frame and warm wood flooring.

Begin with the exposed concrete slab shown in the Start Frame. Build the assembly clearly and physically, one step at a time: unroll a dark purple waterproof membrane across the outdoor slab and turn it upward against the door threshold; install a silver linear drainage channel with a metal grate directly beside the door; place rigid pink insulation boards over the waterproofed terrace; show realistic gloved hands laying a white separation fabric; pour and level a sand bedding layer; install neat grey stone paving slabs flush with the drainage channel.

Finish by closing the glazed timber door and demonstrating rainwater flowing across the paving into the linear drain and out through its outlet. Make the water path clearly visible, physically believable and consistent with the End Frame. Hold briefly on the complete cross-section so every layer and drainage relationship can be read.

Use precise architectural detailing, realistic material textures, clean studio lighting, natural construction movements, believable weight and contact, and smooth transitions between steps. The result should resemble a high-end architectural installation explainer.

STRICT CONTINUITY: preserve the supplied start and end geometry exactly. No camera movement, zoom, reframing, cuts, changing building shape, altered threshold dimensions, extra objects, distorted hands, floating materials, impossible assembly, logos, captions or narration. Add only subtle realistic construction and running-water sounds.`,
    secondaryLabel: 'Production settings',
    secondaryPrompt: 'One continuous 12-second video · vertical 9:16 · 720 × 1280 or higher · 24 fps · completely locked camera · Start Frame strength high · End Frame strength high · geometry lock high · motion strength medium-low · physically realistic water · final detail hold 1 second · no text, logos or narration.',
    referenceFrames: [
      { label: 'Start Frame', src: '/assets/prompts/terrace-threshold-drainage/start-frame.jpg', alt: 'Exposed terrace door threshold before waterproofing and drainage installation' },
      { label: 'End Frame', src: '/assets/prompts/terrace-threshold-drainage/end-frame.jpg', alt: 'Completed terrace threshold with paving, insulation, waterproofing and linear drainage outlet' },
    ],
    howToUse: [
      'Upload Start Frame as the first-frame reference and End Frame as the final-frame reference.',
      'Paste the complete master prompt as one prompt; do not split the video into separate clips.',
      'Enable a locked camera and high geometry or reference consistency.',
      'Verify the final drainage path and every build-up layer before publishing or using the result educationally.',
    ],
    disclosure: 'Disclosure: this is an AI-generated technical visualisation for concept communication, not a construction specification, waterproofing approval or substitute for local technical design.',
  },
  {
    id: 'cliff-assembly-cinematic-build',
    category: 'video',
    access: 'free',
    title: 'Cliff Assembly: Cinematic Architectural Build',
    summary: 'Watch a 10-second, giant-hands construction sequence of a cliffside luxury home, then use the complete reference-locked AI video prompt.',
    image: '/assets/prompts/cliff-assembly/cover.jpg',
    video: '/assets/prompts/cliff-assembly/example-video.mp4',
    sourceGuide: '/assets/prompts/cliff-assembly/prompt-guide.pdf',
    publishedAt: '2026-10-01',
    tool: 'AI architectural visualisation · image-to-video',
    promptLabel: 'Complete 16:9 master prompt',
    prompt: cliffAssemblyPrompt,
    secondaryLabel: '9:16 Reel / Shorts adaptation',
    secondaryPrompt: 'Use the complete master prompt above, but replace “16:9” with “vertical 9:16”. Keep the supplied final-frame reference and all construction stages unchanged. Output 10 seconds at 720 × 1280 or higher, keep the house and pool inside the centre-safe area, preserve readable physical assembly, and hold the exact final reference view briefly. The example video on this page is vertical 9:16; the original supplied master prompt specifies landscape 16:9.',
    referenceFrames: [
      { label: 'Final-frame reference', src: '/assets/prompts/cliff-assembly/final-frame.jpg', alt: 'AI-generated reference image of a cliffside luxury residence, pool and rooftop helicopter at sunset' },
    ],
    howToUse: [
      'Upload the supplied final-frame reference image to an image-to-video generator that supports reference locking.',
      'Copy the complete master prompt for a landscape result, or use the vertical adaptation for Reels, Shorts and video Pins.',
      'Check continuity of the cliffside house, pool, glass facade, helicopter, vehicle and final camera view before sharing.',
      'Treat the clip as a creative visualisation, not a real built project or construction demonstration.',
    ],
    disclosure: 'AI-generated conceptual architecture and construction animation. This is not a built-project record, engineered structural detail or construction-safety instruction.',
  },
  {
    id: 'land-to-building-construction-prompt',
    category: 'video',
    access: 'free',
    title: 'Empty Land to Finished Building: 10-Second Construction Video Prompt',
    summary: 'Grow a six-storey desert residence from empty land to the exact finished building in one 10-second reference-locked sequence.',
    image: '/assets/prompts/land-to-building-construction-prompt/final-frame.jpg',
    publishedAt: '2026-10-24',
    modifiedAt: '2026-10-24',
    tool: 'Veo · Kling · Runway · image-to-video',
    promptLabel: 'Free master prompt',
    prompt: `0–2 sec — Begin with a fast, low cinematic push across an untouched dirt site toward the exact building location. Keep the construction area centered, with a realistic distant urban skyline under natural daylight.

2–5 sec — Accelerated construction sequence: the exact concrete structural frame grows progressively floor by floor — columns, slabs, cores and exposed rebars locking into place in correct order. The camera smoothly circles the structure in one continuous 360° movement while construction advances naturally. No sudden appearance, no teleporting, no cuts. Finish the movement by returning precisely to the original frontal camera angle.

5–9 sec — From the frontal view, create a controlled architectural assembly sequence. Facade panels, glazing, louvers, railings, finishes and exterior elements appear as perfectly aligned exploded layers, then smoothly move into their exact final positions step by step. Every element must match the uploaded reference building in geometry, scale, materials and placement.

9–10 sec — ABSOLUTE FINAL-FRAME LOCK: the completed result MUST become EXACTLY IDENTICAL to the uploaded input image. Match the original building geometry, facade, materials, colors, windows, proportions, surroundings, lighting, camera angle, framing and perspective with ZERO alteration. From second 9 until the final frame, show ONLY the unchanged uploaded-image result. DO NOT redesign, reinterpret, improve, replace or modify anything. THE FINAL VIDEO FRAME MUST MATCH THE INPUT IMAGE EXACTLY.`,
    secondaryLabel: 'Vertical Reel settings',
    secondaryPrompt: 'Duration 10 seconds · vertical 9:16 · 720 × 1280 · 24 fps · reference strength high · final-frame lock high · motion strength medium · hold the exact supplied-image frame at 10.0 seconds · no generated text or logos.',
    referenceFrames: [
      { label: 'Absolute final-frame reference', src: '/assets/prompts/land-to-building-construction-prompt/final-frame.jpg', alt: 'Final-frame reference of a six-storey desert residential building with stacked planted terraces, travertine and dark stone panels and vertical timber slats' },
    ],
    howToUse: [
      'Upload a rights-cleared image of the exact completed building as the final-frame reference.',
      'Paste the complete English master prompt into a generator that supports image-to-video or start/end-frame control.',
      'Use the vertical settings for Reels, Shorts and video Pins, or adapt the aspect ratio stated in the prompt for a landscape version.',
      'Check facade geometry, balcony count, glazing, materials, planting and the final camera position before publishing.',
    ],
    disclosure: 'AI-generated architectural visualisation and prompt study. It is not a built-project record, construction method, structural sequence or safety guide.',
  },
  {
    id: 'fpv-construction-transformation-prompt',
    category: 'video',
    access: 'free',
    title: 'FPV Construction Transformation: Single-Take Video Prompt',
    summary: 'One continuous FPV flight through a mechanical construction chain reaction that assembles an eight-storey travertine residence around the camera.',
    image: '/assets/prompts/fpv-construction-transformation-prompt/final-frame.jpg',
    video: '/assets/prompts/fpv-construction-transformation-prompt/example-reel.mp4',
    publishedAt: '2026-10-24',
    modifiedAt: '2026-10-24',
    tool: 'Veo · Kling · Runway · image-to-video',
    promptLabel: 'Free master prompt',
    prompt: `Create a 10-second high-intensity, single-take FPV construction transformation following the storyboard exactly. Keep one consistent modern building and one consistent construction site from beginning to end. The unfinished structure must gradually evolve into the completed architecture. Treat the entire site as one massive synchronized mechanical system: cranes, steel members, columns, floor plates and facade components activate one another in a continuous chain reaction. Photoreal cinematic construction spectacle, IMAX-scale energy, ultra-wide 14mm FPV perspective, cool steel-toned shadows, warm industrial-orange highlights and aggressive controlled speed ramps. From 00:09 onward, the output must match the uploaded reference image exactly and remain unchanged — same building, same facade, same geometry, same framing, same materials, same final appearance.

00:00–00:01.0 — SYSTEM ACTIVATION
Begin extremely close inside the unfinished structure. A huge industrial steel locking assembly spins rapidly and clamps onto a structural connection. Heavy metal strikes metal as dense orange welding sparks burst past the camera. The lens stays dangerously close and follows the rotation of the mechanism.

00:01.0–00:02.0 — CRANE ROTATION LINK
Continue the exact rotational motion into the movement of a massive tower crane circling the same building. The camera rapidly escapes the structure into an extreme low-angle perspective and accelerates upward. The crane boom sweeps only centimeters above the lens, creating an intense near-collision moment.

00:02.0–00:03.0 — STRUCTURAL BEAM STRIKE
Lock onto a giant suspended steel beam moving rapidly toward the structure. It swings inches past the camera and crashes precisely into position between two structural columns. The impact produces concrete dust, welding sparks and fragments that burst toward the lens. Camera drives directly through the expanding debris.

00:03.0–00:04.0 — COLUMN CHAIN
The beam connection instantly activates the next mechanical sequence. Large concrete columns rise vertically one after another like synchronized industrial pistons. Camera climbs beside them at high speed while each column reaches its exact position and locks before the following column activates.

00:04.0–00:05.0 — FLOOR PLATE SEQUENCE
Dive inside the growing structure and accelerate through its interior. Oversized floor slabs slide inward horizontally from opposite sides, meeting with precise mechanical impacts just ahead of the camera. The lens escapes through the next structural opening seconds before another slab closes behind it. Continue this rapid sequential installation through multiple levels.

00:05.0–00:06.2 — MECHANICAL ORBIT
Burst back outside into a fast ascending orbit around the building. Structural columns extend, beams rotate into their connections, floors lock into place and framing systems unfold around the camera in one synchronized mechanical wave. The unfinished skeleton visibly progresses toward the exact completed architecture without interrupting the shot.

00:06.2–00:07.4 — FACADE INSTALLATION WAVE
Without any cut, race extremely close along the exterior. White curved facade sections and blue reflective glazing panels arrive from multiple directions and snap mechanically into their exact locations immediately behind the moving camera. The installation wave climbs rapidly upward and continues around the curved exterior geometry.

00:07.4–00:08.5 — SLOW-MOTION PANEL LOCK
A final oversized glass facade panel flies alongside the lens through sparks, concrete particles and metallic debris. Enter an extreme speed-ramp into near-frozen bullet time while the camera rolls around the moving panel. Suddenly restore full speed as the panel slams into its frame and locks with a powerful mechanical impact.

00:08.5–00:10.0 — COMPLETION REVEAL
That final impact activates the closing transformation. Camera rockets upward beside the facade while the remaining white panels, glazing elements and distinctive black rooftop structure snap mechanically into their final positions below and around it. By 00:09, the building must already converge to the uploaded reference image, and from 00:09 to 00:10 the result must become visually identical to the uploaded image and stay locked to it with no design changes. Rise above the roof, perform a final 180-degree aerial rotation, then pull rapidly backward and upward exactly as the last rooftop component locks into place. Reveal the fully completed building, architecturally identical to the reference, standing prominently above the city. Final frame must equal the uploaded image exactly.

Maintain absolute visual continuity: one building, identical geometry, identical number of floors, the same curved facade and the same location throughout. Every construction action must mechanically trigger the next. Emphasize extreme velocity, monumental scale, close near-misses, strong depth and parallax, realistic motion blur, sparks, dust, debris, volumetric lighting and physically accurate metallic reflections. Do not alter the final building design in any way. The last second must faithfully show the exact uploaded image, not a variation. No teleporting objects, random morphing, structural collapse, duplicated components, architecture changes, impossible geometry intersections, text, subtitles, logos or watermarks.`,
    secondaryLabel: 'Vertical Reel settings',
    secondaryPrompt: 'Duration 10 seconds · vertical 9:16 · 720 × 1280 · 24 fps · reference strength high · final-frame lock high · motion strength medium · hold the exact supplied-image frame at 10.0 seconds · no generated text or logos.',
    referenceFrames: [
      { label: 'Absolute final-frame reference', src: '/assets/prompts/fpv-construction-transformation-prompt/final-frame.jpg', alt: 'Final-frame reference of an eight-storey travertine residential building with glass balconies and a dark rooftop pergola on a city street corner' },
    ],
    howToUse: [
      'Upload a rights-cleared image of the exact completed building as the final-frame reference.',
      'Paste the complete English master prompt into a generator that supports image-to-video or start/end-frame control.',
      'Use the vertical settings for Reels, Shorts and video Pins, or adapt the aspect ratio stated in the prompt for a landscape version.',
      'Check facade geometry, balcony count, glazing, materials, planting and the final camera position before publishing.',
    ],
    disclosure: 'AI-generated architectural visualisation and prompt study. It is not a built-project record, construction method, structural sequence or safety guide.',
  },
  {
    id: 'miniature-hands-building-prompt',
    category: 'video',
    access: 'free',
    title: 'Miniature Hands Build a Real Building: Video Prompt',
    summary: 'Matte-black gloved hands assemble a four-storey apartment building at miniature scale until it becomes the full-size finished home.',
    image: '/assets/prompts/miniature-hands-building-prompt/final-frame.jpg',
    video: '/assets/prompts/miniature-hands-building-prompt/example-reel.mp4',
    publishedAt: '2026-10-24',
    modifiedAt: '2026-10-24',
    tool: 'Veo · Kling · Runway · image-to-video',
    promptLabel: 'Free master prompt',
    prompt: `Create a 10-second ultra-photorealistic cinematic architectural build sequence in 16:9, using the uploaded reference image as the ABSOLUTE FINAL FRAME.

CRITICAL FINAL-FRAME RULE: the uploaded image is the locked target. At the end of the 10-second video, the completed building, facade geometry, proportions, floors, balconies, windows, materials, colors, landscaping, lighting, camera angle, perspective, framing and composition MUST match the uploaded image EXACTLY. Do not redesign, reinterpret, simplify, replace or modify any visible element. The final frame MUST be visually identical to the input image.

Keep the same building and site throughout. Use realistic daylight, natural shadows and only the materials already visible in the reference. Only masculine hands wearing matte-black gloves appear during construction.

0.0–0.6: extreme macro shot; one finger draws a straight line through sand, exposing the exact footprint of the concrete foundation.

0.6–1.3: a hand places the first structural concrete core; columns, beams and the structural grid mechanically assemble outward.

1.3–2.0: two fingers lift upward; floor slabs, columns and structural levels rise sequentially and lock precisely into position.

2.0–2.7: a hand physically shifts the upper volumes into their exact positions, creating the terraces, setbacks and balconies seen in the uploaded image; short controlled camera orbit.

2.7–3.4: a hand sweeps across the exposed structure; the exact facade materials from the reference mechanically install across the building, including wall surfaces, metal elements, glazing, windows and balcony details.

3.4–4.1: fingers CLICK the final facade panel into position; macro camera glide across the finished facade materials.

4.1–4.8: a finger draws the exterior circulation path; paving, entrance paths and driveway assemble directly behind the movement.

4.8–5.5: a hand installs the main tree and vegetation; the remaining landscaping assembles naturally according to the uploaded reference image.

5.5–6.2: quick hand movements place the remaining exterior details, architectural lighting and vehicles exactly where they belong in the reference.

6.2–7.0: complete the final ground and landscape elements while maintaining realistic physical assembly.

7.0–8.2: fingers make the final precise adjustments; camera pushes through foreground foliage and transitions from miniature construction scale to full real-world scale as the hands disappear.

8.2–10.0: camera emerges into the completed real environment, moves smoothly toward the facade, then returns precisely to the ORIGINAL uploaded-image camera position and framing.

AT 10.0 SECONDS, FREEZE ON THE UPLOADED IMAGE AS THE EXACT FINAL FRAME. Input image = final video frame. Exact same building, exact same geometry, exact same materials, exact same colors, exact same surroundings, exact same perspective, exact same camera position and exact same composition. ZERO visual deviation.

All transformations must feel physical and mechanical: sliding, lifting, assembling, unfolding and locking with realistic mass, contact and shadows. No magic, glow, holograms, LEGO, toys, cranes, workers, text, logos, morphing or spontaneous redesign.`,
    secondaryLabel: 'Vertical Reel settings',
    secondaryPrompt: 'Duration 10 seconds · vertical 9:16 · 720 × 1280 · 24 fps · reference strength high · final-frame lock high · motion strength medium · hold the exact supplied-image frame at 10.0 seconds · no generated text or logos.',
    referenceFrames: [
      { label: 'Absolute final-frame reference', src: '/assets/prompts/miniature-hands-building-prompt/final-frame.jpg', alt: 'Final-frame reference of a four-storey pale-concrete apartment building with a central vertical timber-slat panel, full-height glazing and glass-balustrade balconies' },
    ],
    howToUse: [
      'Upload a rights-cleared image of the exact completed building as the final-frame reference.',
      'Paste the complete English master prompt into a generator that supports image-to-video or start/end-frame control.',
      'Use the vertical settings for Reels, Shorts and video Pins, or adapt the aspect ratio stated in the prompt for a landscape version.',
      'Check facade geometry, balcony count, glazing, materials, planting and the final camera position before publishing.',
    ],
    disclosure: 'AI-generated architectural visualisation and prompt study. It is not a built-project record, construction method, structural sequence or safety guide.',
  },
  {
    id: 'light-trace-wireframe-building-prompt',
    category: 'video',
    access: 'free',
    title: 'Light-Trace Wireframe to Real Building: Video Prompt',
    summary: 'Bright light trails trace a two-storey house out of an empty blue-hour site until the glowing wireframe becomes the real building.',
    image: '/assets/prompts/light-trace-wireframe-building-prompt/cover.jpg',
    video: '/assets/prompts/light-trace-wireframe-building-prompt/example-reel.mp4',
    publishedAt: '2026-10-24',
    modifiedAt: '2026-10-24',
    tool: 'Veo · Kling · Runway · image-to-video',
    promptLabel: 'Free master prompt',
    prompt: `Use the uploaded image as the EXACT FINAL FRAME and absolute visual reference.

Start from an empty site at blue hour. Bright light trails rapidly trace the building upward: structure, floor lines, balconies, windows, facade and roof. The glowing wireframe smoothly becomes realistic architecture with natural lighting and landscaping.

FINAL FRAME MUST MATCH THE UPLOADED IMAGE 1:1 — identical building form, facade, materials, proportions, windows, colors, landscaping, camera angle, framing and perspective.

NO redesign, NO material changes, NO added or removed elements, NO geometry changes, NO camera mismatch.

End on the uploaded image EXACTLY.`,
    secondaryLabel: 'Vertical Reel settings',
    secondaryPrompt: 'Duration 10 seconds · vertical 9:16 · 720 × 1280 · 24 fps · reference strength high · final-frame lock high · motion strength medium · hold the exact supplied-image frame at 10.0 seconds · no generated text or logos.',
    referenceFrames: [
      { label: 'Absolute final-frame reference', src: '/assets/prompts/light-trace-wireframe-building-prompt/final-frame.jpg', alt: 'Final-frame reference of a two-storey modern house with a tall timber entrance bay, dark stone and travertine facade, glass balcony and landscaped front garden' },
    ],
    howToUse: [
      'Upload a rights-cleared image of the exact completed building as the final-frame reference.',
      'Paste the complete English master prompt into a generator that supports image-to-video or start/end-frame control.',
      'Use the vertical settings for Reels, Shorts and video Pins, or adapt the aspect ratio stated in the prompt for a landscape version.',
      'Check facade geometry, balcony count, glazing, materials, planting and the final camera position before publishing.',
    ],
    disclosure: 'AI-generated architectural visualisation and prompt study. It is not a built-project record, construction method, structural sequence or safety guide.',
  },
  {
    id: 'luxury-villa-miniature-assembly-prompt',
    category: 'video',
    access: 'free',
    title: 'Luxury Villa Miniature Assembly: Video Prompt',
    summary: 'Precision-gloved hands assemble a luxury villa miniature panel by panel, then the completed model becomes the full-scale villa at night.',
    image: '/assets/prompts/luxury-villa-miniature-assembly-prompt/final-frame.jpg',
    video: '/assets/prompts/luxury-villa-miniature-assembly-prompt/example-reel.mp4',
    publishedAt: '2026-10-24',
    modifiedAt: '2026-10-24',
    tool: 'Veo · Kling · Runway · image-to-video',
    promptLabel: 'Free master prompt',
    prompt: `Create a 10-second ultra-photorealistic cinematic luxury assembly video, 16:9, using the uploaded villa image as the EXACT FINAL TARGET.

The villa begins as a premium architectural miniature on a pure black platform in a museum-style dark environment. Keep the same elevated front 3/4 camera angle throughout. The camera must stay locked and stable until the final reveal. No camera shake, no random movement, no extra objects, no text, no logos, no faces, no construction-site chaos, and no toy-like styling.

Show only elegant masculine hands wearing thin matte-black precision gloves, appearing very large compared to the miniature. The villa must feature refined luxury materials such as warm limestone, architectural concrete, dark wood, bronze-toned metal, transparent glass, and a clean infinity pool. Keep the model highly realistic and premium.

0.00–0.70 — a gloved hand carefully places a refined stone facade panel into position, closing the final gap with satisfying precision.
0.70–1.40 — precision tweezers lower a full-height glass panel into a slim metallic frame; it settles cleanly and perfectly.
1.40–2.10 — gloved fingers install vertical wooden facade slats one by one with exact spacing.
2.10–2.80 — a tiny premium tool gives one precise finishing tap to a hidden facade detail so the surface becomes perfectly flush.
2.80–3.50 — a fingertip gently closes the main entrance door in a soft, elegant motion.
3.50–4.30 — a gloved hand lowers a terrace slab into place with realistic weight and contact.
4.30–5.10 — two gloved hands carefully lower the final roof slab into position; it settles perfectly into the architecture.
5.10–5.80 — precision placement of a mature miniature landscape tree near the villa.
5.80–6.40 — clean water fills the infinity pool with realistic liquid movement and subtle reflections.
6.40–7.20 — hidden lighting is activated; first the interior glows, then facade lighting, landscape lighting, and finally underwater pool lighting.
7.20–8.00 — the finished illuminated miniature stands complete; both hands make a final subtle alignment adjustment and leave frame.

8.00–10.00 — keep the villa perfectly locked in the same exact composition while a seamless scale transformation happens only around it: the black base becomes full-scale architectural ground, stone paving, landscaping, and natural surroundings. The miniature transforms into the exact same full-size luxury villa without morphing into another design.

MOST IMPORTANT:
The final frame must match the uploaded reference image exactly.
Do not change the architecture, facade, proportions, materials, lighting design, pool layout, landscaping, framing, or camera angle.
No redesign, no reinterpretation, no geometry change, no material change, no added elements, no removed elements.

The video must end on the exact same villa shown in the uploaded image, with the same front 3/4 composition, now appearing as a real full-scale luxury house in a cinematic final hero shot.

Style: premium architectural film, ultra-realistic materials, elegant assembly choreography, realistic reflections, realistic gravity, precision craftsmanship, luxury visualization, subtle ASMR feeling, minimal ambient sound, no voiceover.`,
    secondaryLabel: 'Vertical Reel settings',
    secondaryPrompt: 'Duration 10 seconds · vertical 9:16 · 720 × 1280 · 24 fps · reference strength high · final-frame lock high · motion strength medium · hold the exact supplied-image frame at 10.0 seconds · no generated text or logos.',
    referenceFrames: [
      { label: 'Absolute final-frame reference', src: '/assets/prompts/luxury-villa-miniature-assembly-prompt/final-frame.jpg', alt: 'Final-frame reference of a luxury modern villa at night with travertine and concrete volumes, a cantilevered glass upper floor, vertical timber slats and an infinity pool' },
    ],
    howToUse: [
      'Upload a rights-cleared image of the exact completed building as the final-frame reference.',
      'Paste the complete English master prompt into a generator that supports image-to-video or start/end-frame control.',
      'Use the vertical settings for Reels, Shorts and video Pins, or adapt the aspect ratio stated in the prompt for a landscape version.',
      'Check facade geometry, balcony count, glazing, materials, planting and the final camera position before publishing.',
    ],
    disclosure: 'AI-generated architectural visualisation and prompt study. It is not a built-project record, construction method, structural sequence or safety guide.',
  },
  {
    id: 'sketch-to-building-construction-prompt',
    category: 'video',
    access: 'free',
    title: 'From Sketch to Finished Building: Construction Video Prompt',
    summary: 'A hand sketch of a seven-storey residence develops on paper, then transitions into its real construction and the exact finished building.',
    image: '/assets/prompts/sketch-to-building-construction-prompt/final-frame.jpg',
    video: '/assets/prompts/sketch-to-building-construction-prompt/example-reel.mp4',
    publishedAt: '2026-10-24',
    modifiedAt: '2026-10-24',
    tool: 'Veo · Kling · Runway · image-to-video',
    promptLabel: 'Free master prompt',
    prompt: `Create a 10-second cinematic architectural construction video based on the uploaded reference image.

The uploaded image is the EXACT FINAL TARGET.

0.0–3.0s:
Begin with a clean architectural drawing on white paper.
Show the building being designed by hand in a professional architectural sketch style.
First draw the main building outline, then progressively add doors, windows, balconies, facade divisions, and key architectural details.
The sketch must clearly represent the SAME building shown in the uploaded reference image.
Keep this part elegant, precise, minimal, and realistic, like an architect developing the facade drawing on paper.

3.0–10.0s:
Transition naturally from the architectural drawing into the real construction process of the SAME building.

Show the same building progressing naturally from early construction to full completion:
structure → floor-by-floor construction → facade and windows → balconies and details → final completed building.

Keep the construction realistic, clean, fast-paced, and visually smooth.

MOST IMPORTANT:
The final frame of the video must be visually identical to the uploaded reference image.

Do not redesign or reinterpret the building.
Do not change the facade.
Do not change the geometry, proportions, balconies, windows, materials, colors, textures, landscaping, camera angle, framing, or surrounding elements.

The building at the end must be the exact same building shown in the uploaded image.

The architectural sketch at the beginning must also correspond to the same final building, especially the door positions, window layout, balconies, proportions, and facade composition.

No material changes.
No architectural changes.
No extra elements.
No removed elements.
No morphing into another design.
No random scene changes.

End the video by perfectly matching the uploaded reference image as the final frame.

Style: realistic architectural B-roll, professional architectural sketching, premium construction visualization, cinematic but natural, realistic materials, realistic workers and machinery, smooth construction progression, high-end architectural presentation.

No text, no logos, no watermark.`,
    secondaryLabel: 'Vertical Reel settings',
    secondaryPrompt: 'Duration 10 seconds · vertical 9:16 · 720 × 1280 · 24 fps · reference strength high · final-frame lock high · motion strength medium · hold the exact supplied-image frame at 10.0 seconds · no generated text or logos.',
    referenceFrames: [
      { label: 'Absolute final-frame reference', src: '/assets/prompts/sketch-to-building-construction-prompt/final-frame.jpg', alt: 'Final-frame reference of a seven-storey pale-stone residential building with planted glass balconies, vertical timber slat panels and a rooftop pergola terrace on a leafy street corner' },
    ],
    howToUse: [
      'Upload a rights-cleared image of the exact completed building as the final-frame reference.',
      'Paste the complete English master prompt into a generator that supports image-to-video or start/end-frame control.',
      'Use the vertical settings for Reels, Shorts and video Pins, or adapt the aspect ratio stated in the prompt for a landscape version.',
      'Check facade geometry, balcony count, glazing, materials, planting and the final camera position before publishing.',
    ],
    disclosure: 'AI-generated architectural visualisation and prompt study. It is not a built-project record, construction method, structural sequence or safety guide.',
  },
  {
    id: 'folding-interior-transformation-prompt',
    title: 'Folding Interior Transformation: Living Room Video Prompt',
    category: 'video',
    access: 'free',
    tool: 'Veo · Kling · Runway · image-to-video',
    image: '/assets/prompts/folding-interior-transformation-prompt/cover.jpg',
    video: '/assets/prompts/folding-interior-transformation-prompt/example-reel.mp4',
    summary: 'A plain luxury living room folds itself into a faceted walnut-and-travertine origami interior — walls, ceiling, sofa and coffee table — ending on the exact reference frame.',
    referenceFrames: [
      { src: '/assets/prompts/folding-interior-transformation-prompt/final-frame.jpg', alt: 'Final-frame reference of a luxury living room with faceted walnut and travertine origami walls and ceiling, a curved cream sectional sofa and a polygonal stone coffee table' },
    ],
    prompt: `Create a 10-second ultra-photorealistic cinematic architectural transformation video using the uploaded reference image as the EXACT FINAL TARGET.

CRITICAL: The uploaded reference image defines the final architecture, geometry, materials, furniture, lighting, camera position, and composition. The last frame must match this image as closely as possible.

CAMERA:
One continuous, perfectly stable, symmetrical frontal wide-angle shot. No camera movement, no zoom, no cuts, no transitions to different viewpoints. Preserve the exact perspective, proportions, and framing of the reference image.

0.0–1.0 SECONDS | INITIAL INTERIOR

Begin with the same luxurious living room before its geometric transformation.

The room has simple, flat beige travertine walls, a smooth minimalist ceiling, a straight cream-colored sofa, and a simple rectangular stone coffee table.

Maintain the exact room dimensions, window positions, shelving locations, and architectural proportions of the final reference.

1.0–2.0 SECONDS | CENTRAL WALL FOLDING

The central travertine wall begins folding along precise diagonal architectural crease lines.

Large triangular stone panels slowly push forward while adjacent surfaces recess inward.

The transformation creates the central symmetrical faceted diamond composition visible in the reference image.

All movements must resemble physically plausible mechanical architectural folding.

2.0–3.0 SECONDS | SIDE WALL TRANSFORMATION

The folding transformation spreads symmetrically toward both side walls.

Large walnut wood panels rotate and fold into sculptural triangular surfaces.

Travertine and walnut surfaces interlock precisely.

The final wall geometry must reproduce the exact angular composition of the reference image.

3.0–4.5 SECONDS | CEILING TRANSFORMATION

The previously flat ceiling begins folding along diagonal geometric lines.

Large triangular walnut ceiling panels descend and rotate into their final positions.

The ceiling develops the dramatic symmetrical origami-inspired architectural composition shown in the reference.

Warm concealed linear LED lighting gradually illuminates the edges of the folded ceiling panels.

The lighting must follow the exact geometric lines of the final design.

4.5–6.0 SECONDS | SOFA TRANSFORMATION

The original straight cream sofa transforms smoothly into the elegant curved sectional sofa shown in the final image.

The sofa sections rotate and reposition naturally while the upholstery remains realistic.

The final sofa must have the same curved silhouette, cream fabric, dimensions, position, and brown decorative cushions as the reference.

6.0–7.5 SECONDS | COFFEE TABLE TRANSFORMATION

The simple rectangular travertine coffee table transforms into the low polygonal sculptural stone table.

Its stone surfaces fold outward into sharp, precise triangular facets.

The table must match the final reference in geometry, material, scale, texture, and position.

7.5–9.0 SECONDS | FINAL ARCHITECTURAL DETAILS

The side shelving, warm integrated lighting, decorative objects, plants, and furnishings settle into their exact final positions.

All walnut and travertine materials retain their natural realistic textures.

The entire interior becomes identical in design and composition to the uploaded reference.

9.0–10.0 SECONDS | FINAL HERO FRAME

All architectural movements gradually stop.

The completed luxurious living room remains perfectly still.

The final frame must reproduce the uploaded reference image as closely as possible, including:

- Exact ceiling geometry and lighting.
- Exact central travertine wall composition.
- Exact walnut wall panels.
- Exact curved cream sofa.
- Exact sculptural stone coffee table.
- Exact furniture placement.
- Exact decorative objects and plants.
- Exact material colors and textures.
- Exact camera angle and framing.

VISUAL STYLE:

Ultra-photorealistic architectural visualization, physically accurate materials, realistic architectural mechanics, cinematic natural lighting, warm ambient illumination, realistic shadows, premium interior design cinematography, smooth continuous animation, precise geometric transformations.

The movement should feel like a real architectural installation unfolding in a carefully choreographed sequence.

STRICT NEGATIVE CONSTRAINTS:

No camera movement.
No camera cuts.
No random morphing.
No melting geometry.
No floating objects.
No material substitutions.
No architectural redesign.
No changes to room dimensions.
No additional furniture.
No missing architectural elements.
No changes to final composition.
No exaggerated lighting effects.
No people.
No text.
No logos.
No watermark.

ABSOLUTE PRIORITY: The final frame must match the uploaded reference image. Architectural accuracy is more important than visual creativity.`,
    promptLabel: 'Free master prompt',
    secondaryPrompt: 'Vertical Reel settings\n\nUse a vertical 9:16 frame (1080×1920), 24 fps, 10-second duration, photoreal finish, and an exact final-frame hold. Upload the reference image in this product as the target/final frame in your video tool.',
    howToUse: '1. Open your AI video tool (Veo, Kling, Runway or a similar image-to-video model).\n2. Upload the reference image from this product as the final-frame / target image.\n3. Paste the master prompt below into the prompt field — do not edit the timing blocks.\n4. Set a vertical 9:16 canvas, 24 fps and a 10-second duration, then generate.\n5. Check the last frame against the reference image; if the tool drifts, re-run with a lower motion/creativity setting so the build lands exactly on the reference.',
    disclosure: 'Demonstration visuals in this free prompt product were generated with AI image and video tools from the reference frame shown on this page. Results vary by model and settings; the prompt is written for current image-to-video tools.',
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
