import apiClient from './client';
import { extractData } from '@/lib/api-utils';
import type { ApiResponse } from '@/types/api.types';
import type { LoginRequest, SignUpRequest, AuthResponse } from '@/types/auth.types';

export async function login(credentials: LoginRequest): Promise<AuthResponse> {
  const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
  return extractData(response);
}

export async function signUp(credentials: SignUpRequest): Promise<AuthResponse> {
  const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/signup', credentials);
  return extractData(response);
}
