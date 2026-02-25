import axios from 'axios';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/api-utils';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!axios.isAxiosError(error)) return Promise.reject(error);

    const status = error.response?.status;
    const isAuthEndpoint = error.config?.url?.startsWith('/auth/');

    // 401 on protected endpoints → session expired, redirect
    if (status === 401 && !isAuthEndpoint) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // 400 → validation error, let the form handle it (no toast)
    // 401 on /auth/* → wrong credentials, let the form handle it (no toast)
    if (status === 400 || (status === 401 && isAuthEndpoint)) {
      return Promise.reject(error);
    }

    // Everything else → toast (403, 404, 409, 500, network, timeout)
    toast.error(getErrorMessage(error));
    return Promise.reject(error);
  }
);

export default apiClient;
