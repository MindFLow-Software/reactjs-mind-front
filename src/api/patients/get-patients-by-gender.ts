import { api } from "@/lib/axios"

export interface PatientsByGenderResponse {
  gender: 'OTHER' | 'FEMININE' | 'MASCULINE'
  count: number
}

export async function getPatientsByGender(): Promise<PatientsByGenderResponse[]> {
  const response = await api.get<PatientsByGenderResponse[]>("/patients/stats/gender")
  return response.data
}
