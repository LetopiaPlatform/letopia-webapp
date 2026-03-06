import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
} from '@/api/categories.api';

export const categoryQueryKey = {
  all: ['categories'] as const,
  list: (type?: string) => ['categories', 'list', { type }] as const,
  detail: (slug: string) => ['categories', 'detail', slug] as const,
};

export function useCategoriesList(type?: string) {
  return useQuery({
    queryKey: categoryQueryKey.list(type),
    queryFn: () => getCategories(type),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function useCategoryBySlug(slug: string, type?: string) {
  return useQuery({
    queryKey: categoryQueryKey.detail(slug),
    queryFn: () => getCategoryBySlug(slug, type),
    enabled: !!slug,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryQueryKey.all });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name?: string; iconUrl?: string } }) =>
      updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryQueryKey.all });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryQueryKey.all });
    },
  });
}
