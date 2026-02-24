import { urlAPI } from '@/lib/api/url';
import { useQuery } from '@tanstack/react-query';
import { ThreatChart } from '@/types/ThreatChart.type';

const QUERY_KEY = 'time-series';

export function getQueryKey() {
  return [QUERY_KEY];
}

export function useGetTimeSeries() {
  const query = useQuery<ThreatChart[]>({
    queryKey: getQueryKey(),
    queryFn: async () => {
      const response = await urlAPI.getTimeSeries();
      return response;
    },
    refetchInterval: 30000,
  });

  return query;
}
