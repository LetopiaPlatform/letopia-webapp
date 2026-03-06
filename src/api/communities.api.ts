import apiClient from './client';
import { extractData } from '@/lib/api-utils';
import type { ApiResponse, PaginatedResult } from '@/types/api.types';
import type {
  CommunitySummary,
  CommunityDetail,
  CommunityMember,
  CommunityMemberRole,
  CreateCommunityRequest,
  UpdateCommunityRequest,
  ListCommunitiesQuery,
} from '@/types/community.types';

/**
 * GET /communities
 */
export async function getCommunities(
  params?: ListCommunitiesQuery
): Promise<PaginatedResult<CommunitySummary>> {
  const response = await apiClient.get<ApiResponse<PaginatedResult<CommunitySummary>>>(
    '/communities',
    { params }
  );
  return extractData(response);
}

/**
 * GET /communities/me
 */
export async function getMyCommunities(): Promise<PaginatedResult<CommunitySummary>> {
  const response =
    await apiClient.get<ApiResponse<PaginatedResult<CommunitySummary>>>('/communities/me');
  return extractData(response);
}

/**
 * GET /communities/{slug}
 */
export async function getCommunityBySlug(slug: string): Promise<CommunityDetail> {
  const response = await apiClient.get<ApiResponse<CommunityDetail>>(`/communities/${slug}`);
  return extractData(response);
}

/**
 * POST /communities  (multipart/form-data)
 */
export async function createCommunity(data: CreateCommunityRequest): Promise<CommunityDetail> {
  const formData = new FormData();
  formData.append('name', data.name);
  formData.append('description', data.description);
  if (data.privacy !== undefined) {
    formData.append('isPrivate', String(data.privacy === 'Private'));
  }
  formData.append('categoryId', data.categoryId);
  data.rules?.forEach((rule) => formData.append(`rules`, rule));
  if (data.coverImage) {
    formData.append('coverImage', data.coverImage);
  }
  const response = await apiClient.post<ApiResponse<CommunityDetail>>('/communities', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return extractData(response);
}

/**
 * PUT /communities/{id}  (multipart/form-data)
 */
export async function updateCommunity(
  id: string,
  data: UpdateCommunityRequest
): Promise<CommunityDetail> {
  const formData = new FormData();
  if (data.name) formData.append('name', data.name);
  if (data.description) formData.append('description', data.description);
  if (data.privacy !== undefined) formData.append('isPrivate', String(data.privacy === 'Private'));
  if (data.rules) data.rules.forEach((rule) => formData.append(`rules`, rule));
  if (data.coverImage) {
    formData.append('coverImage', data.coverImage);
  }
  const response = await apiClient.put<ApiResponse<CommunityDetail>>(
    `/communities/${id}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return extractData(response);
}

/**
 * POST /communities/{id}/join
 */
export async function joinCommunity(id: string): Promise<void> {
  await apiClient.post(`/communities/${id}/join`);
}

/**
 * DELETE /communities/{id}/leave
 */
export async function leaveCommunity(id: string): Promise<void> {
  await apiClient.delete(`/communities/${id}/leave`);
}

/**
 * GET /communities/{id}/members
 */
export async function getCommunityMembers(
  id: string,
  params?: { page?: number; pageSize?: number }
): Promise<PaginatedResult<CommunityMember>> {
  const response = await apiClient.get<ApiResponse<PaginatedResult<CommunityMember>>>(
    `/communities/${id}/members`,
    { params }
  );
  return extractData(response);
}

/**
 * PUT /communities/{id}/members/{userId}/role
 */
export async function changeMemberRole(
  communityId: string,
  memberId: string,
  newRole: CommunityMemberRole
): Promise<void> {
  await apiClient.put(`/communities/${communityId}/members/${memberId}/role`, {
    role: newRole,
  });
}
