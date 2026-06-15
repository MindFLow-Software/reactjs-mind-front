import { api } from '@/lib/axios'
import type { Expertise } from '@/types/expertise'
import type { Gender } from '@/types/enum-gender'

export interface Patient {
  id: string
  firstName: string
  lastName: string
  email?: string
  phoneNumber: string
  profileImageUrl?: string
  dateOfBirth: string
  cpf: string
  role: string
  gender: Gender
  expertise: Expertise
  isActive?: boolean
  status?: string
  createdAt: string
}

export interface FetchPatientsQuery {
  pageIndex?: number
  perPage?: number
  search?: string | null
  status?: string | null
}

export interface FetchPatientsResponse {
  patients: Patient[]
  meta: {
    pageIndex: number
    perPage: number
    totalCount: number
  }
}

export async function fetchPatients({
  pageIndex = 0,
  perPage = 10,
  search,
}: FetchPatientsQuery): Promise<FetchPatientsResponse> {
  const response = await api.get<FetchPatientsResponse>('/patients', {
    params: {
      pageIndex: pageIndex + 1,
      perPage,
      filter: search || undefined,
    },
  })

  return {
    ...response.data,
    meta: {
      ...response.data.meta,
      pageIndex: response.data.meta.pageIndex - 1,
    },
  }
}
