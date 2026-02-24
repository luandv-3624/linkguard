import browser from 'webextension-polyfill';
import { STORAGE_KEYS, DEFAULT_SETTINGS, type Settings } from '@shared/constants/storage';

class StorageService {
  // Get item from storage
  async get<T>(key: string, defaultValue?: T): Promise<T | undefined> {
    try {
      const result = await browser.storage.local.get(key);
      return result[key] !== undefined ? result[key] as T : defaultValue;
    } catch (error) {
      console.error('[Storage] Get failed:', error);
      return defaultValue;
    }
  }

  // Set item in storage
  async set<T>(key: string, value: T): Promise<boolean> {
    try {
      await browser.storage.local.set({ [key]: value });
      return true;
    } catch (error) {
      console.error('[Storage] Set failed:', error);
      return false;
    }
  }

  // Remove item from storage
  async remove(key: string): Promise<boolean> {
    try {
      await browser.storage.local.remove(key);
      return true;
    } catch (error) {
      console.error('[Storage] Remove failed:', error);
      return false;
    }
  }

  // Clear all storage
  async clear(): Promise<boolean> {
    try {
      await browser.storage.local.clear();
      return true;
    } catch (error) {
      console.error('[Storage] Clear failed:', error);
      return false;
    }
  }

  // Settings specific methods
  async getSettings(): Promise<Settings> {
    const settings = await this.get<Settings>(STORAGE_KEYS.SETTINGS);
    return { ...DEFAULT_SETTINGS, ...settings };
  }

  async updateSettings(updates: Partial<Settings>): Promise<boolean> {
    const current = await this.getSettings();
    return this.set(STORAGE_KEYS.SETTINGS, { ...current, ...updates });
  }

  // History methods
  async getHistory(): Promise<any[]> {
    return (await this.get<any[]>(STORAGE_KEYS.HISTORY)) || [];
  }

  async addToHistory(item: any): Promise<boolean> {
    const history = await this.getHistory();
    history.unshift(item);
    
    // Keep only last 100 items
    const trimmed = history.slice(0, 100);
    return this.set(STORAGE_KEYS.HISTORY, trimmed);
  }

  async clearHistory(): Promise<boolean> {
    return this.set(STORAGE_KEYS.HISTORY, []);
  }

  // Cache methods
  async getFromCache(url: string): Promise<any | null> {
    const cache = await this.get<Record<string, any>>(STORAGE_KEYS.CACHE) || {};
    const cached = cache[url];
    
    if (!cached) return null;
    
    // Check if expired
    const settings = await this.getSettings();
    if (Date.now() - cached.timestamp > settings.cacheDuration) {
      delete cache[url];
      await this.set(STORAGE_KEYS.CACHE, cache);
      return null;
    }
    
    return cached.data;
  }

  async setCache(url: string, data: any): Promise<boolean> {
    const cache = await this.get<Record<string, any>>(STORAGE_KEYS.CACHE) || {};
    cache[url] = {
      data,
      timestamp: Date.now()
    };
    return this.set(STORAGE_KEYS.CACHE, cache);
  }

  async clearCache(): Promise<boolean> {
    return this.set(STORAGE_KEYS.CACHE, {});
  }
}

export const storageService = new StorageService();
