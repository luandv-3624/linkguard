import { urlAPI } from '@/lib/api/url';
import { useQuery } from '@tanstack/react-query';
import { OverviewStat } from '@/types/OverviewStat.type';

const QUERY_KEY = 'overview';

export function getQueryKey() {
  return [QUERY_KEY];
}

export function useGetOverview() {
  const query = useQuery<OverviewStat>({
    queryKey: getQueryKey(),
    queryFn: async () => {
      const response = await urlAPI.getOverview();
      return response;
    },
  });

  return query;
}
