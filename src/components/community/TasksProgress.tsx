import { useTodayProgress } from '@/hooks/useCommunityTasks';
import { ArrowRight } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

interface TasksProgressProps {
  communityId: string;
}

export const TasksProgress = ({ communityId }: TasksProgressProps) => {
  const { data: progress, isLoading } = useTodayProgress(communityId);
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();

  if (isLoading || !progress) return null;

  const { progressPercentage, progressMessage } = progress;

  return (
    <div className="relative w-full rounded-2xl p-px bg-linear-to-b from-[#e4e4e4] via-[#FAF9FB] to-[#FAF9FB]">
      <div className="w-full bg-[#FAF9FB] rounded-2xl px-3 py-3 sm:px-5 sm:py-4 flex items-center justify-between gap-3 sm:gap-5">
        <div className="flex flex-col items-start gap-2 sm:gap-3 min-w-0 h-full">
          <h3 className="text-lg sm:text-2xl md:text-3xl font-bold text-[#261A2B]">
            Today's Progress
          </h3>
          <p className="text-xs sm:text-sm text-[#938A97]">{progressMessage}</p>
          <button
            onClick={() => navigate(`/communities/${slug}/focus`)}
            className="self-start py-2 sm:py-2.5 px-3 sm:px-4 flex items-center gap-2 sm:gap-3 rounded-xl text-white text-xs sm:text-base md:text-[17px] font-normal capitalize bg-primary"
          >
            start focus session
            <ArrowRight className="size-4 sm:size-5 md:size-6" />
          </button>
        </div>

        <div
          className="relative shrink-0 rounded-full flex items-center justify-center size-[90px] sm:size-[130px] md:size-[150px]"
          style={{
            background: `conic-gradient(#824892 ${progressPercentage}%, #F1EDF6 ${progressPercentage}%)`,
          }}
        >
          <div className="rounded-full bg-[#FAF9FB] flex items-center justify-center size-[76px] sm:size-[110px] md:size-[130px]">
            <span className="text-base sm:text-2xl md:text-3xl font-medium text-primary">
              {progressPercentage}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
