import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { postsApi } from '@/api/posts.api';
import type {
  ChannelPostsParams,
  CreatePostRequest,
  PostSummary,
  ReactionType,
  UpdatePostRequest,
} from '@/types/post.types';
import { toast } from 'sonner';
import type { AxiosError } from 'axios';
import type { ApiResponse, PaginatedQuery, PaginatedResult } from '@/types/api.types';
import type { Comment } from '@/types/comment.types';
import { useAuthContext } from '@/context/AuthContext';

export const postKeys = {
  channel: (communityId: string, channelId: string, params?: ChannelPostsParams) =>
    ['posts', 'channel', communityId, channelId, params] as const,
  pinned: (communityId: string, channelId: string) =>
    ['posts', 'pinned', communityId, channelId] as const,
  detail: (postId: string) => ['posts', postId] as const,
  comments: (postId: string, params?: PaginatedQuery) =>
    ['posts', postId, 'comments', params ?? null] as const,
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
    onError: (error: AxiosError<ApiResponse<null>>) => {
      const errorMessage = error.response?.data?.errors?.[0] || 'Something went wrong!';
      toast.error(errorMessage);
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

export function useAddReaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, reactionType }: { postId: string; reactionType: ReactionType }) =>
      postsApi.addReaction(postId, reactionType).then((res) => res.data),
    onMutate: async ({ postId, reactionType }) => {
      const partialKey = ['posts', 'channel'];

      await queryClient.cancelQueries({ queryKey: partialKey, exact: false });

      const previousEntries = queryClient.getQueriesData<ApiResponse<PaginatedResult<PostSummary>>>(
        {
          queryKey: partialKey,
          exact: false,
        }
      );

      const cachedPost = previousEntries
        .flatMap(([, data]) => data?.data?.items ?? [])
        .find((p) => p.id === postId);
      const wasAlreadyReacted = cachedPost?.currentUserReaction === reactionType;
      const nextReaction: ReactionType | null = wasAlreadyReacted ? null : reactionType;
      const nextUpvotes = (cachedPost?.upvotes ?? 0) + (wasAlreadyReacted ? -1 : 1);

      queryClient.setQueriesData<ApiResponse<PaginatedResult<PostSummary>>>(
        { queryKey: partialKey, exact: false },
        (old) => {
          if (!old?.data?.items) return old;
          return {
            ...old,
            data: {
              ...old.data,
              items: old.data.items.map((post) =>
                post.id === postId
                  ? { ...post, upvotes: nextUpvotes, currentUserReaction: nextReaction }
                  : post
              ),
            },
          };
        }
      );

      return { previousEntries };
    },
    onSuccess: (response, { postId }) => {
      if (!response.data) return;
      const { upvotes } = response.data;
      queryClient.setQueriesData<ApiResponse<PaginatedResult<PostSummary>>>(
        { queryKey: ['posts', 'channel'], exact: false },
        (old) => {
          if (!old?.data?.items) return old;
          return {
            ...old,
            data: {
              ...old.data,
              items: old.data.items.map((post) =>
                post.id === postId ? { ...post, upvotes } : post
              ),
            },
          };
        }
      );
      queryClient.invalidateQueries({ queryKey: postKeys.detail(postId) });
    },
    onError: (_err, _vars, context) => {
      context?.previousEntries.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
    },
  });
}

export function useAddComment(postId: string) {
  const queryClient = useQueryClient();
  const { user } = useAuthContext();

  return useMutation({
    mutationFn: (content: string) => postsApi.addComment(postId, content).then((res) => res.data),
    onSuccess: (response) => {
      const newComment = response.data;
      if (newComment) {
        const patchedComment = {
          ...newComment,
          author: newComment.author ?? {
            id: user?.id,
            fullName: user?.fullName,
            avatarUrl: user?.avatarUrl,
            communityRole: 'Member',
          },
        };

        queryClient.setQueryData<ApiResponse<PaginatedResult<Comment>>>(
          postKeys.comments(postId),
          (old) => {
            if (!old?.data?.items) return old;
            return {
              ...old,
              data: {
                ...old.data,
                items: [...old.data.items, patchedComment],
                totalItems: (old.data.totalItems ?? 0) + 1,
              },
            };
          }
        );
      }
    },
  });
}
