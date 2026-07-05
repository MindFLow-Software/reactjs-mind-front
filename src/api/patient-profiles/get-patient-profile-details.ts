import { api } from '@/lib/axios'
import type { SessionItem } from '@/types/patient'
import type { IPatientProfile } from '@/types/patient-profile'

type IextendedPatientProfile = IPatientProfile & {
  sessions: SessionItem[]
}

export interface IgetPatientProfileDetailsResponse {
  patient: IextendedPatientProfile | null
  meta: {
    pageIndex: number
    perPage: number
    totalCount: number
    averageDuration: number | null
  }
}

export async function getPatientProfileDetails(
  patientId: string | undefined,
  pageIndex: number,
): Promise<IgetPatientProfileDetailsResponse> {
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

  const response = await api.get<IgetPatientProfileDetailsResponse>(
    `/patient-profiles/${patientId}/details`,
    {
      params: { pageIndex },
    },
  )

  const patient = response.data?.patient

  return {
    ...response.data,
    patient,
  }
}
