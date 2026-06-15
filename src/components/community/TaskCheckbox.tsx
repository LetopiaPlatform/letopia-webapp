import { HugeiconsIcon } from '@hugeicons/react';
import { Tick01Icon } from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';

interface TaskCheckboxProps {
  isCompleted: boolean;
  onToggle: () => void;
}

export const TaskCheckbox = ({ isCompleted, onToggle }: TaskCheckboxProps) => (
  <button
    onClick={onToggle}
    className={cn(
      'size-6 sm:size-7 shrink-0 rounded-md sm:rounded-lg border-2 border-[#A39BA6]',
      'flex items-center justify-center transition-colors mt-0.5',
      'hover:border-primary'
    )}
    aria-label={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
    aria-pressed={isCompleted}
  >
    {isCompleted && <HugeiconsIcon icon={Tick01Icon} size={16} color="#A39BA6" strokeWidth={2} />}
  </button>
);
