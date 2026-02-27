import { createContext } from 'react';
import type { AuthUser, AuthResponse } from '@/types/auth.types';

export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (response: AuthResponse) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);
