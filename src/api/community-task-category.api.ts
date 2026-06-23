import apiClient from './client';
import type { ApiResponse } from '@/types/api.types';
import type {
  TaskCategory,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '@/types/community-task-category.types';

export const communityTaskCategoryApi = {
  getAll: (communityId: string) =>
    apiClient.get<ApiResponse<TaskCategory[]>>(`/CommunityTaskCategory/${communityId}/GetAll`),

  getById: (communityId: string, categoryId: string) =>
    apiClient.get<ApiResponse<TaskCategory>>(`/CommunityTaskCategory/${communityId}/${categoryId}`),

  create: (communityId: string, data: CreateCategoryRequest) =>
    apiClient.post<ApiResponse<TaskCategory>>(`/CommunityTaskCategory/${communityId}/Create`, data),

  update: (categoryId: string, data: UpdateCategoryRequest) =>
    apiClient.put<ApiResponse<TaskCategory>>(`/CommunityTaskCategory/Update/${categoryId}`, data),

  delete: (categoryId: string) =>
    apiClient.delete<ApiResponse<null>>(`/CommunityTaskCategory/Delete/${categoryId}`),
};
