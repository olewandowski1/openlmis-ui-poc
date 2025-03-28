import { fetchUsers } from '@/features/users/lib/api';
import { queryKeys } from '@/lib/query-keys';
import { useQuery } from '@tanstack/react-query';

export const useUsers = () => {
  const { data, isLoading } = useQuery({
    queryKey: [queryKeys.users],
    queryFn: () => fetchUsers(),
  });

  const users = data?.content ?? [];

  return { users, isLoading };
};
