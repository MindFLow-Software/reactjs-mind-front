import { api } from "@/lib/axios"

export interface AgeRangeData {
  ageRange: string
  count: number
}

export type GetPsychologistsAgeRangeResponse = AgeRangeData[]

export async function getPsychologistsAgeRange() {
  const { data } = await api.get<GetPsychologistsAgeRangeResponse>(
    "/admin/metrics/psychologists/age-range"
  )

  return data
}