import { axiosInstance } from '@/config/axios';
import { MinimalFacilityApiResponse } from '@/features/facilities/lib/types';

export const fetchMinimalFacilities = async () => {
  const { data: minimalFacilitiesResponse } =
    await axiosInstance.get<MinimalFacilityApiResponse>(
      `/api/facilities/minimal?sort=name`
    );

  return minimalFacilitiesResponse;
};
