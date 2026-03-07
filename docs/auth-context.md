# React Context (AuthContext)

## What is React Context?

A way to share data across components without passing props through every level. Think of it as a building-wide intercom — any component can listen, no matter how deep it is.

## Why do we need it for auth?

"Who is logged in?" is needed everywhere:

- **Navbar** → show avatar or "Sign In"
- **Pages** → show different content for logged-in users
- **API calls** → attach the JWT token (handled by Axios interceptor)
- **Route guards** → redirect guests away from protected pages

Without Context, you'd pass `user` as a prop through every component. With Context, any component just calls `useAuthContext()`.

## Where?

`src/context/AuthContext.tsx` — one file containing:

- `AuthProvider` — the component that wraps your app and holds auth state
- `useAuthContext()` — the hook any component calls to access auth data

## How it works

```
App starts
  → AuthProvider checks localStorage for saved token
    → Found? User is authenticated
    → Not found? User is a guest

User logs in (LoginPage)
  → API returns token + user
  → AuthContext.login() stores both in localStorage + state
  → App re-renders, Navbar shows avatar

User logs out (Navbar button)
  → AuthContext.logout() clears localStorage + state
  → Redirects to /login

Token expires
  → Axios interceptor gets 401 → clears localStorage
  → AuthContext detects change → clears state
```

## What's inside AuthContext

```ts
{
  user: AuthUser | null,        // Who's logged in (null = nobody)
  token: string | null,         // The JWT token string
  isAuthenticated: boolean,     // Quick check: is someone logged in?
  login(response): void,        // Store user + token after API success
  logout(): void,               // Clear everything, redirect to /login
}
```

## Usage

```tsx
// Any component:
const { user, isAuthenticated, logout } = useAuthContext();

if (isAuthenticated) {
  return <span>Hello, {user.fullName}</span>;
}
```

## Key concepts used

### `useState(() => localStorage.getItem(...))`

Initializes state from localStorage on first render. This is why auth survives page refresh — the token is saved to disk, not just memory.

### `useCallback`

Prevents React from recreating the `login`/`logout` functions on every render. Without it, every child component would think the function changed and re-render unnecessarily.

### `useMemo`

Same idea but for the `value` object passed to the Provider. Only creates a new object if `user`, `token`, etc. actually changed.

### `useEffect` with storage listener

Syncs state if another tab or the Axios interceptor clears the token from localStorage (e.g., on 401).

## File extension: `.tsx` not `.ts`

Because the file contains JSX (`<AuthContext.Provider>`). Rule: any file returning HTML-like syntax needs `.tsx`.

## Where does AuthProvider go?

In `App.tsx`, inside `BrowserRouter` (because it uses `useNavigate`):

```tsx
<BrowserRouter>
  <AuthProvider>
    <Routes>...</Routes>
  </AuthProvider>
</BrowserRouter>
```
