import { axiosInstance } from '@/config/axios';
import { BaseRoleFormData } from '@/features/roles/lib/schemas';
import { Right, RightType, Role } from '@/lib/types';

export type RolesApiResponse = Role[];

export const fetchRoles = async () => {
  const { data: apiRolesResponse } =
    await axiosInstance.get<RolesApiResponse>('/api/roles');

  return apiRolesResponse;
};

export const fetchRole = async (roleId: string) => {
  const { data: apiRoleResponse } = await axiosInstance.get<Role>(
    `/api/roles/${roleId}`
  );

  return apiRoleResponse;
};

export const fetchRoleRights = async (roleRightType?: RightType) => {
  const url = roleRightType
    ? `/api/rights/search/?type=${roleRightType}`
    : '/api/rights/search';

  const { data: apiRoleRightsResponse } = await axiosInstance.get<Right[]>(url);

  return apiRoleRightsResponse;
};

export const updateRole = async (roleId: string, data: BaseRoleFormData) => {
  const { data: apiRoleResponse } = await axiosInstance.put<Role>(
    `/api/roles/${roleId}`,
    data
  );

  return apiRoleResponse;
};

export const createRole = async (data: BaseRoleFormData) => {
  const { data: apiRoleResponse } = await axiosInstance.post<Role>(
    '/api/roles',
    data
  );

  return apiRoleResponse;
};
