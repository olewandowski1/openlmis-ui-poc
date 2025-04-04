import { fetchMinimalFacilities } from '@/lib/api';
import { queryKeys } from '@/lib/query-keys';
import { useQuery } from '@tanstack/react-query';

export const useMinimalFacilities = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: [queryKeys.minimalFacilities],
    queryFn: fetchMinimalFacilities,
    staleTime: 1000 * 60 * 10,
  });

  const minimalFacilities = data?.content ?? [];

  return { minimalFacilities, isLoading, isError };
};
