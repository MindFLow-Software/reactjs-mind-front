import { api } from '@/lib/axios'
import type { IMutationResult } from '@/types/api'

export async function generateRegistrationLink(): Promise<
  IMutationResult<void>
> {
  const response = await api.post('/registration-links')

  return { data: response.data, message: response.apiMessage ?? null }
}
