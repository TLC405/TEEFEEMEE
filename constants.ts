export const MAX_FILE_SIZE_MB = 10;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
export const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const DEFAULT_THEME = {
  '--color-primary': '#00a5e1',
  '--color-secondary': '#ffdd00',
  '--color-accent': '#f83d78',
  '--color-background': '#ffdd00',
  '--color-surface': '#ffffff',
  '--color-text-primary': '#000000',
  '--color-text-secondary': '#4f4f4f',
  '--color-text-on-primary': '#FFFFFF',
};

export const NEGATIVE_PROMPT = "Deformed, bad anatomy, mutated, extra limbs, blurry, pixelated, signature, text, watermark, logo, nsfw, disembodied limbs, incomplete figures, cut-off body parts, extra hands, random objects, 3d, realistic.";

export const THEMES = [
  {
    name: 'The Simpsons',
    description: 'Become a citizen of Springfield!',
    prompt: `Aggressively transform and completely redraw the subjects and background in this image to perfectly match the iconic art style of 'The Simpsons'. The final output must look like a screenshot from the actual show. Characters must have yellow skin, large expressive white eyes with black dot pupils, and simplified features. Convert the background to the show's distinct, colorful, flat 2D aesthetic. Enforce bold, clean black outlines on all elements. No trace of the original photo's style should remain. Strictly avoid: ${NEGATIVE_PROMPT}`,
    imageUrl: 'https://images.pexels.com/photos/164743/pexels-photo-164743.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    name: 'Rick and Morty',
    description: 'Get schwifty with a new look.',
    prompt: `Completely redraw the entire image in the bizarre, psychedelic, and chaotic art style of 'Rick and Morty'. The final output must be indistinguishable from a frame from the show. Characters must have wiry limbs, large heads, and expressive, often panicked, faces with squiggly pupils. The environment must be alien and vibrant, with trippy colors and strange cosmic phenomena. The lines should be slightly shaky and thin. No trace of the original photo's style should remain. Strictly avoid: ${NEGATIVE_PROMPT}`,
    imageUrl: 'https://images.pexels.com/photos/1169754/pexels-photo-1169754.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    name: 'Adventure Time',
    description: 'Mathematical! Join Finn & Jake.',
    prompt: `Totally convert this image into the whimsical, colorful, and post-apocalyptic Land of Ooo from 'Adventure Time'. The final image must look like it was drawn by the show's artists. Characters must have simple, noodle-like limbs and dot eyes. The overall style must be bright, with a pastel color palette, and feel like a charming, hand-drawn fairytale. No trace of the original photo's style should remain. Strictly avoid: ${NEGATIVE_PROMPT}`,
    imageUrl: 'https://images.pexels.com/photos/2249959/pexels-photo-2249959.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    name: 'South Park',
    description: 'Respect my authoritah!',
    prompt: `Recreate the entire image as if it were a scene from 'South Park', ensuring it looks authentic. All elements must look like they are made from construction paper cutouts. Characters must be simple, with wide bodies, large circular heads, and basic dot eyes. The animation style must be crude, 2D, and intentionally simple, capturing the show's unique aesthetic perfectly. No trace of the original photo's style should remain. Strictly avoid: ${NEGATIVE_PROMPT}`,
    imageUrl: 'https://images.pexels.com/photos/33545/snow-winter-nature-33545.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    name: 'Dragon Ball Z',
    description: 'Go Super Saiyan with your photo.',
    prompt: `Power up and transform this image into the high-action, dynamic anime style of 'Dragon Ball Z'. The result must be explosive and faithful to the series. Characters need spiky hair, intense, angular eyes, and ridiculously muscular physiques. The scene must be filled with energy, speed lines, and dramatic, high-contrast shading. Use a vibrant, saturated color palette. No trace of the original photo's style should remain. Strictly avoid: ${NEGATIVE_PROMPT}`,
    imageUrl: 'https://images.pexels.com/photos/1486974/pexels-photo-1486974.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    name: 'SpongeBob',
    description: 'Ready for a Krabby Patty?',
    prompt: `Submerge this entire image into the underwater world of 'SpongeBob SquarePants'. The final image must look like it's from an episode. Everything must look like it belongs in Bikini Bottom. Use a bright, bubbly color palette with lots of blues and yellows. Characters must be transformed into sea creatures or anthropomorphic objects with goofy expressions. Add a flower-shaped cloud pattern to the sky/background. No trace of the original photo's style should remain. Strictly avoid: ${NEGATIVE_PROMPT}`,
    imageUrl: 'https://images.pexels.com/photos/163872/sandy-beach-sea-coast-163872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    name: 'Family Guy',
    description: 'Giggity giggity goo!',
    prompt: `Aggressively convert the image into the distinct art style of 'Family Guy', making it look like a scene from the show. Characters must have a rounded, soft look with large heads, prominent chins, and simple features. The style is a satirical take on classic American sitcoms, so the setting must look like a typical suburban house or town, but in a clean, 2D animated format. No trace of the original photo's style should remain. Strictly avoid: ${NEGATIVE_PROMPT}`,
    imageUrl: 'https://images.pexels.com/photos/221540/pexels-photo-221540.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    name: 'Gravity Falls',
    description: 'Uncover a world of mystery.',
    prompt: `Completely redraw this image in the mysterious and charming style of 'Gravity Falls'. The final art must have a slightly muted, earthy color palette, reminiscent of a Pacific Northwest forest. Characters must have a distinct look with large, expressive eyes and relatively normal proportions. The overall vibe should be a perfect mix of cute, funny, and slightly spooky. No trace of the original photo's style should remain. Strictly avoid: ${NEGATIVE_PROMPT}`,
    imageUrl: 'https://images.pexels.com/photos/421927/pexels-photo-421927.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    name: 'Bob\'s Burgers',
    description: 'Order up a new look!',
    prompt: `Reimagine the entire image in the quirky and slightly wobbly art style of 'Bob\'s Burgers'. The final image must capture the show's unique hand-drawn feel. The style must feature a muted color palette, soft character designs, and an intentionally imperfect look. The lines must not be perfectly straight. The overall atmosphere should be mundane but charming, like a small seaside town. No trace of the original photo's style should remain. Strictly avoid: ${NEGATIVE_PROMPT}`,
    imageUrl: 'https://images.pexels.com/photos/161251/boardwalk-pier-beach-sea-161251.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    name: 'Studio Ghibli',
    description: 'Enter a world of wonder.',
    prompt: `Completely overhaul the image into the breathtaking, hand-painted aesthetic of a Studio Ghibli film. The final output must look like a scene from a Hayao Miyazaki masterpiece. Characters should be rendered with soft, expressive features and a gentle, innocent quality. The background must be transformed into a lush, incredibly detailed, and beautiful watercolor landscape, filled with a sense of magic and nostalgia. Use a rich, natural color palette. No trace of the original photo's style should remain. Strictly avoid: ${NEGATIVE_PROMPT}`,
    imageUrl: 'https://images.pexels.com/photos/381739/pexels-photo-381739.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
];


export const LOADING_MESSAGES = [
  "Painting with pixels...",
  "Consulting the art spirits...",
  "Mixing digital colors...",
  "Sketching your masterpiece...",
  "Adding a touch of magic...",
  "Warming up the AI brushes...",
  "Rendering reality into cartoon...",
  "Generating creative concepts...",
  "Analyzing image composition...",
  "Thinking really, really hard...",
  "Unleashing generative power...",
  "Crafting alternate realities...",
  "Connecting to the art dimension...",
];
