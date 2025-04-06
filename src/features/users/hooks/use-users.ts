import { fetchUsers } from '@/features/users/lib/api';
import { DEFAULT_REACT_QUERY_OPTIONS } from '@/lib/constants';
import { queryKeys } from '@/lib/query-keys';
import { useQuery } from '@tanstack/react-query';

export const useUsers = () => {
  const { data, isLoading } = useQuery({
    queryKey: [queryKeys.users],
    queryFn: () => fetchUsers(),
    ...DEFAULT_REACT_QUERY_OPTIONS,
  });

  const users = data?.content;

  return { users, isLoading };
};
