import { api } from '@/lib/axios'
import type { IPsychologistAvailability } from '@/types/availability'

export async function getAvailability(): Promise<IPsychologistAvailability[]> {
  const response = await api.get<IPsychologistAvailability[]>('/availabilities')
  return response.data
}
