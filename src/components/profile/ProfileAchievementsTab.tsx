import { FeatureGate } from '@/components/shared/FeatureGate';
import { AchievementCard } from './AchievementCard';
import { MOCK_ACHIEVEMENTS } from './achievements.mock';

export function ProfileAchievementsTab() {
  const unlockedCount = MOCK_ACHIEVEMENTS.filter((a) => a.unlockedAt).length;

  return (
    <FeatureGate feature="profileAchievementsTab">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-[#1A1A1A]">
          Achievements ({unlockedCount}/{MOCK_ACHIEVEMENTS.length})
        </h2>
        <div className="grid gap-4 lg:grid-cols-2">
          {MOCK_ACHIEVEMENTS.map((a) => (
            <AchievementCard key={a.id} achievement={a} />
          ))}
        </div>
      </div>
    </FeatureGate>
  );
}
