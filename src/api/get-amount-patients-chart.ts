import { api } from "@/lib/axios"

export type NewPatientsResponse = {
  date: string
  newPatients: number
}[]

export async function getAmountPatientsChart(): Promise<NewPatientsResponse> {
  const { data } = await api.get<NewPatientsResponse>("/patients/stats/new")
  return data
}
