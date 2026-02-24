import { Injectable, Logger } from '@nestjs/common';
import { VirusTotalProvider } from './providers/virustotal.provider';
import { GoogleSafeBrowsingProvider } from './providers/google-safe-browsing.provider';

@Injectable()
export class ThreatIntelligenceService {
  private readonly logger = new Logger(ThreatIntelligenceService.name);

  constructor(
    private readonly virusTotalProvider: VirusTotalProvider,
    private readonly googleSafeBrowsingProvider: GoogleSafeBrowsingProvider,
  ) {}

  async checkURL(url: string): Promise<any> {
    const results: any = {
      virusTotal: null,
      googleSafeBrowsing: null,
    };

    try {
      // Run checks in parallel
      const [vtResult, gsbResult] = await Promise.allSettled([
        this.virusTotalProvider.checkURL(url),
        this.googleSafeBrowsingProvider.checkURL(url),
      ]);

      if (vtResult.status === 'fulfilled') {
        results.virusTotal = vtResult.value;
      } else {
        this.logger.warn(`VirusTotal check failed: ${vtResult.reason}`);
      }

      if (gsbResult.status === 'fulfilled') {
        results.googleSafeBrowsing = gsbResult.value;
      } else {
        this.logger.warn(
          `Google Safe Browsing check failed: ${gsbResult.reason}`,
        );
      }

      return results;
    } catch (error: Error | unknown) {
      this.logger.error(
        `Threat intelligence check error: ${(error as Error)?.message || 'Unknown error'}`,
      );
      return results;
    }
  }
}
