import { initTextSelection, cleanupTextSelection } from './features/textSelection';
import { initClickProtection, cleanupClickProtection, toggleClickProtection } from './features/clickProtection';
import { storageService } from '@shared/services/storage';
import './styles/content.css';

console.log('[Content] LinkGuard content script loaded');

// Initialize features
async function init() {
  try {
    // Get settings
    const settings = await storageService.getSettings();
    
    // Initialize text selection feature
    if (settings.textSelectionEnabled) {
      initTextSelection();
    }
    
    // Initialize click protection feature
    if (settings.clickProtectionEnabled) {
      await initClickProtection();
    }
    
    console.log('[Content] Features initialized');
  } catch (error) {
    console.error('[Content] Initialization failed:', error);
  }
}

// Listen for settings changes
chrome.storage.onChanged.addListener((changes: any, areaName: string) => {
  if (areaName === 'local' && changes.linkguard_settings) {
    const newSettings = changes.linkguard_settings.newValue;
    
    if (newSettings.clickProtectionEnabled !== undefined) {
      toggleClickProtection(newSettings.clickProtectionEnabled);
    }
    
    // Text selection doesn't need runtime toggle (page needs reload)
  }
});

// Cleanup on unload
window.addEventListener('unload', () => {
  cleanupTextSelection();
  cleanupClickProtection();
});

// Start initialization
init();
