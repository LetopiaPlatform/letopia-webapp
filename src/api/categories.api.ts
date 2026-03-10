import apiClient from './client';
import type { ApiResponse } from '@/types/api.types';
import type { Category } from '@/types/category.types';

export const categoriesApi = {
  getByType: (type: string) =>
    apiClient.get<ApiResponse<Category[]>>('/categories', {
      params: { type },
    }),
};
