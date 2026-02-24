import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { AnalyzeUrlDto } from './dto/analyze-url.dto';
import {
  URLAnalysisResultDto,
  ThreatLevel,
} from './dto/url-analysis-result.dto';
import { UrlScan } from './entities/url-scan.entity';
import { DomainReputationStrategy } from './strategies/domain-reputation.strategy';
import { PhishingDetectionStrategy } from './strategies/phishing-detection.strategy';
import { SSLValidationStrategy } from './strategies/ssl-validation.strategy';
import { RedirectDetectionStrategy } from './strategies/redirect-detection.strategy';
import { ThreatIntelligenceService } from '../threat-intelligence/threat-intelligence.service';

@Injectable()
export class UrlAnalysisService {
  private readonly logger = new Logger(UrlAnalysisService.name);

  constructor(
    @InjectRepository(UrlScan)
    private readonly urlScanRepository: Repository<UrlScan>,
    private readonly domainReputationStrategy: DomainReputationStrategy,
    private readonly phishingDetectionStrategy: PhishingDetectionStrategy,
    private readonly sslValidationStrategy: SSLValidationStrategy,
    private readonly redirectDetectionStrategy: RedirectDetectionStrategy,
    private readonly threatIntelligenceService: ThreatIntelligenceService,
  ) {}

  async analyzeURL(
    dto: AnalyzeUrlDto,
    ipAddress: string,
    userAgent: string,
  ): Promise<URLAnalysisResultDto> {
    const startTime = Date.now();

    try {
      this.logger.log(`Analyzing URL: ${dto.url}`);

      const urlObj = new URL(dto.url);
      const domain = urlObj.hostname;
      const reasons: string[] = [];
      let totalScore = 0;

      // Run all detection strategies in parallel
      const [
        domainReputation,
        phishingDetection,
        sslValidation,
        redirectDetection,
        externalChecks,
      ] = await Promise.all([
        this.domainReputationStrategy.analyze(dto.url, domain),
        this.phishingDetectionStrategy.analyze(dto.url, domain),
        this.sslValidationStrategy.analyze(dto.url),
        this.redirectDetectionStrategy.analyze(dto.url),
        this.threatIntelligenceService.checkURL(dto.url),
      ]);

      // ----------------------------------------------------------------------
      // 1. CƠ CHẾ PHỦ QUYẾT (VETO) TỪ THREAT INTELLIGENCE
      // ----------------------------------------------------------------------
      const isMaliciousByVT = externalChecks.virusTotal?.malicious > 0;
      const isThreatByGSB = externalChecks.googleSafeBrowsing?.threat;

      if (isMaliciousByVT || isThreatByGSB) {
        if (isMaliciousByVT) {
          reasons.push(
            `CRITICAL: Flagged as malicious by VirusTotal (${externalChecks.virusTotal.malicious} engines)`,
          );
        }
        if (isThreatByGSB) {
          reasons.push('CRITICAL: Flagged as a threat by Google Safe Browsing');
        }

        const vetoResult: URLAnalysisResultDto = {
          url: dto.url,
          threatLevel: ThreatLevel.DANGEROUS, // Trực tiếp báo nguy hiểm
          score: 100, // Cho max điểm
          confidence: 0.99, // Độ tin cậy gần như tuyệt đối do DB ngoài
          reasons: reasons,
          details: {
            domainAge: domainReputation.details.domainAge,
            isPhishing: phishingDetection.isPhishing || isThreatByGSB,
            hasMalware: isMaliciousByVT,
            hasRedirect: redirectDetection.hasRedirect,
            redirectChain: redirectDetection.redirectChain,
            sslValid: sslValidation.isValid,
            externalChecks,
          },
          timestamp: Date.now(),
          analysisTime: Date.now() - startTime,
        };

        await this.saveAnalysisResult(dto, vetoResult, ipAddress, userAgent);
        this.logger.warn(
          `VETO TRIGGERED: ${dto.url} marked as DANGEROUS by External Threat Intel.`,
        );

        return vetoResult;
      }

      // ----------------------------------------------------------------------
      // 2. TÍNH ĐIỂM DỰA TRÊN TRỌNG SỐ (NẾU KHÔNG BỊ VETO)
      // ----------------------------------------------------------------------
      // Aggregate scores
      totalScore += domainReputation.score * 0.3; // Tăng trọng số chút ít vì bỏ External tính điểm chung
      totalScore += phishingDetection.score * 0.35;
      totalScore += sslValidation.score * 0.2;
      totalScore += redirectDetection.score * 0.15;

      // Lưu ý: Đã loại bỏ External Score ra khỏi tổng điểm tổng hợp
      // vì External đã được đưa lên làm cơ chế Veto độc lập phía trên.

      // Aggregate reasons
      reasons.push(...domainReputation.reasons);
      reasons.push(...phishingDetection.reasons);
      reasons.push(...sslValidation.reasons);
      reasons.push(...redirectDetection.reasons);

      // Calculate final score (0-100)
      const finalScore = Math.min(Math.round(totalScore), 100);

      // Determine threat level
      const threatLevel = this.determineThreatLevel(
        finalScore,
        phishingDetection.isPhishing,
      );

      // Calculate confidence
      const confidence = this.calculateConfidence(
        domainReputation,
        phishingDetection,
        externalChecks,
      );

      const result: URLAnalysisResultDto = {
        url: dto.url,
        threatLevel,
        score: finalScore,
        confidence,
        reasons: reasons.filter(Boolean),
        details: {
          domainAge: domainReputation.details.domainAge,
          isPhishing: phishingDetection.isPhishing,
          hasMalware: false, // Vì nếu true thì đã bị bắt ở Veto
          hasRedirect: redirectDetection.hasRedirect,
          redirectChain: redirectDetection.redirectChain,
          sslValid: sslValidation.isValid,
          externalChecks,
        },
        timestamp: Date.now(),
        analysisTime: Date.now() - startTime,
      };

      // Save to database
      await this.saveAnalysisResult(dto, result, ipAddress, userAgent);

      this.logger.log(
        `Analysis complete: ${dto.url} - ${threatLevel} (${finalScore}/100) in ${result.analysisTime}ms`,
      );

      return result;
    } catch (error: Error | unknown) {
      this.logger.error(
        `URL analysis failed: ${(error as Error).message}`,
        (error as Error).stack,
      );

      // Return unknown result on error
      return {
        url: dto.url,
        threatLevel: ThreatLevel.UNKNOWN,
        score: 50,
        confidence: 0,
        reasons: ['Analysis failed due to technical error'],
        details: {},
        timestamp: Date.now(),
        analysisTime: Date.now() - startTime,
      };
    }
  }

  private determineThreatLevel(
    score: number,
    isPhishing: boolean,
  ): ThreatLevel {
    if (isPhishing || score >= 70) {
      return ThreatLevel.DANGEROUS;
    } else if (score >= 40) {
      return ThreatLevel.SUSPICIOUS;
    } else if (score < 20) {
      return ThreatLevel.SAFE;
    } else {
      return ThreatLevel.UNKNOWN;
    }
  }

  private calculateConfidence(
    _domainReputation: any,
    phishingDetection: any,
    externalChecks: any,
  ): number {
    let confidence = 0.5;

    // Higher confidence if multiple sources agree
    if (phishingDetection.isPhishing) confidence += 0.3;
    if (externalChecks.virusTotal?.malicious > 2) confidence += 0.2;
    if (externalChecks.googleSafeBrowsing?.threat) confidence += 0.1;

    return Math.min(confidence, 1.0);
  }

  private async saveAnalysisResult(
    dto: AnalyzeUrlDto,
    result: URLAnalysisResultDto,
    ipAddress: string,
    userAgent: string,
  ): Promise<void> {
    try {
      const urlObj = new URL(dto.url);

      const scan = this.urlScanRepository.create({
        url: dto.url,
        domain: urlObj.hostname,
        threatLevel: result.threatLevel,
        score: result.score,
        confidence: result.confidence,
        reasons: result.reasons,
        details: result.details,
        analysisTime: result.analysisTime,
        feature: dto.context?.feature,
        pageUrl: dto.context?.pageUrl,
        userAgent: userAgent,
        ipAddress: ipAddress,
      });

      await this.urlScanRepository.save(scan);
    } catch (error: Error | unknown) {
      this.logger.error(
        `Failed to save analysis result: ${(error as Error).message}`,
      );
    }
  }

  async getListScans(): Promise<UrlScan[]> {
    return this.urlScanRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async getRecentScans(limit: number = 100): Promise<UrlScan[]> {
    return this.urlScanRepository.find({
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async getStats(): Promise<any> {
    const [totalScans, safeScans, suspiciousScans, dangerousScans] =
      await Promise.all([
        this.urlScanRepository.count(),
        this.urlScanRepository.count({
          where: { threatLevel: ThreatLevel.SAFE },
        }),
        this.urlScanRepository.count({
          where: { threatLevel: ThreatLevel.SUSPICIOUS },
        }),
        this.urlScanRepository.count({
          where: { threatLevel: ThreatLevel.DANGEROUS },
        }),
      ]);

    return {
      totalScans,
      safeScans,
      suspiciousScans,
      dangerousScans,
      threatsBlocked: dangerousScans,
    };
  }

  async getOverview(range: 'today' | 'week' | 'month' | 'all' = 'today') {
    const startDate = this.getStartDate(range);

    const [totalScans, uniqueUrls, threatCounts, avgAnalysisTime, recentScans] =
      await Promise.all([
        // Total scans
        this.urlScanRepository.count({
          where: { createdAt: MoreThan(startDate) },
        }),

        // Unique URLs
        this.urlScanRepository
          .createQueryBuilder('scan')
          .select('COUNT(DISTINCT scan.url)', 'count')
          .where('scan.createdAt > :startDate', { startDate })
          .getRawOne(),

        // Threat level counts
        this.urlScanRepository
          .createQueryBuilder('scan')
          .select('scan.threatLevel', 'threatLevel')
          .addSelect('COUNT(*)', 'count')
          .where('scan.createdAt > :startDate', { startDate })
          .groupBy('scan.threatLevel')
          .getRawMany(),

        // Average analysis time
        this.urlScanRepository
          .createQueryBuilder('scan')
          .select('AVG(scan.analysisTime)', 'avg')
          .where('scan.createdAt > :startDate', { startDate })
          .andWhere('scan.analysisTime IS NOT NULL')
          .getRawOne(),

        // Recent scans
        this.urlScanRepository.find({
          where: { createdAt: MoreThan(startDate) },
          order: { createdAt: 'DESC' },
          take: 10,
        }),
      ]);

    // Process data
    const stats: any = {
      totalScans,
      uniqueUrls: parseInt(uniqueUrls?.count || '0', 10),
      activeUsers: 0,
      activeSessions: 0,
      totalThreats: 0,
      totalSafe: 0,
      totalSuspicious: 0,
      totalDangerous: 0,
      avgAnalysisTime: Math.round(parseFloat(avgAnalysisTime?.avg || '0')),
    };

    threatCounts.forEach((item: any) => {
      const count = parseInt(item.count, 10);
      switch (item.threatLevel) {
        case ThreatLevel.SAFE:
          stats.totalSafe = count;
          break;
        case ThreatLevel.SUSPICIOUS:
          stats.totalSuspicious = count;
          break;
        case ThreatLevel.DANGEROUS:
          stats.totalDangerous = count;
          break;
      }
    });

    stats.totalThreats = stats.totalDangerous + stats.totalSuspicious;
    stats.threatRate =
      stats.totalScans > 0 ? (stats.totalThreats / stats.totalScans) * 100 : 0;

    stats.recentScans = recentScans.map((scan) => ({
      id: scan.id,
      url: scan.url,
      domain: scan.domain,
      timestamp: scan.createdAt,
      result: {
        threatLevel: scan.threatLevel,
        score: scan.score,
      },
    }));

    return stats;
  }

  async getTimeSeries(days: number = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const data = await this.urlScanRepository
      .createQueryBuilder('scan')
      .select("TO_CHAR(scan.createdAt, 'YYYY-MM-DD')", 'date')
      .addSelect('COUNT(*)', 'totalScans')
      .addSelect(
        `SUM(CASE WHEN scan.threatLevel = '${ThreatLevel.DANGEROUS}' OR scan.threatLevel = '${ThreatLevel.SUSPICIOUS}' THEN 1 ELSE 0 END)`,
        'threats',
      )
      .addSelect(
        `SUM(CASE WHEN scan.threatLevel = '${ThreatLevel.SAFE}' THEN 1 ELSE 0 END)`,
        'safe',
      )
      .addSelect(
        `SUM(CASE WHEN scan.threatLevel = '${ThreatLevel.SUSPICIOUS}' THEN 1 ELSE 0 END)`,
        'suspicious',
      )
      .addSelect(
        `SUM(CASE WHEN scan.threatLevel = '${ThreatLevel.DANGEROUS}' THEN 1 ELSE 0 END)`,
        'dangerous',
      )
      .where('scan.createdAt > :startDate', { startDate })
      .groupBy('date')
      .orderBy('date', 'ASC')
      .getRawMany();

    const filledData = this.fillMissingDates(data, days);

    return filledData.map((d: any) => ({
      date: d.date,
      totalScans: parseInt(d.totalScans || '0', 10),
      threats: parseInt(d.threats || '0', 10),
      safe: parseInt(d.safe || '0', 10),
      suspicious: parseInt(d.suspicious || '0', 10),
      dangerous: parseInt(d.dangerous || '0', 10),
    }));
  }

  async getTopDomains(limit: number = 10) {
    const domains = await this.urlScanRepository
      .createQueryBuilder('scan')
      .select('scan.domain', 'domain')
      .addSelect('COUNT(*)', 'totalScans')
      .addSelect(
        `SUM(CASE WHEN scan.threatLevel = '${ThreatLevel.DANGEROUS}' THEN 1 ELSE 0 END)`,
        'threatCount',
      )
      .where('scan.domain IS NOT NULL')
      .groupBy('scan.domain')
      .orderBy('"totalScans"', 'DESC')
      .limit(limit)
      .getRawMany();

    return domains.map((d: any) => ({
      domain: d.domain,
      totalScans: parseInt(d.totalScans, 10),
      threatCount: parseInt(d.threatCount, 10),
    }));
  }

  async getLiveActivity(limit: number = 20) {
    const activities = await this.urlScanRepository.find({
      order: { createdAt: 'DESC' },
      take: limit,
    });

    return activities.map((scan) => ({
      id: scan.id,
      type: this.getActivityType(scan.threatLevel),
      url: scan.url,
      domain: scan.domain,
      timestamp: scan.createdAt,
      score: scan.score,
      threatLevel: scan.threatLevel,
      feature: scan.feature,
    }));
  }

  async getThreatBreakdown() {
    const breakdown = await this.urlScanRepository
      .createQueryBuilder('scan')
      .select('scan.threatLevel', 'threatLevel')
      .addSelect('COUNT(*)', 'count')
      .groupBy('scan.threatLevel')
      .getRawMany();

    return breakdown.map((item: any) => ({
      threatLevel: item.threatLevel,
      count: parseInt(item.count, 10),
    }));
  }

  async getHourlyActivity() {
    const data = await this.urlScanRepository
      .createQueryBuilder('scan')
      .select('EXTRACT(HOUR FROM scan.createdAt)', 'hour')
      .addSelect('COUNT(*)', 'count')
      .where("scan.createdAt > NOW() - INTERVAL '7 days'")
      .groupBy('hour')
      .orderBy('hour', 'ASC')
      .getRawMany();

    const hourlyData = Array.from({ length: 24 }, (_, i) => {
      const found = data.find((d: any) => parseInt(d.hour, 10) === i);
      return {
        hour: i,
        count: found ? parseInt(found.count, 10) : 0,
      };
    });

    return hourlyData;
  }

  private getStartDate(range: 'today' | 'week' | 'month' | 'all'): Date {
    const now = new Date();

    switch (range) {
      case 'today':
        return new Date(now.setHours(0, 0, 0, 0));
      case 'week':
        return new Date(now.setDate(now.getDate() - 7));
      case 'month':
        return new Date(now.setDate(now.getDate() - 30));
      default:
        return new Date(0);
    }
  }

  private getActivityType(
    threatLevel: ThreatLevel,
  ): 'scan' | 'blocked' | 'safe' {
    switch (threatLevel) {
      case ThreatLevel.DANGEROUS:
        return 'blocked';
      case ThreatLevel.SAFE:
        return 'safe';
      default:
        return 'scan';
    }
  }

  private fillMissingDates(data: any[], days: number) {
    const result = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const existing = data.find((d) => d.date === dateStr);
      result.push(
        existing || {
          date: dateStr,
          totalScans: 0,
          threats: 0,
          safe: 0,
          suspicious: 0,
          dangerous: 0,
        },
      );
    }

    return result;
  }
}
