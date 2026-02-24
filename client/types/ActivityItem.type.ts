export interface ActivityItem {
  id: string;
  type: 'scan' | 'blocked' | 'safe';
  url: string;
  domain: string;
  timestamp: string;
  score: number;
  threatLevel: string;
  feature?: string;
}
