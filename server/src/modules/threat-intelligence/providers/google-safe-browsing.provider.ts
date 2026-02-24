import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GoogleSafeBrowsingProvider {
  private readonly logger = new Logger(GoogleSafeBrowsingProvider.name);
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.apiKey = this.configService.get<string>(
      'externalApis.googleSafeBrowsing.apiKey',
    ) as string;
    this.baseUrl = this.configService.get<string>(
      'externalApis.googleSafeBrowsing.baseUrl',
    ) as string;
  }

  async checkURL(url: string): Promise<{
    threat: boolean;
    threatTypes: string[];
    matches: unknown[];
  } | null> {
    if (!this.apiKey) {
      this.logger.warn('Google Safe Browsing API key not configured');
      return null;
    }

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.baseUrl}/threatMatches:find?key=${this.apiKey}`,
          {
            client: {
              clientId: 'linkguard',
              clientVersion: '1.0.0',
            },
            threatInfo: {
              threatTypes: [
                'MALWARE',
                'SOCIAL_ENGINEERING',
                'UNWANTED_SOFTWARE',
              ],
              platformTypes: ['ANY_PLATFORM'],
              threatEntryTypes: ['URL'],
              threatEntries: [{ url }],
            },
          },
          {
            timeout: 5000,
          },
        ),
      );

      const matches =
        ((response.data as Record<string, unknown> | undefined)?.matches as
          | Array<{ threatType: string }>
          | undefined) || [];

      return {
        threat: matches.length > 0,
        threatTypes: matches.map((m: { threatType: string }) => m.threatType),
        matches,
      };
    } catch (error: unknown) {
      this.logger.error(
        `Google Safe Browsing API error: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }
}
