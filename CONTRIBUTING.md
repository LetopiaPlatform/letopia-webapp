# Contributing to Letopia Web App

## Getting Started

1. Clone the repo and install dependencies:
   ```bash
   git clone <repo-url>
   cd letopia-webapp
   npm install
   ```
2. Copy `environments/.env.example` → `environments/.env.development` and fill in values
3. Run `npm run dev`

## Branching Strategy

| Branch           | Purpose               |
| ---------------- | --------------------- |
| `main`           | Production-ready code |
| `feature/<name>` | New features          |
| `fix/<name>`     | Bug fixes             |
| `chore/<name>`   | Config, tooling, docs |

**Flow:** Pull main branch, Create branch from `main` → work → open PR → get review → merge
Steps:

1. git checkout main
2. git pull
3. git checkout -b branch-name
4. work (commit changes)
5. open Pull Request (PR)
6. get review from team
7. merge

## Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add login page
fix: resolve token refresh loop
chore: update ESLint config
refactor: extract auth context
```

## Code Rules

1. **No `any` type** — TypeScript strict mode is on
2. **Pages never call axios directly** — go through `hooks/` → `api/`
3. **No business logic in components** — components render, hooks manage data
4. **One page = one file** — split only if over 200-300 lines
5. **No `console.log` in commits** — clean up before pushing
6. **Env vars start with `VITE_`** — Vite requirement

## Before Pushing

Pre-commit hooks run automatically (Husky + lint-staged), but you can also run manually:

```bash
npm run lint         # ESLint
npm run type-check   # TypeScript errors
npm run build        # Full build check
```

## Pull Requests

- Fill out the PR template completely
- Include screenshots for UI changes
- Link the related issue
- Request review from at least one team member
