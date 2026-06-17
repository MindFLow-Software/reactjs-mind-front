import { api } from '@/lib/axios'

import type {
  PsychologistProfile,
  PsychologistPracticeContext,
} from '@/types/psychologist'
import type { PlatformRole } from '@/types/user'
import type { IpatientProfile } from '@/types/patient-profile'

// interface PsychologistProfileMeShape {
//   id: string
//   crp: string
//   expertise: string
//   professionalBio: string | null
//   status: string
//   isActive: boolean
// }

// interface PracticeContextMeShape {
//   id: string
//   contextType: string
//   clinicId: string | null
//   clinicBranchId: string | null
//   consultationFee: number | null
//   nickname: string | null
//   isActive: boolean
// }

// interface PatientProfileMeShape {
//   id: string
//   psychologistPracticeContextId: string | null
//   isActive: boolean
// }

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
