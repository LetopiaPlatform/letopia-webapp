import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { communityTaskCategoryApi } from '@/api/community-task-category.api';
import type {
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '@/types/community-task-category.types';
import { extractData, getErrorMessage } from '@/lib/api-utils';
import { toast } from 'sonner';

export const categoryKeys = {
  all: (communityId: string) => ['taskCategories', communityId] as const,
  detail: (communityId: string, categoryId: string) =>
    ['taskCategories', communityId, categoryId] as const,
};

export function useTaskCategories(communityId: string) {
  return useQuery({
    queryKey: categoryKeys.all(communityId),
    queryFn: () => communityTaskCategoryApi.getAll(communityId).then(extractData),
    enabled: !!communityId,
  });
}

export function useTaskCategoryById(communityId: string, categoryId: string) {
  return useQuery({
    queryKey: categoryKeys.detail(communityId, categoryId),
    queryFn: () => communityTaskCategoryApi.getById(communityId, categoryId).then(extractData),
    enabled: !!communityId && !!categoryId,
  });
}

export function useCreateCategory(communityId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryRequest) =>
      communityTaskCategoryApi.create(communityId, data).then(extractData),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: categoryKeys.all(communityId) });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error) || 'Failed to create category. Please try again.');
    },
  });
}

export function useUpdateCategory(communityId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ categoryId, data }: { categoryId: string; data: UpdateCategoryRequest }) =>
      communityTaskCategoryApi.update(categoryId, data).then(extractData),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: categoryKeys.all(communityId) });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error) || 'Failed to update category. Please try again.');
    },
  });
}

export function useDeleteCategory(communityId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (categoryId: string) =>
      communityTaskCategoryApi.delete(categoryId).then(extractData),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: categoryKeys.all(communityId) });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error) || 'Failed to delete category. Please try again.');
    },
  });
}
