import type {
  AuthResponse,
  ForgotPasswordRequest,
  GoogleLoginRequest,
  LoginRequest,
  ResetPasswordRequest,
  SendCodeRequest,
  SignUpRequest,
  VerifyEmailRequest,
} from '@/types/auth.types';
import apiClient from './client';
import type { ApiResponse } from '@/types/api.types';

export const authApi = {
  login: (data: LoginRequest) => apiClient.post<ApiResponse<AuthResponse>>('/auth/login', data),

  signUp: (data: SignUpRequest) => apiClient.post<ApiResponse<null>>('/auth/signup', data),

  googleLogin: (data: GoogleLoginRequest) =>
    apiClient.post<ApiResponse<AuthResponse>>('/auth/google', data),

  sendCode: (data: SendCodeRequest) => apiClient.post<ApiResponse<null>>('/auth/send-code', data),

  verifyEmail: (data: VerifyEmailRequest) =>
    apiClient.post<ApiResponse<AuthResponse>>('/auth/verify-email', data),

  forgotPassword: (data: ForgotPasswordRequest) =>
    apiClient.post<ApiResponse<null>>('/auth/forgot-password', data),

  resetPassword: (data: ResetPasswordRequest) =>
    apiClient.post<ApiResponse<null>>('/auth/reset-password', data),
};
