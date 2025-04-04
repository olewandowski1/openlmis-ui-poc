import { fetchSupervisoryNodes } from '@/features/supervisoryNodes/lib/api';
import { queryKeys } from '@/lib/query-keys';
import { useQuery } from '@tanstack/react-query';

export const useSupervisoryNodes = () => {
  const { data, isLoading } = useQuery({
    queryKey: [queryKeys.supervisoryNodes],
    queryFn: () => fetchSupervisoryNodes(),
    staleTime: 1000 * 60 * 10,
  });

  const supervisoryNodes = data?.content ?? [];

  return { supervisoryNodes, isLoading };
};
