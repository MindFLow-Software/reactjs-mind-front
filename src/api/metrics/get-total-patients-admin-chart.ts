import { api } from '@/lib/axios'

export interface NewPatientsChartData {
  date: string
  newPatients: number
}

// 🟢 A resposta agora é explicitamente um Array para o gráfico
export type GetTotalPatientsAdminChartResponse = NewPatientsChartData[]

export interface GetTotalPatientsAdminChartParams {
  startDate: Date
  endDate: Date
}

export async function getTotalPatientsAdminChart({
  startDate,
  endDate,
}: GetTotalPatientsAdminChartParams): Promise<GetTotalPatientsAdminChartResponse> {
  const { data } = await api.get<GetTotalPatientsAdminChartResponse>(
    '/admin/metrics/patients/new', // 🟢 Rota de Admin criada no backend
    {
      params: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
    },
  )

  return data
}
