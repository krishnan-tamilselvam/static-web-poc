# Phase 2 — Entra app registration (Access-Control-POC)

Goal: Register the application in Microsoft Entra ID and connect it to Static Web Apps Easy Auth. **Do not put client secrets in the React app or in git.**

## Record your values

Fill this in during registration:

| Setting | Your value |
|---------|------------|
| Tenant ID | |
| Application (client) ID | |
| Supported account types | Single tenant (recommended for initial POC) |
| SWA hostname | `https://____________.azurestaticapps.net` |
| Redirect URI (Web) | `https://<SWA_HOST>/.auth/login/aad/callback` |
| Authentication method | Authorization code via SWA Easy Auth |
| Client secret | Stored only in SWA **Configuration** → **Application settings** |

If you use a **staging** environment, add a second redirect URI for that hostname.

## Portal steps

1. [Microsoft Entra admin center](https://entra.microsoft.com) → **Identity** → **Applications** → **App registrations** → **New registration**.
2. **Name**: `Access-Control-POC`
3. **Supported account types**: **Accounts in this organizational directory only** (single tenant)
4. **Redirect URI**: Platform **Web**, URI:

   `https://<YOUR-SWA-HOST>/.auth/login/aad/callback`

5. Register and note **Application (client) ID** and **Directory (tenant) ID**.

### Authentication blade

1. App registration → **Authentication**.
2. Confirm the SWA callback redirect URI is listed.
3. Under **Implicit grant and hybrid flows**, enable **ID tokens** if the SWA + Entra integration guide for your setup requires it.
4. Save.

### Client secret (if required by your SWA auth mode)

1. **Certificates & secrets** → **New client secret** → copy value once.
2. Static Web App → **Configuration** → **Application settings**:
   - `AZURE_CLIENT_ID` = Application (client) ID
   - `AZURE_CLIENT_SECRET_APP_REGISTRATION` = secret value

Never commit secrets to the repository.

## Link registration to Static Web Apps

### Option A — Portal (recommended first time)

1. Static Web App → **Authentication** → **Microsoft** provider.
2. Choose **Custom** / app registration mode and enter **Client ID** (and secret via application settings if prompted).
3. Issuer: `https://login.microsoftonline.com/<TENANT_ID>/v2.0`

### Option B — `staticwebapp.config.json` (already in repo)

[`public/staticwebapp.config.json`](../public/staticwebapp.config.json) includes the `auth.identityProviders.azureActiveDirectory.registration` block. **Before Phase 2 deploy**, replace `<TENANT_ID>` in `openIdIssuer` with your directory (tenant) GUID.

Set application settings in Azure (`AZURE_CLIENT_ID`, and `AZURE_CLIENT_SECRET_APP_REGISTRATION` if required). Redeploy so `dist/staticwebapp.config.json` updates.

If you configure the custom provider **only** in the Portal, remove the `auth` section from the file to avoid duplicate provider definitions.

## Verify

1. Sign in via the SWA URL.
2. Entra admin center → **Enterprise applications** → find **Access-Control-POC**.
3. Confirm sign-in uses your registration (client ID in token / enterprise app blade).

## Phase 2 exit criteria

- [ ] App registration created with correct SWA redirect URI
- [ ] SWA sign-in uses the custom registration
- [ ] Values recorded in the table at the top of this doc

Next: [phase3-role-tests.md](phase3-role-tests.md) (create app roles and assignments).

## References

- [SWA authentication and authorization](https://learn.microsoft.com/en-us/azure/static-web-apps/authentication-authorization)
- [Configure authentication in a static web app](https://learn.microsoft.com/en-us/azure/static-web-apps/authentication-custom)
