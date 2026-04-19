// ─── Login ───────────────────────────────────────────────────
export interface LoginRequest {
  email: string;
  password: string;
}

// ─── Google Login ────────────────────────────────────────────
export interface GoogleLoginRequest {
  accessToken: string;
}

// ─── Sign Up ─────────────────────────────────────────────────
export interface SignUpRequest {
  email: string;
  fullName: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

// ─── Auth Response ───────────────────────────────────────────
// Returned by both login and signup endpoints
export interface AuthResponse {
  jwtToken: TokenResult;
  user: AuthUser;
}

export interface TokenResult {
  token: string;
  expiresAt: string; // ISO date string from backend's DateTime
}

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: string;
  avatarUrl: string;
}

export interface SendCodeRequest {
  email: string;
  purpose: 'EmailVerification' | 'PasswordRest';
}

export interface VerifyEmailRequest {
  email: string;
  code: string;
}

// ─── Forgot / Reset Password ─────────────────────────────────
export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  code: string;
  newPassword: string;
  confirmPassword: string;
}
