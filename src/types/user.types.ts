import type { NotificationPrefs, PrivacyPrefs } from './preferences.types';

// Mirrors backend UserProfileResponse DTO
export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  bio: string | null;
  phoneNumber: string | null;
  avatarUrl: string | null;
  location: string | null;
  role: string;
  emailVerified: boolean;
  totalPoints: number;
  currentStreak: number;
  lastLoginAt: string | null;
  createdAt: string;
  notificationPreferences: NotificationPrefs;
  socialLinks: SocialLink[];
  skills: string[];
  interests: string[];
  privacyPreferences: PrivacyPrefs;
}

export interface PublicUserProfile {
  id: string;
  fullName: string;
  email: string | null;
  role: string;
  phoneNumber: string | null;
  bio: string | null;
  avatarUrl: string | null;
  location: string | null;
  totalPoints: number;
  currentStreak: number;
  skills: string[];
  interests: string[];
  joinedAt: string;
  socialLinks: SocialLink[] | null;
}

export interface UpdateProfileRequest {
  fullName?: string;
  bio?: string;
  phoneNumber?: string;
  location?: string;
  socialLinks?: SocialLink[];
  interests?: string[];
  skills?: string[];
}

export interface SocialLink {
  provider: string;
  url: string;
}

export interface EmailChangeRequest {
  newEmail: string;
}
export interface EmailConfirmRequest {
  userId: string;
  token: string;
}
