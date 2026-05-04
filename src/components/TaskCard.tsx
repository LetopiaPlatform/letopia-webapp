import { format } from 'date-fns';

interface Task {
  id: string;
  title: string;
  deadline: Date;
  completed: boolean;
}

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
}

export const TaskCard = ({ task, onToggle }: TaskCardProps) => {
  const isOverdue = !task.completed && new Date() > task.deadline;

  return (
    <div className={`${task.completed ? 'opacity-80' : ''}`}>
      <div className="flex items-center gap-3">
        {/* Checkbox */}
        <button
          onClick={() => onToggle(task.id)}
          className={`size-6 md:size-7 shrink-0 rounded-md md:rounded-lg border-2 flex items-center justify-center transition mt-0.5 ${
            task.completed ? 'border-[#A39BA6]' : 'border-foreground/50 hover:border-primary'
          }`}
        >
          {task.completed && (
            <img src="/icons/check.svg" alt="Completed" className="size-3 md:size-3.5" />
          )}
        </button>

        {/* Content */}
        <div className="flex-col gap-1.5 md:gap3 min-w-0">
          <h4
            className={`font-medium ${
              task.completed ? 'line-through text-[#A39BA6]' : 'text-gray-800'
            }`}
          >
            {task.title}
          </h4>

          {/* Deadline */}
          <div className="flex items-center gap-1.5">
            <p
              className={`text-sm capitalize ${
                isOverdue ? 'text-red-500' : task.completed ? 'text-foreground/50' : 'text-gray-600'
              }`}
            >
              deadline:
            </p>
            <span
              className={`text-xs ${
                isOverdue
                  ? 'text-red-500 font-medium'
                  : task.completed
                    ? 'text-foreground/50'
                    : 'text-gray-600'
              }`}
            >
              {format(task.deadline, 'MM/dd/yyyy')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
