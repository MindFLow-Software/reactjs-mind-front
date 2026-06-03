import { api } from '@/lib/axios'
import type { Ipatient, FetchPatientsParams, PatientStatus, Gender, IsessionVolume } from '@/types/patient'
import type { PaginationMeta } from '@/types/pagination'

export interface GetPatientsFilters {
  pageIndex?: number
  perPage?: number
  filter?: string
  gender?: Gender
  status?: PatientStatus
  order?: 'asc' | 'desc'
  sessionVolume?: IsessionVolume
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
  status,
  order,
  sessionVolume,
}: GetPatientsFilters): Promise<GetPatientsResponse> {
  const params: FetchPatientsParams = {
    pageIndex,
    perPage,
    filter,
    status,
    gender,
    order,
    sessionVolume: sessionVolume,
  }

  const response = await api.get<GetPatientsResponse>('/patients', { params })

  const patients = response.data.patients.map((patient) => ({
    ...patient,
    name: patient.name ?? `${patient.firstName} ${patient.lastName}`.trim() ?? 'Paciente sem nome',
  }))

  return {
    patients,
    meta: response.data.meta,
  }
}
