import type { Honorific } from '@/types/shared/enums'

export type IclaimCanidate = {
  createdAt: Date
  patientCpf: string
  patientProfileId: string
  patientFirstName: string
  patientLastName: string
  psychologistCrp: string
  patientDateOfBirth: string
  psychologistHonorific: Honorific
  psychologistDisplayName: string
}
