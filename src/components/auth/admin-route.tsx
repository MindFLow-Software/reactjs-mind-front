import { Navigate } from 'react-router-dom'

import { useAuth } from '@/hooks/use-auth'
import { PlatformRole } from '@/types/user'

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { profile } = useAuth()

  if (profile?.platformRole !== PlatformRole.ADMIN) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />
  }

  return <>{children}</>
}
