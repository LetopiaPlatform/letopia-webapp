import { z } from 'zod';

// ─── Login ───────────────────────────────────────────────────
// Mirrors: LoginDtoValidator in backend
export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// ─── Sign Up ─────────────────────────────────────────────────
// Mirrors: SignUpDtoValidator in backend
export const signUpSchema = z
  .object({
    fullName: z
      .string()
      .min(3, 'Full name must be at least 3 characters')
      .max(100, 'Full name cannot exceed 100 characters')
      .regex(/^[\p{L}\s]+$/u, 'Full name can only contain letters and spaces'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Invalid email format')
      .max(256, 'Email cannot exceed 256 characters'),
    phoneNumber: z
      .string()
      .min(1, 'Phone number is required')
      .regex(/^(\+?\d{1,3}[- ]?)?\d{10,}$/, 'Invalid phone number format'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(100, 'Password cannot exceed 100 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Must contain at least one number')
      .regex(/[\W_]/, 'Must contain at least one special character'),
    confirmPassword: z.string().min(1, 'Confirm password is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type SignUpFormData = z.infer<typeof signUpSchema>;

// ─── Forgot Password ─────────────────────────────────────────
// Mirrors: ForgotPasswordDtoValidator in backend
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format')
    .max(256, 'Email cannot exceed 256 characters'),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

// ─── Reset Password ──────────────────────────────────────────
// Mirrors: ResetPasswordDtoValidator in backend
export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(100, 'Password cannot exceed 100 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Must contain at least one number')
      .regex(/[\W_]/, 'Must contain at least one special character'),
    confirmPassword: z.string().min(1, 'Confirm password is required'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

// ─── Update Profile ──────────────────────────────────────────
const socialLinkSchema = z
  .object({
    provider: z.string().min(1, 'Provider is required').max(50),
    url: z.string().url('Invalid URL format'),
  })
  .superRefine(({ provider, url }, ctx) => {
    const protocol = new URL(url).protocol;
    const isEmail = provider.toLowerCase() === 'email';

    if (isEmail ? protocol !== 'mailto:' : protocol !== 'https:') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['url'],
        message: 'Unsupported URL scheme for this provider',
      });
    }
  });

const chipSchema = z
  .string()
  .min(1)
  .max(50)
  .regex(/^[a-zA-Z0-9 .+#\\-]+$/, 'Contains invalid characters');

export const updateProfileSchema = z.object({
  fullName: z.string().max(50, 'Name must be at most 50 characters').optional(),
  bio: z.string().max(500, 'Bio must be at most 500 characters').optional(),
  phoneNumber: z
    .string()
    .regex(/^\+?\d{7,15}$/, 'Invalid phone number format')
    .or(z.literal(''))
    .optional(),
  location: z.string().max(100, 'Location must be at most 100 characters').optional(),
  socialLinks: z
    .array(socialLinkSchema)
    .refine(
      (links) => new Set(links.map((l) => l.provider.toLowerCase())).size === links.length,
      'Duplicate social link providers are not allowed'
    )
    .optional(),
  skills: z
    .array(chipSchema)
    .max(20, 'You cannot add more than 20 skills')
    .refine(
      (s) => new Set(s.map((v) => v.trim().toLowerCase())).size === s.length,
      'Duplicate skills are not allowed'
    )
    .optional(),
  interests: z
    .array(chipSchema)
    .max(20, 'You cannot add more than 20 interests')
    .refine(
      (s) => new Set(s.map((v) => v.trim().toLowerCase())).size === s.length,
      'Duplicate interests are not allowed'
    )
    .optional(),
});
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;

// ─── Update Preferences ──────────────────────────────────────
export const updatePreferencesSchema = z.object({
  notificationPreferences: z
    .object({
      emailNotifications: z.boolean(),
      pushNotifications: z.boolean(),
      taskReminders: z.boolean(),
      achievementAlerts: z.boolean(),
      communityUpdates: z.boolean(),
      weeklyDigest: z.boolean(),
    })
    .optional(),
  privacySettings: z
    .object({
      profileVisibility: z.enum(['Public', 'FriendsOnly', 'Private']),
      showPhoneNumber: z.boolean(),
      showEmailAddress: z.boolean(),
      showProjects: z.boolean(),
    })
    .optional(),
});

// ─── Email Change ────────────────────────────────────────────
export const emailChangeSchema = z.object({
  newEmail: z.string().email('Invalid email format').max(256),
});
export type EmailChangeFormData = z.infer<typeof emailChangeSchema>;
