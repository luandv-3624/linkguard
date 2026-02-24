import { Injectable, Logger } from '@nestjs/common';

interface PhishingDetectionResult {
  isPhishing: boolean;
  score: number;
  reasons: string[];
  details: any;
}

@Injectable()
export class PhishingDetectionStrategy {
  private readonly logger = new Logger(PhishingDetectionStrategy.name);

  // Common phishing keywords
  private readonly phishingKeywords = [
    'verify',
    'update',
    'confirm',
    'secure',
    'account',
    'suspend',
    'restricted',
    'unusual',
    'click',
    'urgent',
    'login',
    'signin',
    'password',
    'banking',
    'paypal',
    'amazon',
    'apple',
    'microsoft',
    'google',
    'facebook',
  ];

  // Typosquatting patterns for popular domains
  private readonly legitimateDomains = [
    'google.com',
    'facebook.com',
    'amazon.com',
    'paypal.com',
    'microsoft.com',
    'apple.com',
    'twitter.com',
    'instagram.com',
    'netflix.com',
  ];

  async analyze(url: string, domain: string): Promise<PhishingDetectionResult> {
    const reasons: string[] = [];
    let score = 0;
    let isPhishing = false;

    try {
      const urlLower = url.toLowerCase();

      // Check for phishing keywords
      const foundKeywords = this.phishingKeywords.filter((keyword) =>
        urlLower.includes(keyword),
      );

      if (foundKeywords.length > 0) {
        score += foundKeywords.length * 5;
        reasons.push(`Contains phishing keywords: ${foundKeywords.join(', ')}`);
      }

      // Check for typosquatting
      for (const legitDomain of this.legitimateDomains) {
        if (this.isTyposquatting(domain, legitDomain)) {
          score += 30;
          isPhishing = true;
          reasons.push(`Possible typosquatting of ${legitDomain}`);
        }
      }

      // Check for URL obfuscation (@ symbol)
      if (url.includes('@')) {
        score += 20;
        reasons.push('URL contains @ symbol (obfuscation technique)');
      }

      // Check for excessive dots
      const dotCount = (url.match(/\./g) || []).length;
      if (dotCount > 4) {
        score += 10;
        reasons.push(`Excessive dots in URL (${dotCount})`);
      }

      // Check for misleading path
      const hasLoginInPath = /\/(login|signin|account)/.test(url);
      const hasSecureInDomain = /secure|login|verify/.test(domain);
      if (hasLoginInPath && !hasSecureInDomain) {
        score += 15;
        reasons.push('Login page on suspicious domain');
      }

      // Determine if phishing
      if (score >= 40) {
        isPhishing = true;
      }

      score = Math.min(score, 100);

      this.logger.debug(
        `Phishing detection for ${url}: ${isPhishing} (score: ${score})`,
      );

      return {
        isPhishing,
        score,
        reasons,
        details: {
          foundKeywords,
          dotCount,
        },
      };
    } catch (error: Error | unknown) {
      this.logger.error(
        `Error in phishing detection: ${(error as Error).message}`,
        (error as Error).stack,
      );
      return {
        isPhishing: false,
        score: 0,
        reasons: ['Error during phishing detection'],
        details: {},
      };
    }
  }

  private isTyposquatting(domain: string, legitDomain: string): boolean {
    // Remove TLD for comparison
    const domainWithoutTld = domain.split('.').slice(0, -1).join('.');
    const legitWithoutTld = legitDomain.split('.').slice(0, -1).join('.');

    // Check Levenshtein distance
    const distance = this.levenshteinDistance(
      domainWithoutTld,
      legitWithoutTld,
    );

    // If very similar (1-2 character difference), likely typosquatting
    return distance > 0 && distance <= 2;
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix: number[][] = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1,
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  }
}
