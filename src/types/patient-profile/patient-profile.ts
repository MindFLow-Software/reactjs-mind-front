import type { PatientProfileStatus } from '@/types/patient-profile/patient-profile-status'
import type { Gender } from '@/types/shared/enums'

export type IPatientProfile = {
  id: string
  userId: string | null
  psychologistPracticeContextId: string | null
  firstName: string
  lastName: string
  email: string | null
  cpf: string | null
  phoneNumber: string | null
  gender: Gender
  dateOfBirth: string | null
  profileImageUrl: string | null
  status: PatientProfileStatus
  archivedAt: string | null
  createdAt: string
}
