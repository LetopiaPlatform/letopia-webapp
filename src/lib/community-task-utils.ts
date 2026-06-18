import type { CommunityTask } from '@/types/community-task.types';
import type { TaskStatusKey } from './constants';

export function getTaskStatus(task: CommunityTask): TaskStatusKey {
  if (task.isCompleted) return 'completed';

  const hasDeadline = task.deadline && !task.deadline.startsWith('0001');

  if (hasDeadline && new Date(task.deadline) < new Date()) return 'missed';

  return 'active';
}

export function isTaskStillOpen(task: CommunityTask) {
  const hasDeadline = task.deadline && !task.deadline.startsWith('0001');

  if (!hasDeadline) return true;

  return new Date(task.deadline) >= new Date();
}

export function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}
