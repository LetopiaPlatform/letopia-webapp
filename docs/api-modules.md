# API Modules

## What is an API Module?

A file that groups all HTTP calls for one backend controller. Think of it as a "phone book" for API endpoints — instead of every component knowing URLs and how to call the backend, they look it up from one central place.

## Why?

- **Single source of truth** — URLs live in one place, not scattered across components
- **Easy to maintain** — If the backend changes `/auth/login` to `/auth/sign-in`, you fix it in one file
- **Discoverable** — Open the file and see all available API calls at a glance
- **Type-safe** — Every call knows exactly what it sends and what it receives

## Where?

`src/api/` — one file per backend controller:

```
src/api/
├── client.ts          ← Shared Axios instance (base URL, interceptors)
├── auth.api.ts        ← Auth endpoints (login, signup)
├── users.api.ts       ← User profile endpoints
├── communities.api.ts ← Community endpoints
```

## How it works

```
Page Component → Custom Hook → API Module → Axios Client → Backend
                                   ↑
                              You are here
```

Pages **never** call API modules directly. They go through custom hooks (`useAuth`, `useCommunities`).

## Example

```ts
// src/api/auth.api.ts
import { apiClient } from './client';
import type { ApiResponse } from '@/types/api.types';
import type { AuthResponse, LoginRequest, SignUpRequest } from '@/types/auth.types';

export const authApi = {
  login: (data: LoginRequest) => apiClient.post<ApiResponse<AuthResponse>>('/auth/login', data),

  signUp: (data: SignUpRequest) => apiClient.post<ApiResponse<AuthResponse>>('/auth/signup', data),
};
```

## Usage (from a hook, never from a page)

```ts
// src/hooks/useAuth.ts
import { authApi } from '@/api/auth.api';

const response = await authApi.login({ email, password });
const token = response.data.data.jwtToken.token;
//            ↑ Axios    ↑ ApiResponse wrapper
```

## Rules

1. One file per backend controller
2. Export a single object (e.g., `authApi`) with all methods
3. Always type the request and response
4. Use the shared `apiClient` — never create raw Axios calls
5. Only hooks should import API modules — pages should not
