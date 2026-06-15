import { useState } from 'react';
import { CategoryIcon } from './CategoryIcon';
import type { TaskCategory } from '@/types/community-task-category.types';
import { CategoryDetailsDialog } from './CategoryDetailsDialog';

interface CategoryCardProps {
  category: TaskCategory;
  communityId: string;
}

export const CategoryCard = ({ category, communityId }: CategoryCardProps) => {
  const [open, setOpen] = useState(false);
  const tasksLeft = category.totalTasksCount - category.completedTasksCount;

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

            <span className="text-sm font-semibold text-[#938A97] shrink-0">
              {tasksLeft} tasks left
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
