import { useParams } from 'react-router-dom';
import { EmptyState } from '@/components/EmptyState';
import { MEMBER_CONTACT_BUTTONS, PROFILE_STRINGS } from '@/lib/constants';
import { CalendarDaysIcon, MapPin, UserPlus2 } from 'lucide-react';
import { useUserById } from '@/hooks/useUser';
import { formatRelativeTime, getInitials, getSocialUrl } from '@/lib/utils';
import { StatBadge } from '@/components/StatBadge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const handleConnect = () => {};

function handleContactClick(href: string, isEmail = false): void {
  const url = isEmail ? `mailto:${href}` : href;
  window.open(url, '_blank', 'noopener,noreferrer');
}

export function MemberProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const { data: userProfile, isLoading, error } = useUserById(userId ?? '');
  const member = userProfile?.data ?? null;

  if (isLoading) {
    return <EmptyState title="Loading..." description="Fetching member profile." />;
  }

  if (error || !userId || !userProfile) {
    return <EmptyState title="Member not found" description="Unable to load member profile." />;
  }

  if (!member) {
    return <EmptyState title="Member not found" description="Unable to load member profile." />;
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-5 w-full py-4 sm:py-5 px-4 sm:px-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
        <div className="flex items-center gap-2 sm:gap-3">
          <Avatar className="size-12 sm:size-14 md:size-16 ring-2 ring-[#824892]/20">
            <AvatarImage
              src={member.avatarUrl ?? undefined}
              alt={member.fullName}
              className="object-cover"
            />
            <AvatarFallback className="bg-[#824892] text-white font-medium text-xl">
              {getInitials(member.fullName)}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col items-start gap-0.5 sm:gap-1">
            <span className="text-[#261A2B] text-lg sm:text-xl md:text-2xl font-semibold capitalize line-clamp-2">
              {member.fullName}
            </span>
            <span className="text-muted-foreground capitalize font-normal text-xs sm:text-sm md:text-base">
              {member.role ?? PROFILE_STRINGS.ROLE_SUFFIX}
            </span>
          </div>
        </div>

        <button
          onClick={handleConnect}
          className="flex items-center justify-center sm:justify-start gap-2 px-4 sm:px-6 md:px-8 py-2 bg-primary text-white capitalize rounded-lg sm:rounded-xl text-sm sm:text-base hover:bg-primary/90 transition-colors whitespace-nowrap"
        >
          <UserPlus2 className="size-4 sm:size-5" />
          <span>connect</span>
        </button>
      </div>

      {/* ── Stats ─────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <StatBadge value={member.totalPoints} label="points" />
          <StatBadge value={member.currentStreak} label="streak" />
        </div>
      </div>

      {/* ── Cards grid ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 gap-3 sm:gap-4">
        <div className="md:row-span-2 rounded-lg sm:rounded-2xl p-3 sm:p-4 flex flex-col items-start gap-2 sm:gap-3 bg-white border border-border justify-between">
          <div className="flex flex-col items-start gap-2 sm:gap-3">
            <span className="capitalize font-semibold text-base sm:text-lg md:text-xl text-primary">
              about me
            </span>
            <p className="text-[#67537C] text-sm sm:text-base font-light">
              {member.bio || 'No bio provided.'}
            </p>
          </div>

          <div className="flex flex-col items-start gap-2 sm:gap-3">
            {member.location && (
              <span className="flex items-center gap-2 font-semibold text-xs sm:text-sm text-[#836E99] capitalize">
                <MapPin className="text-primary size-5 sm:size-6 shrink-0" />
                <span className="line-clamp-1">{member.location}</span>
              </span>
            )}
            {member.joinedAt && (
              <span className="flex items-center gap-2 font-semibold text-xs sm:text-sm text-[#836E99] capitalize">
                <CalendarDaysIcon className="text-primary size-4 sm:size-5 shrink-0" />
                joined {formatRelativeTime(member.joinedAt)}
              </span>
            )}
          </div>
        </div>

        {/* Skills */}
        <div className="bg-white border border-border rounded-lg sm:rounded-2xl p-3 sm:p-4 flex flex-col items-start gap-2 sm:gap-3">
          <span className="capitalize font-semibold text-base sm:text-lg md:text-xl text-primary">
            {PROFILE_STRINGS.SECTIONS.SKILLS}
          </span>
          {member.skills.length > 0 ? (
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {member.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 rounded-full bg-[#EDE9FE] text-primary text-xs sm:text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">No skills listed yet.</p>
          )}
        </div>

        {/* Get in Touch */}
        <div className="bg-white border border-border rounded-lg sm:rounded-2xl p-3 sm:p-4 flex flex-col items-start gap-2 sm:gap-3">
          <span className="capitalize font-semibold text-base sm:text-lg md:text-xl text-primary">
            get in touch
          </span>
          <div className="w-full flex flex-wrap items-center gap-1.5 sm:gap-2.5">
            {MEMBER_CONTACT_BUTTONS.map(({ provider, label, bg, icon, isEmail }) => {
              const href =
                provider === 'email' ? member.email : getSocialUrl(member.socialLinks, provider);
              if (!href) return null;
              return (
                <button
                  key={provider}
                  onClick={() => handleContactClick(href, isEmail)}
                  className={`flex items-center justify-center p-2 rounded-xl shrink-0 ${bg}`}
                  aria-label={label}
                >
                  <img src={icon} alt={label} className="size-6" />
                </button>
              );
            })}
            {MEMBER_CONTACT_BUTTONS.every(({ provider, isEmail }) => {
              const href = isEmail ? member.email : getSocialUrl(member.socialLinks, provider);
              return !href;
            }) && (
              <p className="text-sm text-muted-foreground italic">No contact info available.</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <span className="capitalize font-semibold text-base sm:text-lg md:text-xl text-primary">
          projects
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-4">
          {/* TODO: render real projects once are ready */}
        </div>
      </div>
    </div>
  );
}
