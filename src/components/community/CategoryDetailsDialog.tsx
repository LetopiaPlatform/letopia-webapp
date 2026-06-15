import { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Tick01Icon, AlertCircleIcon, Calendar01Icon } from '@hugeicons/core-free-icons';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { CategoryIcon } from './CategoryIcon';
import { useCommunityTasks } from '@/hooks/useCommunityTasks';
import { getTaskStatus } from '@/lib/community-task-utils';
import { formatDeadline } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { TaskCategory } from '@/types/community-task-category.types';

interface CategoryDetailsDialogProps {
  category: TaskCategory;
  communityId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const CategoryDetailsDialog = ({
  category,
  communityId,
  isOpen,
  onClose,
}: CategoryDetailsDialogProps) => {
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const { data } = useCommunityTasks(communityId, { status: 'All' });
  const allTasks = Array.isArray(data) ? data : [];
  const categoryTasks = allTasks.filter((t) =>
    t.categoryId ? t.categoryId === category.id : t.categoryName === category.name
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-sm p-0 overflow-hidden rounded-2xl">
        <div className="flex flex-col">
          {/* Header */}
          <div className="px-5 pt-5 pb-4 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <CategoryIcon colorHex={category.colorHex} iconKey={category.iconKey} />
              <div className="flex flex-col min-w-0">
                <span className="text-base font-bold text-[#261A2B] truncate">{category.name}</span>
                <span className="text-sm text-[#938A97]">
                  {category.completedTasksCount} of {category.totalTasksCount} completed
                </span>
              </div>
            </div>

            {/* Progress */}
            <div className="flex flex-col gap-1.5">
              <div className="w-full h-2.5 bg-[#F1EDF6] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${category.progressPercentage}%`,
                    backgroundColor: category.colorHex,
                  }}
                />
              </div>
              <span className="text-xs text-[#938A97] self-end">
                {category.progressPercentage}% Complete
              </span>
            </div>
          </div>

          {/* Tasks */}
          <div className="px-5 pb-5 flex flex-col gap-2">
            <span className="text-sm font-bold text-[#261A2B]">Tasks</span>
            <div className="flex flex-col max-h-72 overflow-y-auto scrollbar-hide">
              {categoryTasks.map((task) => {
                const status = getTaskStatus(task);
                const isExpanded = expandedTaskId === task.id;
                const hasDeadline = task.deadline && !task.deadline.startsWith('0001');

                return (
                  <div key={task.id}>
                    <div className="flex items-center justify-between gap-3 py-3">
                      {/* Checkbox */}
                      <div
                        className={cn(
                          'size-6 rounded-md border-2 flex items-center justify-center shrink-0',
                          task.isCompleted ? 'border-[#938A97]' : 'border-[#DBD5DE]'
                        )}
                      >
                        {task.isCompleted && (
                          <HugeiconsIcon
                            icon={Tick01Icon}
                            size={18}
                            color="#938A97"
                            strokeWidth={2}
                          />
                        )}
                      </div>

                      {/* Title */}
                      <span
                        className={cn(
                          'text-sm sm:text-base flex-1',
                          task.isCompleted
                            ? 'line-through text-[#938A97]'
                            : status === 'missed'
                              ? 'text-[#938A97]'
                              : 'text-[#261A2B] font-medium'
                        )}
                      >
                        {task.title}
                      </span>

                      {/* Info button */}
                      <button
                        onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                        className="shrink-0 focus-visible:outline-none p-1.5 -mr-1.5 cursor-pointer"
                      >
                        <HugeiconsIcon
                          icon={AlertCircleIcon}
                          size={25}
                          strokeWidth={1.5}
                          color={status === 'missed' ? category.colorHex : '#938A97'}
                        />
                      </button>
                    </div>

                    {/* Expanded details */}
                    {isExpanded && (hasDeadline || task.description) && (
                      <div className="mb-3 rounded-xl bg-[#F8F5F9] px-4 py-3 flex flex-col gap-3">
                        {hasDeadline && (
                          <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-1.5">
                              <HugeiconsIcon
                                icon={Calendar01Icon}
                                size={20}
                                color={category.colorHex}
                                strokeWidth={1.5}
                              />
                              <span className="text-xs sm:text-sm font-bold text-[#261A2B]">
                                Deadline
                              </span>
                            </div>
                            <span className="text-xs sm:text-sm text-[#938A97] ml-6">
                              {formatDeadline(task.deadline)}
                            </span>
                          </div>
                        )}
                        {hasDeadline && task.description && <div className="h-px bg-[#DBD5DE]" />}
                        {task.description && (
                          <div className="flex flex-col gap-0.5">
                            <span className="text-xs sm:text-sm font-bold text-[#261A2B]">
                              Description
                            </span>
                            <span className="text-xs sm:text-sm text-[#938A97] ml-6">
                              {task.description}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="h-px bg-[#F1EDF6]" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
