import { cn } from '@/lib/utils';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  image: string;
  imageClass: string;
  unlockedAt?: string;
  progress?: number;
}

interface AchievementCardProps {
  achievement: Achievement;
}

export function AchievementCard({ achievement }: AchievementCardProps) {
  const isUnlocked = !!achievement.unlockedAt;
  return (
    <div
      className={cn(
        'flex items-center gap-4 rounded-2xl p-6 shadow-[0px_2px_4px_0px_rgba(0,0,0,0.13)]',
        isUnlocked ? 'bg-[#F2EEF3]' : 'bg-white'
      )}
    >
      <div className="flex h-28 w-36 shrink-0 items-center justify-center">
        <img
          src={achievement.image}
          alt=""
          className={cn('object-contain', achievement.imageClass)}
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <h3 className="text-base font-semibold leading-6 text-[#1A1A1A]">{achievement.title}</h3>
        <p className="text-sm font-normal leading-5 text-[#6B7280]">{achievement.description}</p>
        {isUnlocked ? (
          <p className="mt-2 text-xs font-normal leading-4 text-[#1A1A1A]">
            Unlocked {achievement.unlockedAt}
          </p>
        ) : (
          <div className="mt-2 flex flex-col gap-1">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-[#824892]"
                style={{ width: `${achievement.progress ?? 0}%` }}
              />
            </div>
            <span className="text-xs font-normal leading-4 text-[#6B7280]">
              Progress: {achievement.progress ?? 0}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
