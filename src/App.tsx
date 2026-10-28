import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import { APP_ROLES } from './auth/roles'
import { RequireAuthenticated, RequireRole } from './auth/RequireRole'
import { AppLayout } from './components/AppLayout'
import { AccessDeniedPage } from './pages/AccessDeniedPage'
import { AdminPage } from './pages/AdminPage'
import { DashboardPage } from './pages/DashboardPage'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { OrdersPage } from './pages/OrdersPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/dashboard"
              element={
                <RequireAuthenticated>
                  <DashboardPage />
                </RequireAuthenticated>
              }
            />
            <Route
              path="/orders"
              element={
                <RequireRole allowed={[APP_ROLES.OrderManager]}>
                  <OrdersPage />
                </RequireRole>
              }
            />
            <Route
              path="/admin"
              element={
                <RequireRole allowed={[APP_ROLES.Admin]}>
                  <AdminPage />
                </RequireRole>
              }
            />
            <Route path="/access-denied" element={<AccessDeniedPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </AuthProvider>
  )
}
