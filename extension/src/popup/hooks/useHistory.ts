import { useState, useEffect } from 'react';
import { sendMessage } from '@shared/services/messaging';
import { MessageType } from '@shared/types/message.types';

export function useHistory() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await sendMessage({ type: MessageType.GET_HISTORY });
      if (response.success) {
        setHistory(response.data);
      } else {
        setError(response.error || 'Failed to load history');
      }
    } catch (err) {
      setError('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = async () => {
    try {
      const response = await sendMessage({ type: MessageType.CLEAR_HISTORY });
      if (response.success) {
        setHistory([]);
      }
    } catch (err) {
      console.error('Failed to clear history:', err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return { history, loading, error, clearHistory, refresh: fetchHistory };
}
