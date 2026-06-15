import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { communityTaskApi } from '@/api/community-task.api';
import type {
  CreateTaskRequest,
  UpdateTaskRequest,
  GetAllTasksParams,
} from '@/types/community-task.types';
import { extractData, getErrorMessage } from '@/lib/api-utils';
import { toast } from 'sonner';

const taskKeys = {
  all: (communityId: string, params?: GetAllTasksParams) =>
    ['communityTasks', communityId, params] as const,
  progress: (communityId: string) => ['communityTasks', communityId, 'progress'] as const,
};

export function useCommunityTasks(communityId: string, params?: GetAllTasksParams) {
  return useQuery({
    queryKey: taskKeys.all(communityId, params),
    queryFn: () => communityTaskApi.getAll(communityId, params).then(extractData),
    enabled: !!communityId,
  });
}

export function useTodayProgress(communityId: string) {
  return useQuery({
    queryKey: taskKeys.progress(communityId),
    queryFn: () => communityTaskApi.getTodayProgress(communityId).then(extractData),
    enabled: !!communityId,
  });
}

export function useCreateTask(communityId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaskRequest) =>
      communityTaskApi.create(communityId, data).then(extractData),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['communityTasks', communityId] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error) || 'Failed to create task. Please try again.');
    },
  });
}

export function useUpdateTask(communityId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, data }: { taskId: string; data: UpdateTaskRequest }) =>
      communityTaskApi.update(taskId, data).then(extractData),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['communityTasks', communityId] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error) || 'Failed to update task. Please try again.');
    },
  });
}

export function useDeleteTask(communityId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => communityTaskApi.delete(taskId).then(extractData),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['communityTasks', communityId] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error) || 'Failed to delete task. Please try again.');
    },
  });
}

export function useToggleTask(communityId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => communityTaskApi.toggle(taskId).then(extractData),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['communityTasks', communityId] });
      qc.invalidateQueries({ queryKey: taskKeys.progress(communityId) });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error) || 'Failed to toggle task. Please try again.');
    },
  });
}
