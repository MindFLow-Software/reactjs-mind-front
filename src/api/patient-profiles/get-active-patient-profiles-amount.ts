import { api } from '@/lib/axios'

export interface IgetActivePatientProfilesAmount {
  amount: number
}

export async function getActivePatientProfilesAmount(): Promise<IgetActivePatientProfilesAmount> {
  const response = await api.get<IgetActivePatientProfilesAmount>(
    '/patient-profiles/active',
  )

  return response.data
}
