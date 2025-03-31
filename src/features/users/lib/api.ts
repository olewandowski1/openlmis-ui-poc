import { axiosInstance } from '@/config/axios';
import { BaseUserFormData } from '@/features/users/lib/schemas';
import {
  UserAuthApiResponse,
  UserContactDetailsApiResponse,
  UserDetailsApiResponse,
  UsersApiResponse,
} from '@/features/users/lib/types';
import { createUserUpdatePayload } from '@/features/users/lib/utils';

export const fetchUser = async (userId: string | null) => {
  const [apiUserResponse, apiUserContactDetailsResponse, apiUserAuthResponse] =
    await Promise.all([
      axiosInstance.get<UserDetailsApiResponse>(`/api/users/${userId}`),
      axiosInstance.get<UserContactDetailsApiResponse>(
        `/api/userContactDetails/${userId}`
      ),
      axiosInstance.get<UserAuthApiResponse>(`/api/users/auth/${userId}`),
    ]);

  return {
    ...apiUserResponse.data,
    ...apiUserContactDetailsResponse.data,
    ...apiUserAuthResponse.data,
  };
};

export const fetchUsers = async () => {
  const { data: apiUsersResponse } =
    await axiosInstance.get<UsersApiResponse>(`/api/users`);

  return apiUsersResponse;
};

export const updateUser = async (userId: string, data: BaseUserFormData) => {
  const { userDetailsPayload, userContactDetailsPayload, userAuthPayload } =
    createUserUpdatePayload(userId, data);

  const [apiUserResponse, apiUserContactDetailsResponse, apiUserAuthResponse] =
    await Promise.all([
      axiosInstance.put<Partial<UserDetailsApiResponse>>(
        `/api/users`,
        userDetailsPayload
      ),
      axiosInstance.put<Partial<UserContactDetailsApiResponse>>(
        `/api/userContactDetails/${userId}`,
        userContactDetailsPayload
      ),
      axiosInstance.post<Partial<UserAuthApiResponse>>(
        `/api/users/auth`,
        userAuthPayload
      ),
    ]);

  return {
    ...apiUserResponse.data,
    ...apiUserContactDetailsResponse.data,
    ...apiUserAuthResponse.data,
  };
};
