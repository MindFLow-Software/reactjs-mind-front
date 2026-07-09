import type { IDashboardGoal } from '@/pages/app/dashboard/shared/types'

export enum SessionModality {
  ONLINE = 'ONLINE',
  PRESENTIAL = 'PRESENTIAL',
}

export interface IPatientNextSession {
  date: string
  psychologistName: string
  psychologistAvatarUrl: string | null
  durationMinutes: number
  modality: SessionModality
}

export interface IPatientJournalEntry {
  id: string
  date: string
  title: string
  excerpt: string
}

export interface IPatientPsychologistCard {
  id: string
  name: string
  avatarUrl: string | null
  specialty: string
  rating: number
  /** cents, formatted via `Currency.toBRL` */
  pricePerSession: number
  isLinked: boolean
}

export interface IPatientDashboardData {
  patientName: string
  nextSession: IPatientNextSession | null
  goals: IDashboardGoal[]
  journal: IPatientJournalEntry[]
  psychologists: IPatientPsychologistCard[]
}
