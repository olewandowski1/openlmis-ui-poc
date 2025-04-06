import { fetchMinimalFacilities } from '@/lib/api';
import { DEFAULT_REACT_QUERY_OPTIONS } from '@/lib/constants';
import { queryKeys } from '@/lib/query-keys';
import { useQuery } from '@tanstack/react-query';

export const useMinimalFacilities = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: [queryKeys.minimalFacilities],
    queryFn: fetchMinimalFacilities,
    ...DEFAULT_REACT_QUERY_OPTIONS,
  });

  const minimalFacilities = data?.content;

  return { minimalFacilities, isLoading, isError };
};
