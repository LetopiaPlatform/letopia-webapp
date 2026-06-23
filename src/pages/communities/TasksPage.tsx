import { CategoryCard } from '@/components/community/CategoryCard';
import { CreateCategoryModal } from '@/components/community/CreateCategoryModal';
import { CreateTaskModal } from '@/components/community/CreateTaskModal';
import { OwnerActions } from '@/components/community/OwnerActions';
import { TaskCard } from '@/components/community/TaskCard';
import { TasksFilter } from '@/components/community/TasksFilter';
import { TasksProgress } from '@/components/community/TasksProgress';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';
import { EmptyState } from '@/components/EmptyState';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useTaskCategories } from '@/hooks/useCommunityTaskCategories';
import { useCommunityTasks, useDeleteTask, useToggleTask } from '@/hooks/useCommunityTasks';
import { fireConfettiFromElement } from '@/lib/confetti';
import { cn } from '@/lib/utils';
import type { CommunityTask, TaskStatus } from '@/types/community-task.types';
import type { CommunityDetail } from '@/types/community.types';
import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';

export const TasksPage = () => {
  const context = useOutletContext<{ community: CommunityDetail } | undefined>();
  const community = context?.community;

  const { mutate: toggleTask } = useToggleTask(community?.id ?? '');

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const { mutate: deleteTask, isPending: isDeleting } = useDeleteTask(community?.id ?? '');

  const [status, setStatus] = useState<TaskStatus>('All');
  const {
    data: filteredTaskData,
    isLoading,
    error,
  } = useCommunityTasks(community?.id ?? '', { status });
  const tasks = Array.isArray(filteredTaskData) ? filteredTaskData : [];

  const { data: allTasksData } = useCommunityTasks(community?.id ?? '', { status: 'All' });

  const allTasks = Array.isArray(allTasksData) ? allTasksData : [];

  const { data: categoriesData } = useTaskCategories(community?.id ?? '');
  const categories = (categoriesData ?? []).filter((cat) => cat.totalTasksCount > 0);

  const [editTarget, setEditTarget] = useState<CommunityTask | null>(null);

  if (!community) {
    return (
      <EmptyState title="Community not found" description="Unable to load community information." />
    );
  }

  function handleToggle(id: string, e: React.MouseEvent<HTMLButtonElement>) {
    const element = e.currentTarget;
    toggleTask(id, {
      onSuccess: (isCompleted) => {
        if (isCompleted) {
          fireConfettiFromElement(element);
        }
      },
    });
  }

  function handleDelete(id: string) {
    setDeleteTargetId(id);
  }

  function handleConfirmDelete() {
    if (!deleteTargetId) return;
    deleteTask(deleteTargetId, {
      onSuccess: () => setDeleteTargetId(null),
      onError: () => setDeleteTargetId(null),
    });
  }

  function handleEdit(task: CommunityTask) {
    setEditTarget(task);
  }

  return (
    <div className="sm:px-4">
      <div className="xl:hidden">
        {community.userRole === 'Owner' && <OwnerActions communityId={community.id} />}
      </div>

      <div
        className={cn(
          'xl:grid gap-5',
          community.userRole === 'Owner' ? 'xl:grid-cols-3' : 'xl:grid-cols-1'
        )}
      >
        <div className="col-span-2 flex flex-col gap-5">
          <TasksProgress communityId={community.id} />
          <div className="w-full flex items-center gap-4 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <div key={category.id} className="shrink-0 w-64">
                <CategoryCard
                  key={category.id}
                  category={category}
                  communityId={community.id}
                  tasks={allTasks}
                />
              </div>
            ))}
          </div>
          <div className="w-full flex items-center justify-between gap-3 sm:gap-5">
            <h2 className="text-base md:text-lg font-semibold text-[#261A2B]">Assignments</h2>
            <TasksFilter value={status} onChange={setStatus} />
          </div>
          <div className="flex flex-col gap-4 pb-4 scrollbar-hide">
            {error && (
              <div className="w-full text-destructive text-sm p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                Failed to load tasks. Please try again.
              </div>
            )}

            {isLoading && (
              <EmptyState
                title="Loading tasks..."
                description="Please wait while we load the tasks."
              />
            )}

            {!isLoading && !error && tasks.length === 0 ? (
              <EmptyState
                title={
                  status === 'All'
                    ? 'No tasks yet'
                    : status === 'Active'
                      ? 'No active tasks'
                      : status === 'Completed'
                        ? 'No completed tasks'
                        : 'No missed tasks'
                }
                description={
                  community.userRole === 'Owner'
                    ? status === 'All'
                      ? "Create tasks to organize your community's work."
                      : status === 'Active'
                        ? 'All tasks have been completed or no tasks added yet.'
                        : status === 'Completed'
                          ? 'No tasks have been completed yet. Keep going!'
                          : 'Great! No missed deadlines.'
                    : status === 'All'
                      ? 'No tasks have been assigned yet. Check back later.'
                      : status === 'Active'
                        ? 'No active tasks right now. Check back later.'
                        : status === 'Completed'
                          ? 'No tasks completed yet. Start working on your assignments!'
                          : 'Great! No missed deadlines.'
                }
              />
            ) : (
              tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggle={handleToggle}
                  isOwner={community.userRole === 'Owner'}
                />
              ))
            )}
          </div>
        </div>
        {community.userRole === 'Owner' && (
          <div className="hidden xl:flex xl:col-span-1 flex-col gap-5">
            <CreateTaskModal communityId={community.id} />
            <CreateCategoryModal communityId={community.id} />
          </div>
        )}
      </div>

      <Dialog open={!!editTarget} onOpenChange={(open) => !open && setEditTarget(null)}>
        <DialogContent className="p-0 border-0 max-w-sm overflow-y-auto max-h-[90vh]">
          {editTarget && (
            <CreateTaskModal
              communityId={community.id}
              editTarget={editTarget}
              onSuccess={() => setEditTarget(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        isOpen={!!deleteTargetId}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTargetId(null)}
        isLoading={isDeleting}
      />
    </div>
  );
};
