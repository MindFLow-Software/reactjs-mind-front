import { refreshSession } from '@/api/auth/refresh-session'

let refreshPromise: Promise<void> | null = null

export function ensureFreshSession(): Promise<void> {
  if (!refreshPromise) {
    refreshPromise = refreshSession().finally(() => {
      refreshPromise = null
    })
  }

  return refreshPromise
}
