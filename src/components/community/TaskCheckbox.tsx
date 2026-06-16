import { HugeiconsIcon } from '@hugeicons/react';
import { Tick01Icon } from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';

interface TaskCheckboxProps {
  isCompleted: boolean;
  onToggle: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const TaskCheckbox = ({ isCompleted, onToggle }: TaskCheckboxProps) => (
  <button
    onClick={onToggle}
    className={cn(
      'size-6 sm:size-7 shrink-0 rounded-md sm:rounded-lg border-2',
      'flex items-center justify-center transition-all duration-200 mt-0.5',
      isCompleted
        ? 'border-primary bg-primary/10 scale-105'
        : 'border-[#A39BA6] hover:border-primary hover:scale-105'
    )}
    aria-label={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
    aria-pressed={isCompleted}
  >
    {isCompleted && (
      <HugeiconsIcon
        icon={Tick01Icon}
        size={16}
        color="#824892"
        strokeWidth={2.5}
        className="animate-in zoom-in-50 duration-150"
      />
    )}
  </button>
);
