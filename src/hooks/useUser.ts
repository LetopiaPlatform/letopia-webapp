import { usersApi } from '@/api/users.api';
import { useAuthContext } from '@/context/AuthContext';
import type {
  EmailChangeRequest,
  EmailConfirmRequest,
  UpdateProfileRequest,
  UserProfile,
} from '@/types/user.types';
import type { UpdatePreferencesRequest } from '@/types/preferences.types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const ME_KEY = ['users', 'me'] as const;

export function useCurrentUser() {
  const { isAuthenticated } = useAuthContext();

  return useQuery({
    queryKey: ME_KEY,
    queryFn: () => usersApi.getMe().then((res) => res.data),
    enabled: isAuthenticated,
    staleTime: 60_000,
  });
}

export function usePublicProfile(id: string | undefined) {
  return useQuery({
    queryKey: ['users', 'public', id],
    queryFn: () => usersApi.getById(id!).then((res) => res.data),
    enabled: !!id,
    staleTime: 60_000,
  });
}

// Shared helper: sync auth context whenever /me data changes
function useSyncAuthFromProfile() {
  const { updateUser } = useAuthContext();
  return (profile: UserProfile | null | undefined) => {
    if (!profile) return;
    updateUser({
      fullName: profile.fullName,
      avatarUrl: profile.avatarUrl ?? '',
      role: profile.role,
      email: profile.email,
    });
  };
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  const sync = useSyncAuthFromProfile();
  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => usersApi.updateProfile(data).then((r) => r.data),
    onSuccess: (res) => {
      sync(res?.data);
      qc.invalidateQueries({ queryKey: ME_KEY });
    },
  });
}

export function useUpdateAvatar() {
  const qc = useQueryClient();
  const sync = useSyncAuthFromProfile();
  return useMutation({
    mutationFn: (file: File) => usersApi.updateAvatar(file).then((r) => r.data),
    onSuccess: (res) => {
      sync(res?.data);
      qc.invalidateQueries({ queryKey: ME_KEY });
    },
  });
}

export function useDeleteAvatar() {
  const qc = useQueryClient();
  const sync = useSyncAuthFromProfile();
  return useMutation({
    mutationFn: () => usersApi.deleteAvatar().then((r) => r.data),
    onSuccess: (res) => {
      sync(res?.data);
      qc.invalidateQueries({ queryKey: ME_KEY });
    },
  });
}

export function useUpdatePreferences() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdatePreferencesRequest) =>
      usersApi.updatePreferences(data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ME_KEY }),
  });
}

export function useRequestEmailChange() {
  return useMutation({
    mutationFn: (data: EmailChangeRequest) => usersApi.requestEmailChange(data).then((r) => r.data),
  });
}

export function useConfirmEmailChange() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: EmailConfirmRequest) =>
      usersApi.confirmEmailChange(data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ME_KEY }),
  });
}

export function useDeleteAccount() {
  const { logout } = useAuthContext();
  return useMutation({
    mutationFn: () => usersApi.deleteAccount().then((r) => r.data),
    onSuccess: () => logout(),
  });
}
