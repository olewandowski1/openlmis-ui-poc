import { router } from '@/config/router';
import { useLoginData } from '@/features/auth/store/login-data';
import axios, { AxiosRequestConfig } from 'axios';

export class AxiosInstanceError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = 'AxiosInstanceError';
  }
}

const axiosConfig: AxiosRequestConfig = {
  // Timeout is set to 60 seconds
  timeout: 60_000,
  // Default headers
  headers: {
    'Content-Type': 'application/json',
  },
};

const axiosInstance = axios.create(axiosConfig);

axiosInstance.interceptors.request.use(
  (config) => {
    // Get the access token from the Zustand store
    const { accessToken } = useLoginData.getState();

    // If an access token is available, add it to the request headers.
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => {
    // If the request was successful, return the response.
    return response;
  },
  (error) => {
    // If the request failed, check the status code. If it's 401, clear the access token.
    // This will log the user out and redirect them to the login page.
    if (error.status === 401) {
      // Clear the access token from the Zustand store
      const { clearLoginData } = useLoginData.getState();

      clearLoginData();

      router.navigate({ to: '/login' });
    }

    return Promise.reject(error);
  }
);

export { axiosInstance };
