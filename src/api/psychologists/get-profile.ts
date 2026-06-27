import { api } from '@/lib/axios'

import type {
  PsychologistProfile,
  PsychologistPracticeContext,
} from '@/types/psychologist'
import type { PlatformRole } from '@/types/user'
import type { IpatientProfile } from '@/types/patient-profile'

interface ClinicMemberContextShape {
  id: string
  clinicId: string
  branchId: string | null
  memberRole: string
}

export interface IgetMeResponse {
  id: string
  firstName: string
  lastName: string
  email: string | null
  cpf: string | null
  phoneNumber: string | null
  gender: string
  dateOfBirth: string | null
  profileImageUrl: string | null
  isActive: boolean
  platformRole: PlatformRole
  createdAt: string
  psychologistProfile: PsychologistProfile | null
  practiceContexts: PsychologistPracticeContext[]
  patientProfiles: IpatientProfile[]
  clinicMemberContexts: ClinicMemberContextShape[]
}

export async function getProfile(): Promise<IgetMeResponse> {
  const response = await api.get<IgetMeResponse>('/me')
  return response.data
}
