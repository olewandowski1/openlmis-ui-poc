import { fetchPrograms } from '@/features/programs/lib/api';
import { DEFAULT_REACT_QUERY_OPTIONS } from '@/lib/constants';
import { queryKeys } from '@/lib/query-keys';
import { Program } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';

export const usePrograms = () => {
  const { data, isLoading } = useQuery({
    queryKey: [queryKeys.programs],
    queryFn: () => fetchPrograms(),
    ...DEFAULT_REACT_QUERY_OPTIONS,
  });

  const programs: Program[] | undefined = data;

  return { programs, isLoading };
};
