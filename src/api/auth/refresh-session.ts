import { api } from '@/lib/axios'
import type { ISessionRawResponse } from '@/types/shared/session-raw-response'

export async function refreshSession(): Promise<void> {
  await api.post<ISessionRawResponse>('/session/refresh')
}
