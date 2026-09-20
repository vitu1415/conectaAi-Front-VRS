import { Navigate } from 'react-router-dom'
import { useApp } from '@/contexts/AppContext'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useApp()

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

  return <>{children}</>
}