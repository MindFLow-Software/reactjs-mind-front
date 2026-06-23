import { api } from '@/lib/axios'
import type { AgeRangeItem } from '@/types/dashboard'

export type { AgeRangeItem } from '@/types/dashboard'

export async function getPatientProfileAgeDistribution(): Promise<
  AgeRangeItem[]
> {
  const response = await api.get<AgeRangeItem[]>(
    '/patient-profiles/metrics/age',
  )
  return response.data
}
