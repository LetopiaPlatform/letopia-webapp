# Zod Validation Schemas

## What is Zod?

A library that lets you define validation rules in code. You describe the "shape" of valid data, and Zod checks if the actual data matches.

## Why validate on the frontend?

Our backend already validates (with FluentValidation). But without frontend validation:

```
User submits form → waits for server → sees error → fixes → submits again
```

With frontend validation:

```
User types → instantly sees "Password must be at least 8 characters" → fixes → submits
```

We mirror the same rules from the backend to keep them in sync.

## Where?

`src/lib/validators.ts` — all validation schemas live in one file.

## Key concepts

### `z.object()` — Define the shape

```ts
const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Must be at least 8 characters'),
});
```

### `z.infer<>` — Get TypeScript types for free

```ts
type LoginFormData = z.infer<typeof loginSchema>;
// Automatically becomes: { email: string; password: string }
```

You define validation once and get both **validation + types** — no duplication.

### `.refine()` — Cross-field validation

Compares two fields against each other. Regular rules validate each field individually, but "do passwords match?" needs to see both:

```ts
.refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],  // Show error on the confirmPassword field
});
```

## How it connects to forms

Zod works with React Hook Form via `zodResolver`:

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '@/lib/validators';

const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm<LoginFormData>({
  resolver: zodResolver(loginSchema),
});

<input {...register('email')} />;
{
  errors.email && <span>{errors.email.message}</span>;
}
```

## Mapping backend → frontend

| Backend (FluentValidation) | Frontend (Zod)                                            |
| -------------------------- | --------------------------------------------------------- |
| `.NotEmpty()`              | `.min(1, 'Required')`                                     |
| `.EmailAddress()`          | `.email('Invalid email')`                                 |
| `.MinimumLength(8)`        | `.min(8, 'Min 8 chars')`                                  |
| `.MaximumLength(100)`      | `.max(100, 'Max 100 chars')`                              |
| `.Matches(@"[A-Z]")`       | `.regex(/[A-Z]/, 'Need uppercase')`                       |
| `.Equal(x => x.Password)`  | `.refine(data => data.password === data.confirmPassword)` |
