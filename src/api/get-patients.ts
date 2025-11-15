import { api } from '@/lib/axios'

// 1. 🔑 A interface deve ser exportada
export interface Patient {
  id: string
  firstName: string
  lastName: string
  email?: string
  cpf: string
}

// 2. 🔑 A interface de resposta deve ser exportada
export interface GetPatientsRequest {
  pageIndex?: number
  perPage?: number
  name?: string | null
}

// 3. 🔑 A interface de resposta final deve ser exportada
export interface GetPatientsResponse {
  patients: Patient[]
  meta: {
    pageIndex: number
    perPage: number
    totalCount: number
  }
}

export async function getPatients(
  params: GetPatientsRequest,
): Promise<GetPatientsResponse> {
  
  const response = await api.get<GetPatientsResponse>('/patients', {
    params: {
        pageIndex: params.pageIndex ?? 0, 
        perPage: params.perPage ?? 10, 
        ...(params.name && { name: params.name }),
    },
  })

  return response.data
}