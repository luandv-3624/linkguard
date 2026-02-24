import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import browser from 'webextension-polyfill';
import { sendMessage } from '@shared/services/messaging';
import { MessageType } from '@shared/types/message.types';
import type { Settings } from '@shared/constants/storage';

interface Stats {
  totalScans: number;
  threatsBlocked: number;
  safeLinks: number;
  suspiciousLinks: number;
  dangerousLinks: number;
  todayScans: number;
  recentScans: any[];
}

interface AppContextType {
  stats: Stats | null;
  settings: Settings | null;
  loading: boolean;
  error: string | null;
  refreshStats: () => Promise<void>;
  refreshSettings: () => Promise<void>;
  updateSettings: (updates: Partial<Settings>) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshStats = async () => {
    try {
      const response = await sendMessage({ type: MessageType.GET_STATS });
      if (response.success) {
        setStats(response.data);
      } else {
        setError(response.error || 'Failed to load stats');
      }
    } catch (err) {
      setError('Failed to load stats');
      console.error(err);
    }
  };

  const refreshSettings = async () => {
    try {
      const response = await sendMessage({ type: MessageType.GET_SETTINGS });
      if (response.success) {
        setSettings(response.data);
      } else {
        setError(response.error || 'Failed to load settings');
      }
    } catch (err) {
      setError('Failed to load settings');
      console.error(err);
    }
  };

  const updateSettings = async (updates: Partial<Settings>) => {
    try {
      const response = await sendMessage({
        type: MessageType.UPDATE_SETTINGS,
        payload: updates
      });
      if (response.success) {
        setSettings(response.data);
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      setError('Failed to update settings');
      throw err;
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([refreshStats(), refreshSettings()]);
      setLoading(false);
    };
    init();

    // Lắng nghe sự thay đổi của Storage để cập nhật UI ngay lập tức
    const handleStorageChange = (changes: any, areaName: string) => {
      if (areaName === 'local') {
        // SỬA TẠI ĐÂY: Nếu stats HOẶC history thay đổi, gọi lại hàm refreshStats
        if (changes.linkguard_stats || changes.linkguard_history) {
          refreshStats(); 
        }
        
        // Nếu settings thay đổi
        if (changes.linkguard_settings) {
          setSettings(changes.linkguard_settings.newValue);
        }
      }
    };

    browser.storage.onChanged.addListener(handleStorageChange);

    return () => {
      browser.storage.onChanged.removeListener(handleStorageChange);
    };
  }, []);

  return (
    <AppContext.Provider
      value={{
        stats,
        settings,
        loading,
        error,
        refreshStats,
        refreshSettings,
        updateSettings
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
