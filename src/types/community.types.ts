import type { PaginatedQuery } from './api.types';

export type CommunityRole = 'Member' | 'Moderator' | 'Owner';

export interface ChannelSummary {
  id: string;
  name: string;
  slug: string;
  channelType: string | null;
  description: string | null;
  postCount: number;
  isDefault: boolean;
  isArchived: boolean;
  allowMemberPosts: boolean;
  allowComments: boolean;
  displayOrder: number;
  subChannels: ChannelSummary[];
}

export interface CommunitySummary {
  id: string;
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  categoryName: string;
  iconUrl: string | null;
  coverImageUrl: string | null;
  memberCount: number;
  postCount: number;
  isPrivate: boolean;
  createdAt: string;
}

export interface CommunityDetail extends CommunitySummary {
  lastPostAt: string | null;
  isMember: boolean;
  userRole: CommunityRole | null;
  rules: string[];
  channels: ChannelSummary[];
}

export interface JoinedCommunitySummary {
  community: CommunitySummary;
  joinedAt: string;
}

export interface Member {
  userId: string;
  fullName: string;
  avatarUrl: string | null;
  role: CommunityRole;
  joinedAt: string;
}

export interface CreateCommunityRequest {
  name: string;
  description: string;
  categoryId: string;
  isPrivate?: boolean;
  coverImage?: File;
  rules?: string[];
}

export interface UpdateCommunityRequest {
  name?: string;
  description?: string;
  isPrivate?: boolean;
  coverImage?: File;
  rules?: string[];
}

export interface CommunityListParams extends PaginatedQuery {
  category?: string;
  search?: string;
  sortBy?: string;
}
