import { BaseUserFormData } from '@/features/users/lib/schemas';
import {
  UserAuthApiResponse,
  UserAuthPasswordResetResponse,
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
    roleAssignments: data?.roleAssignments ?? [],
  };

  const userContactDetailsPayload: Partial<UserContactDetailsApiResponse> = {
    referenceDataUserId: userId,
    phoneNumber: data.phoneNumber,
    allowNotify: data.allowNotifications,
    emailDetails: data.emailDetails,
  };

  const userAuthPayload: Partial<UserAuthApiResponse> = {
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

export const createUserCreatePartialPayload = (data: BaseUserFormData) => {
  return {
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
};

export const createUserCreatePayload = (
  userId: string,
  data: BaseUserFormData
) => {
  const userContactDetailsPayload: Partial<UserContactDetailsApiResponse> = {
    phoneNumber: data.phoneNumber,
    allowNotify: data.allowNotifications,
    referenceDataUserId: userId,
    emailDetails: data.emailDetails,
  };

  const userAuthPayload: Partial<UserAuthApiResponse> = {
    id: userId,
    username: data.username,
    enabled: data.enabled,
  };

  const userAuthPasswordResetPayload: Partial<UserAuthPasswordResetResponse> = {
    username: data.username,
    newPassword: data.password,
  };

  return {
    userContactDetailsPayload,
    userAuthPayload,
    userAuthPasswordResetPayload,
  };
};
