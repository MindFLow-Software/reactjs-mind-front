import type { Gender, PatientProfileStatus } from '@/types/enums'

export interface IPatientProfile {
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

export interface IPatientProfileAccessCode {
  code: string
  expiresAt: string
  patientProfileId: string
}
