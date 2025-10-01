export interface HackerNewsItem {
  id: number;
  title: string;
  by: string;
  score: string;
  url?: string;
  time: number;
  descendants?: number;
  type?: number;
}
