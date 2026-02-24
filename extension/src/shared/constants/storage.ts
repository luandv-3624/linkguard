export const STORAGE_KEYS = {
  SETTINGS: 'linkguard_settings',
  HISTORY: 'linkguard_history',
  STATS: 'linkguard_stats',
  CACHE: 'linkguard_cache',
  WHITELIST: 'linkguard_whitelist',
} as const;

export const DEFAULT_SETTINGS = {
  clickProtectionEnabled: true,
  textSelectionEnabled: true,
  showNotifications: true,
  autoBlockDangerous: true,
  cacheEnabled: true,
  cacheDuration: 3600000, // 1 hour
  whitelistedDomains: [] as string[],
};

export type Settings = typeof DEFAULT_SETTINGS;
