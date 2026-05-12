import type { CreateCommunityRequest } from '@/types/community.types';
import type { CreateCommunityFormData } from './validators';

export function mapFormDataToRequest(data: CreateCommunityFormData): CreateCommunityRequest {
  return {
    name: data.name,
    description: data.description,
    categoryId: data.categoryId,
    isPrivate: data.isPrivate,
    rules: data.rules,
    coverImage: data.coverImage,
  };
}
