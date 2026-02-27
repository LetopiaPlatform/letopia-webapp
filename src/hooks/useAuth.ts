import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { login, signUp } from '@/api/auth.api';
import { useAuthContext } from '@/context/useAuthContext';
import type { LoginRequest, SignUpRequest } from '@/types/auth.types';

export function useLogin() {
  const { login: storeAuth } = useAuthContext();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: LoginRequest) => login(data),
    onSuccess: (response) => {
      storeAuth(response);
      navigate('/');
    },
  });
}

export function useSignup() {
  const { login: storeAuth } = useAuthContext();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: SignUpRequest) => signUp(data),
    onSuccess: (response) => {
      storeAuth(response);
      navigate('/');
    },
  });
}
