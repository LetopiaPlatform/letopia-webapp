import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuthContext } from '@/context/AuthContext';
import { useCurrentUser, useUpdatePreferences } from '@/hooks/useUser';
import { cn } from '@/lib/utils';
import {
  DEFAULT_NOTIFICATIONS,
  DEFAULT_PRIVACY,
  type NotificationPrefs,
  type PrivacyPrefs,
  type ProfileVisibility,
} from '@/types/preferences.types';
import { NOTIFICATION_ROWS, SETTINGS_STRINGS, VISIBILITY_OPTIONS } from './settings.constants';

type PrivacyToggleKey = Exclude<keyof PrivacyPrefs, 'profileVisibility'>;

export function SettingsPage() {
  const { isAuthenticated } = useAuthContext();
  const { data: meResponse, isLoading } = useCurrentUser();
  const updatePreferences = useUpdatePreferences();
  const navigate = useNavigate();

  const serverNotifications = meResponse?.data?.notificationPreferences ?? DEFAULT_NOTIFICATIONS;
  const serverPrivacy = meResponse?.data?.privacyPreferences ?? DEFAULT_PRIVACY;

  const [notifications, setNotifications] = useState<NotificationPrefs>(serverNotifications);
  const [privacy, setPrivacy] = useState<PrivacyPrefs>(serverPrivacy);

  // Re-sync local state when server snapshot changes (refetch / cache invalidation).
  // Using the "track prop" render-time pattern to avoid cascading renders from useEffect.
  const [serverSnapshot, setServerSnapshot] = useState(meResponse?.data);
  if (meResponse?.data && meResponse.data !== serverSnapshot) {
    setServerSnapshot(meResponse.data);
    setNotifications(meResponse.data.notificationPreferences ?? DEFAULT_NOTIFICATIONS);
    setPrivacy(meResponse.data.privacyPreferences ?? DEFAULT_PRIVACY);
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const persist = (
    next: { notifications?: NotificationPrefs; privacy?: PrivacyPrefs },
    rollback: () => void
  ) => {
    updatePreferences.mutate(
      {
        notificationPreferences: next.notifications,
        privacySettings: next.privacy,
      },
      {
        onError: (err) => {
          rollback();
          const msg = err instanceof Error ? err.message : 'Failed to save preferences.';
          toast.error(msg);
        },
      }
    );
  };

  const toggleNotification = (key: keyof NotificationPrefs) => {
    const prev = notifications;
    const next = { ...prev, [key]: !prev[key] };
    setNotifications(next);
    persist({ notifications: next }, () => setNotifications(prev));
  };

  const togglePrivacyFlag = (key: PrivacyToggleKey) => {
    const prev = privacy;
    const next = { ...prev, [key]: !prev[key] };
    setPrivacy(next);
    persist({ privacy: next }, () => setPrivacy(prev));
  };

  const setVisibility = (value: ProfileVisibility) => {
    if (privacy.profileVisibility === value) return;
    const prev = privacy;
    const next = { ...prev, profileVisibility: value };
    setPrivacy(next);
    persist({ privacy: next }, () => setPrivacy(prev));
  };

  const isSaving = updatePreferences.isPending;

  return (
    <div className="mx-auto max-w-5xl px-6 py-8 lg:px-10 space-y-6">
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => navigate('/profile')}
          className="flex size-9 items-center justify-center rounded-xl transition-colors hover:bg-[#F3EBF4]"
        >
          <img src="/assets/chevron_back.svg" alt="Back" className="size-6" />
        </button>
        <h1 className="text-2xl font-bold text-[#1A1A1A]">{SETTINGS_STRINGS.PAGE_TITLE}</h1>
        {isSaving && <span className="ml-2 text-xs text-[#6B7280]">Saving…</span>}
      </div>

      {isLoading && !meResponse ? (
        <div className="space-y-6">
          <div className="h-64 animate-pulse rounded-3xl bg-white/60" />
          <div className="h-64 animate-pulse rounded-3xl bg-white/60" />
        </div>
      ) : (
        <>
          {/* Notifications */}
          <section className="rounded-3xl bg-white px-4 py-6 shadow-sm sm:px-8">
            <h2 className="text-lg font-bold text-[#1A1A1A]">
              {SETTINGS_STRINGS.NOTIFICATIONS_HEADING}
            </h2>
            <div className="mt-8 flex flex-col gap-6">
              {NOTIFICATION_ROWS.map((row) => (
                <SettingRow
                  key={row.key}
                  title={row.title}
                  description={row.description}
                  checked={notifications[row.key]}
                  onToggle={() => toggleNotification(row.key)}
                  disabled={isSaving}
                />
              ))}
            </div>
          </section>

          {/* Privacy */}
          <section className="rounded-3xl bg-white px-4 py-6 shadow-sm sm:px-8">
            <h2 className="text-lg font-bold text-[#1A1A1A]">{SETTINGS_STRINGS.PRIVACY_HEADING}</h2>

            <div className="mt-8 flex flex-col gap-6">
              <div className="flex flex-col gap-2.5">
                <span className="text-base font-medium text-[#1A1A1A]">
                  {SETTINGS_STRINGS.PROFILE_VISIBILITY_LABEL}
                </span>
                <div className="flex items-center gap-2 sm:gap-4">
                  {VISIBILITY_OPTIONS.map((opt) => (
                    <VisibilityOption
                      key={opt.value}
                      label={opt.label}
                      active={privacy.profileVisibility === opt.value}
                      onSelect={() => setVisibility(opt.value)}
                      disabled={isSaving}
                    />
                  ))}
                </div>
              </div>

              <SettingRow
                title={SETTINGS_STRINGS.SHOW_PHONE_NUMBER}
                checked={privacy.showPhoneNumber}
                onToggle={() => togglePrivacyFlag('showPhoneNumber')}
                disabled={isSaving}
              />
              <SettingRow
                title={SETTINGS_STRINGS.SHOW_EMAIL_ADDRESS}
                checked={privacy.showEmailAddress}
                onToggle={() => togglePrivacyFlag('showEmailAddress')}
                disabled={isSaving}
              />
              <SettingRow
                title={SETTINGS_STRINGS.SHOW_PROJECTS}
                checked={privacy.showProjects}
                onToggle={() => togglePrivacyFlag('showProjects')}
                disabled={isSaving}
              />
            </div>
          </section>
        </>
      )}
    </div>
  );
}

interface SettingRowProps {
  title: string;
  description?: string;
  checked: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

function SettingRow({ title, description, checked, onToggle, disabled }: SettingRowProps) {
  if (!description) {
    return (
      <div className="flex items-center justify-between gap-4">
        <span className="text-base font-medium text-[#1A1A1A]">{title}</span>
        <Toggle checked={checked} onToggle={onToggle} label={title} disabled={disabled} />
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-start justify-between gap-4">
        <span className="text-base font-medium text-[#1A1A1A]">{title}</span>
        <Toggle checked={checked} onToggle={onToggle} label={title} disabled={disabled} />
      </div>
      <p className="text-sm text-[#6B7280]">{description}</p>
    </div>
  );
}

interface VisibilityOptionProps {
  label: string;
  active: boolean;
  onSelect: () => void;
  disabled?: boolean;
}

function VisibilityOption({ label, active, onSelect, disabled }: VisibilityOptionProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      disabled={disabled}
      className={cn(
        'flex-1 basis-0 min-w-0 h-11 rounded-xl px-2 text-xs font-medium whitespace-nowrap transition-colors outline-none ring-0 sm:px-6 sm:text-sm disabled:opacity-50',
        active ? 'bg-[#824892] text-white' : 'bg-[#F3EBF4] text-[#824892] hover:bg-[#ebd9ef]'
      )}
    >
      {label}
    </button>
  );
}

interface ToggleProps {
  checked: boolean;
  onToggle: () => void;
  label: string;
  disabled?: boolean;
}

function Toggle({ checked, onToggle, label, disabled }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onToggle}
      disabled={disabled}
      className={cn(
        'relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-50',
        checked ? 'bg-[#824892]' : 'bg-[#D9D9D9]'
      )}
    >
      <span
        className={cn(
          'absolute top-0.5 size-5 rounded-full bg-white shadow transition-all',
          checked
            ? 'left-5.5 border-[0.8px] border-white'
            : 'left-0.5 border-[0.8px] border-[#BDBDBD]'
        )}
      />
    </button>
  );
}
