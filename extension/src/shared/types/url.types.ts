export enum ThreatLevel {
  SAFE = 'safe',
  SUSPICIOUS = 'suspicious',
  DANGEROUS = 'dangerous',
  UNKNOWN = 'unknown'
}

export interface URLAnalysisResult {
  url: string;
  threatLevel: ThreatLevel;
  score: number; // 0-100
  confidence: number; // 0-1
  reasons: string[];
  details: {
    domainAge?: number;
    isPhishing?: boolean;
    hasMalware?: boolean;
    hasRedirect?: boolean;
    redirectChain?: string[];
    ipReputation?: string;
    sslValid?: boolean;
    category?: string;
  };
  timestamp: number;
  analysisTime: number; // ms
}

export interface URLAnalysisRequest {
  url: string;
  context: {
    pageUrl: string;
    timestamp: number;
    feature: 'text-selection' | 'click-protection';
    userAgent?: string;
  };
}
