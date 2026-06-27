export enum ClaimRequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export type IpatientProfileClaimRequest = {
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

export type IpatientProfileClaimRequestWithRequester = IpatientProfileClaimRequest & {
  requesterFirstName: string
  requesterLastName: string
  requesterDateOfBirth: Date | null
  requesterEmail: string | null
}

export type IcompletePatientProfileClaimRequest = IpatientProfileClaimRequestWithRequester & {
  patientProfileFirstName: string
  patientProfileLastName: string
  patientProfileDateOfBirth: string
  patientProfileEmail: string | null
  patientProfileCpf: string | null
}
