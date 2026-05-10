import apiClient from './client';
import type { ApiResponse } from '@/types/api.types';
import type {
  EmailChangeRequest,
  EmailConfirmRequest,
  PublicUserProfile,
  UpdateProfileRequest,
  UserProfile,
} from '@/types/user.types';
import type { UpdatePreferencesRequest } from '@/types/preferences.types';

export const usersApi = {
  getMe: () => apiClient.get<ApiResponse<UserProfile>>('/users/me'),

  getById: (id: string) => apiClient.get<ApiResponse<PublicUserProfile>>(`/users/${id}`),

  updateProfile: (data: UpdateProfileRequest) =>
    apiClient.put<ApiResponse<UserProfile>>('/users/me', data),

  updateAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.put<ApiResponse<UserProfile>>('/users/me/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  deleteAvatar: () => apiClient.delete<ApiResponse<UserProfile>>('/users/me/avatar'),

  requestEmailChange: (data: EmailChangeRequest) =>
    apiClient.post<ApiResponse<null>>('/users/me/email-change', data),

  confirmEmailChange: (data: EmailConfirmRequest) =>
    apiClient.post<ApiResponse<null>>('/users/me/email-confirm', data),

  updatePreferences: (data: UpdatePreferencesRequest) =>
    apiClient.put<ApiResponse<UserProfile>>('/users/me/preferences', data),

  deleteAccount: () => apiClient.delete<ApiResponse<null>>('/users/me'),
};
