import { Phone } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ProfileChipPanel } from './ProfileChipPanel';
import { ProfileSocialLinks } from './ProfileSocialLinks';
import { RoleBadge } from './RoleBadge';
import { getInitials } from '@/lib/utils';
import { PROFILE_ICONS, PROFILE_STRINGS } from '@/lib/constants';
import type { UserProfile } from '@/types/user.types';

interface ProfileHeaderProps {
  user: UserProfile | null;
  fallbackName: string;
  fallbackAvatar?: string;
  fallbackEmail: string;
  fallbackRole: string;
  profileReady: boolean;
  onEdit: () => void;
  onOpenSettings: () => void;
}

export function ProfileHeader({
  user,
  fallbackName,
  fallbackAvatar,
  fallbackEmail,
  fallbackRole,
  profileReady,
  onEdit,
  onOpenSettings,
}: ProfileHeaderProps) {
  const displayName = user?.fullName ?? fallbackName;
  const displayAvatar = user?.avatarUrl ?? fallbackAvatar;
  const displayEmail = user?.email ?? fallbackEmail;
  const role = user?.role ?? fallbackRole;
  const location = user?.location ?? null;
  const skills = user?.skills ?? [];
  const interests = user?.interests ?? [];
  const socialLinks = user?.socialLinks ?? [];

  return (
    <section className="rounded-3xl bg-white p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col gap-8 md:flex-row md:items-start">
        <div className="shrink-0">
          <Avatar className="size-28 ring-4 ring-[#824892]/20">
            <AvatarImage src={displayAvatar} alt={displayName} />
            <AvatarFallback className="bg-[#824892] text-white text-2xl font-semibold">
              {getInitials(displayName)}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex-1 min-w-0 space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-[#1A1A1A] truncate">{displayName}</h1>
              <div className="mt-1.5">
                <RoleBadge role={role} />
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button variant="outline" size="sm" className="gap-2" onClick={onOpenSettings}>
                <img src={PROFILE_ICONS.SETTINGS} alt="" className="size-4" />
                {PROFILE_STRINGS.BUTTONS.SETTINGS}
              </Button>
              <Button
                size="sm"
                className="gap-2 bg-[#824892] hover:bg-[#6f3a80]"
                onClick={onEdit}
                disabled={!profileReady}
              >
                <img src={PROFILE_ICONS.EDIT_USER} alt="" className="size-4 invert brightness-0" />
                {PROFILE_STRINGS.BUTTONS.EDIT_PROFILE}
              </Button>
            </div>
          </div>

          {user?.bio && <p className="text-sm text-[#4B5563] leading-relaxed">{user.bio}</p>}

          <div className="grid grid-cols-1 gap-x-8 gap-y-4 text-sm text-[#4B5563] sm:grid-cols-2">
            <div className="flex items-center gap-2">
              <img src={PROFILE_ICONS.EMAIL} alt="" className="size-4" />
              <span className="truncate">{displayEmail}</span>
            </div>
            {user?.phoneNumber && (
              <div className="flex items-center gap-2">
                <Phone className="size-4 text-[#824892]" />
                <span>{user.phoneNumber}</span>
              </div>
            )}
            {location && (
              <div className="flex items-center gap-2">
                <img src={PROFILE_ICONS.LOCATION} alt="" className="size-4" />
                <span>{location}</span>
              </div>
            )}
          </div>

          <ProfileSocialLinks links={socialLinks} />

          <ProfileChipPanel title={PROFILE_STRINGS.SECTIONS.SKILLS} items={skills} />
          <ProfileChipPanel title={PROFILE_STRINGS.SECTIONS.INTERESTS} items={interests} />
        </div>
      </div>
    </section>
  );
}
