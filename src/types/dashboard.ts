import type { Gender } from '@/types/patient'

export type AgeRange = '0-17' | '18-25' | '26-35' | '36-50' | '51+'

export interface AgeRangeItem {
  range: AgeRange
  count: number
}

export interface GenderItem {
  gender: Gender
  count: number
}

export interface NewPatientsItem {
  date: string
  newPatients: number
}

export interface DashboardAppointmentItem {
  id: string
  patientId: string | null
  psychologistId: string | null
  diagnosis: string
  content: string | null
  scheduledAt: string
  durationInMin: number | null
  status: string
  createdAt: string
}

export interface DashboardResponse {
  totalPatients: number
  patientsByGender: GenderItem[]
  patientsByAge: AgeRangeItem[]
  upcomingAppointments: DashboardAppointmentItem[]
  newPatientsLast7Days: NewPatientsItem[]
}

export type GetDashboardParams = {
  startDate?: string
  endDate?: string
}

export type GetAmountPatientsParams = {
  startDate: string
  endDate: string
}
