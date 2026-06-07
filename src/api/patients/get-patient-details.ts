import { api } from '@/lib/axios'
import type { PatientDetailsData } from '@/types/patient'

export interface GetPatientDetailsResponse {
  patient: PatientDetailsData | null
  meta: {
    pageIndex: number
    perPage: number
    totalCount: number
    averageDuration: number | null
  }
}

export async function getPatientDetails(
  patientId: string | undefined,
  pageIndex: number,
): Promise<GetPatientDetailsResponse> {
  if (!patientId) {
    return {
      patient: null,
      meta: {
        pageIndex: 0,
        perPage: 0,
        totalCount: 0,
        averageDuration: 0,
      },
    }
  }

  const response = await api.get<GetPatientDetailsResponse>(
    `/patients/${patientId}/details`,
    {
      params: { pageIndex },
    },
  )

  const patient = (response.data.patient ?? {}) as PatientDetailsData
  const sessions = response.data?.patient?.sessions ?? []

  return {
    ...response.data,
    patient: {
      ...patient,
      sessions,
    },
  }
}
