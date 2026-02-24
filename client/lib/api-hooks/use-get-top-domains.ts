import { urlAPI } from '@/lib/api/url';
import { useQuery } from '@tanstack/react-query';

const QUERY_KEY = 'top-domains';

export function getQueryKey() {
  return [QUERY_KEY];
}

export function useGetTopDomains() {
  const query = useQuery({
    queryKey: getQueryKey(),
    queryFn: async () => {
      const response = await urlAPI.getTopDomains();
      return response;
    },
  });

  return query;
}
