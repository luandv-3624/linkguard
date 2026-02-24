import { urlAPI } from '@/lib/api/url';
import { ActivityItem } from '@/types/ActivityItem.type';
import { useQuery } from '@tanstack/react-query';

const QUERY_KEY = 'live-activity';

export function getQueryKey() {
  return [QUERY_KEY];
}

export function useGetLiveActivities() {
  const query = useQuery<ActivityItem[]>({
    queryKey: getQueryKey(),
    queryFn: async () => {
      const response = await urlAPI.getLiveActivity();
      return response;
    },
    refetchInterval: 5000, // Refresh every 5 seconds for "live" effect
    staleTime: 4000,
  });

  return query;
}
