import { api } from '@/lib/axios'

export type IgetActivePatientProfilesAmount = {
  amount: number
}

export async function getActivePatientProfilesAmount(): Promise<IgetActivePatientProfilesAmount> {
  const response = await api.get<IgetActivePatientProfilesAmount>(
    '/patient-profiles/metrics/active',
  )

  return response.data
}
