import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export function LoginPage() {
  const { authenticated, loading, login } = useAuth()
  const location = useLocation()
  const from =
    (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ??
    '/dashboard'

  if (loading) {
    return (
      <div className="page-center">
        <p className="muted">Loading…</p>
      </div>
    )
  }

  if (authenticated) {
    return <Navigate to={from} replace />
  }

  return (
    <div className="page-center">
      <div className="card login-card">
        <h1>Sign in</h1>
        <p className="lead">
          Use your Microsoft Entra ID account to access the Access Control POC.
        </p>
        <button
          type="button"
          className="btn btn-primary btn-lg"
          onClick={() => login(from)}
        >
          Sign in with Microsoft
        </button>
        <p className="hint">
          On Azure Static Web Apps this redirects to <code>/.auth/login/aad</code>. Local
          dev has no Easy Auth — deploy to SWA to test sign-in.
        </p>
      </div>
    </div>
  )
}
