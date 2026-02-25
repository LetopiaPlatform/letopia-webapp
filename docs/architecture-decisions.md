- Framework: Vite + React 19: Fast builds, simple config, begineer friendly
- Language: TypeScript (strict): Catches bugs early, self-documenting
- Routing: React Router v7: Standard, well-documented
- State / Server Cache: TanStack Query (React Query): Handles caching, loading, errors 
- Forms: React Hook Form + Zod: Performant, schema-based validation
- Styling: Tailwind CSS + shadcn/ui: Utility-first, copy-past components, no CSS skill needed
- HTTP Client: Axios: Interceptors for auth tokens, consistent error handling
- Auth: React context + JWT in httpOnly cookies: Secure, simple.
---

letopia-frontend/
├── .env.development          # API_URL=http://localhost:5000/api/v1
├── .env.staging              # API_URL=https://staging-api.letopia.com/api/v1
├── .env.production           # API_URL=https://api.letopia.com/api/v1
├── .env.example              # Template (committed to git)
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
│
├── public/
│   ├── favicon.ico
│   └── assets/               # Static images, logos
│
├── src/
│   ├── main.tsx              # Entry point: ReactDOM.createRoot
│   ├── App.tsx               # Root component: providers + router
│   ├── routes.tsx            # All route definitions (centralized)
│   ├── vite-env.d.ts         # Vite type declarations
│   │
│   ├── api/                  # 🔌 API layer (mirrors your backend)
│   │   ├── client.ts         # Axios instance, interceptors, base URL from env
│   │   ├── auth.api.ts       # login, signup, googleAuth, verifyEmail, refreshToken
│   │   ├── users.api.ts      # getProfile, updateProfile, uploadAvatar
│   │   ├── communities.api.ts# CRUD, join, leave, members, roles
│   │   ├── categories.api.ts # list, getById
│   │   └── announcements.api.ts # CRUD, pin/unpin, like/unlike
│   │
│   ├── types/                # 📐 TypeScript types (mirrors your DTOs)
│   │   ├── api.types.ts      # ApiResponse<T>, PaginatedResult<T>, ErrorResponse
│   │   ├── auth.types.ts     # LoginDto, SignUpDto, AuthResponse, TokenPair
│   │   ├── user.types.ts     # UserProfile, UpdateUserProfileDto
│   │   ├── community.types.ts# CommunitySummary, CommunityDetail, CreateCommunityRequest
│   │   ├── category.types.ts # CategoryDto
│   │   └── announcement.types.ts # AnnouncementDto, CreateAnnouncementRequest
│   │
│   ├── hooks/                # 🎣 Custom hooks (TanStack Query wrappers)
│   │   ├── useAuth.ts        # login/signup mutations, current user query
│   │   ├── useCommunities.ts # useCommunitiesList, useCommunityDetail, useJoinCommunity
│   │   ├── useCategories.ts  # useCategoriesList
│   │   ├── useAnnouncements.ts# useAnnouncementsList, useCreateAnnouncement, useLikeToggle
│   │   └── useFileUpload.ts  # upload with progress tracking
│   │
│   ├── context/              # 🌐 React Context (minimal — only auth)
│   │   └── AuthContext.tsx    # AuthProvider, useAuthContext
│   │
│   ├── components/           # 🧩 Reusable UI components
│   │   ├── ui/               # Base primitives (shadcn/ui — auto-generated)
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── skeleton.tsx
│   │   │   └── toast.tsx
│   │   │
│   │   ├── layout/           # Page scaffolding
│   │   │   ├── AppLayout.tsx  # Sidebar + header + outlet
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Footer.tsx
│   │   │
│   │   └── shared/           # App-specific reusable
│   │       ├── LoadingSpinner.tsx
│   │       ├── ErrorBoundary.tsx
│   │       ├── ProtectedRoute.tsx    # Redirects unauthenticated users
│   │       ├── CommunityCard.tsx
│   │       ├── AnnouncementCard.tsx
│   │       ├── UserAvatar.tsx
│   │       └── FileUpload.tsx
│   │
│   ├── pages/                # 📄 Page components (one per route)
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── SignUpPage.tsx
│   │   │   ├── ForgotPasswordPage.tsx
│   │   │   ├── ResetPasswordPage.tsx
│   │   │   └── VerifyEmailPage.tsx
│   │   │
│   │   ├── communities/
│   │   │   ├── CommunitiesListPage.tsx
│   │   │   ├── CommunityDetailPage.tsx
│   │   │   ├── CreateCommunityPage.tsx
│   │   │   └── CommunitySettingsPage.tsx
│   │   │
│   │   ├── announcements/
│   │   │   └── AnnouncementsFeedPage.tsx  # Within community context
│   │   │
│   │   ├── profile/
│   │   │   ├── ProfilePage.tsx
│   │   │   └── EditProfilePage.tsx
│   │   │
│   │   └── NotFoundPage.tsx
│   │
│   ├── lib/                  # 🔧 Utilities
│   │   ├── utils.ts          # cn() helper, formatDate, etc.
│   │   ├── constants.ts      # App-wide constants, role names
│   │   └── validators.ts     # Zod schemas (shared validation)
│   │
│   └── styles/
│       └── globals.css       # Tailwind directives + custom CSS vars
│
└── tests/                    # 🧪 Tests (mirrors src/ structure)
    ├── setup.ts              # Test setup (vitest + testing-library)
    ├── components/
    └── pages/

## Key Design Decisions
1. Flat feature folders (not nested modules)
2. `api/` layer mirrors backend controllers 1:1 - When the backend adds an endpoint, the frontend adds it to the matching `.api.ts` file. No ambiguity.
3. `types/` mirrors DTOs 1:1 - Copy the DTO shape directly from API Documentation (`API Dog`)
4. TanStack Query hook in `hooks` - Beginners write pages that just call hooks.
5. Environment files - Vite loads `.env.[mode]` automatically:
```typescript
# .env.development
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_GOOGLE_CLIENT_ID=dev-client-id

# .env.staging
VITE_API_BASE_URL=https://staging-api.com/api/v1
VITE_GOOGLE_CLIENT_ID=staging-client-id

# env.production
VITE_API_BASE_URL=https://production-api.com/api/v1
VITE_GOOGLE_CLIENT_ID=production-client-id
```
Run with: `vite --mode staging` or `vite build --mode production`
---
## Rules for the team
1. Pages never call `axios` directly - always go through `hooks/` -> `api/`
2. No business logic in components - components render, hooks manage data.
3. One page = one file - no splitting a page into 5 files unless it's over 200-300 lines.
4. Types are required - no `any`, strict mode enforced in `tsconfig.json`
5. Environment variables must start with `VITE_` - Vite requirement for client-side exposure.
