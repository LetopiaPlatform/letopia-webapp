import { useAuthContext } from '@/context/AuthContext';
import { useMyCommunities } from '@/hooks/useCommunities';
import { formatNumberCount } from '@/lib/utils';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreateCommunityDialog } from './community/CreateCommunityDialog';
import { CREATE_OPTIONS, type CreateOptionId } from '@/lib/constants';
import { Plus } from 'lucide-react';
import { EmptyState } from './EmptyState';
import { AddTaskDialog } from './community/AddTaskDialog';
import { TaskCard } from './TaskCard';

interface SidebarContentProps {
  activeSection: string;
}

export const SidebarContent = ({ activeSection }: SidebarContentProps) => {
  const renderContent = () => {
    switch (activeSection) {
      case 'create':
        return <CreateSection />;
      case 'communities':
        return <CommunitiesSection />;
      case 'tasks':
        return <ToDoSection />;
      case 'saved':
        return <SavedSection />;
      case 'settings':
        return <SettingsSection />;
      default:
        return null;
    }
  };

  return <div className="h-full py-6 px-4">{renderContent()}</div>;
};

const CreateSection = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { isAuthenticated } = useAuthContext();
  const navigate = useNavigate();

  const handleOptionClick = (optionId: CreateOptionId, requiresAuth: boolean) => {
    if (requiresAuth && !isAuthenticated) {
      navigate('/login', { state: { redirectTo: '/communities' } });
      return;
    }

    switch (optionId) {
      case 'community':
        setIsDialogOpen(true);
        break;
      case 'project':
        // TODO: Open project creation dialog
        break;
      case 'roadmap':
        // TODO: Navigate to roadmap creation
        break;
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {CREATE_OPTIONS.map((option) => (
        <CreateOptionCard
          key={option.id}
          title={option.title}
          description={option.description}
          onClick={() => handleOptionClick(option.id, option.requireAuth)}
        />
      ))}
      <CreateCommunityDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
    </div>
  );
};

interface CreateOptionCardProps {
  title: string;
  description: string;
  onClick: () => void;
}

const CreateOptionCard = ({ title, description, onClick }: CreateOptionCardProps) => (
  <div
    onClick={onClick}
    className="w-full p-4 flex flex-col gap-1 bg-white rounded-2xl cursor-pointer shadow-md hover:scale-[1.02] transition-all duration-200"
  >
    <h3 className="font-semibold text-gray-800 capitalize">{title}</h3>
    <span className="text-sm text-muted-foreground">{description}</span>
  </div>
);

const CommunitiesSection = () => {
  const { data, isLoading } = useMyCommunities();
  const navigate = useNavigate();

  return (
    <div>
      <h2 className="text-xl font-bold mb-6 text-gray-800">My Communities</h2>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : !data?.data || data.data.length === 0 ? (
        <EmptyState
          title="No joined communities"
          description="Discover communities and connect with people!"
        />
      ) : (
        <div className="flex flex-col items-center gap-3 overflow-y-auto max-h-[80vh] scrollbar-hide">
          {data.data.map((community) => (
            <div
              key={community.community.id}
              onClick={() => navigate(`/communities/${community.community.slug}`)}
              className="w-full py-2 md:py-4 px-3 bg-white rounded-lg md:rounded-2xl cursor-pointer shadow-md hover:scale-[1.02] transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                {/* Community Cover Image */}
                {community.community.coverImageUrl ? (
                  <img
                    src={community.community.coverImageUrl}
                    alt={community.community.name}
                    className="size-10 md:size-12 lg:size-14 rounded-full object-cover"
                  />
                ) : (
                  <div className="size-10 md:size-12 lg:size-14 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary font-agbalumo text-lg">
                      {community.community.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}

                {/* Community Details */}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 line-clamp-1">
                    {community.community.name}
                  </h3>
                  <span className="text-sm text-muted-foreground">
                    {formatNumberCount(community.community.memberCount)} members
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface Task {
  id: string;
  title: string;
  deadline: Date;
  completed: boolean;
}
const ToDoSection = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const pendingTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task))
    );
  };

  const addTask = (title: string, deadline: Date) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      deadline,
      completed: false,
    };
    setTasks((prev) => [...prev, newTask]);
    setIsDialogOpen(false);
  };

  return (
    <div className="flex flex-col h-full gap-6 md:gap-8">
      <h2 className="text-xl font-bold text-gray-800">To-do</h2>

      {/* Tasks List */}
      <div className="space-y-5">
        {/* Pending Tasks */}
        {pendingTasks.length > 0 && (
          <div className="space-y-3 ">
            <h3 className="text-sm font-semibold text-primary uppercase tracking-wide">
              Pending ({pendingTasks.length})
            </h3>
            <div className="space-y-6 overflow-y-auto scrollbar-hide max-h-72">
              {pendingTasks.map((task) => (
                <TaskCard key={task.id} task={task} onToggle={toggleTask} />
              ))}
            </div>
          </div>
        )}

        {/* Completed Tasks */}
        {completedTasks.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-primary uppercase tracking-wide">
              Completed ({completedTasks.length})
            </h3>
            <div className="space-y-3 overflow-y-auto max-h-72 scrollbar-hide">
              {completedTasks.map((task) => (
                <TaskCard key={task.id} task={task} onToggle={toggleTask} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {tasks.length === 0 && (
          <EmptyState title="No tasks yet!" description="Add your first task to get started" />
        )}
      </div>

      {/* Add Task Button */}
      <button
        onClick={() => setIsDialogOpen(true)}
        className="w-full mb-2 py-1.5 md:py-2 px-4 border-2 border-primary text-primary rounded-lg md:rounded-xl text-sm md:text-lg font-semibold flex items-center justify-center gap-2 cursor-pointer"
      >
        <Plus className="size-4 md:size-5 stroke-3" />
        Add Task
      </button>

      {/* Add Task Dialog */}
      <AddTaskDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} onAdd={addTask} />
    </div>
  );
};

const SavedSection = () => (
  <div>
    <h2 className="text-xl font-bold mb-4 text-gray-800">Saved</h2>
  </div>
);

const SettingsSection = () => (
  <div>
    <h2 className="text-xl font-bold mb-4 text-gray-800">Settings</h2>
  </div>
);
