import { axiosInstance } from '@/config/axios';
import { useLoginData } from '@/features/auth/store/login-data';
import { queryKeys } from '@/lib/query-keys';
import { useQuery, useQueryClient } from '@tanstack/react-query';

type ApiUsersResponse = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  timezone: string;
  active: boolean;
  extraData: { [key: string]: unknown };
  roleAssignments: {
    roleId: string;
  }[];
};

type ApiUserContactDetailsResponse = {
  referenceDataUserId: string;
  phoneNumber: string | null;
  allowNotify: boolean;
  emailDetails: {
    email: string;
    emailVerified: boolean;
  };
};

type ApiUsersAuthResponse = {
  id: string;
  username: string;
  password: string | null;
  enabled: boolean;
  lockedOut: boolean;
};

export type UserData = ApiUsersResponse &
  ApiUserContactDetailsResponse &
  ApiUsersAuthResponse;

const fetchUser = async (referenceDataUserId: string | null) => {
  const { data: apiUserResponse } = await axiosInstance.get<ApiUsersResponse>(
    `/api/users/${referenceDataUserId}`
  );

  const { data: apiUserContactDetailsResponse } =
    await axiosInstance.get<ApiUserContactDetailsResponse>(
      `/api/userContactDetails/${referenceDataUserId}`
    );

  const { data: apiUserAuthResponse } =
    await axiosInstance.get<ApiUsersAuthResponse>(
      `/api/users/auth/${referenceDataUserId}`
    );

  return {
    ...apiUserResponse,
    ...apiUserContactDetailsResponse,
    ...apiUserAuthResponse,
  };
};

export const useUser = () => {
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
