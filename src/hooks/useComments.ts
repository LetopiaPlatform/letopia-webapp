import { useMutation, useQueryClient } from '@tanstack/react-query';
import { commentsApi } from '@/api/comments.api';
import type { UpdateCommentRequest } from '@/types/comment.types';
import type { ReactionType } from '@/types/post.types';
import type { AxiosError } from 'axios';
import type { ApiResponse } from '@/types/api.types';
import { toast } from 'sonner';
import { postKeys } from './usePosts';

export function useUpdateComment(postId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ commentId, data }: { commentId: string; data: UpdateCommentRequest }) =>
      commentsApi.update(commentId, data).then((res) => res.data),
    onSuccess: () => {
      toast.success('Comment updated!');
      queryClient.invalidateQueries({ queryKey: postKeys.comments(postId) });
    },
    onError: (error: AxiosError<ApiResponse<null>>) => {
      const validationMessage = error.response?.data?.errors?.[0];
      if (validationMessage) toast.error(validationMessage);
    },
  });
}

export function useDeleteComment(postId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commentId: string) => commentsApi.delete(commentId).then((res) => res.data),
    onSuccess: () => {
      toast.success('Comment deleted.');
      queryClient.invalidateQueries({ queryKey: postKeys.comments(postId) });
      queryClient.invalidateQueries({ queryKey: postKeys.detail(postId) });
    },
  });
}

export function useAddCommentReaction(postId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ commentId, reactionType }: { commentId: string; reactionType: ReactionType }) =>
      commentsApi.addReaction(commentId, reactionType).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.comments(postId) });
    },
  });
}
