import { z } from 'zod';

export const userLoginSchema = z.object({
  email: z.string().min(1, 'Email is required').check(z.email('Please enter a valid email')),
  password: z.string().min(1, 'Password is required'),
});

export type LoginFormData = z.infer<typeof userLoginSchema>;

export const userSignUpSchema = z
  .object({
    fullName: z
      .string()
      .min(1, 'Full name is required')
      .min(2, 'Full name must be at least 2 characters'),
    email: z.string().min(1, 'Email is required').check(z.email('Please enter a valid email')),
    phoneNumber: z
      .string()
      .min(1, 'Phone number is required')
      .regex(/^\+?[\d\s\-()]{7,15}$/, 'Please enter a valid phone number'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type SignUpFormData = z.infer<typeof userSignUpSchema>;
