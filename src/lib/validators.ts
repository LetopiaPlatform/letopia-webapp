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
