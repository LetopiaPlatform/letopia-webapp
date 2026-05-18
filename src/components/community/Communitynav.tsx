import { cn } from '@/lib/utils';
import { useNavigate, useLocation } from 'react-router-dom';
import { COMMUNITY_LINKS } from '@/lib/constants';
import { PanelCard } from '../PanelCard';
import { LogOut, Plus } from 'lucide-react';
import type { CommunityRole, Member } from '@/types/community.types';
import { LeaveCommunityDialog } from './LeaveCommunityDialog';
import { useState } from 'react';
import { useChangeMemberRole, useLeaveCommunity, useJoinCommunity } from '@/hooks/useCommunities';

interface CommunityNavProps {
  communitySlug: string;
  communityId: string;
  viewerRole: CommunityRole;
  isOnlyMember: boolean;
  members: Member[];
  currentUserId?: string;
  isMember: boolean;
}

export function CommunityNav({
  communitySlug,
  communityId,
  viewerRole,
  isOnlyMember,
  members,
  isMember,
}: CommunityNavProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);

  const { mutate: leaveCommunity, isPending: leavePending } = useLeaveCommunity();
  const { mutate: joinCommunity, isPending: joinPending } = useJoinCommunity();
  const { mutate: changeRole, isPending: isTransferring } = useChangeMemberRole();

  const handleLeave = () => {
    leaveCommunity(communityId, {
      onSuccess: () => {
        setShowLeaveDialog(false);
        navigate('/communities');
      },
    });
  };

  const handleJoin = () => {
    joinCommunity(communityId, {
      onSuccess: () => {
        navigate(`/communities/${communitySlug}/announcements`);
      },
    });
  };

  if (!isMember) {
    return (
      <PanelCard
        className="md:h-[63vh] xl:h-[56vh]  min-w-50 2xl:w-70 flex flex-col justify-between"
        aria-label="Community navigation"
      >
        <div className="flex flex-col gap-3 justify-center items-center h-full">
          <p className="text-sm xl:text-base font-medium text-[#261A2B] text-center">
            Join this community to view content
          </p>
        </div>

        <button
          onClick={handleJoin}
          disabled={joinPending}
          className={cn(
            'w-full bg-primary text-white capitalize text-sm font-medium py-3 gap-2 rounded-xl flex items-center justify-center shrink-0',
            joinPending && 'opacity-50 cursor-not-allowed'
          )}
        >
          <Plus className="size-4 xl:size-5 stroke-3" />
          {joinPending ? 'Joining...' : 'join community'}
        </button>
      </PanelCard>
    );
  }

  return (
    <PanelCard
      className="md:h-[63vh] xl:h-[56vh]  min-w-50 2xl:w-70 flex flex-col justify-between"
      aria-label="Community navigation"
    >
      <div className="flex flex-col gap-3 xl:gap-6">
        {COMMUNITY_LINKS.map(({ key, label, icon, activeIcon }) => {
          const href = `/communities/${communitySlug}/${key}`;
          const isActive = location.pathname === href;

          return (
            <button
              key={key}
              onClick={() => navigate(href)}
              className={cn(
                'w-full flex items-center gap-2 xl:gap-3 px-3 xl:px-4 py-3 rounded-xl',
                'transition-all duration-200 text-left',
                isActive ? 'bg-primary' : 'hover:bg-black/5'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <img
                src={isActive ? activeIcon : icon}
                alt=""
                aria-hidden="true"
                className="size-5 shrink-0"
              />
              <span
                className={cn(
                  'text-sm xl:text-base font-medium',
                  isActive ? 'text-white' : 'text-[#261A2B]'
                )}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>

      <button
        onClick={() => {
          if (!leavePending) setShowLeaveDialog(true);
        }}
        disabled={leavePending}
        className={cn(
          'w-full bg-destructive text-white capitalize text-sm font-medium py-3 gap-2 rounded-xl flex items-center justify-center shrink-0',
          leavePending && 'opacity-50 cursor-not-allowed'
        )}
      >
        <LogOut className="size-4 xl:size-5 stroke-3" />
        {leavePending ? 'Leaving...' : 'leave community'}
      </button>

      <LeaveCommunityDialog
        open={showLeaveDialog}
        onOpenChange={setShowLeaveDialog}
        communityId={communityId}
        communitySlug={communitySlug}
        members={members}
        isOwner={viewerRole === 'Owner'}
        isOnlyMember={isOnlyMember}
        onLeave={handleLeave}
        isPending={leavePending}
        isTransferring={isTransferring}
        onTransferOwnership={(memberId) =>
          changeRole(
            { communityId, userId: memberId, role: 'Owner' },
            {
              onSuccess: () => {
                leaveCommunity(communityId, {
                  onSuccess: () => navigate('/communities'),
                });
              },
            }
          )
        }
      />
    </PanelCard>
  );
}
