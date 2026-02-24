// src/shared/utils/urlUtils.ts

export function isValidURL(text: string): boolean {
  try {
    new URL(text);
    return true;
  } catch {
    return false;
  }
}

export function extractURLFromText(text: string): string | null {
  // URL regex pattern - match http://, https://, ftp://, ftps://
  const urlPattern = /(https?|ftp|ftps):\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
  
  const matches = text.match(urlPattern);
  
  if (!matches || matches.length === 0) {
    return null;
  }
  
  // Return first URL found
  return matches[0];
}

export function normalizeURL(url: string): string {
  try {
    const parsed = new URL(url);
    // Remove trailing slash
    return parsed.href.replace(/\/$/, '');
  } catch {
    return url;
  }
}

export function getDomain(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname;
  } catch {
    return '';
  }
}

export function isInternalLink(url: string, currentUrl: string): boolean {
  if (url.startsWith('#') || url.startsWith('javascript:')) {
    return true;
  }
  
  try {
    const targetDomain = getDomain(url);
    const currentDomain = getDomain(currentUrl);
    return targetDomain === currentDomain;
  } catch {
    return false;
  }
}
