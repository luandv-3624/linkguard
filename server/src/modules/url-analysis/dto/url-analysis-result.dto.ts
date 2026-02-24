export enum ThreatLevel {
  SAFE = 'safe',
  SUSPICIOUS = 'suspicious',
  DANGEROUS = 'dangerous',
  UNKNOWN = 'unknown',
}

export class URLAnalysisResultDto {
  url!: string;
  threatLevel!: ThreatLevel;
  score!: number; // 0-100
  confidence!: number; // 0-1
  reasons!: string[];
  details!: {
    domainAge?: number;
    isPhishing?: boolean;
    hasMalware?: boolean;
    hasRedirect?: boolean;
    redirectChain?: string[];
    ipReputation?: string;
    sslValid?: boolean;
    category?: string;
    externalChecks?: {
      virusTotal?: any;
      googleSafeBrowsing?: any;
    };
  };
  timestamp!: number;
  analysisTime?: number;
}
