import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ThreatIntelligenceService } from './threat-intelligence.service';
import { VirusTotalProvider } from './providers/virustotal.provider';
import { GoogleSafeBrowsingProvider } from './providers/google-safe-browsing.provider';

@Module({
  imports: [HttpModule],
  providers: [
    ThreatIntelligenceService,
    VirusTotalProvider,
    GoogleSafeBrowsingProvider,
  ],
  exports: [ThreatIntelligenceService],
})
export class ThreatIntelligenceModule {}
