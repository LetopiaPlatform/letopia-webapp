// Mirrors backend UserProfileResponse DTO
export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  bio: string | null;
  phoneNumber: string | null;
  avatarUrl: string | null;
}

// Mirrors backend UpdateUserProfileDto (multipart/form-data)
export interface UpdateUserProfileRequest {
  fullName?: string;
  email?: string;
  bio?: string;
  phoneNumber?: string;
  avatar?: File;
}
