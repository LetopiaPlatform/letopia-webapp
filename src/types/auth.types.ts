// ─── Login ───────────────────────────────────────────────────
export interface LoginRequest {
  email: string;
  password: string;
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
}
