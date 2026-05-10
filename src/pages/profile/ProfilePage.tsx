import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { EditProfileForm } from '@/components/profile/EditProfileForm';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileActivityCalendar } from '@/components/profile/ProfileActivityCalendar';
import { ProfileTabs, type ProfileTabKey } from '@/components/profile/ProfileTabs';
import { ProfileOverviewTab } from '@/components/profile/ProfileOverviewTab';
import { ProfileProjectsTab } from '@/components/profile/ProfileProjectsTab';
import { ProfileAchievementsTab } from '@/components/profile/ProfileAchievementsTab';
import { useAuthContext } from '@/context/AuthContext';
import { useCurrentUser, useUpdateAvatar, useUpdateProfile } from '@/hooks/useUser';

export function ProfilePage() {
  const { isAuthenticated, user: authUser } = useAuthContext();
  const { data: meResponse, isLoading } = useCurrentUser();
  const updateProfile = useUpdateProfile();
  const updateAvatar = useUpdateAvatar();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<ProfileTabKey>('overview');
  const [isEditing, setIsEditing] = useState(false);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const user = meResponse?.data ?? null;
  const profileReady = !isLoading && !!user;
  const displayName = user?.fullName ?? authUser?.fullName ?? '';

  if (!displayName) {
    return (
      <div className="mx-auto max-w-360 px-6 py-10 lg:px-10 xl:px-20.75">
        <div className="h-64 animate-pulse rounded-3xl bg-white/40" />
      </div>
    );
  }

  const handleSave = async ({
    profile,
    avatar,
  }: {
    profile: Parameters<typeof updateProfile.mutateAsync>[0];
    avatar?: File;
  }) => {
    const tasks: Promise<unknown>[] = [];
    if (Object.keys(profile).length > 0) tasks.push(updateProfile.mutateAsync(profile));
    if (avatar) tasks.push(updateAvatar.mutateAsync(avatar));
    if (tasks.length === 0) {
      toast.info('No changes to save.');
      return;
    }
    try {
      await Promise.all(tasks);
      toast.success('Profile updated.');
      setIsEditing(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to update profile.';
      toast.error(msg);
    }
  };

  return (
    <div className="mx-auto max-w-360 overflow-x-hidden px-6 py-8 lg:px-10 xl:px-20.75 space-y-6">
      {isEditing && user ? (
        <EditProfileForm
          user={user}
          fallbackAvatarUrl={authUser?.avatarUrl}
          isSaving={updateProfile.isPending || updateAvatar.isPending}
          onCancel={() => setIsEditing(false)}
          onSave={handleSave}
        />
      ) : (
        <ProfileHeader
          user={user}
          fallbackName={authUser?.fullName ?? ''}
          fallbackAvatar={authUser?.avatarUrl}
          fallbackEmail={authUser?.email ?? ''}
          fallbackRole={authUser?.role ?? 'Member'}
          profileReady={profileReady}
          onEdit={() => setIsEditing(true)}
          onOpenSettings={() => navigate('/settings')}
        />
      )}

      <ProfileActivityCalendar user={user} />

      <ProfileTabs active={activeTab} onChange={setActiveTab} />

      {activeTab === 'overview' && <ProfileOverviewTab />}
      {activeTab === 'projects' && <ProfileProjectsTab />}
      {activeTab === 'achievement' && <ProfileAchievementsTab />}
    </div>
  );
}
