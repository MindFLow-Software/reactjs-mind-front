import { api } from '@/lib/axios'

export type InewPatientProfileAmount = {
  date: string
  newPatients: number
}[]

export type GetAmountPatientsChartParams = {
  startDate: Date
  endDate: Date
}

export async function getNewPatientProfilesAmount({
  startDate,
  endDate,
}: GetAmountPatientsChartParams): Promise<InewPatientProfileAmount> {
  const { data } = await api.get<InewPatientProfileAmount>(
    '/patient-profiles/metrics/new',
    {
      params: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
    },
  )

  return data
}
