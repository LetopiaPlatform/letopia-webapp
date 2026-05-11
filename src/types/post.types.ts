import type { PaginatedQuery } from './api.types';
import type { CommunityRole } from './community.types';

export type PostType = 'Discussion' | 'Announcement';

export type ReactionType = 'Upvote' | 'Downvote';

export interface AuthorInfo {
  id: string;
  fullName: string;
  communityRole: CommunityRole;
}

export interface PostSummary {
  id: string;
  title: string;
  content: string;
  imageUrls: string[];
  authorInfo: AuthorInfo;
  postType: PostType;
  upvotes: number;
  commentCount: number;
  viewsCount: number;
  isPinned: boolean;
  createdAt: string;
  tags: string[];
}

export interface PostDetail extends PostSummary {
  currentUserReaction?: ReactionType;
  updatedAt: string | null;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  postType: PostType;
  images?: File[];
  tags?: string[];
}

export interface UpdatePostRequest {
  title?: string;
  content?: string;
  addImages?: File[];
  removeImageUrls?: string[];
  tags?: string[] | null;
}

export interface ChannelPostsParams extends PaginatedQuery {
  search?: string;
  sortBy?: string;
}

export interface PostReactionResponse {
  upvotes: number;
}
