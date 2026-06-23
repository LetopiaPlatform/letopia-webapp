import { FeatureGate } from '@/components/shared/FeatureGate';
import { PROFILE_STRINGS } from '@/lib/constants';

export function ProfileProjectsTab() {
  return (
    <FeatureGate feature="profileProjectsTab">
      <div className="rounded-3xl bg-white p-10 text-center text-sm text-[#6B7280] shadow-sm">
        {PROFILE_STRINGS.EMPTY.PROJECTS_SOON}
      </div>
    </FeatureGate>
  );
}
