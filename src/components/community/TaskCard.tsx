import type { CommunityTask } from '@/types/community-task.types';
import { CategoryIcon } from './CategoryIcon';
import { STATUS_STYLES } from '@/lib/constants';
import { getTaskStatus } from '@/lib/community-task-utils';
import { cn, formatDeadline } from '@/lib/utils';
import { TaskActions } from './TaskActions';
import { TaskCheckbox } from './TaskCheckbox';

interface TaskCardProps {
  task: CommunityTask;
  onToggle: (id: string, e: React.MouseEvent<HTMLButtonElement>) => void;
  onEdit: (task: CommunityTask) => void;
  onDelete: (id: string) => void;
  isOwner?: boolean;
}

const isValidDeadline = (deadline?: string) => !!deadline && !deadline.startsWith('0001');

export const TaskCard = ({ task, onToggle, onEdit, onDelete, isOwner = false }: TaskCardProps) => {
  const status = getTaskStatus(task);
  const styles = STATUS_STYLES[status];

  return (
    <div
      className={cn(
        'rounded-2xl px-3 py-2.5 sm:px-4 sm:py-3.5 flex items-center gap-2 sm:gap-3',
        styles.card
      )}
    >
      {/* Category Icon */}
      <CategoryIcon colorHex={task.colorHex} iconKey={task.iconKey} dimmed={status === 'missed'} />

      {/* Content */}
      <div className="flex flex-col gap-1 min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          {/* Title */}
          <h4 className={cn('font-medium truncate text-sm md:text-base', styles.textColor)}>
            {task.title}
          </h4>

          {/* Actions */}
          {isOwner && (
            <TaskActions
              onEdit={() => onEdit(task)}
              onDelete={() => onDelete(task.id)}
              iconClassName={styles.iconColor}
            />
          )}
        </div>

        {/* Deadline */}
        {isValidDeadline(task.deadline) && (
          <div
            className={cn(
              'flex items-center gap-1 text-[#938A97]',
              status === 'missed' && 'line-through'
            )}
          >
            <span className="text-xs">Deadline:</span>
            <span className={cn('text-xs', styles.deadlineColor)}>
              {formatDeadline(task.deadline)}
            </span>
          </div>
        )}

        <p className={cn('text-xs', styles.descriptionColor)}>{task.description}</p>
      </div>

      <TaskCheckbox isCompleted={task.isCompleted} onToggle={(e) => onToggle(task.id, e)} />
    </div>
  );
};
