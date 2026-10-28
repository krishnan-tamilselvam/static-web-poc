import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  fetchClientPrincipal,
  getEntraAppRoles,
  isAuthenticated,
  isGuestUser,
  loginWithEntra,
  logout,
} from './authClient'
import type { AppRole } from './roles'
import type { ClientPrincipal } from './types'

export type AuthContextValue = {
  principal: ClientPrincipal | null
  loading: boolean
  authenticated: boolean
  roles: AppRole[]
  isGuest: boolean
  refresh: () => Promise<void>
  login: (redirect?: string) => void
  signOut: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [principal, setPrincipal] = useState<ClientPrincipal | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    const next = await fetchClientPrincipal()
    setPrincipal(next)
    setLoading(false)
  }, [])

  useEffect(() => {
    let active = true
    void fetchClientPrincipal().then((next) => {
      if (active) {
        setPrincipal(next)
        setLoading(false)
      }
    })
    return () => {
      active = false
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      principal,
      loading,
      authenticated: isAuthenticated(principal),
      roles: getEntraAppRoles(principal),
      isGuest: isGuestUser(principal),
      refresh,
      login: loginWithEntra,
      signOut: () => logout('/login'),
    }),
    [principal, loading, refresh],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
