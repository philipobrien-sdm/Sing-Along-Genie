
export interface SongPart {
  type: 'Verse' | 'Chorus' | 'Bridge' | 'Outro';
  lines: string[];
}

export interface GeneratedSong {
  title: string;
  parts: SongPart[];
  mood: string;
  tempo: string;
  tips: string;
}

export interface SongPreset {
  id: string;
  category: 'For Kids' | 'Group Sing-Alongs' | 'Solo Singing';
  name: string;
  description: string;
  icon: string;
  rhythmStyle: string;
  rhymeScheme: string;
}

export enum GenerationState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
