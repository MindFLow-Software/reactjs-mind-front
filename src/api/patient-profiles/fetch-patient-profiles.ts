import { api } from '@/lib/axios'
import type { IPatient } from '@/types/patient/patient'
import type { ISessionVolume } from '@/types/patient/session-volume'
import type { Gender } from '@/types/shared/enums'
import type { IPaginationMeta } from '@/types/shared/pagination-meta'

export type IgetPatientsQueryParams = {
  pageIndex?: number
  perPage?: number
  filter?: string
  gender?: Gender | null
  isActive?: boolean
  orderBy?: string
  order?: 'asc' | 'desc'
  sessionVolume?: ISessionVolume | null
}

export type IgetPatientProfilesResponse = {
  patients: IPatient[]
  meta: IPaginationMeta
}

export async function fetchPatientProfiles({
  pageIndex,
  perPage,
  filter,
  gender,
  isActive,
  orderBy,
  order,
  sessionVolume,
}: IgetPatientsQueryParams): Promise<IgetPatientProfilesResponse> {
  const params: IgetPatientsQueryParams = {
    pageIndex,
    perPage,
    filter,
    isActive,
    gender,
    orderBy,
    order,
    sessionVolume,
  }

  const response = await api.get<IgetPatientProfilesResponse>(
    '/patient-profiles',
    {
      params,
    },
  )

  return {
    patients: response.data.patients,
    meta: response.data.meta,
  }
}
