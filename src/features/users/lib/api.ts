import { axiosInstance } from '@/config/axios';
import { BaseUserFormData } from '@/features/users/lib/schemas';
import {
  UserAuthApiResponse,
  UserContactDetailsApiResponse,
  UserDetailsApiResponse,
  UsersApiResponse,
} from '@/features/users/lib/types';

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
  console.log(`Updating user ${userId} with data:`, data);
  // Replace with: const response = await axiosInstance.put(`/api/users/${userId}`, data);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  // Return mock updated user data (adjust based on your API response)
  return { id: userId, ...data };
};
