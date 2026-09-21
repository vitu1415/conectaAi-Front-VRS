import { Navigate, useLocation } from 'react-router-dom'
import { useApp } from '@/contexts/AppContext'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useApp()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-500 mt-3">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/app/login" replace />
  }

  const isNewUser = localStorage.getItem('newUser') === 'true'
  const isOnboardingPage = location.pathname === '/app/onboarding'

  if (isNewUser && !isOnboardingPage) {
    return <Navigate to="/app/onboarding" replace />
  }

  if (!isNewUser && isOnboardingPage) {
    return <Navigate to="/app/events" replace />
  }

  return <>{children}</>
}