import { extractURLFromText } from '@shared/utils/urlUtils';
import { showTooltip, hideTooltip, updateTooltip } from './components/Tooltip';
import { sendMessage } from '@shared/services/messaging';
import { MessageType } from '@shared/types/message.types';
import type { URLAnalysisRequest } from '@shared/types/url.types';

let selectionTimeout: number | undefined;
let isProcessing = false;

export function initTextSelection() {
  console.log('[Content] Text selection feature initialized');
  
  // Listen for text selection
  document.addEventListener('mouseup', handleMouseUp);
  
  // Hide tooltip when clicking elsewhere
  document.addEventListener('mousedown', handleMouseDown);
  
  // Hide tooltip on scroll
  document.addEventListener('scroll', hideTooltip, true);
  
  // Hide tooltip on window blur
  window.addEventListener('blur', hideTooltip);
}

async function handleMouseUp(e: MouseEvent) {
  // Clear previous timeout
  if (selectionTimeout) {
    clearTimeout(selectionTimeout);
  }
  
  // Debounce selection
  selectionTimeout = window.setTimeout(async () => {
    await processSelection(e);
  }, 300);
}

async function processSelection(_e: MouseEvent) {
  if (isProcessing) return;
  
  const selection = window.getSelection();
  const selectedText = selection?.toString().trim();
  
  // No text selected or too short
  if (!selectedText || selectedText.length < 5) {
    hideTooltip();
    return;
  }
  
  // First, try to extract URL from selected text
  let url = extractURLFromText(selectedText);
  
  // If no URL found in text, check if selection is inside an <a> tag
  if (!url && selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const commonAncestor = range.commonAncestorContainer as any;
    const ancestorElement = commonAncestor.nodeType === Node.TEXT_NODE 
      ? commonAncestor.parentElement 
      : commonAncestor;
    
    // First check if direct ancestor is inside an <a>
    let linkElement = ancestorElement?.closest('a') as HTMLAnchorElement | null;
    
    // If not found, try to find <a> by traversing the selection range
    if (!linkElement && ancestorElement) {
      // Walk up the DOM tree from ancestor
      let current = ancestorElement as HTMLElement | null;
      while (current && current !== document.body) {
        if (current.tagName === 'A') {
          linkElement = current as HTMLAnchorElement;
          break;
        }
        current = current.parentElement;
      }
    }
    
    // If still not found, check all <a> elements that overlap with selection
    if (!linkElement) {
      const allLinks = document.querySelectorAll('a[href]');
      for (const link of allLinks) {
        const linkRange = document.createRange();
        linkRange.selectNodeContents(link);
        
        // Check if this link overlaps with the selection
        if (range.compareBoundaryPoints(Range.START_TO_END, linkRange) >= 0 &&
            range.compareBoundaryPoints(Range.END_TO_START, linkRange) <= 0) {
          linkElement = link as HTMLAnchorElement;
          break;
        }
      }
    }
    
    if (linkElement && linkElement.href) {
      url = linkElement.href;
    }
  }
  
  if (!url) {
    hideTooltip();
    return;
  }
  
  console.log('[Content] URL detected in selection:', url);
  
  isProcessing = true;
  
  try {
    // Get selection position
    const range = selection!.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const position = {
      x: rect.left + window.scrollX,
      y: rect.bottom + window.scrollY
    };
    
    // Show loading tooltip
    showTooltip({
      position,
      status: 'loading',
      url
    });
    
    // Send to background for analysis
    const request: URLAnalysisRequest = {
      url,
      context: {
        pageUrl: window.location.href,
        timestamp: Date.now(),
        feature: 'text-selection'
      }
    };
    
    const response = await sendMessage({
      type: MessageType.ANALYZE_URL,
      payload: request
    });
    
    // Update tooltip with result
    if (response.success && response.data) {
      updateTooltip({
        position,
        status: 'success',
        url,
        result: response.data
      });
    } else {
      updateTooltip({
        position,
        status: 'error',
        url,
        message: response.error || 'Analysis failed'
      });
    }
  } catch (error) {
    console.error('[Content] Analysis error:', error);
    const range = selection!.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    updateTooltip({
      position: {
        x: rect.left + window.scrollX,
        y: rect.bottom + window.scrollY
      },
      status: 'error',
      url,
      message: 'Failed to analyze URL'
    });
  } finally {
    isProcessing = false;
  }
}

function handleMouseDown(e: MouseEvent) {
  const tooltip = document.getElementById('linkguard-tooltip-root');
  if (tooltip && !tooltip.contains(e.target as Node)) {
    hideTooltip();
  }
}

export function cleanupTextSelection() {
  document.removeEventListener('mouseup', handleMouseUp);
  document.removeEventListener('mousedown', handleMouseDown);
  document.removeEventListener('scroll', hideTooltip, true);
  window.removeEventListener('blur', hideTooltip);
  hideTooltip();
}
