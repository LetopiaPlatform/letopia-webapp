export type ProfileVisibility = 'Public' | 'FriendsOnly' | 'Private';

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

export type UpdatePreferencesRequest = {
  notificationPreferences?: NotificationPrefs;
  privacySettings?: PrivacyPrefs;
};

export const DEFAULT_NOTIFICATIONS: NotificationPrefs = {
  emailNotifications: true,
  pushNotifications: true,
  taskReminders: true,
  achievementAlerts: true,
  communityUpdates: true,
  weeklyDigest: true,
};

export const DEFAULT_PRIVACY: PrivacyPrefs = {
  profileVisibility: 'Public',
  showPhoneNumber: false,
  showEmailAddress: false,
  showProjects: true,
};
