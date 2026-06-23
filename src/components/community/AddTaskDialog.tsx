import { useCallback, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '../ui/dialog';
import { Plus } from 'lucide-react';

interface AddTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (title: string, deadline: Date) => void;
}

export const AddTaskDialog = ({ isOpen, onClose, onAdd }: AddTaskDialogProps) => {
  const [title, setTitle] = useState('');
  const [deadline, setDeadline] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && deadline) {
      onAdd(title.trim(), new Date(deadline));
      setTitle('');
      setDeadline('');
      onClose();
    }
  };

  const handleDialogClose = useCallback(() => {
    setTitle('');
    setDeadline('');
    onClose();
  }, [onClose]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleDialogClose();
      }}
    >
      <DialogContent className="bg-mauve-100 max-w-xs w-full rounded-2xl p-6">
        <DialogTitle className="sr-only">Create Task</DialogTitle>
        <DialogDescription className="sr-only">
          Fill in the details to create your new task
        </DialogDescription>
        <div>
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4 mt-8">
            {/* Title Input */}
            <div>
              <input
                id="task-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title"
                className="w-full px-4 py-3 bg-white border border-foreground/10 rounded-xl focus:outline-none "
                required
              />
            </div>

            {/* Deadline Input */}
            <div className="relative">
              <input
                id="task-deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full px-4 py-3 bg-white border border-foreground/10 rounded-xl focus:outline-none `}
                required
              />
              <img
                src="/icons/calendar.svg"
                alt="Calendar"
                className="size-6 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 md:py-3 px-4 border-2 border-primary text-primary rounded-xl font-semibold flex items-center justify-center gap-2 "
            >
              <Plus className="size-5 stroke-3 inline-block mr-2" />
              Add Task
            </button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
