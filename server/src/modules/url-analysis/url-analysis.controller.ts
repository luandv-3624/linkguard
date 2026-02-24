import { Controller, Post, Body, Get, Query, Req } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { type Request } from 'express';
import { UrlAnalysisService } from './url-analysis.service';
import { AnalyzeUrlDto } from './dto/analyze-url.dto';

@Controller('url')
export class UrlAnalysisController {
  constructor(private readonly urlAnalysisService: UrlAnalysisService) {}

  @Throttle({ short: { limit: 5, ttl: 1000 } })
  @Post('analyze')
  async analyzeURL(@Body() dto: AnalyzeUrlDto, @Req() req: Request) {
    const ipAddress: string = req.ip || (req.socket.remoteAddress as string);
    const userAgent: string = req.headers['user-agent'] as string;

    return this.urlAnalysisService.analyzeURL(dto, ipAddress, userAgent);
  }

  @Throttle({ short: { limit: 20, ttl: 1000 } })
  @Post('check-safety')
  async checkSafety(@Body() dto: AnalyzeUrlDto, @Req() req: Request) {
    const ipAddress: string = req.ip || (req.socket.remoteAddress as string);
    const userAgent: string = req.headers['user-agent'] as string;

    return this.urlAnalysisService.analyzeURL(dto, ipAddress, userAgent);
  }

  @Get('recent')
  async getRecentScans(@Query('limit') limit: number = 100) {
    return this.urlAnalysisService.getRecentScans(limit);
  }

  @Get('stats')
  async getStats() {
    return this.urlAnalysisService.getStats();
  }

  @Get('list-scans')
  async getListScans() {
    return this.urlAnalysisService.getListScans();
  }

  @Get('overview')
  async getOverview(
    @Query('range') range?: 'today' | 'week' | 'month' | 'all',
  ) {
    const data = await this.urlAnalysisService.getOverview(range || 'today');
    return {
      success: true,
      data,
    };
  }

  @Get('time-series')
  async getTimeSeries(@Query('days') days?: string) {
    const data = await this.urlAnalysisService.getTimeSeries(
      parseInt(days || '7', 10),
    );
    return {
      success: true,
      data,
    };
  }

  @Get('top-domains')
  async getTopDomains(@Query('limit') limit?: string) {
    const data = await this.urlAnalysisService.getTopDomains(
      parseInt(limit || '10', 10),
    );
    return {
      success: true,
      data,
    };
  }

  @Get('live-activity')
  async getLiveActivity(@Query('limit') limit?: string) {
    const data = await this.urlAnalysisService.getLiveActivity(
      parseInt(limit || '20', 10),
    );
    return {
      success: true,
      data,
    };
  }

  @Get('threat-breakdown')
  async getThreatBreakdown() {
    const data = await this.urlAnalysisService.getThreatBreakdown();
    return {
      success: true,
      data,
    };
  }

  @Get('hourly-activity')
  async getHourlyActivity() {
    const data = await this.urlAnalysisService.getHourlyActivity();
    return {
      success: true,
      data,
    };
  }
}
