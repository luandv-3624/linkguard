import { Injectable, Logger } from '@nestjs/common';
import * as tls from 'tls';

interface SSLValidationResult {
  isValid: boolean;
  score: number;
  reasons: string[];
  details: any;
}

@Injectable()
export class SSLValidationStrategy {
  private readonly logger = new Logger(SSLValidationStrategy.name);

  async analyze(url: string): Promise<SSLValidationResult> {
    const reasons: string[] = [];
    let score = 0;
    let isValid = true;

    try {
      const urlObj = new URL(url);

      // Check if HTTPS
      if (urlObj.protocol !== 'https:') {
        score += 20;
        isValid = false;
        reasons.push('Not using HTTPS protocol');

        return {
          isValid,
          score,
          reasons,
          details: { protocol: urlObj.protocol },
        };
      }

      // Check SSL certificate
      const certInfo = await this.checkSSLCertificate(urlObj.hostname);

      if (!certInfo.valid) {
        score += 30;
        isValid = false;
        reasons.push('Invalid or expired SSL certificate');
      }

      if (certInfo.selfSigned) {
        score += 20;
        reasons.push('Self-signed certificate');
      }

      return {
        isValid,
        score,
        reasons,
        details: certInfo,
      };
    } catch (error: Error | unknown) {
      this.logger.error(
        `SSL validation error: ${(error as Error)?.message || 'Unknown error'}`,
      );
      return {
        isValid: false,
        score: 15,
        reasons: ['Could not validate SSL certificate'],
        details: { error: (error as Error)?.message || 'Unknown error' },
      };
    }
  }

  private async checkSSLCertificate(hostname: string): Promise<any> {
    return new Promise((resolve) => {
      const options: tls.ConnectionOptions = {
        host: hostname,
        port: 443,
        servername: hostname,
        rejectUnauthorized: false,
      };

      const socket = tls.connect(options, () => {
        const cert = socket.getPeerCertificate();

        if (socket.authorized) {
          socket.end();
          resolve({
            valid: true,
            selfSigned: cert.issuer === cert.subject,
            issuer: cert.issuer,
            validFrom: cert.valid_from,
            validTo: cert.valid_to,
          });
        } else {
          socket.end();
          resolve({
            valid: false,
            error: socket.authorizationError,
          });
        }
      });

      socket.on('error', (error) => {
        resolve({
          valid: false,
          error: error.message,
        });
      });

      socket.setTimeout(5000, () => {
        socket.end();
        resolve({
          valid: false,
          error: 'Connection timeout',
        });
      });
    });
  }
}
