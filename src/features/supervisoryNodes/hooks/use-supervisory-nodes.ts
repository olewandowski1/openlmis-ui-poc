import { fetchSupervisoryNodes } from '@/features/supervisoryNodes/lib/api';
import { DEFAULT_REACT_QUERY_OPTIONS } from '@/lib/constants';
import { queryKeys } from '@/lib/query-keys';
import { useQuery } from '@tanstack/react-query';

export const useSupervisoryNodes = () => {
  const { data, isLoading } = useQuery({
    queryKey: [queryKeys.supervisoryNodes],
    queryFn: () => fetchSupervisoryNodes(),
    ...DEFAULT_REACT_QUERY_OPTIONS,
  });

  const supervisoryNodes = data?.content;

  return { supervisoryNodes, isLoading };
};
