import { api } from '@/lib/axios'
import type { Gender, Ipatient, IsessionVolume } from '@/types/patient'
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

export interface GetPatientsResponse {
  patients: Ipatient[]
  meta: PaginationMeta
}

export async function getPatients({
  pageIndex,
  perPage,
  filter,
  gender,
  isActive,
  orderBy,
  order,
  sessionVolume,
}: IgetPatientsQueryParams): Promise<GetPatientsResponse> {
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

  const response = await api.get<GetPatientsResponse>('/patients', { params })

  const patients = response.data.patients.map((patient) => ({
    ...patient,
    name:
      patient.name ??
      `${patient.firstName} ${patient.lastName}`.trim() ??
      'Paciente sem nome',
  }))

  return {
    patients,
    meta: response.data.meta,
  }
}
