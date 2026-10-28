# Phase 3 — App roles and authorization tests

Goal: Three Entra app roles drive different UI access; direct URLs show **Access denied** when the role is missing.

## Create app roles (Entra admin center)

App registration **Access-Control-POC** → **App roles** → **Create app role**:

| Display name | Allowed member types | Value | Description |
|--------------|----------------------|-------|-------------|
| Reader | Users/Groups | `Reader` | View dashboard |
| Order Manager | Users/Groups | `OrderManager` | Order management page |
| Administrator | Users/Groups | `Admin` | Administration page |

**Value** must match exactly (case-sensitive) — the React app uses these strings in [`src/auth/roles.ts`](../src/auth/roles.ts).

## Assign roles to test users

1. **Enterprise applications** → **Access-Control-POC** → **Users and groups** → **Add user/group**.
2. Create or pick three test users (or use one user and change assignment between tests):

| Test user | Assigned app role |
|-----------|-------------------|
| `poc-reader@...` | Reader |
| `poc-orders@...` | Order Manager |
| `poc-admin@...` | Administrator |

3. Wait a few minutes for assignment propagation if needed.

## Token claims

Assigned roles should appear in the token as **`roles`** claims and surface in `GET /.auth/me` under `clientPrincipal.claims`.

If roles are missing on the dashboard:

1. App registration → **Token configuration** → ensure **roles** optional claim is configured for ID/access token as needed.
2. Sign out completely and sign in again.
3. See [Microsoft Learn — app roles in tokens](https://learn.microsoft.com/en-us/entra/identity-platform/howto-add-app-roles-in-azure-ad-apps).

## Test matrix

Run each test in a separate browser profile or after sign-out.

| # | Action | User / role | Expected result |
|---|--------|-------------|-----------------|
| 1 | Sign in | Reader | Dashboard only; no Orders or Admin in nav |
| 2 | Open `/orders` directly | Reader | **Access denied** page |
| 3 | Open `/admin` directly | Reader | **Access denied** page |
| 4 | Sign in | OrderManager | Dashboard + Orders in nav; orders table visible |
| 5 | Open `/admin` directly | OrderManager | **Access denied** |
| 6 | Sign in | Admin | Dashboard + Administration in nav |
| 7 | Open `/orders` directly | Admin | **Access denied** (unless Admin also assigned OrderManager) |
| 8 | Sign out; open `/dashboard` | Anonymous | SWA redirects to Entra sign-in |

## What the app enforces

| Layer | Mechanism |
|-------|-----------|
| Anonymous access | SWA `allowedRoles: authenticated` on protected paths |
| Role-specific pages | React `RequireRole` reading Entra `roles` claims |
| Navigation | Links hidden without role (direct URL still hits guard) |

SWA **`allowedRoles`** does **not** map Entra app roles automatically. Entra roles are enforced in the SPA; SWA only requires sign-in.

## Security note (POC scope)

UI and client-side guards demonstrate identity and role claims. A user could still load static JS bundles. For real authorization of APIs or data, add an Azure Functions API that validates the bearer token and checks `roles` server-side.

## Phase 3 exit criteria

- [ ] Three roles defined in app registration
- [ ] Test users assigned one role each
- [ ] All rows in the test matrix pass

Next: [phase4-b2b-guest.md](phase4-b2b-guest.md).
