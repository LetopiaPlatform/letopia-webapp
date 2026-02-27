import { PLATFORM_ROLES } from '@/lib/constants';

export type PlatformRole = (typeof PLATFORM_ROLES)[keyof typeof PLATFORM_ROLES];

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: PlatformRole;
}

export interface TokenResult {
  token: string;
  expiresAt: string;
}

export interface AuthResponse {
  jwtToken: TokenResult;
  user: AuthUser;
}
