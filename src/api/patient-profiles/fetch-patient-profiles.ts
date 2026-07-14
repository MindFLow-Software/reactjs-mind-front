import { api } from '@/lib/axios'
import type { IPatient, IsessionVolume } from '@/types/patient'
import type { Gender } from '@/types/shared/enums'
import type { IPaginationMeta } from '@/types/shared/pagination-meta'

export interface IgetPatientsQueryParams {
  pageIndex?: number
  perPage?: number
  filter?: string
  gender?: Gender | null
  isActive?: boolean
  orderBy?: string
  order?: 'asc' | 'desc'
  sessionVolume?: IsessionVolume | null
}

export interface IgetPatientProfilesResponse {
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
