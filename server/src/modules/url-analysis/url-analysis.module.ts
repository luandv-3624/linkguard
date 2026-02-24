import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { UrlAnalysisController } from './url-analysis.controller';
import { UrlAnalysisService } from './url-analysis.service';
import { UrlScan } from './entities/url-scan.entity';
import { DomainReputationStrategy } from './strategies/domain-reputation.strategy';
import { PhishingDetectionStrategy } from './strategies/phishing-detection.strategy';
import { SSLValidationStrategy } from './strategies/ssl-validation.strategy';
import { RedirectDetectionStrategy } from './strategies/redirect-detection.strategy';
import { ThreatIntelligenceModule } from '../threat-intelligence/threat-intelligence.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UrlScan]),
    HttpModule,
    ThreatIntelligenceModule,
  ],
  controllers: [UrlAnalysisController],
  providers: [
    UrlAnalysisService,
    DomainReputationStrategy,
    PhishingDetectionStrategy,
    SSLValidationStrategy,
    RedirectDetectionStrategy,
  ],
  exports: [UrlAnalysisService],
})
export class UrlAnalysisModule {}
