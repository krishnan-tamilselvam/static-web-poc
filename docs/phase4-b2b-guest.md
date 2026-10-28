# Phase 4 — B2B guest user

Goal: An external user is invited to your tenant, assigned an app role, and signs in to the SWA with the same role rules as members.

## Prerequisites

- External email account you control (work, school, or personal Microsoft/Google accepted by your B2B settings)
- Phase 2–3 complete (app registration, roles, SWA auth)

## Invite guest (Entra admin center)

1. **Identity** → **Users** → **New user** → **Invite external user**.
2. Enter **Email** and optional display name.
3. Send invitation.
4. Open the mail and **Accept invitation** (guest completes redemption).

## Assign app role to guest

1. **Enterprise applications** → **Access-Control-POC** → **Users and groups**.
2. **Add user/group** → select the **guest** user (often shown with `#EXT#` in UPN).
3. Assign one role (e.g. **Reader** or **Order Manager**).

## Verify in the POC app

1. Guest opens the SWA URL (e.g. `/login`).
2. Sign in with the **external** identity used for redemption.
3. On **Dashboard**:
   - **User type** should indicate **B2B guest** when UPN contains `#EXT#`.
   - **Entra app roles** should list the assigned role.
4. Confirm navigation matches the role (same matrix as [phase3-role-tests.md](phase3-role-tests.md)).

## Troubleshooting

| Symptom | Things to check |
|---------|------------------|
| Guest cannot sign in | External collaboration settings; invitation redeemed |
| Guest signs in but no roles | Enterprise app role assignment on guest object |
| Redirect / AAD errors | SWA redirect URI; guest using correct account |
| Wrong tenant | Guest must accept invite into **your** tenant |

## Single tenant vs guests

This POC uses a **single-tenant** app registration. B2B **guests in your directory** can still be assigned to the enterprise application. If you later need multi-tenant sign-in, revisit **Supported account types** and Conditional Access scope.

## Phase 4 exit criteria

- [ ] Guest visible under **Users** (type Guest)
- [ ] Guest assigned an app role on **Access-Control-POC**
- [ ] Guest sign-in respects role-based pages and access denied rules

Next: [phase5-conditional-access.md](phase5-conditional-access.md).

## Reference

- [Add B2B guest users (portal)](https://learn.microsoft.com/en-us/entra/external-id/b2b-quickstart-add-guest-users-portal)
