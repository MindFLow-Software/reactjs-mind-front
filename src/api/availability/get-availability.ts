import { api } from '@/lib/axios'
import type { AvailabilityHTTP } from '@/types/availability'

export async function getAvailability(): Promise<AvailabilityHTTP[]> {
  const response = await api.get<AvailabilityHTTP[]>('/availabilities')
  return response.data
}
