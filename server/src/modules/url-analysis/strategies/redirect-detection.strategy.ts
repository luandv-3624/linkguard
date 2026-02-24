import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

interface RedirectDetectionResult {
  hasRedirect: boolean;
  score: number;
  reasons: string[];
  redirectChain: string[];
  details: any;
}

@Injectable()
export class RedirectDetectionStrategy {
  private readonly logger = new Logger(RedirectDetectionStrategy.name);

  // Thêm Danh sách trắng (Whitelist) cho các tên miền SSO/OAuth hợp lệ
  private readonly trustedRedirectDomains = [
    'accounts.google.com',
    'login.microsoftonline.com',
    'www.facebook.com',
    'appleid.apple.com',
    'github.com',
    'login.yahoo.com',
    'auth0.com',
    'okta.com',
  ];

  async analyze(url: string): Promise<RedirectDetectionResult> {
    const reasons: string[] = [];
    const redirectChain: string[] = [];
    let score = 0;
    let hasRedirect = false;

    try {
      const response = await axios.get(url, {
        maxRedirects: 5,
        timeout: 5000,
        validateStatus: () => true,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });

      const originalDomain = new URL(url).hostname;
      const finalUrl = response.request.res?.responseUrl || url;
      const finalDomain = new URL(finalUrl).hostname;

      // Kiểm tra xem đích đến có thuộc Whitelist không
      const isTrustedRedirect = this.trustedRedirectDomains.some(
        (domain) =>
          finalDomain === domain || finalDomain.endsWith(`.${domain}`),
      );

      // Check if there were redirects
      if (
        response.request._redirectable &&
        response.request._redirectable._redirectCount > 0
      ) {
        hasRedirect = true;
        const redirectCount = response.request._redirectable._redirectCount;

        // CHỈ PHẠT ĐIỂM NẾU KHÔNG THUỘC WHITELIST
        if (!isTrustedRedirect) {
          score += redirectCount * 5;
          reasons.push(`${redirectCount} redirect(s) detected`);

          // Multiple redirects are more suspicious
          if (redirectCount > 2) {
            score += 10;
            reasons.push('Excessive redirects (potential obfuscation)');
          }
        } else {
          reasons.push(
            `Legitimate authentication redirect detected to: ${finalDomain}`,
          );
        }
      }

      // Check for cross-domain redirects
      if (originalDomain !== finalDomain) {
        hasRedirect = true;
        redirectChain.push(originalDomain, finalDomain);

        // CHỈ PHẠT ĐIỂM NẾU KHÔNG THUỘC WHITELIST
        if (!isTrustedRedirect) {
          score += 15;
          reasons.push(
            `Cross-domain redirect: ${originalDomain} → ${finalDomain}`,
          );
        }
      }

      return {
        hasRedirect,
        score,
        reasons,
        redirectChain,
        details: {
          originalUrl: url,
          finalUrl: response.request.res?.responseUrl || url,
          statusCode: response.status,
        },
      };
    } catch (error: Error | unknown) {
      this.logger.error(
        `Redirect detection error: ${(error as Error)?.message || 'Unknown error'}`,
      );
      return {
        hasRedirect: false,
        score: 0,
        reasons: ['Could not check for redirects'],
        redirectChain: [],
        details: { error: (error as Error)?.message || 'Unknown error' },
      };
    }
  }
}
