import { cn } from '@/lib/utils';
import type { TaskStatus } from '@/types/community-task.types';

const FILTER_TABS: { label: string; value: TaskStatus }[] = [
  { label: 'All', value: 'All' },
  { label: 'Active', value: 'Active' },
  { label: 'Completed', value: 'Completed' },
  { label: 'Missed', value: 'Missed' },
];

interface TasksFilterProps {
  value: TaskStatus;
  onChange: (status: TaskStatus) => void;
}

export const TasksFilter = ({ value, onChange }: TasksFilterProps) => {
  return (
    <div className="flex items-center gap-1 bg-[#F1EDF6] rounded-2xl p-1 flex-1 max-w-lg">
      {FILTER_TABS.map((tab) => {
        const isActive = value === tab.value;
        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onChange(tab.value)}
            className={cn(
              'flex-1 h-7 sm:h-9 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200',
              isActive
                ? 'bg-[#FAF9FB] text-[#824892] shadow-sm'
                : 'text-[#938A97] hover:text-[#524B56]'
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};
