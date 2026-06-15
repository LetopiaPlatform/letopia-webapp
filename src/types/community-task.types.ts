export type TaskStatus = 'All' | 'Active' | 'Completed' | 'Missed';

export interface CommunityTask {
  id: string;
  title: string;
  description: string | null;
  deadline: string;
  categoryId: string | null;
  categoryName: string | null;
  colorHex: string;
  iconKey: string | null;
  isCompleted: boolean;
}

export interface CommunityProgress {
  totalTasks: number;
  completedTasks: number;
  progressPercentage: number;
  progressMessage: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  deadline?: string;
  categoryId?: string;
}

export interface UpdateTaskRequest {
  title: string;
  description?: string;
  deadline?: string;
  categoryId?: string;
}

export interface GetAllTasksParams {
  status?: TaskStatus;
}
