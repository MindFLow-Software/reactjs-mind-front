import { Gender } from '@/types/enums'
import type { IPatientProfile } from '@/types/patient-profile'

export { Gender } from '@/types/enums'

export type IPatient = IPatientProfile & {
  name: string
  lastSessionAt: string | null
}

export interface AddressByCepResponse {
  zipCode: string
  street: string
  neighborhood: string
  city: string
  number: string
  state: string
  complement: string | null
}

// TODO: move session to its own type file (session.ts)
export interface SessionItem {
  id: string
  date: string
  sessionDate: string
  createdAt: string
  theme: string
  duration: string
  status: 'Concluída' | 'Pendente'
  content: string | null
}

export interface PatientDetailsMeta {
  pageIndex: number
  perPage: number
  totalCount: number
  averageDuration: number | null
}

export interface CreatePatientBody {
  firstName: string
  lastName: string
  email?: string
  phoneNumber?: string
  profileImageUrl?: string
  dateOfBirth?: string
  cpf?: string
  gender?: Gender
  zipCode?: string
  street?: string
  number?: string
  complement?: string
  neighborhood?: string
  city?: string
  state?: string
  modality?: string
  frequency?: string
  price?: string
  source?: string
  notes?: string
}

export type CreatePatientResponse = { message: string; patientId: string }

export interface UpdatePatientBody {
  firstName?: string
  lastName?: string
  email?: string
  phoneNumber?: string
  dateOfBirth?: string
  cpf?: string
  gender?: Gender
  profileImageUrl?: string
  attachmentIds?: string[]
  zipCode?: string | null
  street?: string | null
  number?: string | null
  complement?: string | null
  neighborhood?: string | null
  city?: string | null
  state?: string | null
  modality?: string
  frequency?: string
  price?: string
  source?: string
  notes?: string
}

export type IsessionVolume = 'high' | 'low' | 'all'
