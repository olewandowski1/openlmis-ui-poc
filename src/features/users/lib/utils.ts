import { BaseUserFormData } from '@/features/users/lib/schemas';
import {
  UserContactDetailsApiResponse,
  UserDetailsApiResponse,
} from '@/features/users/lib/types';

export const createUserUpdatePayload = (
  userId: string,
  data: BaseUserFormData
) => {
  const userDetailsPayload: Partial<UserDetailsApiResponse> = {
    id: userId,
    username: data.username,
    firstName: data.firstName,
    lastName: data.lastName,
    jobTitle: data.jobTitle,
    homeFacilityId: data.homeFacilityId,
    timezone: data.timezone,
    active: data?.enabled,
    extraData: {},
    roleAssignments: [],
  };

  const userContactDetailsPayload: Partial<UserContactDetailsApiResponse> = {
    referenceDataUserId: userId,
    phoneNumber: data.phoneNumber,
    allowNotify: data.allowNotifications,
    emailDetails: {
      email: data?.email ?? null,
      emailVerified: data.emailVerified,
    },
  };

  const userAuthPayload = {
    id: userId,
    username: data.username,
    enabled: data.enabled,
  };

  return {
    userDetailsPayload,
    userContactDetailsPayload,
    userAuthPayload,
  };
};
