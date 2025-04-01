import { axiosInstance } from '@/config/axios';
import { Role } from '@/lib/types';

type RolesApiResponse = Role[];

export const fetchRoles = async () => {
  const { data: apiRolesResponse } =
    await axiosInstance.get<RolesApiResponse>('/api/roles');

  return apiRolesResponse;
};
