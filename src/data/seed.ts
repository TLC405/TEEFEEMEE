export interface CartoonStyle {
  name: string;
  description: string;
  thumbnail: string;
  prompt?: string;
}

const styleData = [
    { style: 'KHAOS_FLAT2D_THICK', name: 'The Simpsons', source: 'FOX' },
    { style: 'KHAOS_FLAT_PASTEL', name: 'Adventure Time', source: 'Cartoon Network' },
    { style: 'KHAOS_WOBBLE_SCI_FI', name: 'Rick and Morty', source: 'Adult Swim' },
    { 
      style: 'KHAOS_CUTOUT_2D', 
      name: 'South Park', 
      source: 'Comedy Central',
      description: 'High-fidelity paper cutout style that preserves background details.',
      prompt: `High-quality cartoon portrait in a South Park–inspired cutout-paper style: simple geometric bodies, oversized round eyes with black pupils, thick black outlines, flat saturated color fills, subtle paper grain texture, minimal shading, bold silhouette. Preserve original pose and clothing details exactly as in the photo. It is critical to keep the original background, including any scenery, objects, and other people — these must remain visually consistent and unchanged from the original photo. Stylize only the main subjects. High detail on facial features but stylized to South Park vocabulary, no text overlays, no watermark.`
    },
    { style: 'KHAOS_VECTOR_RIG_2D', name: 'Total Drama Island', source: 'Teletoon / Cartoon Network' },
    { style: 'KHAOS_LIMITED_UPA', name: 'Mr. Magoo', source: 'Columbia / UPA' },
    { style: 'KHAOS_FULL_CEL_CLASSIC', name: 'Looney Tunes', source: 'Warner Bros.' },
    { style: 'KHAOS_RUBBER_HOSE', name: 'Steamboat Willie', source: 'Walt Disney' },
    { style: 'KHAOS_XEROX_TV', name: 'The Flintstones', source: 'Hanna-Barbera' },
    { style: 'KHAOS_WATERCOLOR_2D', name: 'Violet Evergarden', source: 'Kyoto Animation' },
    { style: 'KHAOS_STORYBOOK_2D', name: 'Hilda', source: 'Netflix' },
    { style: 'KHAOS_CHARCOAL_2D', name: 'The Midnight Gospel', source: 'Netflix' },
    { style: 'KHAOS_STOP_MOTION', name: 'Robot Chicken', source: 'Adult Swim' },
    { style: 'KHAOS_PAPERCRAFT_25D', name: 'Angela Anaconda', source: 'FOX Family' },
    { style: 'KHAOS_MIXED_MEDIA', name: 'The Amazing World of Gumball', source: 'Cartoon Network' },
    { style: 'KHAOS_ROTO_ILLUSTRATED', name: 'Undone', source: 'Amazon Prime Video' },
    { style: 'KHAOS_PIXEL_2D', name: 'Captain Laserhawk', source: 'Netflix' },
    { style: 'KHAOS_ANIME_CEL', name: 'Naruto', source: 'TV Tokyo' },
    { style: 'KHAOS_GEKIGA_GRIT', name: 'Attack on Titan', source: 'MBS / NHK' },
    { style: 'KHAOS_SHOJO_GLOSS', name: 'Sailor Moon', source: 'TV Asahi' },
    { style: 'KHAOS_MECHA_GLOSS', name: 'Mobile Suit Gundam', source: 'Sunrise' },
    { style: 'KHAOS_SLICE_PASTEL', name: 'K-On!', source: 'Kyoto Animation' },
    { style: 'KHAOS_HORROR_GRUNGE', name: 'Paranoia Agent', source: 'Madhouse' },
    { style: 'KHAOS_3D_GLOSSY', name: 'Trollhunters', source: 'Netflix / DreamWorks' },
    { style: 'KHAOS_3D_TOONSHADER', name: 'The Dragon Prince', source: 'Netflix' },
    { style: 'KHAOS_NPR_3D', name: 'Arcane', source: 'Netflix / Fortiche' },
    { style: 'KHAOS_HYBRID_NEON', name: 'Cyberpunk: Edgerunners', source: 'Netflix / Trigger' },
    { style: 'KHAOS_EARLY_CG_LOWPOLY', name: 'ReBoot', source: 'YTV / Mainframe' },
    { style: 'KHAOS_3D_PHOTOREAL_TV', name: 'Star Wars: The Bad Batch', source: 'Disney+ / Lucasfilm' },
    { style: 'KHAOS_MOGRAPH_FLAT', name: 'BoJack Horseman', source: 'Netflix' },
    { style: 'KHAOS_STICKER_KAWAII', name: 'Bee and PuppyCat', source: 'Netflix / Frederator' },
    { style: 'KHAOS_GRAFFITI_MARKER', name: 'The Boondocks', source: 'Adult Swim' }
];

const thumbnailColors = [
  'bg-yellow-400', 'bg-cyan-300', 'bg-sky-400', 'bg-orange-300',
  'bg-orange-500', 'bg-yellow-200', 'bg-lime-600', 'bg-indigo-400',
  'bg-red-500', 'bg-teal-200', 'bg-purple-400', 'bg-pink-400'
];

export const cartoonStyles: CartoonStyle[] = styleData.map((s, index) => ({
    name: s.name,
    description: s.description || `${s.style} style from ${s.source}.`,
    thumbnail: thumbnailColors[index % thumbnailColors.length],
    prompt: s.prompt,
}));


// FIX: Added MapMarker interface and mapMarkers data to resolve import errors in Map.tsx.
export interface MapMarker {
  id: number;
  lat: number;
  lng: number;
  type: 'Hub' | 'Data Center';
  label: string;
}

export const mapMarkers: MapMarker[] = [
  { id: 1, lat: 34.0522, lng: -118.2437, type: 'Hub', label: 'Los Angeles AI Hub' },
  { id: 2, lat: 40.7128, lng: -74.0060, type: 'Hub', label: 'New York AI Hub' },
  { id: 3, lat: 51.5074, lng: -0.1278, type: 'Hub', label: 'London AI Hub' },
  { id: 4, lat: 35.6895, lng: 139.6917, type: 'Hub', label: 'Tokyo AI Hub' },
  { id: 5, lat: 48.8566, lng: 2.3522, type: 'Hub', label: 'Paris AI Hub' },
  { id: 6, lat: 37.8272, lng: -122.2913, type: 'Data Center', label: 'SF Bay Area Data Center' },
  { id: 7, lat: 52.3676, lng: 4.9041, type: 'Data Center', label: 'Amsterdam Data Center' },
  { id: 8, lat: 1.3521, lng: 103.8198, type: 'Data Center', label: 'Singapore Data Center' },
  { id: 9, lat: -33.8688, lng: 151.2093, type: 'Data Center', label: 'Sydney Data Center' },
  { id: 10, lat: 19.0760, lng: 72.8777, type: 'Data Center', label: 'Mumbai Data Center' },
];
