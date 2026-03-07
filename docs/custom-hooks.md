# Custom Hooks (useAuth)

## What is a custom hook?

A function that starts with `use` and wraps React logic (state, API calls, effects) for reuse. It keeps your page components clean — pages just call the hook and get data/actions back.

## Why not call the API directly from the page?

React Query (via `useMutation`) gives you **free** loading, error, and success states:

```tsx
// Without hook (manual, verbose):
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState(null);
try {
  setIsLoading(true);
  const response = await authApi.login(data);
  // store token, show toast, redirect...
} catch (err) {
  setError(err);
} finally {
  setIsLoading(false);
}

// With hook (clean):
const { mutate: login, isPending, error } = useLogin();
login(data); // Loading, error, success all handled automatically.
```

## Where?

`src/hooks/` — one file per feature:

```
src/hooks/
├── useAuth.ts          ← Login + SignUp mutations
├── useCommunities.ts   ← Community queries + mutations (future)
```

## Data flow

```
LoginPage → useLogin() hook → authApi.login() → Axios → Backend
                ↑                                          ↓
           Returns:                              Returns token + user
           { mutate, isPending, error }                    ↓
                                              onSuccess: store in AuthContext
                                              → show toast → redirect to /
```

## Key concepts

### Query vs Mutation

| Type         | HTTP Method     | React Query Hook | Example                              |
| ------------ | --------------- | ---------------- | ------------------------------------ |
| **Query**    | GET             | `useQuery`       | Fetch user profile, list communities |
| **Mutation** | POST/PUT/DELETE | `useMutation`    | Login, signup, create post           |

Login is a **mutation** because it changes state (creates a session).

### `mutate` vs `mutateAsync`

- `mutate(data)` — fire and forget. Success/error handled by callbacks (`onSuccess`, `onError`)
- `mutateAsync(data)` — returns a Promise you can `await`. Use when you need to do something after in the caller

We use `mutate` — the callbacks handle everything.

### `isPending`

- `true` while the API call is in flight
- `false` when done (success or error)
- Use it to disable buttons and show spinners:

```tsx
<button disabled={isPending}>{isPending ? 'Signing in...' : 'Sign In'}</button>
```

### `onSuccess` callback

Runs after the API returns a successful response. This is where we:

1. Store the token + user in AuthContext
2. Show a success toast
3. Redirect to the home page

### `onError` callback

Runs after the API returns an error (4xx/5xx). Extracts the error message from the backend response shape:

```ts
error.response?.data?.errors?.[0] ?? // First specific error from backend
  error.response?.data?.message ?? // General message fallback
  'Login failed'; // Ultimate fallback
```

### `.then(res => res.data)` in mutationFn

Unwraps the Axios response. Without it you'd get `{ data: { success, data, ... }, status, headers }`. With it you get `{ success, data, ... }` directly — the `ApiResponse<AuthResponse>`.

## Usage in a page

```tsx
const { mutate: login, isPending } = useLogin();

<form onSubmit={handleSubmit((data) => login(data))}>
  <input {...register('email')} />
  <input {...register('password')} />
  <button disabled={isPending}>{isPending ? 'Signing in...' : 'Sign In'}</button>
</form>;
```
