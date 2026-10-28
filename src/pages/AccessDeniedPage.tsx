import { Link, useLocation } from 'react-router-dom'

export function AccessDeniedPage() {
  const location = useLocation()
  const from = (location.state as { from?: { pathname?: string } } | null)?.from
    ?.pathname

  return (
    <div className="page-center">
      <div className="card access-denied">
        <h1>Access denied</h1>
        <p className="lead">
          Your account is signed in, but you do not have the Entra app role required for this
          page.
        </p>
        {from ? (
          <p className="muted">
            Requested: <code>{from}</code>
          </p>
        ) : null}
        <Link to="/dashboard" className="btn btn-primary">
          Back to dashboard
        </Link>
      </div>
    </div>
  )
}
