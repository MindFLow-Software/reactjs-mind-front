import type { IPatientProfile } from '../patient-profile/patient-profile'

export type ICreatePatientResponse = {
  message: string | null
  patientProfile: IPatientProfile
}
