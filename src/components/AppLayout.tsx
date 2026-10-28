import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { APP_ROLES } from '../auth/roles'

export function AppLayout({ children }: { children: ReactNode }) {
  const { authenticated, roles, principal, isGuest, signOut } = useAuth()

  const showOrders = roles.includes(APP_ROLES.OrderManager)
  const showAdmin = roles.includes(APP_ROLES.Admin)

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <span className="brand-mark" aria-hidden />
          <div>
            <p className="brand-title">Access Control</p>
            <p className="brand-sub">Entra ID + Static Web Apps POC</p>
          </div>
        </div>
        {authenticated && (
          <nav className="app-nav" aria-label="Main">
            <NavLink to="/dashboard" className={navClass}>
              Dashboard
            </NavLink>
            {showOrders && (
              <NavLink to="/orders" className={navClass}>
                Orders
              </NavLink>
            )}
            {showAdmin && (
              <NavLink to="/admin" className={navClass}>
                Administration
              </NavLink>
            )}
          </nav>
        )}
        <div className="header-actions">
          {authenticated ? (
            <>
              <span className="user-chip" title={principal?.userDetails}>
                {principal?.userDetails ?? 'Signed in'}
                {isGuest ? ' · Guest' : ''}
              </span>
              <button type="button" className="btn btn-ghost" onClick={signOut}>
                Sign out
              </button>
            </>
          ) : null}
        </div>
      </header>
      <main className="app-main">{children}</main>
      <footer className="app-footer">
        <p>POC: Entra app roles drive navigation; SWA enforces sign-in on protected routes.</p>
      </footer>
    </div>
  )
}

function navClass({ isActive }: { isActive: boolean }) {
  return isActive ? 'nav-link active' : 'nav-link'
}
