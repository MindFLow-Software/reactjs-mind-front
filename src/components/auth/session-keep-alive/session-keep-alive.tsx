import { useSessionRefreshScheduler } from './use-session-refresh-scheduler'

export function SessionKeepAlive(): null {
  useSessionRefreshScheduler()
  return null
}
