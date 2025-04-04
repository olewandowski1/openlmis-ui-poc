import { fetchUserEmailVerification } from '@/features/users/lib/api';
import { queryKeys } from '@/lib/query-keys';
import { useQuery } from '@tanstack/react-query';

export const useUserEmailVerification = (
  userId: string | undefined,
  mode: 'create' | 'edit'
) => {
  const { data: userEmailVerification, isLoading } = useQuery({
    enabled: !!userId && mode === 'edit',
    queryKey: [queryKeys.userEmailVerification, userId],
    queryFn: () => fetchUserEmailVerification(userId),
    staleTime: 0,
  });

  return { userEmailVerification, isLoading };
};
