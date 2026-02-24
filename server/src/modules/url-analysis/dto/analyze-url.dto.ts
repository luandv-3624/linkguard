import {
  IsString,
  IsUrl,
  IsNotEmpty,
  IsOptional,
  IsObject,
} from 'class-validator';

export class AnalyzeUrlDto {
  @IsUrl({}, { message: 'Invalid URL format' })
  @IsNotEmpty()
  @IsString()
  url!: string;

  @IsOptional()
  @IsObject()
  context?: {
    pageUrl?: string;
    timestamp?: number;
    feature?: 'text-selection' | 'click-protection';
    userAgent?: string;
  };
}
