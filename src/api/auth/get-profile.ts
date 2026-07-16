import { api } from '@/lib/axios'

import type { IMeResponse } from '@/types/me/me-response'

export type IgetMeResponse = IMeResponse

export async function getProfile(): Promise<IMeResponse> {
  const response = await api.get<IMeResponse>('/me')
  return response.data
}
