import type { IPatientNextSession } from '@/types/dashboard/patient-next-session'
import type { IPatientPsychologistCard } from '@/types/dashboard/patient-psychologist-card'

export type IPatientDashboardInner = {
  patientName: string
  nextSession: IPatientNextSession | null
  goals: unknown[]
  journal: unknown[]
  psychologists: IPatientPsychologistCard[]
}
