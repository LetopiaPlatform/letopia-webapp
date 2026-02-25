# Letopia Web App

Frontend for the Letopia learning platform, built with React + TypeScript.

## Tech Stack

- **React 19** + **TypeScript 5.9** (strict mode)
- **Vite 7** — build tool
- **Tailwind CSS v4** + **shadcn/ui** — styling & components
- **React Router v7** — routing
- **TanStack Query** — server state / caching
- **React Hook Form** + **Zod** — forms & validation
- **Axios** — HTTP client

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Setup

```bash
git clone <repo-url>
cd letopia-webapp
npm install
```

Copy the environment template and fill in your values:

```bash
cp environments/.env.example environments/.env.development
```

### Run

```bash
npm run dev          # starts dev server at http://localhost:5173
```

### Build

```bash
npm run build            # development build
npm run build:staging    # staging build
npm run build:prod       # production build
npm run preview          # preview built output locally
```

### Other Commands

```bash
npm run lint             # run ESLint
npm run type-check       # TypeScript check without emitting
```

## Project Structure

```
src/
├── api/              # Axios client & API service functions
├── types/            # TypeScript interfaces (mirrors backend DTOs)
├── hooks/            # TanStack Query hooks
├── context/          # React Context (auth)
├── components/
│   ├── ui/           # shadcn/ui primitives (auto-generated)
│   ├── layout/       # App shell (header, sidebar, footer)
│   └── shared/       # Reusable app-specific components
├── pages/            # Page components (one per route)
│   ├── auth/
│   ├── communities/
│   └── profile/
├── lib/              # Utilities & constants
├── App.tsx           # Root: providers + router
└── main.tsx          # Entry point
```

## Environment Variables

Env files live in `environments/`. Vite loads them via `envDir` in `vite.config.ts`.

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Backend API base URL |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `VITE_CDN_URL` | CDN URL for uploaded files (production) |

## Team Rules

1. **Pages never call axios directly** — use `hooks/` → `api/`
2. **No business logic in components** — components render, hooks manage data
3. **No `any` type** — strict mode is enforced
4. **Env variables must start with `VITE_`**
