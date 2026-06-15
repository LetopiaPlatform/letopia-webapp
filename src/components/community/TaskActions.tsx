import { HugeiconsIcon } from '@hugeicons/react';
import { PencilEdit01Icon, Delete01Icon } from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';

interface TaskActionsProps {
  onEdit: () => void;
  onDelete: () => void;
  iconClassName: string;
}

export const TaskActions = ({ onEdit, onDelete, iconClassName }: TaskActionsProps) => (
  <div className="flex items-center gap-1 shrink-0">
    <button
      onClick={onEdit}
      className="p-1 sm:p-1.5 rounded-lg hover:bg-black/5 transition-colors"
      aria-label="Edit task"
    >
      <HugeiconsIcon
        icon={PencilEdit01Icon}
        size={16}
        strokeWidth={1.5}
        className={iconClassName}
      />
    </button>
    <button
      onClick={onDelete}
      className="p-1 sm:p-1.5 rounded-lg hover:bg-red-50 transition-colors"
      aria-label="Delete task"
    >
      <HugeiconsIcon
        icon={Delete01Icon}
        size={16}
        strokeWidth={1.5}
        className={cn(iconClassName, 'hover:text-red-400')}
      />
    </button>
  </div>
);
