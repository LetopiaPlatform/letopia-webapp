import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import {
  DEFAULT_NOTIFICATIONS,
  DEFAULT_PRIVACY,
  type NotificationPrefs,
  type PrivacyPrefs,
  type ProfileVisibility,
} from '@/types/preferences.types';
import { NOTIFICATION_ROWS, SETTINGS_STRINGS, VISIBILITY_OPTIONS } from './settings.constants';

// TODO(backend): replace local state with GET/PUT /users/me/preferences
// (see letopia-webapp/src/context/missing.md — Task 3).

type PrivacyToggleKey = Exclude<keyof PrivacyPrefs, 'profileVisibility'>;

export function SettingsPage() {
  const { isAuthenticated } = useAuthContext();
  const [notifications, setNotifications] = useState<NotificationPrefs>(DEFAULT_NOTIFICATIONS);
  const [privacy, setPrivacy] = useState<PrivacyPrefs>(DEFAULT_PRIVACY);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const toggleNotification = (key: keyof NotificationPrefs) =>
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));

  const togglePrivacyFlag = (key: PrivacyToggleKey) =>
    setPrivacy((prev) => ({ ...prev, [key]: !prev[key] }));

  const setVisibility = (value: ProfileVisibility) =>
    setPrivacy((prev) => ({ ...prev, profileVisibility: value }));

  return (
    <div className="mx-auto max-w-5xl px-6 py-8 lg:px-10 space-y-6">
      <h1 className="text-2xl font-bold text-[#1A1A1A]">{SETTINGS_STRINGS.PAGE_TITLE}</h1>

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
                />
              ))}
            </div>
          </div>

          <SettingRow
            title={SETTINGS_STRINGS.SHOW_PHONE_NUMBER}
            checked={privacy.showPhoneNumber}
            onToggle={() => togglePrivacyFlag('showPhoneNumber')}
          />
          <SettingRow
            title={SETTINGS_STRINGS.SHOW_EMAIL_ADDRESS}
            checked={privacy.showEmailAddress}
            onToggle={() => togglePrivacyFlag('showEmailAddress')}
          />
          <SettingRow
            title={SETTINGS_STRINGS.SHOW_PROJECTS}
            checked={privacy.showProjects}
            onToggle={() => togglePrivacyFlag('showProjects')}
          />
        </div>
      </section>
    </div>
  );
}

interface SettingRowProps {
  title: string;
  description?: string;
  checked: boolean;
  onToggle: () => void;
}

function SettingRow({ title, description, checked, onToggle }: SettingRowProps) {
  if (!description) {
    return (
      <div className="flex items-center justify-between gap-4">
        <span className="text-base font-medium text-[#1A1A1A]">{title}</span>
        <Toggle checked={checked} onToggle={onToggle} label={title} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-start justify-between gap-4">
        <span className="text-base font-medium text-[#1A1A1A]">{title}</span>
        <Toggle checked={checked} onToggle={onToggle} label={title} />
      </div>
      <p className="text-sm text-[#6B7280]">{description}</p>
    </div>
  );
}

interface VisibilityOptionProps {
  label: string;
  active: boolean;
  onSelect: () => void;
}

function VisibilityOption({ label, active, onSelect }: VisibilityOptionProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={cn(
        'flex-1 basis-0 min-w-0 h-11 rounded-xl px-2 text-xs font-medium whitespace-nowrap transition-colors sm:px-6 sm:text-sm',
        active
          ? 'bg-[#824892] text-white'
          : 'bg-[#F3EBF4] text-[#824892] ring-1 ring-inset ring-[#824892]/30 hover:bg-[#ebd9ef]'
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
}

function Toggle({ checked, onToggle, label }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onToggle}
      className={cn(
        'relative h-6 w-11 shrink-0 rounded-full transition-colors',
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
