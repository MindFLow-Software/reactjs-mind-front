import { api } from '@/lib/axios'
import type { IPatientDetailsMeta } from '@/types/patient/patient-details-meta'
import type { ISessionItem } from '@/types/patient/session-item'
import type { IPatientProfile } from '@/types/patient-profile/patient-profile'

type IextendedPatientProfile = IPatientProfile & {
  sessions: ISessionItem[]
}

export type IgetPatientProfileDetailsResponse = {
  patient: IextendedPatientProfile | null
  meta: IPatientDetailsMeta
}

export async function getPatientProfileDetails(
  patientProfileId: string | undefined,
  pageIndex: number,
): Promise<IgetPatientProfileDetailsResponse> {
  if (!patientProfileId) {
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
    `/patient-profiles/${patientProfileId}/details`,
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
