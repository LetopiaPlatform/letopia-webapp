import apiClient from './client';
import { extractData } from '@/lib/api-utils';
import type { ApiResponse } from '@/types/api.types';
import type { CategoryDto } from '@/types/category.types';

// Get/categories?type=community

export async function getCategories(type?: string): Promise<CategoryDto[]> {
  const response = await apiClient.get<ApiResponse<CategoryDto[]>>('/categories', {
    params: type ? { type } : undefined,
  });
  return extractData(response);
}

// Get/categories/{slug}
export async function getCategoryBySlug(slug: string, type?: string): Promise<CategoryDto> {
  const response = await apiClient.get<ApiResponse<CategoryDto>>(`/categories/${slug}`, {
    params: type ? { type } : undefined,
  });
  return extractData(response);
}

// Post/categories
export async function createCategory(categoryData: {
  name: string;
  iconUrl?: string;
}): Promise<CategoryDto> {
  const response = await apiClient.post<ApiResponse<CategoryDto>>('/categories', categoryData);
  return extractData(response);
}

// Put/categories/{id}
export async function updateCategory(
  id: string,
  categoryData: {
    name?: string;
    iconUrl?: string;
  }
): Promise<CategoryDto> {
  const response = await apiClient.put<ApiResponse<CategoryDto>>(`/categories/${id}`, categoryData);
  return extractData(response);
}

// Delete/categories/{id}
export async function deleteCategory(id: string): Promise<void> {
  await apiClient.delete(`/categories/${id}`);
}
