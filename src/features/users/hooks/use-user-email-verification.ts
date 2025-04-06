import { fetchUserEmailVerification } from '@/features/users/lib/api';
import { DEFAULT_REACT_QUERY_OPTIONS } from '@/lib/constants';
import { queryKeys } from '@/lib/query-keys';
import { useQuery } from '@tanstack/react-query';

export const useUserEmailVerification = (
  mode: 'create' | 'edit',
  userId?: string
) => {
  const { data: userEmailVerification, isLoading } = useQuery({
    enabled: !!userId && mode === 'edit',
    queryKey: [queryKeys.userEmailVerification, userId],
    queryFn: () => fetchUserEmailVerification(userId),
    ...DEFAULT_REACT_QUERY_OPTIONS,
    // Stale time is 0 - since user email verification is not expected to change often.
    staleTime: 0,
  });

  return { userEmailVerification, isLoading };
};
