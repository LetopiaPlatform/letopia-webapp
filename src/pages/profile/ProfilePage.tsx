import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Phone } from 'lucide-react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { EditProfileForm } from '@/components/profile/EditProfileForm';
import { StatCard } from '@/components/profile/StatCard';
import { AchievementCard } from '@/components/profile/AchievementCard';
import { MOCK_ACHIEVEMENTS } from '@/components/profile/achievements.mock';
import { useAuthContext } from '@/context/AuthContext';
import { useCurrentUser, useUpdateProfile } from '@/hooks/useUser';
import { useMyCommunities } from '@/hooks/useCommunities';
import { getInitials, cn, formatCount } from '@/lib/utils';
import { PROFILE_ICONS, PROFILE_STRINGS, PROFILE_PLACEHOLDERS } from '@/lib/constants';
import { FeatureGate } from '@/components/shared/FeatureGate';

type TabKey = 'overview' | 'projects' | 'achievement';

export function ProfilePage() {
  const { isAuthenticated, user: authUser, updateUser } = useAuthContext();
  const { data: meResponse, isLoading } = useCurrentUser();
  const { data: communitiesResponse } = useMyCommunities();
  const updateProfile = useUpdateProfile();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [isEditing, setIsEditing] = useState(false);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const user = meResponse?.data;
  const communities = communitiesResponse?.data ?? [];
  // TODO(backend): role is not on UserProfileResponse; fall back to auth context user.
  const role = authUser?.role ?? 'Member';

  if (isLoading || !user) {
    return (
      <div className="mx-auto max-w-360 px-6 py-10 lg:px-10 xl:px-20.75">
        <div className="h-64 animate-pulse rounded-3xl bg-white/40" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-360 px-6 py-8 lg:px-10 xl:px-20.75 space-y-6">
      {/* ── Header card OR edit form ───────────────────────────── */}
      {isEditing ? (
        <EditProfileForm
          user={user}
          fallbackAvatarUrl={authUser?.avatarUrl}
          isSaving={updateProfile.isPending}
          onCancel={() => setIsEditing(false)}
          onSave={(changes) => {
            updateProfile.mutate(changes, {
              onSuccess: (res) => {
                const updated = res?.data;
                if (updated) {
                  updateUser({
                    fullName: updated.fullName,
                    avatarUrl: updated.avatarUrl ?? undefined,
                  });
                }
                toast.success('Profile updated.');
                setIsEditing(false);
              },
              onError: (err) => {
                const message = err instanceof Error ? err.message : 'Failed to update profile.';
                toast.error(message);
              },
            });
          }}
        />
      ) : (
        <section className="rounded-3xl bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col gap-6 md:flex-row md:items-start">
            {/* Avatar */}
            <div className="shrink-0">
              <Avatar className="size-28 ring-4 ring-[#824892]/20">
                <AvatarImage
                  src={user.avatarUrl ?? authUser?.avatarUrl ?? undefined}
                  alt={user.fullName}
                />
                <AvatarFallback className="bg-[#824892] text-white text-2xl font-semibold">
                  {getInitials(user.fullName)}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Name + meta + actions */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h1 className="text-3xl font-semibold text-[#1A1A1A] truncate">
                    {user.fullName}
                  </h1>
                  <p className="mt-1 text-sm text-[#6B7280]">
                    {role} {PROFILE_STRINGS.ROLE_SUFFIX}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => navigate('/settings')}
                  >
                    <img src={PROFILE_ICONS.SETTINGS} alt="" className="size-4" />
                    {PROFILE_STRINGS.BUTTONS.SETTINGS}
                  </Button>
                  <Button
                    size="sm"
                    className="gap-2 bg-[#824892] hover:bg-[#6f3a80]"
                    onClick={() => setIsEditing(true)}
                  >
                    <img
                      src={PROFILE_ICONS.EDIT_USER}
                      alt=""
                      className="size-4 invert brightness-0"
                    />
                    {PROFILE_STRINGS.BUTTONS.EDIT_PROFILE}
                  </Button>
                </div>
              </div>

              {/* Bio */}
              {user.bio && (
                <p className="mt-4 text-sm text-[#4B5563] leading-relaxed">{user.bio}</p>
              )}

              {/* Contact rows */}
              <div className="mt-4 grid grid-cols-1 gap-x-8 gap-y-4 text-sm text-[#4B5563] sm:grid-cols-2">
                <div className="flex items-center gap-2">
                  <img src={PROFILE_ICONS.EMAIL} alt="" className="size-4" />
                  <span className="truncate">{user.email}</span>
                </div>
                {user.phoneNumber && (
                  <div className="flex items-center gap-2">
                    <Phone className="size-4 text-[#824892]" />
                    <span>{user.phoneNumber}</span>
                  </div>
                )}
                {/* TODO(backend): location not on User entity */}
                <div className="flex items-center gap-2">
                  <img src={PROFILE_ICONS.LOCATION} alt="" className="size-4" />
                  <span>{PROFILE_PLACEHOLDERS.LOCATION}</span>
                </div>
              </div>

              {/* Social buttons — TODO(backend): social fields not on User entity */}
              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href={`mailto:${user.email}`}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#E11D48] px-3 py-2 text-xs font-medium text-white hover:opacity-90"
                >
                  <img src={PROFILE_ICONS.EMAIL} alt="" className="size-3.5 invert brightness-0" />
                  {PROFILE_STRINGS.SOCIALS.EMAIL}
                </a>
                <a
                  href={PROFILE_PLACEHOLDERS.SOCIALS.LINKEDIN_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-3 py-2 text-xs font-medium text-white hover:opacity-90"
                >
                  <img
                    src={PROFILE_ICONS.LINKEDIN_DISPLAY}
                    alt=""
                    className="size-3.5 invert brightness-0"
                  />
                  {PROFILE_STRINGS.SOCIALS.LINKEDIN}
                </a>
                <a
                  href={PROFILE_PLACEHOLDERS.SOCIALS.GITHUB_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-zinc-800 px-3 py-2 text-xs font-medium text-white hover:opacity-90"
                >
                  <img src={PROFILE_ICONS.GITHUB} alt="" className="size-3.5 invert brightness-0" />
                  {PROFILE_STRINGS.SOCIALS.GITHUB}
                </a>
              </div>
            </div>
          </div>

          {/* Skills + Interests — TODO(backend): not on User entity */}
          <div className="mt-4 grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                {PROFILE_STRINGS.SECTIONS.SKILLS}
              </h3>
              <p className="mt-3 text-sm text-[#9CA3AF]">Coming soon</p>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                {PROFILE_STRINGS.SECTIONS.INTERESTS}
              </h3>
              <p className="mt-3 text-sm text-[#9CA3AF]">Coming soon</p>
            </div>
          </div>
        </section>
      )}

      {/* ── Stats row ──────────────────────────────────────────── */}
      {/* TODO(backend): TotalPoints + CurrentStreak exist on User entity but not in
          UserProfileResponse DTO. TasksCompleted + Contributions are not modeled. */}
      <section className="mt-4.5! mb-4! grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard
          icon={<img src={PROFILE_ICONS.BADGE} alt="" className="size-6" />}
          label={PROFILE_STRINGS.STATS.TOTAL_POINTS}
          value="Coming soon"
        />
        <StatCard
          icon={<img src={PROFILE_ICONS.FIRE} alt="" className="size-6" />}
          label={PROFILE_STRINGS.STATS.CURRENT_STREAK}
          value="Coming soon"
        />
        <StatCard
          icon={<img src={PROFILE_ICONS.GRAPH_STAR} alt="" className="size-6" />}
          label={PROFILE_STRINGS.STATS.TASKS_COMPLETED}
          value="Coming soon"
        />
        <StatCard
          icon={<img src={PROFILE_ICONS.TRUST} alt="" className="size-6" />}
          label={PROFILE_STRINGS.STATS.CONTRIBUTIONS}
          value="Coming soon"
        />
      </section>

      {/* ── Tabs ───────────────────────────────────────────────── */}
      <section className="mb-4!">
        <div className="inline-flex h-11 items-center gap-1 rounded-2xl bg-[#F3EBF4] p-1">
          {(
            [
              ['overview', PROFILE_STRINGS.TABS.OVERVIEW, PROFILE_ICONS.DASHBOARD],
              ['projects', PROFILE_STRINGS.TABS.PROJECTS, PROFILE_ICONS.CHECKLIST],
              ['achievement', PROFILE_STRINGS.TABS.ACHIEVEMENT, PROFILE_ICONS.AWARD],
            ] as const
          ).map(([key, label, icon]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={cn(
                'flex h-9 items-center gap-1 rounded-2xl px-6 text-base font-medium leading-5 text-[#1A1A1A] transition-colors',
                activeTab === key ? 'bg-white shadow-sm' : 'hover:bg-white/40'
              )}
            >
              <img src={icon} alt="" className="size-4.5" />
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* ── Tab content ────────────────────────────────────────── */}
      {activeTab === 'overview' && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Weekly Activity — TODO(backend): no endpoint */}
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h3 className="text-base font-semibold text-[#1A1A1A]">
              {PROFILE_STRINGS.SECTIONS.WEEKLY_ACTIVITY}
            </h3>
            <div className="mt-4 flex h-48 items-center justify-center rounded-xl bg-linear-to-br from-[#824892]/5 to-[#824892]/10 text-sm text-[#6B7280]">
              {PROFILE_STRINGS.EMPTY.ACTIVITY_SOON}
            </div>
          </div>

          {/* My Communities — real data */}
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-[#1A1A1A]">
                {PROFILE_STRINGS.SECTIONS.MY_COMMUNITIES} (Coming Soon)
              </h3>
              <span className="text-xs text-[#6B7280]">{communities.length}</span>
            </div>
            <ul className="mt-4 space-y-3">
              {communities.length === 0 && (
                <li className="text-sm text-[#6B7280]">{PROFILE_STRINGS.EMPTY.NO_COMMUNITIES}</li>
              )}
              {communities.map(({ community }) => (
                <li
                  key={community.id}
                  className="flex h-20 items-center gap-3 rounded-[10px] bg-zinc-100 p-3 outline-[0.8px] -outline-offset-[0.8px] outline-gray-200"
                >
                  <Avatar className="size-12 shrink-0">
                    <AvatarImage src={community.iconUrl ?? undefined} alt={community.name} />
                    <AvatarFallback className="bg-[#824892]/10 text-[#824892] text-xs font-semibold">
                      {getInitials(community.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <p className="truncate text-base font-medium leading-6 text-[#1A1A1A]">
                      {community.name}
                    </p>
                    <p className="text-sm font-normal leading-5 text-[#6B7280]">
                      {formatCount(community.memberCount)} members
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'projects' && (
        <FeatureGate feature="profileProjectsTab">
          <div className="rounded-3xl bg-white p-10 text-center text-sm text-[#6B7280] shadow-sm">
            {/* TODO(backend): user projects listing endpoint */}
            {PROFILE_STRINGS.EMPTY.PROJECTS_SOON}
          </div>
        </FeatureGate>
      )}

      {activeTab === 'achievement' && (
        <FeatureGate feature="profileAchievementsTab">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-[#1A1A1A]">
              Achievements ({MOCK_ACHIEVEMENTS.filter((a) => a.unlockedAt).length}/
              {MOCK_ACHIEVEMENTS.length})
            </h2>
            <div className="grid gap-4 lg:grid-cols-2">
              {MOCK_ACHIEVEMENTS.map((a) => (
                <AchievementCard key={a.id} achievement={a} />
              ))}
            </div>
          </div>
        </FeatureGate>
      )}
    </div>
  );
}
