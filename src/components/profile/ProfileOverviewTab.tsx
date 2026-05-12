import { ProfileActivityChart } from './ProfileActivityChart';
import { ProfileCommunitiesCard } from './ProfileCommunitiesCard';

export function ProfileOverviewTab() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ProfileActivityChart />
      <ProfileCommunitiesCard />
    </div>
  );
}
