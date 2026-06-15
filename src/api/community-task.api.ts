import apiClient from './client';
import type { ApiResponse } from '@/types/api.types';
import type {
  CommunityTask,
  CommunityProgress,
  CreateTaskRequest,
  UpdateTaskRequest,
  GetAllTasksParams,
} from '@/types/community-task.types';

export const communityTaskApi = {
  getAll: (communityId: string, params?: GetAllTasksParams) =>
    apiClient.get<ApiResponse<CommunityTask[]>>(`/CommunityTask/${communityId}/GetAll`, { params }),

  getTodayProgress: (communityId: string) =>
    apiClient.get<ApiResponse<CommunityProgress>>(`/CommunityTask/${communityId}/GetTodayProgress`),

  create: (communityId: string, data: CreateTaskRequest) =>
    apiClient.post<ApiResponse<CommunityTask>>(`/CommunityTask/${communityId}/Create`, data),

  update: (communityTaskId: string, data: UpdateTaskRequest) =>
    apiClient.put<ApiResponse<CommunityTask>>(`/CommunityTask/Update/${communityTaskId}`, data),

  delete: (communityTaskId: string) =>
    apiClient.delete<ApiResponse<null>>(`/CommunityTask/Delete/${communityTaskId}`),

  toggle: (taskId: string) =>
    apiClient.patch<ApiResponse<CommunityTask>>(`/CommunityTask/Toggle/${taskId}`),
};
