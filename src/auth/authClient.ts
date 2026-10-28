import { ALL_APP_ROLES, type AppRole } from './roles'
import type { AuthMeResponse, ClientPrincipal } from './types'

function isAppRole(value: string): value is AppRole {
  return (ALL_APP_ROLES as readonly string[]).includes(value)
}

const AUTH_ME_URL = '/.auth/me'

export function loginWithEntra(postLoginRedirect?: string): void {
  const redirect =
    postLoginRedirect ?? `${window.location.pathname}${window.location.search}`
  const encoded = encodeURIComponent(redirect)
  window.location.href = `/.auth/login/aad?post_login_redirect_uri=${encoded}`
}

export function logout(postLogoutRedirect = '/'): void {
  const encoded = encodeURIComponent(postLogoutRedirect)
  window.location.href = `/.auth/logout?post_logout_redirect_uri=${encoded}`
}

export async function fetchClientPrincipal(): Promise<ClientPrincipal | null> {
  try {
    const response = await fetch(AUTH_ME_URL)
    if (!response.ok) {
      return null
    }
    const data = (await response.json()) as AuthMeResponse
    return data.clientPrincipal ?? null
  } catch {
    return null
  }
}

/** Entra app roles from token claims (not SWA built-in route roles). */
export function getEntraAppRoles(principal: ClientPrincipal | null): AppRole[] {
  if (!principal?.claims?.length) {
    return []
  }

  const roleClaims = principal.claims.filter(
    (c) => c.typ === 'roles' || c.typ === 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role',
  )

  const values = roleClaims.flatMap((c) => {
    try {
      const parsed = JSON.parse(c.val) as unknown
      if (Array.isArray(parsed)) {
        return parsed.filter((v): v is string => typeof v === 'string')
      }
    } catch {
      /* single role string */
    }
    return [c.val]
  })

  return [...new Set(values)].filter(isAppRole)
}

export function isGuestUser(principal: ClientPrincipal | null): boolean {
  if (!principal) {
    return false
  }
  const guestClaim = principal.claims?.find(
    (c) =>
      c.typ === 'http://schemas.microsoft.com/identity/claims/identityprovider' ||
      c.typ === 'idp',
  )
  if (guestClaim?.val && guestClaim.val !== 'live.com' && guestClaim.val.includes('#EXT#')) {
    return true
  }
  return principal.userDetails.includes('#EXT#') || principal.userId.includes('#EXT#')
}

export function isAuthenticated(principal: ClientPrincipal | null): boolean {
  if (!principal) {
    return false
  }
  return (
    principal.userRoles.includes('authenticated') ||
    Boolean(principal.userId && principal.identityProvider)
  )
}

export function hasAnyRole(
  principal: ClientPrincipal | null,
  allowed: AppRole[],
): boolean {
  const roles = getEntraAppRoles(principal)
  return allowed.some((r) => roles.includes(r))
}
