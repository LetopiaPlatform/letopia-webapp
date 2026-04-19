export type ProfileVisibility = 'public' | 'friends' | 'private';

export type NotificationPrefs = {
  emailNotifications: boolean;
  pushNotifications: boolean;
  taskReminders: boolean;
  achievementAlerts: boolean;
  communityUpdates: boolean;
  weeklyDigest: boolean;
};

export type PrivacyPrefs = {
  profileVisibility: ProfileVisibility;
  showPhoneNumber: boolean;
  showEmailAddress: boolean;
  showProjects: boolean;
};

export type UserPreferences = {
  notifications: NotificationPrefs;
  privacy: PrivacyPrefs;
};

export const DEFAULT_NOTIFICATIONS: NotificationPrefs = {
  emailNotifications: true,
  pushNotifications: false,
  taskReminders: true,
  achievementAlerts: true,
  communityUpdates: false,
  weeklyDigest: true,
};

export const DEFAULT_PRIVACY: PrivacyPrefs = {
  profileVisibility: 'public',
  showPhoneNumber: false,
  showEmailAddress: true,
  showProjects: true,
};
