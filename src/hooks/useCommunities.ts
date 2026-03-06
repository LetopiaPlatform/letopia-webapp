import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getCommunities,
  getMyCommunities,
  createCommunity,
  joinCommunity,
  updateCommunity,
  leaveCommunity,
  getCommunityMembers,
  changeMemberRole,
  getCommunityBySlug,
} from '@/api/communities.api';
import type {
  ListCommunitiesQuery,
  UpdateCommunityRequest,
  CommunityMemberRole,
} from '@/types/community.types';

export const communitiesQueryKey = {
  all: ['communities'] as const,
  mine: () => ['communities', 'mine'] as const,
  list: (params?: ListCommunitiesQuery) => ['communities', 'list', params] as const,
  detail: (slug: string) => ['communities', 'detail', slug] as const,
  members: (id: string) => ['communities', 'members', id] as const,
};

// GET /communities
export function useCommunities(params?: ListCommunitiesQuery) {
  return useQuery({
    queryKey: communitiesQueryKey.list(params),
    queryFn: () => getCommunities(params),
  });
}

// GET /communities/me
export function useMyCommunities() {
  return useQuery({
    queryKey: communitiesQueryKey.mine(),
    queryFn: getMyCommunities,
  });
}

// GET /communities/{slug}
export function useCommunityDetail(slug: string) {
  return useQuery({
    queryKey: communitiesQueryKey.detail(slug),
    queryFn: () => getCommunityBySlug(slug),
    enabled: !!slug,
  });
}

// GET /communities/{id}/members
export function useCommunityMembers(id: string) {
  return useQuery({
    queryKey: communitiesQueryKey.members(id),
    queryFn: () => getCommunityMembers(id),
    enabled: !!id,
  });
}

// POST /communities
export function useCreateCommunity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCommunity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: communitiesQueryKey.all });
      queryClient.invalidateQueries({ queryKey: communitiesQueryKey.mine() });
    },
  });
}

// POST /communities/{id}/join
export function useJoinCommunity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: joinCommunity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: communitiesQueryKey.all });
      queryClient.invalidateQueries({ queryKey: communitiesQueryKey.mine() });
    },
  });
}

// PUT /communities/{id}
export function useUpdateCommunity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCommunityRequest }) =>
      updateCommunity(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: communitiesQueryKey.all });
    },
  });
}

// DELETE /communities/{id}/leave
export function useLeaveCommunity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: leaveCommunity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: communitiesQueryKey.all });
      queryClient.invalidateQueries({ queryKey: communitiesQueryKey.mine() });
    },
  });
}

// PUT /communities/{id}/members/{userId}/role
export function useChangeMemberRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      communityId,
      userId,
      newRole,
    }: {
      communityId: string;
      userId: string;
      newRole: CommunityMemberRole;
    }) => changeMemberRole(communityId, userId, newRole),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: communitiesQueryKey.members(variables.communityId),
      });
    },
  });
}
