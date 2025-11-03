
export const MAX_FILE_SIZE_MB = 10;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
export const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
export const GALLERY_STORAGE_KEY = 'teefeeme_gallery';
export const CUSTOM_BACKGROUND_STORAGE_KEY = 'teefeeme_background';

export const ASPECT_RATIOS = ["1:1", "16:9", "9:16", "4:3", "3:4"];

export const DEFAULT_THEME = {
  '--color-primary': '#38bdf8', // sky-400
  '--color-secondary': '#7dd3fc', // sky-300
  '--color-accent': '#d946ef', // fuchsia-500
  '--color-background': '#111827', // gray-900
  '--color-surface': '#1f2937', // gray-800
  '--color-text-primary': '#f9fafb', // gray-50
  '--color-text-secondary': '#9ca3af', // gray-400
  '--color-text-on-primary': '#ffffff',
};

export interface CartoonStyle {
  label: string;
  prompt: string;
  icon: string;
  theme: Record<string, string>;
}

interface CartoonStyles {
  [key: string]: CartoonStyle[];
}

export const CARTOON_STYLES: CartoonStyles = {
  "Primetime Satire": [
    { 
      label: "The Simpsons", 
      prompt: "A Simpsons-like cartoon style. Faithfully adapt the person's features. If the person is female, give her a classic Simpsons female character design with appropriate hairstyle and features like eyelashes or a pearl necklace. If the person is male, give him a slightly goofy expression and classic male character design, possibly with a slight overbite. The characters should be yellow with bold outlines and simple flat colors.", 
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
  "Action & Adventure": [
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
      label: "Dragon Ball Z",
      prompt: "A Dragon Ball Z anime style from the 90s, sharp angular lines, dynamic energy auras, intense action poses, dramatic speed lines, cel-shaded characters with spiky hair, set on a rocky battlefield.",
      icon: "💥",
      theme: { ...DEFAULT_THEME, '--color-primary': '#F57C00', '--color-secondary': '#1976D2', '--color-accent': '#FFEB3B', '--color-text-on-primary': '#000000' }
    },
    {
      label: "Sailor Moon",
      prompt: "A 90s shōjo anime style inspired by Sailor Moon, large expressive eyes with detailed highlights, soft pastel color palette, elegant and magical girl transformation aesthetic, flowing hair, romantic and dreamy atmosphere.",
      icon: "🌙",
      theme: { ...DEFAULT_THEME, '--color-primary': '#F472B6', '--color-secondary': '#60A5FA', '--color-accent': '#FBBF24', '--color-text-on-primary': '#000000' }
    },
  ],
  "Modern Whimsy": [
     { 
      label: "SpongeBob", 
      prompt: "A SpongeBob SquarePants-like cartoon style, vibrant underwater setting, bubbly textures, expressive round eyes, bright colors, set in Bikini Bottom.", 
      icon: "🍍", 
      theme: { ...DEFAULT_THEME, '--color-primary': '#FFD700', '--color-secondary': '#1E90FF', '--color-accent': '#DC143C', '--color-text-on-primary': '#000000' }
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
    {
      label: "Steven Universe",
      prompt: "A Steven Universe inspired art style, soft and rounded shapes, gentle pastel color palette, diverse character designs, beautiful painterly backgrounds, emotional and serene atmosphere.",
      icon: "⭐",
      theme: { ...DEFAULT_THEME, '--color-primary': '#FB7185', '--color-secondary': '#67E8F9', '--color-accent': '#FDE047', '--color-text-on-primary': '#000000' }
    }
  ],
  "Retro & Classic": [
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
    },
     {
      label: "Powerpuff Girls",
      prompt: "A Powerpuff Girls art style, UPA-inspired modernism, thick bold outlines without tapering, simple geometric character shapes, large circular eyes, vibrant flat colors, abstract cityscape background.",
      icon: "💖",
      theme: { ...DEFAULT_THEME, '--color-primary': '#F472B6', '--color-secondary': '#60A5FA', '--color-accent': '#4ADE80', '--color-text-on-primary': '#000000' }
    }
  ]
};

export const STICKERS = [
  { name: 'Crown', src: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmYmYyMDYiIHN0cm9rZS1widthPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNyb3duIj48cGF0aCBkPSJtMiA0IDMgMTIgOC03IDggNyAzLTEyIi8+PHBhdGggZD0iTTUgMjBoMTRhMiAyIDAgMCAwIDItMlY4YTIgMiAwIDAgMC0yLTJINWEyIDIgMCAwIDAtMiAydjEwYTIgMiAwIDAgMCAyIDIiLz48L3N2Zz4=' },
  { name: 'Heart', src: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNlZjQ0NDQiIHN0cm9rZS1widthPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWhlYXJ0Ij48cGF0aCBkPSJNMTkgMTRIOC41QzcuMDEgMTQgNSA5LjUgNSA3LjVDNSA0LjQ2IDcuNDYgMiAxMC41IDJjMS43NCAwIDMuNDEuODEgNC41IDIuMjlDMTYuMDkgMi44MSAxNy43NiAyIDE5LjUgMmMzLjA0IDAgNS41IDIuNDYgNS41IDUuNVMxNS45OSAxNCAxMiAxMy41IDUgMTQgNSA3LjUiLz48L3N2Zz4=' },
  { name: 'Star', src: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM4NGU1ZmYiIHN0cm9rZS1widthPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXN0YXIiPjxwYXRoIGQ9Im0xMiAyIDMuMDkgNi4yNiA2LjkxIDEuMDEtNSAzLjg4IDEuMTggNi44OC02LjE4LTMuMjUtNi4xOCAzLjI1IDEuMTgtNi44OC01LTQuODgtNi45MS0xLjAxWiIvPjwvc3ZnPg==' },
  { name: 'Bolt', src: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNhM2U2YmYiIHN0cm9rZS1widthPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWZsYXNoIj48cGF0aCBkPSJNMyAxMS41IDExLjUgMyAyMSA5LjUgMTIuNSA4IDMgMTEuNVoiLz48cGF0aCBkPSJtMTMgMTAtNSA0LjUgOS41IDIuNS0yLjUtOS41WiIvPjwvc3ZnPg==' },
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

export const NEGATIVE_PROMPT = "Deformed, bad anatomy, mutated, extra limbs, blurry, pixelated, signature, text, watermark, logo, nsfw, disembodied limbs, incomplete figures, cut-off body parts, extra hands, random objects.";
