import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class KeepAliveService {
  private readonly logger = new Logger(KeepAliveService.name);
  private pingUrl: string;
  private isProduction: boolean;

  constructor(private configService: ConfigService) {
    this.pingUrl = this.configService.get<string>('KEEP_ALIVE_URL') as string;

    this.isProduction =
      this.configService.get<string>('NODE_ENV') === 'production';
  }

  @Cron('*/14 * * * *')
  async handleCron() {
    if (!this.isProduction) {
      return;
    }

    if (!this.pingUrl) {
      this.logger.warn('⚠️ KEEP_ALIVE_URL chưa được cấu hình trong .env');
      return;
    }

    try {
      this.logger.debug(`🕒 Đang ping server để giữ kết nối: ${this.pingUrl}`);
      await axios.get(this.pingUrl);
      this.logger.debug('✅ Ping thành công!');
    } catch (error: Error | unknown) {
      this.logger.error(`❌ Lỗi ping server: ${(error as Error).message}`);
    }
  }
}
