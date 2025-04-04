import { fetchPrograms } from '@/features/programs/lib/api';
import { queryKeys } from '@/lib/query-keys';
import { Program } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';

export const usePrograms = () => {
  const { data, isLoading } = useQuery({
    queryKey: [queryKeys.programs],
    queryFn: () => fetchPrograms(),
    staleTime: 1000 * 60 * 10,
  });

  const programs: Program[] = data ?? [];

  return { programs, isLoading };
};
