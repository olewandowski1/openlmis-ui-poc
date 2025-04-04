import { ALL_RIGHT_TYPES } from '@/lib/constants';

type ApiReference = {
  id: string;
  href: string;
};

export interface SortInfo {
  direction: string;
  property: string;
  ignoreCase: boolean;
  nullHandling: string;
  descending: boolean;
  ascending: boolean;
}

export interface Pageable {
  sort: SortInfo[];
  pageNumber: number;
  pageSize: number;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface PaginatedResponse<TContentItem> {
  content: TContentItem[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  pageable: Pageable;
  size: number;
  sort: SortInfo[];
  totalElements: number;
  totalPages: number;
}

export type RightType = (typeof ALL_RIGHT_TYPES)[number];

export type Right = {
  id: string;
  name: string;
  type: RightType;
  attachments: unknown[];
};

export type Role = {
  id: string;
  name: string;
  description: string;
  rights: Right[];
  count: number;
};

export type Program = {
  active: boolean;
  code: string;
  description: string | null;
  enableDatePhysicalStockCountCompleted: boolean;
  id: string;
  name: string;
  periodsSkippable: boolean;
  showNonFullSupplyTab: boolean;
  skipAuthorization: boolean;
};

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

export type MinimalFacility = {
  active: boolean;
  id: string;
  name: string;
  code: string;
};

export type RoleAssignment = {
  count?: number;
  errors?: unknown[];
  roleId: string;
  roleName?: string;
  warehouseId?: string;
  warehouseName?: string;
  supervisoryNodeId?: string;
  supervisoryNodeName?: string;
  programId?: string;
  programName?: string;
  rights?: Right[];
};

export type SupervisoryNode = {
  id: string;
  code: string;
  facility: ApiReference;
  name: string;
  extraData: Record<string, unknown>;
  childNodes: ApiReference[];
  partnerNodes: ApiReference[];
  requisitionGroup: ApiReference;
};
