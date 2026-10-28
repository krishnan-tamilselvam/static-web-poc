# Phase 5 — Conditional Access (Require MFA)

Goal: Show that Entra can require **multifactor authentication** at sign-in for a scoped test group and this application.

**Safety:** Use a dedicated test group. Exclude break-glass / emergency admin accounts. Do not apply experimental policies to all users.

## Licensing

Conditional Access requires **Microsoft Entra ID P1** (or P2), or equivalent licensing that includes CA. Confirm in **Entra admin center** → **Identity** → **Overview** / licensing before continuing.

## Step 1 — Test group

1. **Identity** → **Groups** → **New group**.
2. **Group type**: Security
3. **Name**: `POC-CA-MFA-Test`
4. **Members**: one non-admin test user (not your only global administrator)
5. Create.

## Step 2 — Policy (report-only first)

1. **Protection** → **Conditional Access** → **Policies** → **New policy**.
2. **Name**: `POC - Require MFA`
3. **Assignments**
   - **Users**: Include `POC-CA-MFA-Test` only; exclude emergency access accounts
   - **Target resources**: **Select applications** → **Access-Control-POC** (enterprise app) or the SWA-related cloud app as shown in your tenant
   - **Conditions**: defaults unless you need platform filters for the POC
4. **Access controls** → **Grant** → **Require multifactor authentication**
5. **Enable policy**: **Report-only** (if available)
6. Save.

## Step 3 — Validate in report-only

1. Sign in to the SWA as a user **in** `POC-CA-MFA-Test`.
2. **Entra admin center** → **Monitoring** → **Sign-in logs**:
   - Open the sign-in event
   - Review **Conditional Access** tab / policy result (`Report-only success` or similar)
3. Confirm the policy would have required MFA without blocking users yet (report-only behavior depends on tenant).

## Step 4 — Enable for test group

When satisfied:

1. Edit **POC - Require MFA** → set policy to **On**.
2. Sign in again as the test user → expect **MFA prompt** during Entra sign-in (before the SPA loads).
3. Sign in as a user **not** in the group → MFA should not be required by this policy.

## What changes in the React app

Nothing required — Conditional Access runs at **Entra sign-in**, before Easy Auth completes. The POC only needs successful sign-in after MFA.

## Phase 5 exit criteria

- [ ] Policy `POC - Require MFA` created and scoped to test group + app
- [ ] Report-only sign-in logs show policy evaluation
- [ ] With policy **On**, test group user completes MFA at sign-in

## Reference

- [Conditional Access overview](https://learn.microsoft.com/en-us/entra/identity/conditional-access/overview)
