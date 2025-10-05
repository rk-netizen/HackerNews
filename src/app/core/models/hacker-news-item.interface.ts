export interface Story {
  id: number;
  title: string;
  by: string;
  score: number;
  url?: string;
  time: number;
  descendants?: number;
  type?: string;
}

export type StoryType = 'top' | 'new';
