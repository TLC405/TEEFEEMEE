

export const MAX_FILE_SIZE_MB = 10;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
export const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
export const GALLERY_STORAGE_KEY = 'teefeeme_gallery';

export const ASPECT_RATIOS = ["1:1", "16:9", "9:16", "4:3", "3:4"];

export const DEFAULT_THEME = {
  '--color-primary': '#a3e635', // lime-400
  '--color-secondary': '#bef264', // lime-300
  '--color-accent': '#84cc16', // lime-500
  '--color-background': '#111111',
  '--color-surface': '#181818',
  '--color-text-primary': '#f3f4f6', // gray-100
  '--color-text-secondary': '#9ca3af', // gray-400
  '--color-text-on-primary': '#000000', // black
};

export interface CartoonStyle {
  label: string;
  prompt: string;
  icon: string;
  theme: Record<string, string>;
}

interface CartoonStyles {
  adultShows: CartoonStyle[];
  kidShows: CartoonStyle[];
  classicShows: CartoonStyle[];
}

export const CARTOON_STYLES: CartoonStyles = {
  adultShows: [
    { 
      label: "The Simpsons", 
      prompt: "A Simpsons-like cartoon style, yellow characters, bold outlines, simple flat colors, overbite, set in a suburban living room.", 
      icon: "🍩", 
      theme: { ...DEFAULT_THEME, '--color-primary': '#FFD90F', '--color-secondary': '#4AC7F0', '--color-accent': '#F262A8', '--color-text-on-primary': '#000000' }
    },
    { 
      label: "Family Guy", 
      prompt: "A Family Guy-like cartoon style, distinct chin, simple character design, satirical tone, set on a familiar couch.", 
      icon: "📺", 
      theme: { ...DEFAULT_THEME, '--color-primary': '#E64C3C', '--color-secondary': '#3498DB', '--color-accent': '#2ECC71', '--color-text-on-primary': '#ffffff' }
    },
    { 
      label: "Rick & Morty", 
      prompt: "A Rick and Morty-like cartoon style, sci-fi theme, squiggly pupils, drool, vibrant portal background.", 
      icon: "🌀", 
      theme: { ...DEFAULT_THEME, '--color-primary': '#00B0C8', '--color-secondary': '#97CE4C', '--color-accent': '#F96229', '--color-text-on-primary': '#000000' }
    },
    { 
      label: "South Park", 
      prompt: "A South Park-like cartoon style, paper cutout animation, simple geometric shapes, construction paper texture, snowy mountain town background.", 
      icon: "🏔️", 
      theme: { ...DEFAULT_THEME, '--color-primary': '#F7D748', '--color-secondary': '#E53935', '--color-accent': '#4CAF50', '--color-text-on-primary': '#000000' }
    },
    { 
      label: "BoJack Horseman", 
      prompt: "A BoJack Horseman-like cartoon style, anthropomorphic animal characters, painterly backgrounds, melancholic tone, set in a Hollywood apartment.", 
      icon: "🐴", 
      theme: { ...DEFAULT_THEME, '--color-primary': '#FF4081', '--color-secondary': '#7C4DFF', '--color-accent': '#FFC107', '--color-text-on-primary': '#000000' }
    },
  ],
  kidShows: [
    { 
      label: "SpongeBob", 
      prompt: "A SpongeBob SquarePants-like cartoon style, vibrant underwater setting, bubbly textures, expressive round eyes, bright colors, set in Bikini Bottom.", 
      icon: "🍍", 
      theme: { ...DEFAULT_THEME, '--color-primary': '#FFD700', '--color-secondary': '#1E90FF', '--color-accent': '#DC143C', '--color-text-on-primary': '#000000' }
    },
    { 
      label: "Avatar", 
      prompt: "An Avatar: The Last Airbender anime-influenced style, dynamic action poses, elemental bending effects, detailed traditional clothing, East Asian-inspired world.", 
      icon: "💨", 
      theme: { ...DEFAULT_THEME, '--color-primary': '#FF9933', '--color-secondary': '#6495ED', '--color-accent': '#8FBC8F', '--color-text-on-primary': '#000000' }
    },
    { 
      label: "Pokémon", 
      prompt: "A classic Pokémon anime style from the 90s, cel-shaded, vibrant colors, dynamic action poses, natural outdoor background.", 
      icon: "⚡️", 
      theme: { ...DEFAULT_THEME, '--color-primary': '#FFCB05', '--color-secondary': '#2A75BB', '--color-accent': '#EE1515', '--color-text-on-primary': '#000000' }
    },
    { 
      label: "Adventure Time", 
      prompt: "An Adventure Time-like cartoon style, noodly limbs, simple dot eyes, pastel color palette, surreal and whimsical post-apocalyptic land of Ooo background.", 
      icon: "🗡️", 
      theme: { ...DEFAULT_THEME, '--color-primary': '#69D2E7', '--color-secondary': '#F38630', '--color-accent': '#FA6900', '--color-text-on-primary': '#000000' }
    },
    { 
      label: "Gravity Falls", 
      prompt: "A Gravity Falls-like cartoon style, mysterious and woodsy atmosphere, detailed backgrounds with hidden clues, slightly muted color palette, character designs with a mix of soft and sharp angles.", 
      icon: "🌲", 
      theme: { ...DEFAULT_THEME, '--color-primary': '#FFE57D', '--color-secondary': '#00BFA5', '--color-accent': '#6D4C41', '--color-text-on-primary': '#000000' }
    },
  ],
  classicShows: [
    {
      label: "Looney Tunes",
      prompt: "A classic Looney Tunes style, exaggerated physics, dynamic action poses, expressive characters, desert landscapes with mesas and cacti.",
      icon: "🥕",
      theme: { ...DEFAULT_THEME, '--color-primary': '#FF8C00', '--color-secondary': '#4682B4', '--color-accent': '#D2691E', '--color-text-on-primary': '#000000' }
    },
    {
      label: "Rubber Hose",
      prompt: "1930s rubber hose animation style, black and white, pie eyes, noodle-like limbs, white gloves, bouncy movements, film grain effect.",
      icon: "🚢",
      theme: { ...DEFAULT_THEME, '--color-primary': '#FFFFFF', '--color-secondary': '#CCCCCC', '--color-accent': '#999999', '--color-text-on-primary': '#000000', '--color-background': '#101010', '--color-surface': '#222222', '--color-text-primary': '#FFFFFF' }
    },
    {
      label: "The Flintstones",
      prompt: "A Hanna-Barbera 'The Flintstones' cartoon style, prehistoric Bedrock setting, simple character designs with thick black outlines, animal-powered contraptions, stone textures.",
      icon: "🦴",
      theme: { ...DEFAULT_THEME, '--color-primary': '#F47920', '--color-secondary': '#00AEEF', '--color-accent': '#8DC63F', '--color-text-on-primary': '#000000' }
    },
    {
      label: "Scooby-Doo",
      prompt: "A classic 'Scooby-Doo, Where Are You!' cartoon style, groovy 1970s aesthetic, mysterious and spooky but not scary atmosphere, muted color palette, iconic van in the background.",
      icon: "👻",
      theme: { ...DEFAULT_THEME, '--color-primary': '#784484', '--color-secondary': '#FBB43C', '--color-accent': '#489A50', '--color-text-on-primary': '#ffffff' }
    }
  ]
};

export const LOADING_MESSAGES = [
  "Painting with pixels...",
  "Consulting the art spirits...",
  "Mixing digital colors...",
  "Sketching your masterpiece...",
  "Adding a touch of magic...",
  "Warming up the AI brushes...",
  "Rendering reality into cartoon...",
];

export const NEGATIVE_PROMPT = "Deformed, bad anatomy, mutated, extra limbs, blurry, pixelated, signature, text, watermark, logo, nsfw, disembodied limbs, incomplete figures, cut-off body parts, extra hands, random objects.";