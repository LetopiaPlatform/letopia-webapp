import type { ReactionType } from './post.types';

export interface AuthorDto {
  id: string;
  fullName: string;
}

export interface Comment {
  id: string;
  postId: string;
  author: AuthorDto;
  content: string;
  upvotes: number;
  createdAt: string;
  updatedAt: string | null;
  currentUserReaction?: ReactionType;
}

export interface CreateCommentRequest {
  content: string;
}

export interface UpdateCommentRequest {
  content: string;
}

export interface CommentReactionResponse {
  upvotes: number;
}
