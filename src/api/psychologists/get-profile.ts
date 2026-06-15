import { api } from '@/lib/axios'
import type { PlatformRole } from '@/types/user'

interface PsychologistProfileMeShape {
  id: string
  crp: string
  expertise: string
  professionalBio: string | null
  status: string
  isActive: boolean
}

interface PracticeContextMeShape {
  id: string
  contextType: string
  clinicId: string | null
  clinicBranchId: string | null
  consultationFee: number | null
  nickname: string | null
  isActive: boolean
}

interface PatientProfileMeShape {
  id: string
  psychologistPracticeContextId: string | null
  isActive: boolean
}

interface ClinicMemberContextShape {
  id: string
  clinicId: string
  branchId: string | null
  memberRole: string
}

export interface GetMeResponse {
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
  psychologistProfile: PsychologistProfileMeShape | null
  practiceContexts: PracticeContextMeShape[]
  patientProfiles: PatientProfileMeShape[]
  clinicMemberContexts: ClinicMemberContextShape[]
}

export async function getProfile(): Promise<GetMeResponse> {
  const response = await api.get<GetMeResponse>('/me')
  return response.data
}
