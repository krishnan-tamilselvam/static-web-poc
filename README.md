# Access Control POC

React (Vite) demo for **Azure Static Web Apps**, **Microsoft Entra ID** sign-in, **app roles**, **B2B guests**, and **Conditional Access** (portal configuration).

## App routes

| Route | SWA sign-in required | Entra app role (React guard) |
|-------|----------------------|--------------------------------|
| `/login` | No | — |
| `/dashboard` | Yes (`authenticated`) | Any signed-in user |
| `/orders` | Yes | `OrderManager` |
| `/admin` | Yes | `Admin` |
| `/access-denied` | No | Shown when role guard fails |

Entra **app roles** (`Reader`, `OrderManager`, `Admin`) are read from `GET /.auth/me` claims. They are **not** the same as Static Web Apps **route roles** in `staticwebapp.config.json` (which only uses `authenticated` here). UI and client-side route guards demonstrate authorization; **server-side API enforcement is not included** in this POC (add Azure Functions later for production-style checks).

Custom Entra registration is declared in `public/staticwebapp.config.json` (`auth.identityProviders`); set `AZURE_CLIENT_ID` (and secret if needed) in SWA application settings, replace `<TENANT_ID>` in `openIdIssuer`, then verify on deploy: [docs/verify-entra-integration.md](docs/verify-entra-integration.md).

## Local development

```bash
npm install
npm run dev
```

Easy Auth (`/.auth/me`, `/.auth/login/aad`) is available only on Azure Static Web Apps. Locally you can develop layout and navigation; sign-in and roles must be tested on the deployed SWA URL.

## Deploy

**Azure (portal):** [docs/azure-tasks.md](docs/azure-tasks.md) — checklist A1–A5.

**GitHub + SWA:** [docs/phase1-deploy.md](docs/phase1-deploy.md).

## Entra configuration

See [docs/entra-app-registration.md](docs/entra-app-registration.md) and phase docs 3–5 in `docs/`.

## Build

```bash
npm run build
```

Output: `dist/` (includes `staticwebapp.config.json` from `public/`).
