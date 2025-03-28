import { MinimalFacilityApiResponse } from '@/features/facilities/lib/types';
import { fetchMinimalFacilities } from '@/lib/api';
import { queryKeys } from '@/lib/query-keys';
import { useQuery } from '@tanstack/react-query';

export const useMinimalFacilities = () => {
  return useQuery<MinimalFacilityApiResponse, Error>({
    queryKey: [queryKeys.minimalFacilities],
    queryFn: fetchMinimalFacilities,
  });
};
