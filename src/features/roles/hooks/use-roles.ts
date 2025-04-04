import { fetchRoles } from '@/features/roles/lib/api';
import { queryKeys } from '@/lib/query-keys';
import { Role } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';

export const useRoles = () => {
  const { data, isLoading } = useQuery({
    queryKey: [queryKeys.roles],
    queryFn: () => fetchRoles(),
    // Stale time is 1 hour - since roles are not expected to change often.
    staleTime: 1000 * 60 * 60,
  });

  const roles: Role[] = data ?? [];

  return { roles, isLoading };
};
