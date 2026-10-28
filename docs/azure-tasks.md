# Azure tasks (A1–A5) — Access Control POC

Complete these in the **Azure Portal** and **Microsoft Entra admin center**. The React app in this repo is already built; Azure work unlocks deploy, sign-in, roles, guests, and Conditional Access.

**Authentication note:** This repo uses **Static Web Apps Easy Auth** (`/.auth/login/aad`, `GET /.auth/me`) wired to your **custom app registration** (Phase 2), not **MSAL React** in the browser. App roles still come from Entra token **`roles`** claims exposed on `/.auth/me`. Redirect URIs use the SWA callback path below—not MSAL’s typical `http://localhost:5173` SPA redirect unless you change the app to MSAL later.

---

## A1. Create Azure Static Web Apps

| Step | Action |
|------|--------|
| 1 | Create or select a **resource group** |
| 2 | **Create a resource** → **Static Web App** |
| 3 | Deployment: **GitHub** → authorize → select this repo and branch **`main`** |
| 4 | Build: **Custom** — **App location** `/`, **Output location** `dist`, **Api location** empty |
| 5 | Create → wait for GitHub Actions deploy → copy **HTTPS URL** from Overview |

**Checklist**

- [ ] Resource group and SWA created
- [ ] GitHub connected; workflow secret `AZURE_STATIC_WEB_APPS_API_TOKEN` present
- [ ] Site loads at `https://<name>.azurestaticapps.net`
- [ ] `dist/` deploy includes `staticwebapp.config.json` from this repo

**Detail:** [phase1-deploy.md](phase1-deploy.md)

---

## A2. Register the application in Entra ID

| Step | Action |
|------|--------|
| 1 | [Entra admin center](https://entra.microsoft.com) → **App registrations** → **New registration** |
| 2 | Name: **`Access-Control-POC`** |
| 3 | **Supported account types:** Single tenant (company-only POC) |
| 4 | **Redirect URI:** Web → `https://<YOUR-SWA-HOST>/.auth/login/aad/callback` |
| 5 | Record **Directory (tenant) ID** and **Application (client) ID** |
| 6 | Link SWA **Authentication** to this registration (client ID; secret in app settings if required) |

**Record**

| Setting | Value |
|---------|--------|
| Tenant ID | |
| Client ID | |
| SWA URL | |
| Redirect URI | `https://<SWA>/.auth/login/aad/callback` |

**Do not** put client secrets in the React repo. Use SWA **Configuration** → **Application settings** (`AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET_APP_REGISTRATION` if needed).

**Detail:** [entra-app-registration.md](entra-app-registration.md)

**After A2 + A3:** [verify-entra-integration.md](verify-entra-integration.md) — `/.auth/me` role claims and direct URL tests.

---

## A3. Create and assign app roles

In **App registration** → **App roles**, create:

| Display name | Value |
|--------------|--------|
| Reader | `Reader` |
| Order Manager | `OrderManager` |
| Administrator | `Admin` |

Then **Enterprise applications** → **Access-Control-POC** → **Users and groups** → assign each test user one role.

**Checklist**

- [ ] Three roles created (values match table exactly)
- [ ] At least three test users assigned (Reader, OrderManager, Admin)
- [ ] After sign-in, dashboard shows roles from Entra (via `/.auth/me`)

**Detail:** [phase3-role-tests.md](phase3-role-tests.md)

---

## A4. Configure B2B guest access

| Step | Action |
|------|--------|
| 1 | Review **External Identities** / collaboration settings for your tenant |
| 2 | **Users** → **New user** → **Invite external user** (email you control) |
| 3 | Guest redeems invitation |
| 4 | **Enterprise applications** → assign guest an app role |
| 5 | Guest signs in at SWA URL and sees role-appropriate pages only |

**Checklist**

- [ ] Guest appears in directory (type Guest)
- [ ] Guest has app role assignment
- [ ] Sign-in and access match internal users’ role rules

**Detail:** [phase4-b2b-guest.md](phase4-b2b-guest.md)

---

## A5. Configure Conditional Access

| Step | Action |
|------|--------|
| 1 | Confirm **Entra ID P1/P2** (or equivalent) for Conditional Access |
| 2 | Create security group **`POC-CA-MFA-Test`**; add one non-break-glass test user |
| 3 | **Conditional Access** → new policy **`POC - Require MFA`** |
| 4 | Scope: test group + **Access-Control-POC** (enterprise app) |
| 5 | Grant: **Require multifactor authentication** |
| 6 | Enable **Report-only** first → review **Sign-in logs** |
| 7 | Turn policy **On** for test group when validated |

**Checklist**

- [ ] Policy evaluated in sign-in logs (report-only)
- [ ] Test group user prompted for MFA when policy is on
- [ ] Emergency admin accounts excluded from policy

**Detail:** [phase5-conditional-access.md](phase5-conditional-access.md)

---

## Mapping: your Azure list → repo docs

| Your ID | Topic | Document |
|---------|--------|----------|
| A1 | Static Web Apps + GitHub | [phase1-deploy.md](phase1-deploy.md) |
| A2 | App registration | [entra-app-registration.md](entra-app-registration.md) |
| A3 | App roles + assignments | [phase3-role-tests.md](phase3-role-tests.md) |
| A4 | B2B guest | [phase4-b2b-guest.md](phase4-b2b-guest.md) |
| A5 | Conditional Access | [phase5-conditional-access.md](phase5-conditional-access.md) |

---

## After Azure is configured — code-side verification (C6)

Use [phase3-role-tests.md](phase3-role-tests.md) on the deployed SWA URL (not local `npm run dev` alone).

| Test | Expected |
|------|----------|
| Reader | Dashboard only; `/orders` and `/admin` → Access denied |
| OrderManager | Dashboard + Orders |
| Admin | Dashboard + Administration |
| Anonymous `/dashboard` | SWA redirects to Entra sign-in |
| B2B guest | Same role rules; guest badge on dashboard when `#EXT#` |
