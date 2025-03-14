import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type LoginData = {
  referenceDataUserId: string;
  accessToken: string;
};

type LoginDataStorage = {
  referenceDataUserId: string | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setLoginData: (loginData: LoginData) => void;
  clearLoginData: () => void;
};

export const useLoginData = create<LoginDataStorage>()(
  persist(
    (set) => ({
      referenceDataUserId: null,
      accessToken: null,
      isAuthenticated: false,
      setLoginData: ({ referenceDataUserId, accessToken }) =>
        set({
          referenceDataUserId,
          accessToken,
          isAuthenticated: !!accessToken,
        }),
      clearLoginData: () =>
        set({
          referenceDataUserId: null,
          accessToken: null,
          isAuthenticated: false,
        }),
    }),
    { name: 'login-data-storage' }
  )
);
