import { useEffect } from 'react'
import { ensureFreshSession } from '@/lib/ensure-fresh-session'

// Mirrors the backend access_token TTL (docs/frontend-reference/01-entities-and-types.md).
const ACCESS_TOKEN_TTL_MS = 15 * 60 * 1000
const PROACTIVE_REFRESH_MARGIN_MS = 60 * 1000

export function useSessionRefreshScheduler(): void {
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>

    function schedule() {
      timeoutId = setTimeout(() => {
        ensureFreshSession()
          .catch(() => { })
          .finally(schedule)
      }, ACCESS_TOKEN_TTL_MS - PROACTIVE_REFRESH_MARGIN_MS)
    }

    schedule()

    return () => clearTimeout(timeoutId)
  }, [])
}
