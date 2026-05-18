import { useState } from 'react';
import { Eye, Shield, ChevronRight, ChevronLeft, UserRoundX, Check, LogOut } from 'lucide-react';
import type { CommunityRole } from '@/types/community.types';

const COMMUNITY_ROLES: CommunityRole[] = ['Owner', 'Moderator', 'Member'];

interface MemberActionsMenuProps {
  viewerRole: CommunityRole;
  currentRole: CommunityRole;
  isCurrentUser?: boolean;
  onViewProfile: () => void;
  onChangeRole: (role: CommunityRole) => void;
  onRemoveMember: () => void;
  onLeave?: () => void;
}

export function MemberActionsMenu({
  viewerRole,
  currentRole,
  isCurrentUser,
  onViewProfile,
  onChangeRole,
  onRemoveMember,
  onLeave,
}: MemberActionsMenuProps) {
  const [showRoles, setShowRoles] = useState(false);

  const canChangeRole = viewerRole === 'Owner';
  const canRemove = viewerRole === 'Owner' || viewerRole === 'Moderator';

  if (isCurrentUser) {
    return (
      <div className="p-4 flex flex-col gap-3 bg-background border-2 border-border rounded-2xl absolute right-5 -top-10 z-50 w-max">
        <button className="flex items-center gap-3" onClick={onViewProfile}>
          <Eye className="text-muted-foreground size-5" />
          <span className="text-muted-foreground capitalize">view profile</span>
        </button>
        <button className="flex items-center gap-3" onClick={onLeave}>
          <LogOut className="text-destructive size-5" />
          <span className="text-destructive capitalize">leave community</span>
        </button>
      </div>
    );
  }

  if (showRoles) {
    return (
      <div className="p-4 flex flex-col gap-3 bg-background border-2 border-border rounded-2xl z-40 w-max">
        <button className="flex items-center gap-3" onClick={() => setShowRoles(false)}>
          <ChevronLeft className="text-muted-foreground size-5 stroke-3" />
          <span className="text-muted-foreground capitalize">back</span>
        </button>
        {COMMUNITY_ROLES.map((role) => (
          <button
            key={role}
            onClick={() => onChangeRole(role)}
            className="flex items-center justify-between gap-3"
          >
            <span className="text-muted-foreground capitalize">{role}</span>
            {role === currentRole && <Check className="text-[#824892] size-4 stroke-2" />}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col gap-3 bg-background border-2 border-border rounded-2xl z-40 w-max">
      <button className="flex items-center gap-3" onClick={onViewProfile}>
        <Eye className="text-muted-foreground size-5" />
        <span className="text-muted-foreground capitalize">view profile</span>
      </button>
      {canChangeRole && (
        <button className="flex items-center gap-3" onClick={() => setShowRoles(true)}>
          <Shield className="text-muted-foreground size-5" />
          <span className="text-muted-foreground capitalize">change role</span>
          <ChevronRight className="text-muted-foreground size-5 stroke-3" />
        </button>
      )}
      {canRemove && (
        <button className="flex items-center gap-3" onClick={onRemoveMember}>
          <UserRoundX className="text-destructive size-5" />
          <span className="text-destructive capitalize">remove member</span>
        </button>
      )}
    </div>
  );
}
