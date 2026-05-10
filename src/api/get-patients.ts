import { api } from '@/lib/axios'

export interface GetPatientsFilters {
  pageIndex: number
  perPage: number
  filter?: string | null
  gender?: 'OTHER' | 'FEMININE' | 'MASCULINE' | null
  order?: 'high' | 'low' | null
}

export interface Patient {
  id: string
  firstName: string
  lastName: string
  name: string
  email: string | null
  cpf: string | null
  phoneNumber: string | null
  gender: 'OTHER' | 'FEMININE' | 'MASCULINE'
  dateOfBirth: string | null
  profileImageUrl: string | null
  createdAt: string
  lastSessionAt: string | null
}

export interface GetPatientsResponse {
  patients: Patient[]
  meta: {
    pageIndex: number
    perPage: number
    totalCount: number
  }
}

export async function getPatients({
  pageIndex,
  perPage,
  filter,
  gender,
  order,
}: GetPatientsFilters): Promise<GetPatientsResponse> {
  const response = await api.get('/patients', {
    params: {
      pageIndex: pageIndex + 1,
      perPage,
      filter: filter || undefined,
      gender: gender && gender !== 'all' ? gender : undefined,
      order: order && order !== 'all' ? order : undefined,
    },
  })

  const patients: Patient[] = response.data.patients.map((p: Patient) => ({
    ...p,
    name: p.name || `${p.firstName} ${p.lastName}`.trim() || 'Paciente sem nome',
    profileImageUrl: p.profileImageUrl ?? null,
    lastSessionAt: p.lastSessionAt ?? null,
  }))

  return {
    patients,
    meta: {
      ...response.data.meta,
      pageIndex: response.data.meta.pageIndex - 1,
    },
  }
}
