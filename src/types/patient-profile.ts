import type { Gender } from './patient'

export enum PatientProfileStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ARCHIVED = 'ARCHIVED',
}

export interface IpatientProfile {
  id: string
  userId: string | null
  psychologistPracticeContextId: string | null
  firstName: string
  lastName: string
  email: string
  cpf: string
  phoneNumber: string | null
  gender: Gender
  dateOfBirth: Date | null
  profileImageUrl: string | null
  status: PatientProfileStatus
  archivedAt: Date | null
  createdAt: Date | null
  // TODO: remove props bellow
  isActive: boolean
  lastSessionAt: string | null
}
