# Phase 1 — Deploy React app to Azure Static Web Apps

Goal: HTTPS site on SWA with Entra sign-in, protected routes, and logout.

## Prerequisites

- Azure subscription
- GitHub account and a repository containing this project
- Node.js 22+ locally (optional, for local UI dev)

## Step 1 — Push code to GitHub

1. Create a new GitHub repository (for example `access-control-poc`).
2. From this project directory:

```bash
git init
git add .
git commit -m "Initial Access Control POC"
git branch -M main
git remote add origin https://github.com/<ORG_OR_USER>/<REPO>.git
git push -u origin main
```

## Step 2 — Create Azure Static Web App

1. [Azure Portal](https://portal.azure.com) → **Create a resource** → **Static Web App**.
2. Basics:
   - **Name**: e.g. `access-control-poc`
   - **Plan type**: Free or Standard (POC works on Free)
   - **Region**: choose nearest region
3. Deployment:
   - **Source**: GitHub
   - Sign in to GitHub and select **Organization**, **Repository**, and **Branch** `main`
4. Build details:
   - **Build Preset**: Custom
   - **App location**: `/`
   - **Api location**: leave empty
   - **Output location**: `dist`
5. Create the resource.

Azure adds a GitHub Actions workflow and secret `AZURE_STATIC_WEB_APPS_API_TOKEN`. This repo already includes [`.github/workflows/azure-static-web-apps.yml`](../.github/workflows/azure-static-web-apps.yml). If Azure created a duplicate workflow, keep one workflow aligned with:

- `app_location: /`
- `output_location: dist`
- `skip_api_build: true`

## Step 3 — Verify deployment

1. Open the SWA **Overview** blade and copy the **URL** (`https://<name>.azurestaticapps.net`).
2. GitHub → **Actions** → confirm the workflow run succeeded.
3. Browse to `/login` and `/dashboard`.

## Step 4 — Enable authentication (built-in Microsoft provider)

Phase 1 uses the **built-in** Microsoft / Entra provider in the portal (custom app registration comes in Phase 2).

1. Static Web App → **Settings** → **Authentication**.
2. Add identity provider **Microsoft** (Azure Active Directory).
3. Accept defaults for a quick tenant sign-in test, or follow the wizard for your tenant.
4. Save.

Custom **app roles** may not appear in tokens until Phase 2 links your **Access-Control-POC** app registration.

## Step 5 — Route protection (already in repo)

[`public/staticwebapp.config.json`](../public/staticwebapp.config.json) configures:

- SPA `navigationFallback` to `index.html`
- `allowedRoles: ["authenticated"]` on `/dashboard`, `/orders`, `/admin`
- `401` → redirect to `/.auth/login/aad`

After deploy, unauthenticated requests to `/dashboard` should redirect to Microsoft sign-in.

## Step 6 — Browser test checklist

| Test | Expected |
|------|----------|
| Open `/` | Redirect to login or dashboard |
| Open `/dashboard` while signed out | Redirect to Entra sign-in |
| Sign in | Land on dashboard; header shows UPN |
| Sign out | Return to login; `/dashboard` requires sign-in again |

## Troubleshooting

| Issue | Check |
|-------|--------|
| 404 on client routes | `staticwebapp.config.json` deployed under `dist/`; rebuild |
| Auth loop | Redirect URIs and SWA auth provider configuration |
| Workflow fails | Node version, `npm ci`, secret `AZURE_STATIC_WEB_APPS_API_TOKEN` |
| Roles empty on dashboard | Expected in Phase 1; complete Phase 2–3 |

## Phase 1 exit criteria

- [ ] SWA URL serves the app over HTTPS
- [ ] Sign-in and sign-out work
- [ ] Anonymous users cannot access `/dashboard` without authentication

Next: [entra-app-registration.md](entra-app-registration.md) (Phase 2).
