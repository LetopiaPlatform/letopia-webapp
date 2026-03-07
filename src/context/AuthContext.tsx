import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useNavigate } from 'react-router-dom';
import type { AuthResponse, AuthUser } from '@/types/auth.types';

// ─── Shape of the context ────────────────────────────────────
interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (response: AuthResponse) => void;
  logout: () => void;
}

// ─── Create the context ──────────────────────────────────────
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ─── Storage keys ────────────────────────────────────────────
const TOKEN_KEY = 'authToken';
const USER_KEY = 'authUser';

// ─── Provider component ─────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  // Initialize from localStorage (survives page refresh)
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  const isAuthenticated = !!token && !!user;

  // Called after successful login/signup API response
  const login = useCallback((response: AuthResponse) => {
    const { jwtToken, user: authUser } = response;
    localStorage.setItem(TOKEN_KEY, jwtToken.token);
    localStorage.setItem(USER_KEY, JSON.stringify(authUser));
    setToken(jwtToken.token);
    setUser(authUser);
  }, []);

  // Called when user clicks logout or token expires
  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
    navigate('/login');
  }, [navigate]);

  // Listen for token removal from Axios interceptor (401 handler)
  useEffect(() => {
    const handleStorageChange = () => {
      const currentToken = localStorage.getItem(TOKEN_KEY);
      if (!currentToken && token) {
        setToken(null);
        setUser(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [token]);

  // Memoize to prevent unnecessary re-renders
  const value = useMemo(
    () => ({ user, token, isAuthenticated, login, logout }),
    [user, token, isAuthenticated, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─── Hook to consume the context ─────────────────────────────
// eslint-disable-next-line react-refresh/only-export-components
export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
}
