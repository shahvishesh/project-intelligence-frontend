import type { AxiosError, AxiosRequestConfig } from 'axios';

import { apiClient } from './apiClient';
import { ApiError } from './apiError';
import { tokenStorage } from '../auth/tokenStorage';
import { refreshAccessToken } from '../../features/auth/api/refreshApi';
import { publicApiClient } from './publicApiClient';

type RetryableRequestConfig = AxiosRequestConfig & {
  _retry?: boolean;
};

let refreshPromise: Promise<string> | null = null;

apiClient.interceptors.request.use((config) => {
  const accessToken = tokenStorage.getAccessToken();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,

  async (error: AxiosError<{ message?: string }>) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    if (error.response?.status !== 401 || !originalRequest) {
      const message = error.response?.data?.message ?? 'Something went wrong';

      const statusCode = error.response?.status ?? 500;

      return Promise.reject(new ApiError(message, statusCode));
    }

    if (originalRequest._retry) {
      tokenStorage.clearAccessToken();

      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken();
      }

      const newAccessToken = await refreshPromise;

      tokenStorage.setAccessToken(newAccessToken);

      originalRequest.headers = originalRequest.headers ?? {};

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      return apiClient(originalRequest);
    } catch (refreshError) {
      tokenStorage.clearAccessToken();

      return Promise.reject(refreshError);
    } finally {
      refreshPromise = null;
    }
  },
);

publicApiClient.interceptors.response.use(
  (response) => response,

  (error: AxiosError<{ message?: string }>) => {
    const message = error.response?.data?.message ?? 'Something went wrong';

    const statusCode = error.response?.status ?? 500;

    return Promise.reject(new ApiError(message, statusCode));
  },
);
