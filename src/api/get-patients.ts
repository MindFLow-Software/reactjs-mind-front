import { api } from "@/lib/axios"

// 🔹 Estrutura de um paciente
export interface Patient {
  id: string
  firstName: string
  lastName: string
  email?: string
  cpf: string
}

// 🔹 Parâmetros que o front pode enviar
export interface GetPatientsRequest {
  pageIndex?: number
  perPage?: number
  name?: string | null
}

// 🔹 Estrutura exata da resposta da API
export interface GetPatientsResponse {
  patients: Patient[]
  meta: {
    pageIndex: number
    perPage: number
    totalCount: number
  }
}

// 🔹 Função chamada pelo React Query
export async function getPatients(
  params: GetPatientsRequest
): Promise<GetPatientsResponse> {

  const response = await api.get<GetPatientsResponse>("/patients", {
    params: {
      pageIndex: params.pageIndex ?? 0,
      perPage: params.perPage ?? 10,
      ...(params.name ? { name: params.name } : {}),
    },
  })

  return response.data
}
