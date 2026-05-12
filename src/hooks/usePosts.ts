import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { postsApi } from '@/api/posts.api';
import type {
  ChannelPostsParams,
  CreatePostRequest,
  ReactionType,
  UpdatePostRequest,
} from '@/types/post.types';
import { toast } from 'sonner';
import type { AxiosError } from 'axios';
import type { ApiResponse, PaginatedQuery } from '@/types/api.types';

export const postKeys = {
  channel: (communityId: string, channelId: string, params?: ChannelPostsParams) =>
    ['posts', 'channel', communityId, channelId, params] as const,
  pinned: (communityId: string, channelId: string) =>
    ['posts', 'pinned', communityId, channelId] as const,
  detail: (postId: string) => ['posts', postId] as const,
  comments: (postId: string, params?: PaginatedQuery) =>
    ['posts', postId, 'comments', params] as const,
};

export function useChannelPosts(
  communityId: string,
  channelId: string,
  params?: ChannelPostsParams
) {
  return useQuery({
    queryKey: postKeys.channel(communityId, channelId, params),
    queryFn: () => postsApi.getChannelPosts(communityId, channelId, params).then((res) => res.data),
    enabled: !!communityId && !!channelId,
    placeholderData: keepPreviousData,
  });
}

export function usePinnedPosts(communityId: string, channelId: string) {
  return useQuery({
    queryKey: postKeys.pinned(communityId, channelId),
    queryFn: () => postsApi.getPinnedPosts(communityId, channelId).then((res) => res.data),
    enabled: !!communityId && !!channelId,
  });
}

export function usePostById(postId: string) {
  return useQuery({
    queryKey: postKeys.detail(postId),
    queryFn: () => postsApi.getById(postId).then((res) => res.data),
    enabled: !!postId,
  });
}

export function usePostComments(postId: string, params?: PaginatedQuery) {
  return useQuery({
    queryKey: postKeys.comments(postId, params),
    queryFn: () => postsApi.getComments(postId, params).then((res) => res.data),
    enabled: !!postId,
  });
}

export function useCreatePost(communityId: string, channelId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePostRequest) =>
      postsApi.create(communityId, channelId, data).then((res) => res.data),
    onSuccess: () => {
      toast.success('Post created successfully!');
      queryClient.invalidateQueries({ queryKey: postKeys.channel(communityId, channelId) });
    },
  });
}

export function useUpdatePost(communityId: string, channelId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, data }: { postId: string; data: UpdatePostRequest }) =>
      postsApi.update(postId, data).then((res) => res.data),
    onSuccess: (_, { postId }) => {
      toast.success('Post updated successfully!');
      queryClient.invalidateQueries({ queryKey: postKeys.channel(communityId, channelId) });
      queryClient.invalidateQueries({ queryKey: postKeys.detail(postId) });
    },
    onError: (error: AxiosError<ApiResponse<null>>) => {
      const validationMessage = error.response?.data?.errors?.[0];
      if (validationMessage) toast.error(validationMessage);
    },
  });
}

export function useDeletePost(communityId: string, channelId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) => postsApi.delete(postId).then((res) => res.data),
    onSuccess: (_, postId) => {
      toast.success('Post deleted.');
      queryClient.invalidateQueries({ queryKey: postKeys.channel(communityId, channelId) });
      queryClient.removeQueries({ queryKey: postKeys.detail(postId) });
    },
  });
}

export function useTogglePin(communityId: string, channelId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId }: { postId: string; isPinned: boolean }) => postsApi.togglePin(postId),
    onSuccess: (_, { isPinned }) => {
      toast.success(isPinned ? 'Post unpinned.' : 'Post pinned.');
      queryClient.invalidateQueries({ queryKey: postKeys.channel(communityId, channelId) });
      queryClient.invalidateQueries({ queryKey: postKeys.pinned(communityId, channelId) });
    },
  });
}

export function useAddReaction(communityId: string, channelId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, reactionType }: { postId: string; reactionType: ReactionType }) =>
      postsApi.addReaction(postId, reactionType).then((res) => res.data),
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: postKeys.channel(communityId, channelId) });
      queryClient.invalidateQueries({ queryKey: postKeys.detail(postId) });
    },
  });
}

export function useAddComment(postId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (content: string) => postsApi.addComment(postId, content).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.comments(postId) });
      queryClient.invalidateQueries({ queryKey: postKeys.detail(postId) });
    },
  });
}
