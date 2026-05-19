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

export interface GetPatientsByNameResponse {
  patients: Patient[]
}

export async function getPatientsByName(
  name: string,
): Promise<GetPatientsByNameResponse> {
  const response = await api.get<GetPatientsByNameResponse>(`/patients/${name}`)
  return response.data
}