import type { CommunityRole, Member } from '@/types/community.types';
import { EllipsisVertical } from 'lucide-react';
import { MemberActionsMenu } from './MemberActionMenu';
import { useChangeMemberRole, useRemoveMember } from '@/hooks/useCommunities';

interface MemberMenuProps {
  communityId: string;
  member: Member;
  isCurrentUser: boolean;
  viewerRole: CommunityRole;
  openMenuId: string | null;
  setOpenMenuId: (id: string | null) => void;
  onRef?: (el: HTMLDivElement | null) => void;
  onViewProfile: (member: Member) => void;
  onLeave?: () => void;
}

export function MemberMenu({
  communityId,
  member,
  isCurrentUser,
  viewerRole,
  openMenuId,
  setOpenMenuId,
  onRef,
  onViewProfile,
  onLeave,
}: MemberMenuProps) {
  const { mutate: changeRole } = useChangeMemberRole();
  const { mutate: removeMember } = useRemoveMember();

  return (
    <div ref={onRef} onClick={(e) => e.stopPropagation()}>
      <button
        className="cursor-pointer"
        aria-label={isCurrentUser ? 'More options' : `More options for ${member.fullName}`}
        aria-haspopup="menu"
        aria-expanded={openMenuId === member.userId}
        aria-controls={`menu-${member.userId}`}
        onClick={(e) => {
          e.stopPropagation();
          setOpenMenuId(openMenuId === member.userId ? null : member.userId);
        }}
      >
        <EllipsisVertical className="size-6 text-[#824892]" strokeWidth={1.5} />
      </button>
      {openMenuId === member.userId && (
        <div className="absolute right-0 top-8 z-50" id={`menu-${member.userId}`}>
          <MemberActionsMenu
            viewerRole={viewerRole}
            currentRole={member.role}
            isCurrentUser={isCurrentUser}
            onViewProfile={() => onViewProfile(member)}
            onChangeRole={(role) => {
              changeRole({ communityId, userId: member.userId, role });
              setOpenMenuId(null);
            }}
            onRemoveMember={() => {
              removeMember({ communityId, userId: member.userId });
              setOpenMenuId(null);
            }}
            {...(isCurrentUser && { onLeave })}
          />
        </div>
      )}
    </div>
  );
}
