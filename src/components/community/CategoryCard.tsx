import { useState } from 'react';
import { CategoryIcon } from './CategoryIcon';
import type { TaskCategory } from '@/types/community-task-category.types';
import type { CommunityTask } from '@/types/community-task.types';
import { CategoryDetailsDialog } from './CategoryDetailsDialog';
import { getTaskStatus } from '@/lib/community-task-utils';

interface CategoryCardProps {
  category: TaskCategory;
  communityId: string;
  tasks: CommunityTask[];
}

export const CategoryCard = ({ category, communityId, tasks }: CategoryCardProps) => {
  const [open, setOpen] = useState(false);

  const categoryTasks = tasks.filter((task) => task.categoryName === category.name);

  const missedCount = categoryTasks.filter((task) => getTaskStatus(task) === 'missed').length;

  const tasksLeft = category.totalTasksCount - category.completedTasksCount;

  const statusMessage =
    missedCount > 0
      ? `${missedCount} missed task${missedCount > 1 ? 's' : ''}`
      : `${tasksLeft} task${tasksLeft !== 1 ? 's' : ''} left`;

  return (
    <>
      <div
        className="bg-white border rounded-xl p-4 sm:p-5 cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <div className="flex flex-col gap-3 sm:gap-4 min-w-0 flex-1">
          {/* category + tasks left */}
          <div className="flex items-center justify-between">
            <CategoryIcon colorHex={category.colorHex} iconKey={category.iconKey} />

            <span
              className={`text-sm font-semibold shrink-0 ${
                missedCount > 0 ? 'text-red-500' : 'text-[#938A97]'
              }`}
            >
              {statusMessage}
            </span>
          </div>

          <span className="text-base sm:text-lg font-bold text-[#261A2B] truncate">
            {category.name}
          </span>

          {/* Progress bar */}
          <div className="w-full h-2 bg-[#F1EDF6] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${category.progressPercentage}%`,
                backgroundColor: category.colorHex,
              }}
            />
          </div>
        </div>
      </div>
      <CategoryDetailsDialog
        category={category}
        communityId={communityId}
        isOpen={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
};
