import type { ClaimRequestStatus } from '@/types/enums'

export { ClaimRequestStatus } from '@/types/enums'

export interface IPatientProfileClaimRequest {
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

export type IPatientProfileClaimRequestDetail = IPatientProfileClaimRequest & {
  patientProfileFirstName: string
  patientProfileLastName: string
  patientProfileDateOfBirth: string | null
  patientProfileEmail: string | null
  patientProfileCpf: string | null
}
