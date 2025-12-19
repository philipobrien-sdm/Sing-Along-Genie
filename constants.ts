
import { SongPreset } from './types';

export const SONG_PRESETS: SongPreset[] = [
  // FOR KIDS
  {
    id: 'nursery',
    category: 'For Kids',
    name: 'Classic Nursery',
    description: 'Bouncy, simple AABB rhymes. Great for kids or playful vibes.',
    icon: 'fa-child-reaching',
    rhythmStyle: '4/4 steady bounce, similar to "Twinkle Twinkle"',
    rhymeScheme: 'AABB'
  },
  {
    id: 'animal-safari',
    category: 'For Kids',
    name: 'Animal Safari',
    description: 'Energetic and full of sound effects. Great for acting out parts.',
    icon: 'fa-hippo',
    rhythmStyle: 'Fast 2/4 march with breaks for animal noises',
    rhymeScheme: 'AABB'
  },
  {
    id: 'lullaby',
    category: 'For Kids',
    name: 'Sweet Lullaby',
    description: 'Gentle, soothing, and slow. Perfect for winding down.',
    icon: 'fa-moon',
    rhythmStyle: 'Soft 3/4 waltz time',
    rhymeScheme: 'AAAA or AABB'
  },

  // GROUP SING-ALONGS (TROOP SONGS)
  {
    id: 'pub-anthem',
    category: 'Group Sing-Alongs',
    name: 'Pub Anthem',
    description: 'Boisterous, stompy 4/4 beats. Easy to shout and belt out.',
    icon: 'fa-beer-mug-empty',
    rhythmStyle: 'Strong 4/4 downbeats with a chantable chorus',
    rhymeScheme: 'ABAB'
  },
  {
    id: 'campfire',
    category: 'Group Sing-Alongs',
    name: 'Campfire Folk',
    description: 'Mellow, acoustic-style storytelling with a repetitive hook.',
    icon: 'fa-fire',
    rhythmStyle: 'Waltz-like or gentle 4/4 strumming',
    rhymeScheme: 'AABB or ABAB'
  },
  {
    id: 'sea-shanty',
    category: 'Group Sing-Alongs',
    name: 'Sea Shanty',
    description: 'Call-and-response style. Rhythmic and gritty for a hearty group.',
    icon: 'fa-anchor',
    rhythmStyle: 'Heavy 4/4 "stomp-clap" rhythm',
    rhymeScheme: 'AABB with refrain'
  },
  {
    id: 'marching-cadence',
    category: 'Group Sing-Alongs',
    name: 'Troop Cadence',
    description: 'Strict rhythm, high energy, used for keeping pace and morale.',
    icon: 'fa-person-military-pointing',
    rhythmStyle: 'Strict 4/4 left-right-left marching beat',
    rhymeScheme: 'AABB (Call & Response)'
  },

  // SOLO SINGING
  {
    id: 'pop-bop',
    category: 'Solo Singing',
    name: 'Upbeat Pop',
    description: 'High energy, syncopated rhythms, and a catchy earworm chorus.',
    icon: 'fa-radio',
    rhythmStyle: 'Driving 4/4 with syncopation in the verses',
    rhymeScheme: 'AABB CC'
  },
  {
    id: 'power-ballad',
    category: 'Solo Singing',
    name: 'Power Ballad',
    description: 'Dramatic, emotional, and building to a huge crescendo.',
    icon: 'fa-heart-pulse',
    rhythmStyle: 'Slow 4/4 that doubles in intensity at the chorus',
    rhymeScheme: 'ABAB'
  },
  {
    id: 'jazz-crooner',
    category: 'Solo Singing',
    name: 'Jazz Crooner',
    description: 'Smooth, swingy, and sophisticated. For the suave shower singer.',
    icon: 'fa-saxophone',
    rhythmStyle: 'Swing 4/4 with "walking" bass feel',
    rhymeScheme: 'AABA'
  },
  {
    id: 'country-story',
    category: 'Solo Singing',
    name: 'Country Story',
    description: 'Clear storytelling with a twang and a heart-on-sleeve hook.',
    icon: 'fa-hat-cowboy',
    rhythmStyle: 'Steady 4/4 "boom-chicka" rhythm',
    rhymeScheme: 'AABB or ABAB'
  }
];

export const SYSTEM_INSTRUCTION = `
You are a world-class Sing-Along Songwriter. Your mission is to create lyrics that are catchy, rhythmic, and incredibly easy to sing for people of all skill levels (including "tone-deaf" beginners).

Guidelines:
1. Lyrics must be highly rhythmic and follow a consistent meter.
2. Use simple, evocative language.
3. Include a very repetitive and memorable "Chorus" that anchors the song.
4. Structure the song with clearly labeled parts (Verse 1, Chorus, Verse 2, etc.).
5. Provide a title, the mood of the song, suggested tempo, and "Singer Tips" for the user.

Format the output as valid JSON.
`;
