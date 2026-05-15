import { api } from '@/lib/axios'
import type { AgeRangeItem } from '@/types/dashboard'

export type { AgeRangeItem } from '@/types/dashboard'

export async function getPatientsByAge(): Promise<AgeRangeItem[]> {
  const response = await api.get<AgeRangeItem[]>('/patients/stats/age')
  return response.data
}
