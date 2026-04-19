import type { NotificationPrefs, ProfileVisibility } from '@/types/preferences.types';

export const SETTINGS_STRINGS = {
  PAGE_TITLE: 'Settings',
  NOTIFICATIONS_HEADING: 'Notifications',
  PRIVACY_HEADING: 'Privacy',
  PROFILE_VISIBILITY_LABEL: 'Profile Visibility',
  SHOW_PHONE_NUMBER: 'Show Phone Number',
  SHOW_EMAIL_ADDRESS: 'Show Email Address',
  SHOW_PROJECTS: 'Show Projects',
} as const;

export const NOTIFICATION_ROWS: Array<{
  key: keyof NotificationPrefs;
  title: string;
  description: string;
}> = [
  {
    key: 'emailNotifications',
    title: 'Email Notifications',
    description: 'Receive notifications via email',
  },
  {
    key: 'pushNotifications',
    title: 'Push Notifications',
    description: 'Receive push notifications on your device',
  },
  {
    key: 'taskReminders',
    title: 'Task Reminders',
    description: 'Get reminders for upcoming tasks',
  },
  {
    key: 'achievementAlerts',
    title: 'Achievement Alerts',
    description: 'Get notified when you unlock achievements',
  },
  {
    key: 'communityUpdates',
    title: 'Community Updates',
    description: 'Updates from your communities',
  },
  { key: 'weeklyDigest', title: 'Weekly Digest', description: 'Weekly summary of your activity' },
];

export const VISIBILITY_OPTIONS: Array<{ value: ProfileVisibility; label: string }> = [
  { value: 'public', label: 'Public' },
  { value: 'friends', label: 'Only Friends' },
  { value: 'private', label: 'Private' },
];
