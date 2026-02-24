import { isInternalLink, normalizeURL } from '@shared/utils/urlUtils';
import { showWarningModal, type UserChoice } from './components/WarningModal';
import { sendMessage } from '@shared/services/messaging';
import { MessageType } from '@shared/types/message.types';
import { storageService } from '@shared/services/storage';
import type { URLAnalysisRequest } from '@shared/types/url.types';

let isEnabled = true;

export async function initClickProtection() {
  console.log('[Content] Click protection feature initialized');
  
  // Check if feature is enabled
  const settings = await storageService.getSettings();
  isEnabled = settings.clickProtectionEnabled;
  
  if (!isEnabled) {
    console.log('[Content] Click protection is disabled');
    return;
  }
  
  // Use capture phase to intercept clicks before default behavior
  document.addEventListener('click', handleClick, true);
}

async function handleClick(e: MouseEvent) {
  if (!isEnabled) return;
  
  const target = e.target as HTMLElement;
  const link = target.closest('a') as HTMLAnchorElement;
  
  // Not a link
  if (!link || !link.href) {
    return;
  }
  
  // Skip internal links
  if (isInternalLink(link.href, window.location.href)) {
    return;
  }
  
  // Skip if Ctrl/Cmd/Shift key is pressed (new tab, etc.)
  if (e.ctrlKey || e.metaKey || e.shiftKey) {
    return;
  }
  
  console.log('[Content] Link clicked:', link.href);
  
  // Prevent default navigation
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();
  
  await checkAndNavigate(link.href);
}

async function checkAndNavigate(url: string) {
  const normalizedURL = normalizeURL(url);
  
  console.log('[Content] Checking URL safety:', normalizedURL);
  
  try {
    // Get settings
    const settings = await storageService.getSettings();
    
    // Check whitelist
    const domain = new URL(normalizedURL).hostname;
    if (settings.whitelistedDomains.includes(domain)) {
      console.log('[Content] Whitelisted domain, allowing navigation');
      window.location.href = normalizedURL;
      return;
    }
    
    // Send to background for safety check
    const request: URLAnalysisRequest = {
      url: normalizedURL,
      context: {
        pageUrl: window.location.href,
        timestamp: Date.now(),
        feature: 'click-protection'
      }
    };
    
    const response = await sendMessage({
      type: MessageType.CHECK_URL_SAFETY,
      payload: request
    });
    
    if (!response.success) {
      console.error('[Content] Safety check failed:', response.error);
      // On error, allow navigation with console warning
      console.warn('[Content] Allowing navigation due to check failure');
      window.location.href = normalizedURL;
      return;
    }
    
    const result = response.data;
    
    console.log('[Content] Safety check result:', result.threatLevel);
    
    // If safe, proceed immediately
    if (result.threatLevel === 'safe') {
      window.location.href = normalizedURL;
      return;
    }
    
    // If suspicious or dangerous, show warning modal
    const userChoice: UserChoice = await showWarningModal({
      url: normalizedURL,
      result
    });
    
    if (userChoice === 'proceed') {
      console.log('[Content] User chose to proceed');
      window.location.href = normalizedURL;
    } else if (userChoice === 'whitelist') {
      console.log('[Content] User chose to whitelist domain');
      // Add to whitelist
      const currentWhitelist = settings.whitelistedDomains;
      await storageService.updateSettings({
        whitelistedDomains: [...currentWhitelist, domain]
      });
      window.location.href = normalizedURL;
    } else {
      console.log('[Content] User cancelled navigation');
    }
  } catch (error) {
    console.error('[Content] Error during safety check:', error);
    // On error, allow navigation
    window.location.href = normalizedURL;
  }
}

export function cleanupClickProtection() {
  document.removeEventListener('click', handleClick, true);
}

export async function toggleClickProtection(enabled: boolean) {
  isEnabled = enabled;
  console.log('[Content] Click protection', enabled ? 'enabled' : 'disabled');
}
