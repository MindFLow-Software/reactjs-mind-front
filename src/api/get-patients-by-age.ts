import { api } from '@/lib/axios'
import type { AgeRangeItem } from '@/contracts/types'

export type { AgeRangeItem } from '@/contracts/types'

export async function getPatientsByAge(): Promise<AgeRangeItem[]> {
  const response = await api.get<AgeRangeItem[]>('/patients/stats/age')
  return response.data
}
