import { fetchRole } from '@/features/roles/lib/api';
import { queryKeys } from '@/lib/query-keys';
import { Role } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';

export const useRole = (roleId: string) => {
  const { data: role, isLoading } = useQuery<Role, Error>({
    enabled: !!roleId,
    queryKey: [queryKeys.role, roleId],
    queryFn: () => fetchRole(roleId),
  });

  return { role, isLoading };
};
