import { usersApi } from '@/api/users.api';
import { useAuthContext } from '@/context/AuthContext';
import type { UpdateUserProfileRequest } from '@/types/user.types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useCurrentUser() {
  const { isAuthenticated } = useAuthContext();

  return useQuery({
    queryKey: ['users', 'me'],
    queryFn: () => usersApi.getMe().then((res) => res.data),
    enabled: isAuthenticated,
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserProfileRequest) => usersApi.updateMe(data).then((res) => res.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users', 'me'] });
    },
  });
}
