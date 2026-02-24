export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
  ANALYZE_URL: '/url/analyze',
  CHECK_SAFETY: '/url/check-safety',
  REPORT_URL: '/url/report',
  GET_STATS: '/url/stats',
} as const;

export const API_TIMEOUT = 10000; // 10 seconds
