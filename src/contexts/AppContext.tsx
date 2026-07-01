import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { User, Event } from '@/types'
import { MOCK_USER } from '@/constants'

interface AppContextType {
  user: User
  selectedEvent: Event | null
  setSelectedEvent: (event: Event | null) => void
  isAuthenticated: boolean
  login: () => void
  logout: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [user] = useState<User>(MOCK_USER)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('@conectaai:auth') === 'true'
  })

  const login = useCallback(() => {
    localStorage.setItem('@conectaai:auth', 'true')
    setIsAuthenticated(true)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('@conectaai:auth')
    setIsAuthenticated(false)
    setSelectedEvent(null)
  }, [])

  return (
    <AppContext.Provider value={{ user, selectedEvent, setSelectedEvent, isAuthenticated, login, logout }}>
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
