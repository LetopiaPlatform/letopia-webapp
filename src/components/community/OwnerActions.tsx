import { HugeiconsIcon } from '@hugeicons/react';
import { NoteAddIcon, ResourcesAddIcon } from '@hugeicons/core-free-icons';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { CreateTaskModal } from './CreateTaskModal';
import { CreateCategoryModal } from './CreateCategoryModal';

interface OwnerActionsProps {
  communityId: string;
}

export const OwnerActions = ({ communityId }: OwnerActionsProps) => {
  return (
    <div className="flex items-center justify-end gap-2 mb-5">
      {/* Add Task */}
      <Dialog>
        <DialogTrigger asChild>
          <button
            aria-label="Add Task"
            className="bg-primary/10 text-primary p-2 rounded-[10px] flex items-center gap-2"
          >
            <HugeiconsIcon icon={NoteAddIcon} size={18} strokeWidth={2} />
          </button>
        </DialogTrigger>
        <DialogContent
          showCloseButton
          className="p-0 border-0 max-w-sm overflow-y-auto max-h-[90vh]"
        >
          <CreateTaskModal communityId={communityId} />
        </DialogContent>
      </Dialog>

      {/* Add Category */}
      <Dialog>
        <DialogTrigger asChild>
          <button
            aria-label="Add Category"
            className="bg-primary/10 text-primary p-2 rounded-[10px] flex items-center gap-2"
          >
            <HugeiconsIcon icon={ResourcesAddIcon} size={18} strokeWidth={2} />
          </button>
        </DialogTrigger>
        <DialogContent
          showCloseButton
          className="p-0 border-0 max-w-sm overflow-y-auto max-h-[90vh]"
        >
          <CreateCategoryModal communityId={communityId} />
        </DialogContent>
      </Dialog>
    </div>
  );
};
