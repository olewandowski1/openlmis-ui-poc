import { fetchRoles } from '@/features/roles/lib/api';
import { queryKeys } from '@/lib/query-keys';
import { Role } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';

export const useRoles = () => {
  const { data, isLoading } = useQuery({
    queryKey: [queryKeys.roles],
    queryFn: () => fetchRoles(),
  });

  const roles: Role[] = data ?? [];

  return { roles, isLoading };
};
