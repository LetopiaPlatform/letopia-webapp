import type { PaginatedQuery } from './api.types';

export type CommunityPrivacy = 'Public' | 'Private';
export type CommunityMemberRole = 'Member' | 'Moderator' | 'Admin';
export type JoinStatus = 'none' | 'pending' | 'joined';

export interface CommunityCategory {
  id: string;
  name: string;
  slug: string;
}

export interface CommunitySummary {
  id: string;
  name: string;
  slug: string;
  description: string;
  coverImageUrl?: string;
  privacy: CommunityPrivacy;
  memberCount: number;
  onlineMemberCount?: number;
  category: CommunityCategory;
  joinStatus: JoinStatus;
}

export interface CommunityDetail extends CommunitySummary {
  rules: string[];
}

export interface CommunityMember {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  role: CommunityMemberRole;
  joinedAt: string;
}

export interface CreateCommunityRequest {
  name: string;
  description: string;
  coverImage?: File;
  privacy?: CommunityPrivacy;
  categoryId: string;
  rules?: string[];
}

export interface UpdateCommunityRequest {
  name?: string;
  description?: string;
  coverImage?: File;
  privacy?: CommunityPrivacy;
  rules?: string[];
}

export interface ListCommunitiesQuery extends PaginatedQuery {
  search?: string;
  categorySlug?: string;
  privacy?: CommunityPrivacy;
}
