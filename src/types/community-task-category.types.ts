export interface TaskCategory {
  id: string;
  name: string;
  colorHex: string;
  iconKey: string | null;
  totalTasksCount: number;
  completedTasksCount: number;
  progressPercentage: number;
}

export interface CreateCategoryRequest {
  name: string;
  colorHex?: string;
  iconKey?: string;
}

export interface UpdateCategoryRequest {
  name: string;
  colorHex: string;
  iconKey?: string;
}
