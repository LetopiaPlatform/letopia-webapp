import apiClient from './client';
import type { ApiResponse, PaginatedQuery, PaginatedResult } from '@/types/api.types';
import type { Comment } from '@/types/comment.types';
import type {
  PostSummary,
  PostDetail,
  CreatePostRequest,
  UpdatePostRequest,
  ReactionType,
  ChannelPostsParams,
  PostReactionResponse,
} from '@/types/post.types';

export const postsApi = {
  getChannelPosts: (communityId: string, channelId: string, params?: ChannelPostsParams) =>
    apiClient.get<ApiResponse<PaginatedResult<PostSummary>>>(
      `/communities/${communityId}/channels/${channelId}/posts`,
      { params }
    ),

  getPinnedPosts: (communityId: string, channelId: string) =>
    apiClient.get<ApiResponse<PostSummary[]>>(
      `/communities/${communityId}/channels/${channelId}/posts/pinned`
    ),

  getById: (postId: string) => apiClient.get<ApiResponse<PostDetail>>(`/posts/${postId}`),

  create: (communityId: string, channelId: string, data: CreatePostRequest) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('content', data.content);
    formData.append('postType', data.postType);
    data.images?.forEach((img) => formData.append('Images', img));
    data.tags?.forEach((tag) => formData.append('Tags', tag));

    return apiClient.post<ApiResponse<PostDetail>>(
      `/communities/${communityId}/channels/${channelId}/posts`,
      formData,
      { headers: { 'Content-Type': null } }
    );
  },

  update: (postId: string, data: UpdatePostRequest) => {
    const formData = new FormData();
    if (data.title != null) formData.append('title', data.title);
    if (data.content != null) formData.append('content', data.content);
    data.addImages?.forEach((img) => formData.append('AddImages', img));
    data.removeImageUrls?.forEach((url) => formData.append('RemoveImageUrls', url));
    if (data.tags !== undefined) {
      if (data.tags === null) {
        formData.append('tags', '');
      } else {
        data.tags.forEach((tag) => formData.append('tags', tag));
      }
    }

    return apiClient.put<ApiResponse<PostDetail>>(`/posts/${postId}`, formData, {
      headers: { 'Content-Type': null },
    });
  },

  delete: (postId: string) => apiClient.delete<ApiResponse<null>>(`/posts/${postId}`),

  togglePin: (postId: string) => apiClient.patch<ApiResponse<null>>(`/posts/${postId}/pin`),

  addReaction: (postId: string, reactionType: ReactionType) =>
    apiClient.post<ApiResponse<PostReactionResponse>>(`/posts/${postId}/react`, { reactionType }),

  addComment: (postId: string, content: string) =>
    apiClient.post<ApiResponse<Comment>>(`/posts/${postId}/comments`, { content }),

  getComments: (postId: string, params?: PaginatedQuery) =>
    apiClient.get<ApiResponse<PaginatedResult<Comment>>>(`/posts/${postId}/comments`, { params }),
};
