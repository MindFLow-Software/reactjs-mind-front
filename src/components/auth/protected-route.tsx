import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { useAuth } from '@/hooks/use-auth'
import { BrandedLoader } from '@/components/branded-loader'

export function ProtectedRoute({ children }: { children?: React.ReactNode }) {
  const { isAuthenticated, isPending } = useAuth()
  const location = useLocation()

  if (isPending) {
    return <BrandedLoader message="Verificando acesso..." />
  }

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />
  }

  return <>{children || <Outlet />}</>
}
