# Deployment Guide

## Concepts

### What is deployment?

Taking your code from your laptop/repository and making it available on the internet for users to access via a URL.

### What is a Static Web App?

When you run `npm run build`, Vite produces a `dist/` folder:

```
dist/
├── index.html          ← The single HTML page
├── assets/
│   ├── index-xyz.js    ← Your entire app bundled into one JS file
│   └── index-xyz.css   ← Your entire app's styles bundled into one CSS file
```

These are **static files** — they don't need a server to generate them. A hosting service just serves them to the user's browser, and React takes over from there.

### What is a CDN?

**Content Delivery Network** — a network of servers around the world. When a user in Egypt visits your site, they get files from a server in the Middle East (not from the US). This makes your app load much faster.

### What is CI/CD?

- **CI (Continuous Integration)** — every push/PR automatically runs tests, lint, and build to catch errors early
- **CD (Continuous Deployment)** — if CI passes, automatically deploys to the live site

You don't manually upload files. Push code → it deploys automatically.

### What is a GitHub Actions Workflow?

A YAML file in `.github/workflows/` that tells GitHub: "When X happens (e.g., push to main), do Y (e.g., build and deploy)." It runs on GitHub's servers, not your laptop.

### What are GitHub Secrets?

Sensitive values (API keys, tokens, URLs) stored securely in GitHub. They're injected into workflows at runtime — never visible in code or logs.

### What is CORS?

**Cross-Origin Resource Sharing** — a browser security feature. Your frontend at `lemon-river.azurestaticapps.net` calls the backend at `letopia-staging.azurewebsites.net`. The browser blocks this unless the backend explicitly says "I allow requests from this frontend URL." That's what CORS settings do.

### What does "baked in at build time" mean?

Vite replaces `import.meta.env.VITE_API_BASE_URL` with the actual value during `npm run build`. After build, the value is hardcoded in the JS file. Changing it requires a new build — you can't just restart the app.

---

## Overview

The frontend is deployed to **Azure Static Web Apps (SWA)** — a hosting service for static sites (HTML, CSS, JS). It automatically builds and deploys when code is pushed to GitHub.

**Live URL:** `https://lemon-river-0f8287f0f.6.azurestaticapps.net`

## How it works

```
Developer pushes to main branch
        ↓
GitHub Actions workflow triggers (.github/workflows/deploy.yml)
        ↓
1. Checks out the code
2. Installs dependencies (npm ci)
3. Builds the app (npm run build → creates dist/ folder)
4. Deploys dist/ to Azure Static Web Apps CDN
        ↓
Live at: https://lemon-river-0f8287f0f.6.azurestaticapps.net
```

## PR Preview Environments

Every pull request automatically gets its own preview URL:

```
Developer opens PR → GitHub Actions builds → deploys to unique preview URL
Developer closes/merges PR → preview environment is automatically deleted
```

This lets reviewers test changes before they go to production.

## Key Files

| File                           | Purpose                                                                                     |
| ------------------------------ | ------------------------------------------------------------------------------------------- |
| `.github/workflows/deploy.yml` | GitHub Actions workflow — triggers build + deploy                                           |
| `staticwebapp.config.json`     | Azure SWA config — tells Azure to serve `index.html` for all routes (so React Router works) |
| `environments/.env.staging`    | API URL for staging builds                                                                  |
| `environments/.env.production` | API URL for production builds                                                               |

## Environment Variables

Vite environment variables are **baked in at build time** (not runtime). This means:

- Changing an env var requires a **new build/deploy** — not just a restart
- Variables must start with `VITE_` to be accessible in frontend code
- They're set as GitHub Secrets and injected during the build step

### Current Variables

| Variable            | Where set     | Value                                                                          |
| ------------------- | ------------- | ------------------------------------------------------------------------------ |
| `VITE_API_BASE_URL` | GitHub Secret | Backend API URL (e.g., `https://letopia-staging-xxx.azurewebsites.net/api/v1`) |

### How to add a new environment variable

1. Go to GitHub repo → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add the secret name (must start with `VITE_`)
4. Add the value
5. Reference it in `.github/workflows/deploy.yml`:
   ```yaml
   env:
     VITE_MY_NEW_VAR: ${{ secrets.VITE_MY_NEW_VAR }}
   ```

## CORS Configuration

The backend must allow requests from the frontend URL. If you get CORS errors:

1. Go to Azure Portal → Backend App Service → Configuration
2. Add the frontend URL to `CorsSettings__AllowedOrigins`
3. Save and restart

### Currently allowed origins

- `http://localhost:3000` (local dev)
- `http://localhost:5174` (local dev)
- `https://lemon-river-0f8287f0f.6.azurestaticapps.net` (deployed frontend)

## Common Tasks

### Deploy to production

Just merge a PR to `main` — deployment is automatic.

### Check deployment status

Go to GitHub repo → Actions tab → look for the "Deploy" workflow run.

### Deployment failed?

1. Go to Actions tab → click the failed run
2. Expand the "Build And Deploy" step
3. Check the error — usually:
   - **Build error** — `npm run build` failed (TypeScript or lint error)
   - **Missing secret** — `VITE_API_BASE_URL` not set in GitHub Secrets
   - **Token expired** — `AZURE_STATIC_WEB_APPS_API_TOKEN_LEMON_RIVER_0F8287F0F` needs to be regenerated from Azure Portal

### Add a custom domain (future)

1. Buy a domain (e.g., from Cloudflare or Namecheap)
2. Azure Portal → Static Web App → Custom domains → Add
3. Add a CNAME record at your domain provider pointing to the SWA URL
4. Azure auto-issues SSL certificate — done

## Architecture

```
Users → Azure CDN (global edge servers) → dist/index.html + assets
                                              ↓
                                        React runs in browser
                                              ↓
                                        API calls via Axios
                                              ↓
                                        Azure App Service (backend)
```

The frontend is purely static files — no server processing. The CDN serves them fast from edge locations worldwide.
