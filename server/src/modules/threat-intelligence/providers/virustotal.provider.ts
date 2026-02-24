import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class VirusTotalProvider {
  private readonly logger = new Logger(VirusTotalProvider.name);
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.apiKey = this.configService.get<string>(
      'externalApis.virusTotal.apiKey',
    ) as string;
    this.baseUrl = this.configService.get<string>(
      'externalApis.virusTotal.baseUrl',
    ) as string;
  }

  async checkURL(url: string): Promise<any> {
    if (!this.apiKey) {
      this.logger.warn('VirusTotal API key not configured');
      return null;
    }

    try {
      // Encode URL
      const urlId = Buffer.from(url).toString('base64').replace(/=/g, '');

      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/urls/${urlId}`, {
          headers: {
            'x-apikey': this.apiKey,
          },
          timeout: 5000,
        }),
      );

      const stats = response.data?.data?.attributes?.last_analysis_stats || {};

      return {
        malicious: stats.malicious || 0,
        suspicious: stats.suspicious || 0,
        harmless: stats.harmless || 0,
        undetected: stats.undetected || 0,
        total: Object.values(stats).reduce(
          (a: number, b: unknown) => a + (b as number),
          0,
        ),
      };
    } catch (error: Error | unknown) {
      if ((error as any)?.response?.status === 404) {
        // URL not found in VT database - not necessarily bad
        return { malicious: 0, suspicious: 0, harmless: 0, undetected: 0 };
      }
      this.logger.error(`VirusTotal API error: ${(error as Error).message}`);
      throw error;
    }
  }
}
