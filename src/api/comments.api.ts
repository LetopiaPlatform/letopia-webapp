import apiClient from './client';
import type { ApiResponse } from '@/types/api.types';
import type { Comment, UpdateCommentRequest, CommentReactionResponse } from '@/types/comment.types';
import type { ReactionType } from '@/types/post.types';

export const commentsApi = {
  update: (commentId: string, data: UpdateCommentRequest) =>
    apiClient.put<ApiResponse<Comment>>(`/comments/${commentId}`, data),

  delete: (commentId: string) => apiClient.delete<ApiResponse<null>>(`/comments/${commentId}`),

  addReaction: (commentId: string, reactionType: ReactionType) =>
    apiClient.post<ApiResponse<CommentReactionResponse>>(`/comments/${commentId}/react`, {
      reactionType,
    }),
};
