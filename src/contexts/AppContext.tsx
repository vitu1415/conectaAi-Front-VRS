import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react'
import type { User, Event } from '@/types'
import type { RegisterRequest } from '@/types/api'
import { getAccessToken, setAccessToken, clearAccessToken } from '@/services/api'
import * as authService from '@/services/auth'
import * as usuarioService from '@/services/usuarios'
import { mapUsuarioResponse } from '@/services/mappers'

interface AppContextType {
  user: User | null
  selectedEvent: Event | null
  setSelectedEvent: (event: Event | null) => void
  isAuthenticated: boolean
  loading: boolean
  login: (email: string, senha: string) => Promise<void>
  register: (payload: RegisterRequest) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    authService
      .refresh()
      .then((data) => {
        if (cancelled) return
        setAccessToken(data.accessToken)
        return usuarioService.me()
      })
      .then((meData) => {
        if (!cancelled && meData) {
          setUser(mapUsuarioResponse(meData))
        }
      })
      .catch(() => {
        if (!cancelled) {
          clearAccessToken()
          setUser(null)
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const refreshUser = useCallback(async () => {
    const data = await usuarioService.me()
    setUser(mapUsuarioResponse(data))
  }, [])

  const login = useCallback(async (email: string, senha: string) => {
    const tokens = await authService.login({ email, senha })
    setAccessToken(tokens.accessToken)
    await refreshUser()
  }, [refreshUser])

  const register = useCallback(async (payload: RegisterRequest) => {
    const tokens = await authService.register(payload)
    setAccessToken(tokens.accessToken)
    await refreshUser()
  }, [refreshUser])

  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } catch {
      // ignora falha no logout e limpa local mesmo assim
    } finally {
      clearAccessToken()
      setUser(null)
      setSelectedEvent(null)
    }
  }, [])

  const isAuthenticated = Boolean(getAccessToken())

  return (
    <AppContext.Provider
      value={{
        user,
        selectedEvent,
        setSelectedEvent,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
