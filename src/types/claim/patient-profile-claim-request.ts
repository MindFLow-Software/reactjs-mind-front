import type { ClaimRequestStatus } from '@/types/claim/claim-request-status'

export type IPatientProfileClaimRequest = {
  id: string
  status: ClaimRequestStatus
  reviewedById: string | null
  requestedAt: string
  approvedAt: string | null
  rejectedAt: string | null
  patientProfileId: string
  requestedCpf: string | null
  requesterUserId: string
  requesterFirstName: string
  requesterLastName: string
  requesterEmail: string
  requesterDateOfBirth: string | null
  createdAt: string
  updatedAt: string
}
