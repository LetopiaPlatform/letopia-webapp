import { Eye, UserPlus2 } from 'lucide-react';
import type { Member, CommunityRole } from '@/types/community.types';
import { cn, formatCount, formatRelativeTime } from '@/lib/utils';
import { useEffect, useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrentUser } from '@/hooks/useUser';
import { useChangeMemberRole, useLeaveCommunity } from '@/hooks/useCommunities';
import { LeaveCommunityDialog } from './LeaveCommunityDialog';
import { MemberMenu } from './MemberMenu';
import { MemberAvatar } from './MemberAvatar';

const ROLE_BADGE_STYLES: Record<CommunityRole, string> = {
  Owner: 'bg-[#D5C7E2] text-[#6A0DAD]',
  Moderator: 'bg-amber-700/15 text-amber-700',
  Member: 'bg-[#E5E7EB] text-muted-foreground',
};

interface CommunityMembersCardProps {
  communityId: string;
  communitySlug: string;
  members: Member[];
  totalCount: number;
  viewerRole: CommunityRole;
}

export function CommunityMembersCard({
  communityId,
  communitySlug,
  members,
  totalCount,
  viewerRole,
}: CommunityMembersCardProps) {
  const navigate = useNavigate();
  const { data: currentUser } = useCurrentUser();
  const currentUserId = currentUser?.data?.id;

  const { mutate: changeRole, isPending: isTransferring } = useChangeMemberRole();
  const { mutate: leaveCommunity } = useLeaveCommunity();

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const menuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isOwner = viewerRole === 'Owner';
  const isOnlyMember = totalCount === 1;

  const handleViewProfile = (member: Member) => {
    setOpenMenuId(null);

    if (member.userId === currentUser?.data?.id) {
      navigate('/profile');
    } else {
      navigate(`../members/${member.userId}`);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openMenuId === null) return;
      const menuContainer = menuRefs.current[openMenuId];
      if (menuContainer && !menuContainer.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMenuId]);

  const displayed = useMemo(
    () =>
      [...members].sort((a, b) => {
        if (a.userId === currentUserId) return -1;
        if (b.userId === currentUserId) return 1;
        return 0;
      }),
    [members, currentUserId]
  );

  const handleLeave = () => {
    leaveCommunity(communityId, {
      onSuccess: () => {
        setShowLeaveDialog(false);
        navigate('/communities');
      },
    });
  };

  return (
    <div className="bg-[#F6F5F6] rounded-2xl flex flex-col gap-5 px-5 pt-6 shrink-0">
      <div className="flex items-center gap-2">
        <img src="/icons/Members.svg" alt="users" className="size-6" />
        <h3 className="text-lg font-bold  tracking-wide text-primary">Members</h3>
        <span className="text-sm font-medium text-[#9E9E9E] ml-auto">
          {formatCount(totalCount)} Members
        </span>
      </div>

      <ul className="flex flex-col gap-2.5 px-1 max-h-screen overflow-y-auto overflow-x-visible pb-48 scrollbar-hide relative">
        {displayed.map((member) => (
          <li key={member.userId} className="flex items-center justify-between pt-2">
            <div className="flex gap-2">
              <MemberAvatar avatarUrl={member.avatarUrl} fullName={member.fullName} />

              <div className="flex flex-col gap-1">
                <div className="flex gap-2 max-w-35">
                  <span className="text-sm font-medium text-primary truncate">
                    {member.fullName}
                  </span>
                  <span
                    className={cn(
                      'text-[12px] font-light px-2 inline-flex items-center rounded-full w-fit shrink-0',
                      ROLE_BADGE_STYLES[member.role]
                    )}
                  >
                    {member.role}
                  </span>
                  {member.userId === currentUserId && (
                    <span className="text-[12px] font-light inline-flex items-center w-fit shrink-0 text-muted-foreground">
                      (You)
                    </span>
                  )}
                </div>

                <span className="text-xs font-light text-[#9E9E9E]">
                  Joined {formatRelativeTime(member.joinedAt)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0 relative">
              {member.userId !== currentUserId && (
                <button
                  className="cursor-pointer"
                  aria-label={`Connect with ${member.fullName}`}
                  //TODO onClick={handleConnect}
                >
                  <UserPlus2 className="size-5 text-primary stroke-2" />
                </button>
              )}

              {member.userId === currentUserId ? (
                <MemberMenu
                  member={member}
                  isCurrentUser={true}
                  viewerRole={viewerRole}
                  communityId={communityId}
                  openMenuId={openMenuId}
                  setOpenMenuId={setOpenMenuId}
                  onRef={(el) => {
                    if (el) menuRefs.current[member.userId] = el;
                    else delete menuRefs.current[member.userId];
                  }}
                  onViewProfile={handleViewProfile}
                  onLeave={() => {
                    setShowLeaveDialog(true);
                    setOpenMenuId(null);
                  }}
                />
              ) : viewerRole === 'Member' ? (
                <button
                  className="cursor-pointer"
                  aria-label={`View profile of ${member.fullName}`}
                  onClick={() => handleViewProfile(member)}
                >
                  <Eye className="size-5 text-[#824892]" />
                </button>
              ) : (
                <MemberMenu
                  member={member}
                  isCurrentUser={false}
                  viewerRole={viewerRole}
                  communityId={communityId}
                  openMenuId={openMenuId}
                  setOpenMenuId={setOpenMenuId}
                  onRef={(el) => {
                    if (el) menuRefs.current[member.userId] = el;
                    else delete menuRefs.current[member.userId];
                  }}
                  onViewProfile={handleViewProfile}
                />
              )}
            </div>
          </li>
        ))}
      </ul>

      <LeaveCommunityDialog
        open={showLeaveDialog}
        onOpenChange={setShowLeaveDialog}
        isOwner={isOwner}
        isOnlyMember={isOnlyMember}
        onLeave={handleLeave}
        communityId={communityId}
        communitySlug={communitySlug}
        members={members}
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
    </div>
  );
}
