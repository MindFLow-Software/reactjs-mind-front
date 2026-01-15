import { api } from "@/lib/axios"

export interface PsychologistsChartData {
  date: string
  newPsychologists: number
}

export type GetNewPsychologistsCountResponse = PsychologistsChartData[]

export interface GetNewPsychologistsCountParams {
  from?: Date
  to?: Date
}

export async function getNewPsychologistsCount({ from, to }: GetNewPsychologistsCountParams) {
  const response = await api.get<GetNewPsychologistsCountResponse>(
    "/admin/metrics/psychologists/new",
    {
      params: {
        from: from?.toISOString(),
        to: to?.toISOString(),
      },
    }
  )
  return response.data
}