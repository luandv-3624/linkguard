import { ThreatLevel } from '@shared/types/url.types';

export interface ThreatStyleConfig {
  color: string;
  icon: string;
}

export const THREAT_STYLES: Record<ThreatLevel, ThreatStyleConfig> = {
  [ThreatLevel.SAFE]: {
    color: '#10b981', // green
    icon: '✓',
  },
  [ThreatLevel.SUSPICIOUS]: {
    color: '#f59e0b', // orange
    icon: '⚠',
  },
  [ThreatLevel.DANGEROUS]: {
    color: '#ef4444', // red
    icon: '✕',
  },
  [ThreatLevel.UNKNOWN]: {
    color: '#6b7280', // gray
    icon: '?',
  },
};