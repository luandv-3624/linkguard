import { useState } from 'react';
import { sendMessage } from '@shared/services/messaging';
import { MessageType } from '@shared/types/message.types';
import type { URLAnalysisResult } from '@shared/types/url.types';

export function useURLScan() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<URLAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const scanURL = async (url: string) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await sendMessage({
        type: MessageType.MANUAL_SCAN,
        payload: { url }
      });

      if (response.success) {
        setResult(response.data);
      } else {
        setError(response.error || 'Scan failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Scan failed');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
  };

  return { scanURL, loading, result, error, reset };
}
