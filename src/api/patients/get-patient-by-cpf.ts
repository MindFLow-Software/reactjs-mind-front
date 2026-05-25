import { api } from "@/lib/axios"
import type { Expertise, PatientRole } from "@/types/expertise"
import type { Gender } from "@/types/enum-gender"
export interface Patient {
  id: string
  firstName: string
  lastName: string
  email?: string
  phoneNumber: string
  profileImageUrl?: string
  dateOfBirth: string
  cpf: string
  role: PatientRole
  gender: Gender
  expertise: Expertise
  isActive?: boolean
}

export interface GetPatientByCpfResponse {
  patient: Patient | null
}

export async function getPatientByCpf(
  cpf: string,
): Promise<GetPatientByCpfResponse> {
  const response = await api.get<GetPatientByCpfResponse>(`/patients/${cpf}`)
  return response.data
}