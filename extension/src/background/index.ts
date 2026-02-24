import browser from 'webextension-polyfill';
import { MessageType, type Message, type MessageResponse } from '@shared/types/message.types';
import { storageService } from '@shared/services/storage';
import { analyzeURL, checkURLSafety } from '@shared/services/api/urlAnalysis';
import type { URLAnalysisRequest, URLAnalysisResult } from '@shared/types/url.types';

console.log('[Background] Service worker started');

// Message handler
browser.runtime.onMessage.addListener(
  (message: Message, sender): Promise<MessageResponse> => {
    console.log('[Background] Received message:', message.type);
    
    switch (message.type) {
      case MessageType.ANALYZE_URL:
        return handleAnalyzeURL(message.payload, sender);
      
      case MessageType.CHECK_URL_SAFETY:
        return handleCheckURLSafety(message.payload, sender);
      
      case MessageType.GET_STATS:
        return handleGetStats();
      
      case MessageType.GET_HISTORY:
        return handleGetHistory();
      
      case MessageType.GET_SETTINGS:
        return handleGetSettings();
      
      case MessageType.UPDATE_SETTINGS:
        return handleUpdateSettings(message.payload);
      
      case MessageType.CLEAR_HISTORY:
        return handleClearHistory();
      
      case MessageType.MANUAL_SCAN:
        return handleManualScan(message.payload);
      
      default:
        return Promise.resolve({
          success: false,
          error: 'Unknown message type'
        });
    }
  }
);

// Handler: Analyze URL (Feat 1 - Text Selection)
async function handleAnalyzeURL(
  payload: URLAnalysisRequest,
  sender: browser.Runtime.MessageSender
): Promise<MessageResponse<URLAnalysisResult>> {
  try {
    console.log('[Background] Analyzing URL:', payload.url);
    
    // Check cache first
    const settings = await storageService.getSettings();
    if (settings.cacheEnabled) {
      const cached = await storageService.getFromCache(payload.url);
      if (cached) {
        console.log('[Background] Cache hit:', payload.url);
        return {
          success: true,
          data: { ...cached, source: 'cache' }
        };
      }
    }
    
    // Call API
    const result = await analyzeURL(payload);
    
    // Cache result
    if (settings.cacheEnabled) {
      await storageService.setCache(payload.url, result);
    }
    
    // Save to history
    await storageService.addToHistory({
      url: payload.url,
      result,
      pageUrl: payload.context.pageUrl,
      feature: payload.context.feature,
      timestamp: Date.now()
    });
    
    // Update stats
    await updateStats(result);
    
    console.log('[Background] Analysis complete:', result.threatLevel);
    
    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('[Background] Analysis failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Analysis failed'
    };
  }
}

// Handler: Check URL Safety (Feat 2 - Click Protection)
async function handleCheckURLSafety(
  payload: URLAnalysisRequest,
  sender: browser.Runtime.MessageSender
): Promise<MessageResponse<URLAnalysisResult>> {
  try {
    console.log('[Background] Checking URL safety:', payload.url);
    
    // Check whitelist
    const settings = await storageService.getSettings();
    const domain = new URL(payload.url).hostname;
    if (settings.whitelistedDomains.includes(domain)) {
      console.log('[Background] Whitelisted domain:', domain);
      return {
        success: true,
        data: {
          url: payload.url,
          threatLevel: 'safe' as any,
          score: 100,
          confidence: 1,
          reasons: ['Domain is whitelisted'],
          details: {},
          timestamp: Date.now(),
          analysisTime: 0
        }
      };
    }
    
    // Check cache
    if (settings.cacheEnabled) {
      const cached = await storageService.getFromCache(payload.url);
      if (cached) {
        console.log('[Background] Cache hit:', payload.url);
        return {
          success: true,
          data: cached
        };
      }
    }
    
    // Call API
    const result = await checkURLSafety(payload);
    
    // Cache result
    if (settings.cacheEnabled) {
      await storageService.setCache(payload.url, result);
    }
    
    // Save to history
    await storageService.addToHistory({
      url: payload.url,
      result,
      pageUrl: payload.context.pageUrl,
      feature: payload.context.feature,
      timestamp: Date.now()
    });
    
    // Update stats
    await updateStats(result);
    
    // Show notification if dangerous
    if (result.threatLevel === 'dangerous' && settings.showNotifications) {
      browser.notifications.create({
        type: 'basic',
        iconUrl: browser.runtime.getURL('icons/icon48.png'),
        title: 'LinkGuard: Dangerous Link Blocked',
        message: `Blocked: ${payload.url}`
      });
    }
    
    console.log('[Background] Safety check complete:', result.threatLevel);
    
    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('[Background] Safety check failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Safety check failed'
    };
  }
}

// Update stats
async function updateStats(result: URLAnalysisResult) {
  const stats = await storageService.get('linkguard_stats', {
    totalScans: 0,
    threatsBlocked: 0,
    safeLinks: 0,
    suspiciousLinks: 0,
    dangerousLinks: 0,
    todayScans: 0,
    lastReset: new Date().toDateString()
  });
  
  // Reset daily stats if new day
  const today = new Date().toDateString();
  if (stats.lastReset !== today) {
    stats.todayScans = 0;
    stats.lastReset = today;
  }
  
  stats.totalScans++;
  stats.todayScans++;
  
  switch (result.threatLevel) {
    case 'safe':
      stats.safeLinks++;
      break;
    case 'suspicious':
      stats.suspiciousLinks++;
      break;
    case 'dangerous':
      stats.dangerousLinks++;
      stats.threatsBlocked++;
      break;
  }
  
  await storageService.set('linkguard_stats', stats);
}

// Handler: Get Stats
async function handleGetStats(): Promise<MessageResponse> {
  try {
    const stats = await storageService.get('linkguard_stats');
    const history = await storageService.getHistory();
    
    return {
      success: true,
      data: {
        ...stats,
        recentScans: history.slice(0, 10)
      }
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to get stats'
    };
  }
}

// Handler: Get History
async function handleGetHistory(): Promise<MessageResponse> {
  try {
    const history = await storageService.getHistory();
    return {
      success: true,
      data: history
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to get history'
    };
  }
}

// Handler: Get Settings
async function handleGetSettings(): Promise<MessageResponse> {
  try {
    const settings = await storageService.getSettings();
    return {
      success: true,
      data: settings
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to get settings'
    };
  }
}

// Handler: Update Settings
async function handleUpdateSettings(payload: any): Promise<MessageResponse> {
  try {
    await storageService.updateSettings(payload);
    return {
      success: true,
      data: await storageService.getSettings()
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to update settings'
    };
  }
}

// Handler: Clear History
async function handleClearHistory(): Promise<MessageResponse> {
  try {
    await storageService.clearHistory();
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to clear history'
    };
  }
}

// Handler: Manual Scan
async function handleManualScan(payload: any): Promise<MessageResponse> {
  const request: URLAnalysisRequest = {
    url: payload.url,
    context: {
      pageUrl: 'manual-scan',
      timestamp: Date.now(),
      feature: 'text-selection'
    }
  };
  
  return handleAnalyzeURL(request, {} as any);
}
