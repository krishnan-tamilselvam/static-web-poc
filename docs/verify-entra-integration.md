# Verify Entra integration (post-Azure setup)

Use this after **A2** (app registration) and **A3** (role assignments). Keeps Easy Auth; no MSAL refactor required.

## 1. Custom registration connected to SWA

Confirm **one** source of truth — avoid conflicting Portal and file settings.

| Check | Where | Expected |
|-------|--------|----------|
| Provider uses **Access-Control-POC** | SWA → Authentication | Custom registration / your client ID |
| Application settings | SWA → Configuration | `AZURE_CLIENT_ID` = app (client) ID; `AZURE_CLIENT_SECRET_APP_REGISTRATION` only if your auth mode requires a secret |
| Redirect URI | App registration → Authentication | `https://<SWA_HOST>/.auth/login/aad/callback` |
| Issuer in config | [`public/staticwebapp.config.json`](../public/staticwebapp.config.json) | Replace `<TENANT_ID>` with your directory (tenant) GUID, redeploy |
| Sign-in path | Browser | Sign-in completes; Enterprise applications lists your app |

**Repo vs portal:** This repo declares the custom AAD provider in `staticwebapp.config.json` (client ID and secret via **application settings**, never in git). You may instead configure the same provider only in the Portal; if so, remove or comment out the `auth` block in the file to avoid duplicate definitions.

## 2. Inspect `/.auth/me` for app roles

While signed in on the deployed site:

1. Open `https://<SWA_HOST>/.auth/me` in the **same browser session**.
2. Find `clientPrincipal.claims` entries with `"typ": "roles"` (or the Microsoft role claim URI).
3. Confirm values match assignments: `Reader`, `OrderManager`, `Admin`.

Repeat for each test user (Reader, OrderManager, Admin).

If roles are missing:

- Enterprise application → user has an **app role** assignment (not only group membership without role).
- App registration → **Token configuration** / optional claims for **roles**.
- Sign out completely and sign in again.
- Confirm SWA auth uses **your** registration (wrong provider = wrong or empty roles).

## 3. UI and direct URL tests

| User role | `/dashboard` | `/orders` (direct URL) | `/admin` (direct URL) |
|-----------|--------------|-------------------------|------------------------|
| Reader | OK | Access denied | Access denied |
| OrderManager | OK | OK | Access denied |
| Admin | OK | Access denied* | OK |

\*Unless Admin is also assigned OrderManager.

Navigation hiding alone is not the test — type URLs in the address bar.

## 4. What SWA route rules do **not** do

`staticwebapp.config.json` uses `allowedRoles: ["authenticated"]` on `/orders` and `/admin`. That only requires sign-in, **not** Entra app roles. Role enforcement for those pages is in React (`RequireRole`). That matches this POC; it is **not** server-side authorization.

For production: add an API (e.g. Azure Functions on SWA) that validates the access token and `roles` before returning data.

## 5. B2B and Conditional Access

- **B2B:** Guest signs in → same `/.auth/me` role checks; dashboard may show Guest / `#EXT#`. See [phase4-b2b-guest.md](phase4-b2b-guest.md).
- **CA / MFA:** Enforced at Entra sign-in; no code change. See [phase5-conditional-access.md](phase5-conditional-access.md) and sign-in logs.

## Phase 2–3 exit checklist

- [ ] `<TENANT_ID>` replaced in `staticwebapp.config.json` (or Portal-only auth documented)
- [ ] `/.auth/me` shows expected `roles` for three test users
- [ ] Direct URL access denied behaves per table above
- [ ] Understood: browser guards are demonstration only
