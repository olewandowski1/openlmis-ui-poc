import { PaginatedResponse, RoleAssignment, User } from '@/lib/types';

export type UsersApiResponse = PaginatedResponse<User>;

export type UserDetailsApiResponse = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  timezone: string;
  jobTitle?: string;
  homeFacilityId?: string;
  active: boolean;
  extraData: Record<string, unknown>;
  roleAssignments: RoleAssignment[];
};

export type UserContactDetailsApiResponse = {
  referenceDataUserId: string;
  phoneNumber: string | null;
  allowNotify: boolean;
  emailDetails: {
    email?: string | undefined;
    emailVerified?: boolean | undefined;
  };
};

export type UserAuthApiResponse = {
  id: string;
  username: string;
  password: string | null;
  enabled: boolean;
  lockedOut: boolean;
};

export type UserAuthPasswordResetResponse = {
  newPassword: string;
  username: string;
};

export type UserData = UserDetailsApiResponse &
  UserContactDetailsApiResponse &
  UserAuthApiResponse;
