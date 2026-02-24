import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'LinkGuard API v1.0.0 - Malicious URL Protection';
  }
}
