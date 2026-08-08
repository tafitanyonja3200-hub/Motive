export type PageType = 'intro' | 'letter' | 'games' | 'bible' | 'jar' | 'memories';

export interface MemoryItem {
  id: string;
  imageUrl: string;
  caption: string;
  date: string;
  filter: string;
  tag?: string;
  liked?: boolean;
}

export interface BibleVerse {
  id: string;
  verse: string;
  reference: string;
  category: 'strength' | 'peace' | 'hope' | 'love' | 'comfort' | 'general';
}

export interface AudioTrack {
  id: string;
  name: string;
  description: string;
  src: string;
  isSynthetic?: boolean;
  youtubeId?: string;
}

export interface AffirmationNote {
  id: string;
  text: string;
  author?: string;
  tag: string;
}

export interface PuzzlePreset {
  id: string;
  name: string;
  url: string;
}
