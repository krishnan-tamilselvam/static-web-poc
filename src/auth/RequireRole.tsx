import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'
import type { AppRole } from './roles'

type RequireRoleProps = {
  allowed: AppRole[]
  children: ReactNode
}

/** Requires authentication and at least one Entra app role when roles are assigned. */
export function RequireRole({ allowed, children }: RequireRoleProps) {
  const { loading, authenticated, roles } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="page-center">
        <p className="muted">Checking access…</p>
      </div>
    )
  }

  if (!authenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  const hasRole = allowed.some((r) => roles.includes(r))
  if (!hasRole) {
    return <Navigate to="/access-denied" state={{ from: location }} replace />
  }

  return children
}

/** Any signed-in user (SWA authenticated). Used for dashboard. */
export function RequireAuthenticated({ children }: { children: ReactNode }) {
  const { loading, authenticated } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="page-center">
        <p className="muted">Checking access…</p>
      </div>
    )
  }

  if (!authenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
