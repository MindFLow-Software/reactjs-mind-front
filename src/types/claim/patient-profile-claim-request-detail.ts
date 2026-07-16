import type { IPatientProfileClaimRequest } from '@/types/claim/patient-profile-claim-request'

export type IPatientProfileClaimRequestDetail = IPatientProfileClaimRequest & {
  patientProfileFirstName: string
  patientProfileLastName: string
  patientProfileDateOfBirth: string | null
  patientProfileEmail: string | null
  patientProfileCpf: string | null
}
