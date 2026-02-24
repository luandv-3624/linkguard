import { apiClient } from './client';
import { API_ENDPOINTS } from '@shared/constants/api';
import type { URLAnalysisRequest, URLAnalysisResult } from '@shared/types/url.types';

export async function analyzeURL(
  request: URLAnalysisRequest
): Promise<URLAnalysisResult> {
  const startTime = Date.now();
  
  try {
    // The backend may return a wrapper: { success: true, data: URLAnalysisResult }
    const raw = await apiClient.post<any>(
      API_ENDPOINTS.ANALYZE_URL,
      request
    );

    const payload: URLAnalysisResult = raw && raw.success && raw.data ? raw.data : raw;

    return {
      ...payload,
      analysisTime: Date.now() - startTime
    };
  } catch (error) {
    console.error('[API] URL analysis failed:', error);
    throw error;
  }
}

export async function checkURLSafety(
  request: URLAnalysisRequest
): Promise<URLAnalysisResult> {
  const startTime = Date.now();
  
  try {
    const raw = await apiClient.post<any>(
      API_ENDPOINTS.CHECK_SAFETY,
      request
    );

    const payload: URLAnalysisResult = raw && raw.success && raw.data ? raw.data : raw;

    return {
      ...payload,
      analysisTime: Date.now() - startTime
    };
  } catch (error) {
    console.error('[API] Safety check failed:', error);
    throw error;
  }
}
