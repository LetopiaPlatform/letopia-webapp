export type SocialProvider = 'facebook' | 'linkedin' | 'github' | 'twitter' | 'instagram' | string;

export interface SocialLink {
  provider: SocialProvider;
  url: string;
}

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
  socialLinks: SocialLink[];
  skills: string[];
  interests: string[];
}

export interface PublicUserProfile extends Omit<
  UserProfile,
  'email' | 'lastLoginAt' | 'createdAt'
> {
  email: string | null;
  joinedAt: string;
}

// Mirrors backend UpdateUserProfileDto (multipart/form-data)
export interface UpdateUserProfileRequest {
  fullName?: string;
  email?: string;
  bio?: string;
  phoneNumber?: string;
  avatar?: File;
}
