import type {
  AuthResponse,
  GoogleLoginRequest,
  LoginRequest,
  SignUpRequest,
} from '@/types/auth.types';
import apiClient from './client';
import type { ApiResponse } from '@/types/api.types';

export const authApi = {
  login: (data: LoginRequest) => apiClient.post<ApiResponse<AuthResponse>>('/auth/login', data),

  signUp: (data: SignUpRequest) => apiClient.post<ApiResponse<AuthResponse>>('/auth/signup', data),

  googleLogin: (data: GoogleLoginRequest) =>
    apiClient.post<ApiResponse<AuthResponse>>('/auth/google', data),
};
