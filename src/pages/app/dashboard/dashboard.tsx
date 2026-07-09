import { Navigate } from 'react-router-dom'

import { useAuth } from '@/hooks/use-auth'
import { BrandedLoader } from '@/components/branded-loader'
import { useActivePracticeContextStore } from '@/store/use-active-practice-context-store'
import { getRuntimeRole } from '@/utils/get-runtime-role'
import { PlatformRole } from '@/types/enums'

const RUNTIME_ROLE_TARGET: Record<ReturnType<typeof getRuntimeRole>, string> = {
  PATIENT: '/profiles',
  PSYCHOLOGIST: '/profiles',
  BOTH: '/profiles',
  NEW_USER: '/profiles',
}

export function DashboardRedirect() {
  const { profile, isPending } = useAuth()
  const { activePracticeContextId } = useActivePracticeContextStore()

  if (isPending) {
    return <BrandedLoader message="Redirecionando..." />
  }

  if (profile?.platformRole === PlatformRole.ADMIN) {
    return <Navigate to="/admin/dashboard" replace />
  }

  if (activePracticeContextId) {
    return <Navigate to="/psychologist/dashboard" replace />
  }

  return <Navigate to={RUNTIME_ROLE_TARGET[getRuntimeRole(profile)]} replace />
}
