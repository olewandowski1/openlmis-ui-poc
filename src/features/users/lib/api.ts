import { axiosInstance } from '@/config/axios';
import { BaseUserFormData } from '@/features/users/lib/schemas';
import {
  UserAuthApiResponse,
  UserAuthPasswordResetResponse,
  UserContactDetailsApiResponse,
  UserDetailsApiResponse,
  UserEmailVerificationApiResponse,
  UsersApiResponse,
} from '@/features/users/lib/types';
import {
  createUserCreatePartialPayload,
  createUserCreatePayload,
  createUserUpdatePayload,
} from '@/features/users/lib/utils';

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

export const fetchUserEmailVerification = async (userId?: string) => {
  const { data: apiUserVerificationEmail } =
    await axiosInstance.get<UserEmailVerificationApiResponse>(
      `/api/userContactDetails/${userId}/verifications`
    );

  return apiUserVerificationEmail;
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

export const createUser = async (data: BaseUserFormData) => {
  const userDetailsPayload = createUserCreatePartialPayload(data);

  const { data: apiUserResponse } = await axiosInstance.put<
    Partial<UserDetailsApiResponse>
  >(`/api/users`, userDetailsPayload);

  const userRefId = apiUserResponse.id;

  if (!userRefId) {
    throw new Error('User ID not found');
  }

  const {
    userContactDetailsPayload,
    userAuthPayload,
    userAuthPasswordResetPayload,
  } = createUserCreatePayload(userRefId, data);

  const [
    apiUserContactDetailsResponse,
    apiUserAuthResponse,
    apiUserAuthPasswordResetResponse,
  ] = await Promise.all([
    axiosInstance.put<Partial<UserContactDetailsApiResponse>>(
      `/api/userContactDetails/${userRefId}`,
      userContactDetailsPayload
    ),
    axiosInstance.post<Partial<UserAuthApiResponse>>(
      '/api/users/auth',
      userAuthPayload
    ),
    axiosInstance.post<UserAuthPasswordResetResponse>(
      '/api/users/auth/passwordReset',
      userAuthPasswordResetPayload
    ),
  ]);

  return {
    ...apiUserResponse,
    ...apiUserContactDetailsResponse.data,
    ...apiUserAuthResponse.data,
    ...apiUserAuthPasswordResetResponse.data,
  };
};

export const resetUserPassword = async (username: string, password: string) => {
  const userAuthPasswordResetPayload: Partial<UserAuthPasswordResetResponse> = {
    username,
    newPassword: password,
  };

  const { data: apiUserAuthPasswordResetResponse } =
    await axiosInstance.post<UserAuthPasswordResetResponse>(
      '/api/users/auth/passwordReset',
      userAuthPasswordResetPayload
    );

  return apiUserAuthPasswordResetResponse;
};
