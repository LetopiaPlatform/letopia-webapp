import { formatNumberCount } from '@/lib/utils';
import { PanelCard } from '../PanelCard';

interface CommunityStatsProps {
  onlineCount?: number;
  memberCount: number;
  activeTaskCount?: number;
}

export function CommunityStats({ onlineCount, memberCount, activeTaskCount }: CommunityStatsProps) {
  return (
    <PanelCard>
      <h3 className="text-base font-bold text-[#261A2B]">Community Stats</h3>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-green-500 shrink-0" aria-hidden="true" />
          <span className="text-sm text-[#6F6673]">Online Now</span>
        </div>
        <span className="text-sm font-bold text-[#261A2B]">
          {formatNumberCount(onlineCount ?? 0)}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-[#6F6673]">Total Members</span>
        <span className="text-sm font-bold text-[#261A2B]">{formatNumberCount(memberCount)}</span>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-[#6F6673]">Active Tasks</span>
        <span className="text-sm font-bold text-[#261A2B]">{activeTaskCount ?? 0}</span>
      </div>
    </PanelCard>
  );
}
