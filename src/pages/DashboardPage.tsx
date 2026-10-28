import type { AppRole } from '../auth/roles'
import { useAuth } from '../auth/AuthContext'

export function DashboardPage() {
  const { principal, roles, isGuest } = useAuth()

  return (
    <div className="page">
      <header className="page-header">
        <h1>Dashboard</h1>
        <p className="lead">Signed-in overview and assigned Entra app roles.</p>
      </header>

      <section className="card grid-2">
        <div>
          <h2>Identity</h2>
          <dl className="meta-list">
            <div>
              <dt>Email / UPN</dt>
              <dd>{principal?.userDetails ?? '—'}</dd>
            </div>
            <div>
              <dt>Provider</dt>
              <dd>{principal?.identityProvider ?? '—'}</dd>
            </div>
            <div>
              <dt>User type</dt>
              <dd>{isGuest ? 'B2B guest (#EXT#)' : 'Member'}</dd>
            </div>
          </dl>
        </div>
        <div>
          <h2>Entra app roles</h2>
          {roles.length === 0 ? (
            <p className="warn">
              No <code>roles</code> claims yet. Assign app roles in Enterprise applications
              after Phase 2 registration is linked.
            </p>
          ) : (
            <ul className="role-list">
              {roles.map((role: AppRole) => (
                <li key={role}>
                  <span className="badge">{role}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="card">
        <h2>What you can access</h2>
        <ul className="check-list">
          <li>Dashboard — all authenticated users</li>
          <li>Orders — requires <strong>OrderManager</strong> role</li>
          <li>Administration — requires <strong>Admin</strong> role</li>
        </ul>
      </section>
    </div>
  )
}
