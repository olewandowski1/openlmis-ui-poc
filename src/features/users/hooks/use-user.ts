import { useLoginData } from '@/features/auth/store/login-data';
import { fetchUser } from '@/features/users/lib/api';
import { UserData } from '@/features/users/lib/types';
import { queryKeys } from '@/lib/query-keys';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const useUser = (userId: string) => {
  const { data: user, isLoading } = useQuery<UserData, Error>({
    enabled: !!userId,
    queryKey: [queryKeys.user, userId],
    queryFn: () => fetchUser(userId),
  });

  return { user, isLoading };
};

export const useLoggedUser = () => {
  const queryClient = useQueryClient();

  const { referenceDataUserId } = useLoginData();

  const { data: user, isLoading } = useQuery<UserData, Error>({
    enabled: !!referenceDataUserId,
    queryKey: [queryKeys.user, referenceDataUserId],
    queryFn: () => fetchUser(referenceDataUserId),
    staleTime: Infinity,
  });

  function clearUser() {
    queryClient.removeQueries({ queryKey: [queryKeys.user] });
  }

  return { user, isLoading, clearUser };
};
