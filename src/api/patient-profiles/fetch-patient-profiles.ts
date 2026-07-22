import { api } from '@/lib/axios'
import type { IPatient } from '@/types/patient/patient'
import type { ISessionVolume } from '@/types/patient/session-volume'
import type { PatientProfileStatus } from '@/types/patient-profile/patient-profile-status'
import type { Gender } from '@/types/shared/enums'
import type { IPaginationMeta } from '@/types/shared/pagination-meta'

export type IgetPatientsQueryParams = {
  pageIndex?: number
  perPage?: number
  filter?: string
  gender?: Gender | null
  status?: PatientProfileStatus | null
  orderBy?: string
  order?: 'asc' | 'desc'
  sessionVolume?: ISessionVolume | null
}

export type IgetPatientProfilesResponse = {
  patients: IPatient[]
  meta: IPaginationMeta
}

export async function fetchPatientProfiles(
  params: IgetPatientsQueryParams,
): Promise<IgetPatientProfilesResponse> {
  const response = await api.get<IgetPatientProfilesResponse>(
    '/patient-profiles',
    { params },
  )

  return {
    patients: response.data.patients,
    meta: response.data.meta,
  }
}
