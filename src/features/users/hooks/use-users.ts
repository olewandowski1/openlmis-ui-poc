import { axiosInstance } from '@/config/axios';
import { queryKeys } from '@/lib/query-keys';
import { useQuery } from '@tanstack/react-query';

export type User = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  timezone: string;
  active: boolean;
  extraData: Record<string, unknown>;
  roleAssignments: RoleAssignment[];
};

type Right = {
  id: string;
  name: string;
  type: string;
};

type RoleAssignment = {
  id: string;
  name: string;
  description: string;
  rights: Right[];
  count: number;
};

type Sort = {
  direction: string;
  property: string;
  ignoreCase: boolean;
  nullHandling: string;
  descending: boolean;
  ascending: boolean;
};

type Pageable = {
  sort: Sort[];
  pageNumber: number;
  pageSize: number;
  offset: number;
  paged: boolean;
  unpaged: boolean;
};

type ApiUsersResponse = {
  content: User[];
  pageable: Pageable;
  totalPages: number;
  last: boolean;
  totalElements: number;
  first: boolean;
  numberOfElements: number;
  sort: Sort[];
  size: number;
  number: number;
  empty: boolean;
};

const fetchUsers = async () => {
  const { data: apiUsersResponse } =
    await axiosInstance.get<ApiUsersResponse>(`/api/users`);

  return apiUsersResponse;
};

export const useUsers = () => {
  const { data, isLoading } = useQuery({
    queryKey: [queryKeys.users],
    queryFn: () => fetchUsers(),
  });

  const users = data?.content ?? [];

  return { users, isLoading };
};
