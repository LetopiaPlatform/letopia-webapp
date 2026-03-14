import { authApi } from '@/api/auth.api';
import { useAuthContext } from '@/context/AuthContext';
import type { ApiResponse } from '@/types/api.types';
import type { LoginRequest, SignUpRequest } from '@/types/auth.types';
import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export function useLogin() {
  const { login } = useAuthContext();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data).then((response) => response.data),
    onSuccess: (response) => {
      if (response.data) {
        login(response.data);
        toast.success('Welcome back!');
        navigate('/');
      }
    },
    onError: (error: AxiosError<ApiResponse<null>>) => {
      const message =
        error.response?.data?.errors?.[0] ?? error.response?.data?.message ?? 'Login failed';
      toast.error(message);
    },
  });
}

export function useGoogleLogin() {
  const { login } = useAuthContext();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (accessToken: string) =>
      authApi.googleLogin({ accessToken }).then((response) => response.data),
    onSuccess: (response) => {
      if (response.data) {
        login(response.data);
        toast.success('Welcome back!');
        navigate('/');
      }
    },
    onError: (error: AxiosError<ApiResponse<null>>) => {
      const message =
        error.response?.data?.errors?.[0] ?? error.response?.data?.message ?? 'Google login failed';
      toast.error(message);
    },
  });
}

export function useSignUp() {
  const { login } = useAuthContext();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: SignUpRequest) => authApi.signUp(data).then((response) => response.data),
    onSuccess: (response) => {
      if (response.data) {
        login(response.data);
        toast.success('Account created successfully!');
        navigate('/'); // Redirect to home page
      }
    },
    onError: (error: AxiosError<ApiResponse<null>>) => {
      const message =
        error.response?.data?.errors?.[0] ?? error.response?.data?.message ?? 'Sign up failed';
      toast.error(message);
    },
  });
}
