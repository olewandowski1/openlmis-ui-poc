import { fetchRoles } from '@/features/roles/lib/api';
import { DEFAULT_REACT_QUERY_OPTIONS } from '@/lib/constants';
import { queryKeys } from '@/lib/query-keys';
import { Role } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';

export const useRoles = () => {
  const { data, isLoading } = useQuery({
    queryKey: [queryKeys.roles],
    queryFn: () => fetchRoles(),
    ...DEFAULT_REACT_QUERY_OPTIONS,
    // Stale time is 1 hour - since roles are not expected to change often.
    staleTime: 1000 * 60 * 60,
  });

  const roles: Role[] | undefined = data;

  return { roles, isLoading };
};
