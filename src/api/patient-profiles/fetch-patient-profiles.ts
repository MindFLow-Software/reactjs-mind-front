import { api } from '@/lib/axios'
import type { Gender, IPatient, IsessionVolume } from '@/types/patient'
import type { PaginationMeta } from '@/types/pagination'

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
