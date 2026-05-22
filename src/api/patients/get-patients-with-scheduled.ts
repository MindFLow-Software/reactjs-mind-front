import { api } from "@/lib/axios"

export interface Patient {
  id: string
  firstName: string
  lastName: string
}

export interface GetPatientsResponse {
  patients: Patient[]
}

export async function getPatientsWithScheduled() {
  const response = await api.get<GetPatientsResponse>('/patients/scheduled')
  return response.data
}