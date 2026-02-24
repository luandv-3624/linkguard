import type { URLAnalysisResult } from '@shared/types/url.types';

export type TooltipStatus = 'loading' | 'success' | 'error';

export interface TooltipPosition {
  x: number;
  y: number;
}

export interface TooltipData {
  position: TooltipPosition;
  status: TooltipStatus;
  url: string;
  result?: URLAnalysisResult;
  message?: string;
}
