export function AdminPage() {
  return (
    <div className="page">
      <header className="page-header">
        <h1>Administration</h1>
        <p className="lead">
          Mock tenant settings — visible only with the <strong>Admin</strong> Entra app role.
        </p>
      </header>

      <div className="card">
        <h2>Tenant settings (demo)</h2>
        <dl className="meta-list">
          <div>
            <dt>Maintenance mode</dt>
            <dd>Off</dd>
          </div>
          <div>
            <dt>Audit log retention</dt>
            <dd>90 days</dd>
          </div>
          <div>
            <dt>External collaboration</dt>
            <dd>B2B guests allowed</dd>
          </div>
        </dl>
        <p className="hint">
          In production, sensitive admin APIs must validate the access token and enforce roles
          server-side — not only this UI.
        </p>
      </div>
    </div>
  )
}
