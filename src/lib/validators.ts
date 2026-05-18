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

// Create Community //
export const createCommunitySchema = z.object({
  categoryId: z.string().min(1, 'Sub-category is required'),
  isPrivate: z.boolean().default(false),
  name: z
    .string()
    .trim()
    .min(1, 'Community name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters'),
  description: z
    .string()
    .trim()
    .min(1, 'Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description cannot exceed 2000 characters'),
  rules: z
    .array(
      z
        .string()
        .trim()
        .min(1, 'Rule cannot be empty')
        .min(5, 'Rule must be at least 5 characters')
        .max(500, 'Rule cannot exceed 500 characters')
    )
    .max(20, 'Cannot have more than 20 rules')
    .optional()
    .default([])
    .transform((rules) => rules.filter((rule) => rule.trim().length > 0)),

  coverImage: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, 'Cover image must be at most 5 MB')
    .refine((file) => {
      const ext = /\.[^.]+$/.exec(file.name)?.[0]?.toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext || '');
    }, 'Cover image must be a .jpg, .jpeg, .png, or .webp file')
    .optional(),
});

export type CreateCommunityFormData = z.input<typeof createCommunitySchema>;

export type CreateCommunitySubmitData = z.infer<typeof createCommunitySchema>;

// ─── Create Post ─────────────────────────────────────────────
export const MAX_IMAGES = 10;
export const MAX_IMAGE_SIZE_MB = 5;
export const MAX_TAGS = 10;
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/jfif',
];

const imageSchema = z
  .instanceof(File)
  .refine(
    (file) => ALLOWED_IMAGE_TYPES.includes(file.type),
    'Each image must be JPEG, PNG, WEBP, GIF, or JFIF.'
  )
  .refine(
    (file) => file.size <= MAX_IMAGE_SIZE_MB * 1024 * 1024,
    `Each image must be at most ${MAX_IMAGE_SIZE_MB} MB.`
  );

export const createPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title cannot exceed 200 characters'),

  content: z
    .string()
    .min(1, 'Content is required')
    .max(10000, 'Content cannot exceed 10,000 characters'),

  postType: z.enum(['Discussion', 'Announcement']),

  images: z
    .array(imageSchema)
    .max(MAX_IMAGES, `You can upload up to ${MAX_IMAGES} images only.`)
    .optional(),

  tags: z
    .array(
      z
        .string()
        .min(1, 'Tags cannot be empty.')
        .max(30, 'Tag cannot exceed 30 characters.')
        .regex(/^[a-zA-Z0-9\-_]+$/, "Tags can contain only letters, numbers, '-' and '_'.")
    )
    .max(MAX_TAGS, `Maximum ${MAX_TAGS} tags allowed.`)
    .optional(),
});

export type CreatePostFormValues = z.infer<typeof createPostSchema>;
