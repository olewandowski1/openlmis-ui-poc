import { axiosInstance } from '@/config/axios';
import { useLoginData } from '@/features/auth/store/login-data';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

/**
 * @name LoginResponse
 * @description
 * The response object from the login endpoint.
 */
type LoginResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  referenceDataUserId: string;
  username: string;
};

/**
 * @name AuthActions
 * @description
 * The actions available for the authentication feature.
 */
type AuthActions = {
  login: (credentials: { username: string; password: string }) => void;
  logout: () => void;
};

/**
 * @name useAuthActions
 * @description
 * Custom hook for handling authentication actions.
 * It uses useLoginData for storing login data.
 * @returns Login and logout functions.
 */
export const useAuthActions = (): AuthActions => {
  const { setLoginData, clearLoginData } = useLoginData();
  const { t } = useTranslation('translation', {
    keyPrefix: 'auth.useAuthActions',
  });

  const login = async ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => {
    try {
      const clientId = import.meta.env.VITE_AUTH_SERVER_CLIENT_ID;
      const clientSecret = import.meta.env.VITE_AUTH_SERVER_CLIENT_SECRET;

      if (!clientId || !clientSecret) {
        throw new Error('Missing client ID or client secret');
      }

      const basicAuthHeader = `Basic ${btoa(`${clientId}:${clientSecret}`)}`;

      const { data: loginResponse } = await axiosInstance.post<LoginResponse>(
        '/api/oauth/token?grant_type=password',
        { username, password },
        {
          headers: {
            Authorization: basicAuthHeader,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      const { referenceDataUserId, access_token } = loginResponse;

      setLoginData({
        referenceDataUserId,
        accessToken: access_token,
      });

      toast.success(t('loginSuccess'));
    } catch (error) {
      console.error(`[USE_AUTH_ACTIONS]: ${error}`);
      toast.error(t('loginError'));
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post('/api/users/auth/logout');
      clearLoginData();
    } catch (error) {
      console.error(`[USE_AUTH_ACTIONS]: ${error}`);
      toast.error(t('logoutError'));
    }
  };

  return { login, logout };
};
