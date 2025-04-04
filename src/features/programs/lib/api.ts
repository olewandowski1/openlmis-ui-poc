import { axiosInstance } from '@/config/axios';
import { ProgramsApiResponse } from '@/features/programs/lib/types';

export const fetchPrograms = async () => {
  const { data: apiProgramsResponse } =
    await axiosInstance.get<ProgramsApiResponse>(`/api/programs`);

  return apiProgramsResponse;
};
