'use client';

import { useEffect, useRef } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export function useAuth() {
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Set up auto-refresh before access token expires
    const setupAutoRefresh = () => {
      // Refresh 1 minute before expiry (15min - 1min = 14min)
      const refreshInterval = 14 * 60 * 1000; // 14 minutes

      refreshTimerRef.current = setInterval(async () => {
        try {
          await axios.post(`${API_URL}/api/auth/refresh`, {}, { withCredentials: true });
          console.log('[Auth] Token refreshed successfully');
        } catch (error) {
          console.error('[Auth] Token refresh failed:', error);
          // Refresh failed → redirect to login
          window.location.href = '/login';
        }
      }, refreshInterval);
    };

    setupAutoRefresh();

    // Cleanup on unmount
    return () => {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
      }
    };
  }, [router]);

  const logout = async () => {
    try {
      await axios.post(`${API_URL}/api/auth/logout`, {}, { withCredentials: true });
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('[Auth] Logout failed:', error);
    }
  };

  return { logout };
}
