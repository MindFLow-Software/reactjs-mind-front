export enum PatientInviteStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

export type IPatientInvite = {
  patientProfileId: string
  tokenHash: string
  email: string
  expiresAt: string
  status: PatientInviteStatus
  acceptedAt: string | null
  rejectedAt: string | null
}
