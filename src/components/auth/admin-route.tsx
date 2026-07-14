import { Navigate } from 'react-router-dom'

import { useAuth } from '@/hooks/use-auth'
import { BrandedLoader } from '@/components/branded-loader'
import { PlatformRole } from '@/types/shared/enums'

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { profile, isPending } = useAuth()

  if (isPending) {
    return <BrandedLoader message="Verificando acesso..." />
  }

  if (profile?.platformRole !== PlatformRole.ADMIN) {
    return <Navigate to="/profiles" replace />
  }

  return <>{children}</>
}
