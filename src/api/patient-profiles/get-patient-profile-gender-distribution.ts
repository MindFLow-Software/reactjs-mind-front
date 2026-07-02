import { api } from '@/lib/axios'

export interface IgetPatientProfileGenderDistributionResponse {
  gender: 'OTHER' | 'FEMININE' | 'MASCULINE'
  count: number
}

export async function getPatientProfileGenderDistribution(): Promise<
  IgetPatientProfileGenderDistributionResponse[]
> {
  const response = await api.get<
    IgetPatientProfileGenderDistributionResponse[]
  >('/patient-profiles/metrics/gender')
  return response.data
}
