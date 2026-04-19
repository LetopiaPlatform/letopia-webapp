import { authApi } from '@/api/auth.api';
import { useAuthContext } from '@/context/AuthContext';
import type { ApiResponse } from '@/types/api.types';
import type { LoginRequest, SignUpRequest, VerifyEmailRequest } from '@/types/auth.types';
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
    onError: (error: AxiosError<ApiResponse<null>>, variables) => {
      const status = error.response?.status;
      const message =
        error.response?.data?.errors?.[0] ?? error.response?.data?.message ?? 'Login failed';

      // 403 = email not verified → redirect to verify page
      if (status === 403) {
        toast.error('Please verify your email first.');
        navigate('/verify-email', { state: { email: variables.email, autoResend: true } });
        return;
      }

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
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: SignUpRequest) => authApi.signUp(data).then((response) => response.data),
    onSuccess: (_response, variables) => {
      toast.success('Account created! Check your email for a verification code.');
      navigate('/verify-email', { state: { email: variables.email, autoResend: true } });
    },
    onError: (error: AxiosError<ApiResponse<null>>) => {
      const message =
        error.response?.data?.errors?.[0] ?? error.response?.data?.message ?? 'Sign up failed';
      toast.error(message);
    },
  });
}

export function useVerifyEmail() {
  const { login } = useAuthContext();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: VerifyEmailRequest) =>
      authApi.verifyEmail(data).then((response) => response.data),
    onSuccess: (response) => {
      if (response.data) {
        login(response.data);
        toast.success('Email verified! Welcome to LeTopia.');
        navigate('/');
      }
    },
    onError: (error: AxiosError<ApiResponse<null>>) => {
      const status = error.response?.status;
      const serverMsg = error.response?.data?.errors?.[0] ?? error.response?.data?.message;

      if (status === 410 || serverMsg?.toLowerCase().includes('expired')) {
        toast.error('Code has expired. Please request a new one.');
      } else if (status === 400 || serverMsg?.toLowerCase().includes('invalid')) {
        toast.error('Invalid code. Please check and try again.');
      } else {
        toast.error(serverMsg ?? 'Verification failed');
      }
    },
  });
}

export function useResendCode() {
  return useMutation({
    mutationFn: (email: string) =>
      authApi.sendCode({ email, purpose: 'EmailVerification' }).then((response) => response.data),
    onSuccess: () => {
      toast.success('A new code has been sent to your email.');
    },
    onError: (error: AxiosError<ApiResponse<null>>) => {
      const message =
        error.response?.data?.errors?.[0] ??
        error.response?.data?.message ??
        'Failed to resend code';
      toast.error(message);
    },
  });
}
