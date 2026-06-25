export enum ClaimRequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export type IclaimRequest = {
  id: string
  patientProfileId: string
  requesterUserId: string
  status: ClaimRequestStatus
  approvedAt: Date | null
  rejectedAt: Date | null
  requestedCpf: string | null
  reviewedById: string | null
  requestedAt: Date
  requesterFirstName: string
  requesterLastName: string
  requesterDateOfBirth: string
  requesterEmail: string | null
  createdAt: Date | null
  updatedAt: Date | null
}
