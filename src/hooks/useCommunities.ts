import { communitiesApi } from '@/api/communities.api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  CommunityListParams,
  CreateCommunityRequest,
  UpdateCommunityRequest,
} from '@/types/community.types';
import type { ApiResponse, PaginatedQuery } from '@/types/api.types';
import type { AxiosError } from 'axios';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export function useCommunitiesList(params: CommunityListParams) {
  return useQuery({
    queryKey: ['communities', params],
    queryFn: () => communitiesApi.list(params).then((res) => res.data),
  });
}

export function useCommunityBySlug(slug: string) {
  return useQuery({
    queryKey: ['communities', slug],
    queryFn: () => communitiesApi.getBySlug(slug).then((res) => res.data),
  });
}

export function useMyCommunities() {
  return useQuery({
    queryKey: ['communities', 'me'],
    queryFn: () => communitiesApi.getMyCommunities().then((res) => res.data),
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
    onError: (error: AxiosError<ApiResponse<null>>) => {
      const message = error.response?.data?.message ?? 'Failed to join community';
      toast.error(message);
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
    onError: (error: AxiosError<ApiResponse<null>>) => {
      const message = error.response?.data?.message ?? 'Failed to leave community';
      toast.error(message);
    },
  });
}

export function useCreateCommunity() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: CreateCommunityRequest) =>
      communitiesApi.create(data).then((res) => res.data),
    onSuccess: (response) => {
      if (response.data) {
        toast.success('Community created successfully!');
        queryClient.invalidateQueries({ queryKey: ['communities'] });
        navigate(`/communities/${response.data.slug}`);
      }
    },
    onError: (error: AxiosError<ApiResponse<null>>) => {
      const message = error.response?.data?.message ?? 'Failed to create community';
      toast.error(message);
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
    onError: (error: AxiosError<ApiResponse<null>>) => {
      const message = error.response?.data?.message ?? 'Failed to update community';
      toast.error(message);
    },
  });
}
