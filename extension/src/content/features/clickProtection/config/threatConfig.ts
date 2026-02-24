import { ThreatLevel } from '@shared/types/url.types';

export interface ThreatInfo {
  icon: string;
  title: string;
  color: string;
  bgColor: string;
  description: string;
}

export const THREAT_CONFIG: Record<ThreatLevel, ThreatInfo> = {
  [ThreatLevel.DANGEROUS]: {
    icon: '🛑',
    title: 'Dangerous Link Detected',
    color: '#dc2626',
    bgColor: '#fef2f2',
    description: 'This link has been identified as dangerous and may harm your device or steal your information.',
  },
  [ThreatLevel.SUSPICIOUS]: {
    icon: '⚠️',
    title: 'Suspicious Link Detected',
    color: '#ea580c',
    bgColor: '#fff7ed',
    description: 'This link shows suspicious characteristics and may not be safe to visit.',
  },
  [ThreatLevel.SAFE]: {
    icon: '✅',
    title: 'Safe Link',
    color: '#16a34a',
    bgColor: '#f0fdf4',
    description: 'This link appears to be safe.',
  },
  [ThreatLevel.UNKNOWN]: {
    icon: '❓',
    title: 'Unknown Link',
    color: '#6b7280',
    bgColor: '#f9fafb',
    description: 'We could not determine if this link is safe.',
  },
};
