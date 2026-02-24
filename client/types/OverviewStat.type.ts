export interface OverviewStat {
  totalScans: number;
  totalDomains: number;
  activeUsers: number;
  totalThreats: number;
  activeSessions: number;
  threatRate: number;
  avgAnalysisTime: number;
  recentScans: {
    id: string;
    url: string;
    timestamp: string;
    result: {
      threatLevel: 'safe' | 'suspicious' | 'dangerous';
      score: number;
    };
  }[];
}
