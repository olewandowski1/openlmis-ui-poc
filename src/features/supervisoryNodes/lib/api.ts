import { axiosInstance } from '@/config/axios';
import { PaginatedResponse, SupervisoryNode } from '@/lib/types';

export const fetchSupervisoryNodes = async () => {
  const { data: apiSupervisoryNodesResponse } = await axiosInstance.get<
    PaginatedResponse<SupervisoryNode>
  >(`/api/supervisoryNodes`);

  return apiSupervisoryNodesResponse;
};
