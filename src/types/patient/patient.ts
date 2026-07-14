import type { IPatientProfile } from '@/types/patient-profile/patient-profile'

export type IPatient = IPatientProfile & {
  name: string
  lastSessionAt: string | null
}
