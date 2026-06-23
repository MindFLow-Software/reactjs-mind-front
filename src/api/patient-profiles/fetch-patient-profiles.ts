import { api } from '@/lib/axios'
import type { Gender, IsessionVolume } from '@/types/patient'
import type { PaginationMeta } from '@/types/pagination'
import type { IpatientProfile } from '@/types/patient-profile'

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
  patients: IpatientProfile[]
  meta: PaginationMeta
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

  const response = await api.get<IgetPatientProfilesResponse>('/patients', {
    params,
  })

  return {
    patients: response.data.patients,
    meta: response.data.meta,
  }
}
