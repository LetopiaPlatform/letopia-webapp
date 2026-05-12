import { communitiesApi } from '@/api/communities.api';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  CommunityListParams,
  CreateCommunityRequest,
  UpdateCommunityRequest,
} from '@/types/community.types';
import type { PaginatedQuery } from '@/types/api.types';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export function useCommunitiesList(params: CommunityListParams) {
  return useQuery({
    queryKey: ['communities', params],
    queryFn: () => communitiesApi.list(params).then((res) => res.data),
    placeholderData: keepPreviousData,
  });
}

export function useCommunityBySlug(slug: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['communities', slug],
    queryFn: () => communitiesApi.getBySlug(slug).then((res) => res.data),
    enabled: options?.enabled,
  });
}

export function useMyCommunities(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['communities', 'me'],
    queryFn: () => communitiesApi.getMyCommunities().then((res) => res.data),
    enabled: options?.enabled,
  });
}

export function useCommunityMembers(id: string, params: PaginatedQuery) {
  return useQuery({
    queryKey: ['communities', id, 'members', params],
    queryFn: () => communitiesApi.getMembers(id, params).then((res) => res.data),
  });
}

export function useJoinCommunity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => communitiesApi.join(id),
    onSuccess: () => {
      toast.success('Joined community successfully!');
      queryClient.invalidateQueries({ queryKey: ['communities'] });
    },
  });
}

export function useLeaveCommunity() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (id: string) => communitiesApi.leave(id),
    onSuccess: () => {
      toast.success('Left community successfully');
      queryClient.invalidateQueries({ queryKey: ['communities'] });
      navigate('/communities');
    },
  });
}

export function useCreateCommunity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCommunityRequest) =>
      communitiesApi.create(data).then((res) => res.data),
    onSuccess: (response) => {
      if (response.data) {
        toast.success('Community created successfully!');
        queryClient.invalidateQueries({ queryKey: ['communities'] });
      }
    },
  });
}

export function useUpdateCommunity() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCommunityRequest }) =>
      communitiesApi.update(id, data).then((res) => res.data),
    onSuccess: (response) => {
      if (response.data) {
        toast.success('Community updated successfully!');
        queryClient.invalidateQueries({ queryKey: ['communities'] });
        navigate(`/communities/${response.data.slug}`);
      }
    },
  });
}
