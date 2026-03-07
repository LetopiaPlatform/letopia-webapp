# React Hook Form

## What is it?

A library that manages form state — field values, errors, submission, validation — without re-rendering the whole form on every keystroke.

## Why not just use `useState`?

```tsx
// With useState (every keystroke re-renders everything):
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [emailError, setEmailError] = useState('');
// ... more state for every field and error

// With React Hook Form (efficient, minimal re-renders):
const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm();
```

React Hook Form uses refs under the hood, so typing in one field doesn't re-render the others.

## Where?

Used inside page components that have forms (`LoginPage.tsx`, `RegisterPage.tsx`).

## Key functions

### `register('fieldName')`

Connects an input to the form. Returns `{ onChange, onBlur, ref, name }` — spread it on the input:

```tsx
<input {...register('email')} />
```

### `handleSubmit(onValid)`

Wraps your submit handler. Only calls `onValid` if all validation passes:

```tsx
<form onSubmit={handleSubmit((data) => login(data))}>
```

### `formState.errors`

Object containing validation errors per field:

```tsx
{
  errors.email && <span>{errors.email.message}</span>;
}
// Shows: "Invalid email format"
```

## Integration with Zod

The `zodResolver` bridges React Hook Form and Zod:

```tsx
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '@/lib/validators';

const form = useForm<LoginFormData>({
  resolver: zodResolver(loginSchema), // Zod validates on submit
});
```

## Form submission flow

```
1. User fills fields → React Hook Form tracks values (no re-renders)
2. User clicks Submit → handleSubmit triggers
3. zodResolver runs loginSchema validation
   → Invalid? Populates formState.errors → shows messages
   → Valid? Calls your onValid function
4. onValid calls useLogin().mutate(data) → API call
5. isPending=true → button shows "Signing in..."
6. Success → store token, redirect
   Error → toast shows message
```
