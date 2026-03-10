import apiClient from './client';
import type { ApiResponse, PaginatedQuery, PaginatedResult } from '@/types/api.types';
import type {
  CommunitySummary,
  CommunityDetail,
  CreateCommunityRequest,
  UpdateCommunityRequest,
  JoinedCommunitySummary,
  Member,
  CommunityListParams,
} from '@/types/community.types';

export const communitiesApi = {
  getBySlug: (slug: string) => apiClient.get<ApiResponse<CommunityDetail>>(`/communities/${slug}`),

  getMyCommunities: () => apiClient.get<ApiResponse<JoinedCommunitySummary[]>>(`/communities/me`),

  list: (params: CommunityListParams) =>
    apiClient.get<ApiResponse<PaginatedResult<CommunitySummary>>>(`/communities`, { params }),

  getMembers: (id: string, params: PaginatedQuery) =>
    apiClient.get<ApiResponse<PaginatedResult<Member>>>(`/communities/${id}/members`, { params }),

  join: (id: string) => apiClient.post(`/communities/${id}/join`),

  leave: (id: string) => apiClient.delete(`/communities/${id}/leave`),

  create: (data: CreateCommunityRequest) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('categoryId', data.categoryId);
    formData.append('isPrivate', String(data.isPrivate ?? false));
    if (data.coverImage) {
      formData.append('coverImage', data.coverImage);
    }
    data.rules?.forEach((rule) => formData.append('rules', rule));

    return apiClient.post<ApiResponse<CommunityDetail>>('/communities', formData);
  },

  update: (id: string, data: UpdateCommunityRequest) => {
    const formData = new FormData();
    if (data.name) formData.append('name', data.name);
    if (data.description) formData.append('description', data.description);
    if (data.isPrivate !== undefined) formData.append('isPrivate', String(data.isPrivate));
    if (data.coverImage) formData.append('coverImage', data.coverImage);
    data.rules?.forEach((rule) => formData.append('rules', rule));

    return apiClient.put<ApiResponse<CommunityDetail>>(`/communities/${id}`, formData);
  },
};
