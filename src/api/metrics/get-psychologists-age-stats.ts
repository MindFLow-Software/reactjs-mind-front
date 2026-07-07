import { api } from '@/lib/axios'

export interface IPsychologistAgeStats {
  ageRange: string
  count: number
}

export async function getPsychologistsAgeStats() {
  const response = await api.get<IPsychologistAgeStats[]>(
    '/admin/metrics/psychologists/age-range',
  )
  return response.data
}
