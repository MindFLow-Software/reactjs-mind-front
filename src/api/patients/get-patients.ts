import { api } from '@/lib/axios'
import type { PatientHTTP, FetchPatientsParams } from '@/types/patient'
import type { PaginationMeta } from '@/types/pagination'

export type { PatientHTTP, FetchPatientsParams } from '@/types/patient'
export type Patient = PatientHTTP

export interface GetPatientsFilters {
  pageIndex: number
  perPage: number
  filter?: string | null
  gender?: PatientHTTP['gender'] | 'all' | null
  status?: 'active' | 'inactive' | 'all' | null
  order?: 'asc' | 'desc' | 'all' | null
  sessionVolume?: 'high' | 'low' | 'all' | null
}

export interface GetPatientsResponse {
  patients: PatientHTTP[]
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
    filter: filter || undefined,
    status: status && status !== 'all' ? status : undefined,
    gender: gender && gender !== 'all' ? gender : undefined,
    order: order && order !== 'all' ? order : undefined,
    sessionVolume: sessionVolume && sessionVolume !== 'all' ? sessionVolume : undefined,
  }

  const response = await api.get<GetPatientsResponse>('/patients', { params })

  const patients: PatientHTTP[] = response.data.patients.map((p) => ({
    ...p,
    name:            p.name || `${p.firstName} ${p.lastName}`.trim() || 'Paciente sem nome',
    profileImageUrl: p.profileImageUrl ?? null,
    lastSessionAt:   p.lastSessionAt ?? null,
    isActive:        p.isActive ?? (p.status === 'active'),
    status:          p.status   ?? (p.isActive ? 'active' : 'inactive'),
  }))

  return {
    patients,
    meta: response.data.meta,
  }
}
