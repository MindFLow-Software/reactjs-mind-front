export const Gender = {
  OTHER: 'OTHER',
  FEMININE: 'FEMININE',
  MASCULINE: 'MASCULINE',
} as const

export type Gender = (typeof Gender)[keyof typeof Gender]

export interface Ipatient {
  id: string
  userId: string
  psychologistPracticeContextId: string
  isActive: boolean
  archivedAt: string | null
  createdAt: string
  firstName: string
  lastName: string
  email: string | null
  phoneNumber: string | null
  cpf: string | null
  gender: Gender
  dateOfBirth: string | null
  profileImageUrl: string | null
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

export interface PatientDetailsData extends Ipatient {
  sessions: SessionItem[]
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
  cep?: string
  logradouro?: string
  bairro?: string
  cidade?: string
  uf?: string
}

export type CreatePatientResponse = { message: string, patientId: string }

export interface UpdatePatientBody {
  firstName?: string
  lastName?: string
  phoneNumber?: string
  dateOfBirth?: string
  cpf?: string
  gender?: Gender
  profileImageUrl?: string
  attachmentIds?: string[]
  cep?: string | null
  logradouro?: string | null
  bairro?: string | null
  cidade?: string | null
  uf?: string | null
}

// POST /invites/:hash/register — senha: mín. 8 chars, maiúscula, minúscula, número, especial
export interface RegisterPatientBody {
  firstName: string
  lastName: string
  email: string
  password: string
  gender: Gender
  phoneNumber?: string
  dateOfBirth?: string
  cpf?: string
}

export type RegisterPatientViaInviteBody = RegisterPatientBody
export type RegisterPatientViaInviteResponse = {
  patientId: string
  userId: string
  firstName: string
  lastName: string
  email: string
  psychologistPracticeContextId: string
}

export type IsessionVolume = 'high' | 'low' | 'all'
