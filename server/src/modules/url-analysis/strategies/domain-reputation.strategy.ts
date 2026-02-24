import { Injectable, Logger } from '@nestjs/common';

interface DomainReputationResult {
  score: number;
  reasons: string[];
  details: any;
}

@Injectable()
export class DomainReputationStrategy {
  private readonly logger = new Logger(DomainReputationStrategy.name);

  // Known malicious patterns
  private readonly suspiciousPatterns = [
    /bit\.ly|tinyurl|goo\.gl/, // URL shorteners
    /[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/, // IP addresses
    /-login|-secure|-verify|-update|-confirm/i, // Phishing keywords
    /paypal|account|banking|wallet/i, // Financial keywords
  ];

  // Known safe TLDs
  private readonly safeTlds = [
    'com',
    'org',
    'net',
    'edu',
    'gov',
    'co.uk',
    'de',
    'fr',
    'jp',
    'au',
  ];

  async analyze(url: string, domain: string): Promise<DomainReputationResult> {
    const reasons: string[] = [];
    let score = 50; // Start neutral

    try {
      // Check for suspicious patterns
      for (const pattern of this.suspiciousPatterns) {
        if (pattern.test(url)) {
          score += 15;
          reasons.push(`Contains suspicious pattern: ${pattern.source}`);
        }
      }

      // Check domain length
      if (domain.length > 30) {
        score += 10;
        reasons.push('Unusually long domain name');
      }

      // Check for excessive subdomains
      const subdomains = domain.split('.').length - 2;
      if (subdomains > 2) {
        score += 10;
        reasons.push(`Excessive subdomains (${subdomains})`);
      }

      // Check TLD
      const tld = domain.split('.').pop()?.toLowerCase();
      if (!this.safeTlds.includes(tld || '')) {
        score += 5;
        reasons.push(`Uncommon TLD: .${tld}`);
      }

      // Check for numbers in domain
      const numberCount = (domain.match(/\d/g) || []).length;
      if (numberCount > 3) {
        score += 10;
        reasons.push(`High number count in domain (${numberCount})`);
      }

      // Check for hyphens
      const hyphenCount = (domain.match(/-/g) || []).length;
      if (hyphenCount > 2) {
        score += 5;
        reasons.push(`Multiple hyphens in domain (${hyphenCount})`);
      }

      // Cap score at 100
      score = Math.min(score, 100);

      this.logger.debug(`Domain reputation score for ${domain}: ${score}`);

      return {
        score,
        reasons,
        details: {
          domain,
          tld,
          subdomainCount: subdomains,
          numberCount,
          hyphenCount,
        },
      };
    } catch (error: Error | unknown) {
      this.logger.error(
        `Error analyzing domain reputation: ${(error as Error)?.message || 'Unknown error'}`,
      );
      return {
        score: 50,
        reasons: ['Error during reputation analysis'],
        details: {},
      };
    }
  }
}
