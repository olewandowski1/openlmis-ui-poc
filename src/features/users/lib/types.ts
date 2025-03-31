import { PaginatedResponse, User } from '@/lib/types';

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
  extraData: { [key: string]: unknown };
  roleAssignments: {
    roleId: string;
  }[];
};

export type UserContactDetailsApiResponse = {
  referenceDataUserId: string;
  phoneNumber: string | null;
  allowNotify: boolean;
  emailDetails: {
    email: string | null;
    emailVerified: boolean;
  };
};

export type UserAuthApiResponse = {
  id: string;
  username: string;
  password: string | null;
  enabled: boolean;
  lockedOut: boolean;
};

export type UserData = UserDetailsApiResponse &
  UserContactDetailsApiResponse &
  UserAuthApiResponse;
