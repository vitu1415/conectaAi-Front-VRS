import { Navigate } from 'react-router-dom'
import { useApp } from '@/contexts/AppContext'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useApp()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
