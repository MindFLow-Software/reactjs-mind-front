import { api } from "@/lib/axios"

export interface PsychologistGenderStats {
  gender: string
  count: number
}

export type GetPsychologistsGenderResponse = PsychologistGenderStats[]

export async function getPsychologistsGenderStats(): Promise<GetPsychologistsGenderResponse> {
  const response = await api.get<GetPsychologistsGenderResponse>(
    "/admin/metrics/psychologists/gender"
  )

  return response.data
}