# Protected Routes

## What is a ProtectedRoute?

A wrapper component that checks authentication before showing a page. If the user is not logged in, they're redirected to `/login`.

## Why?

Without it, a guest could navigate to `/profile` or `/communities/create` and see errors or blank pages. ProtectedRoute acts as a security guard at the door.

## How it works

```
User visits /profile
  → ProtectedRoute checks: isAuthenticated?
    → Yes → render the page (children or Outlet)
    → No  → redirect to /login
```

## Where?

`src/components/shared/ProtectedRoute.tsx`

## Usage in routes

```tsx
// App.tsx
<Routes>
  {/* Public routes — anyone can access */}
  <Route path="login" element={<LoginPage />} />
  <Route path="register" element={<RegisterPage />} />

  {/* Protected routes — must be logged in */}
  <Route element={<ProtectedRoute />}>
    <Route path="profile" element={<ProfilePage />} />
  </Route>
</Routes>
```

When used as a layout route (with `<Outlet />`), it protects all child routes inside it.

## Key concept: `<Navigate>` vs `useNavigate()`

- `<Navigate to="/login" replace />` — a **component** that redirects on render. Used in JSX return statements.
- `useNavigate()` — a **hook** that gives you a function to call imperatively (e.g., after an API call).

ProtectedRoute uses `<Navigate>` because it decides during rendering (not after an event).

### What does `replace` do?

`<Navigate to="/login" replace />` replaces the current history entry instead of adding a new one. This means pressing the browser's back button won't take the user back to the protected page (which would just redirect again — infinite loop).
