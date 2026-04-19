import apiClient from './client';
import type { ApiResponse } from '@/types/api.types';
import type { UpdateUserProfileRequest, UserProfile } from '@/types/user.types';

export const usersApi = {
  getMe: () => apiClient.get<ApiResponse<UserProfile>>('/users/me'),

  updateMe: (data: UpdateUserProfileRequest) => {
    const formData = new FormData();
    if (data.fullName !== undefined) formData.append('fullName', data.fullName);
    if (data.email !== undefined) formData.append('email', data.email);
    if (data.bio !== undefined) formData.append('bio', data.bio);
    if (data.phoneNumber !== undefined) formData.append('phoneNumber', data.phoneNumber);
    if (data.avatar) formData.append('avatarUrl', data.avatar);

    return apiClient.put<ApiResponse<UserProfile>>('/users/me', formData, {
      headers: { 'Content-Type': undefined },
    });
  },

  updateAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.put<ApiResponse<string>>('/users/me/avatar', formData, {
      headers: { 'Content-Type': undefined },
    });
  },

  deleteAvatar: () => apiClient.delete<ApiResponse<null>>('/users/me/avatar'),
};
