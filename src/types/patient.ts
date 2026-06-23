export enum Gender {
  OTHER = 'OTHER',
  FEMININE = 'FEMININE',
  MASCULINE = 'MASCULINE',
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
  cep?: string
  logradouro?: string
  bairro?: string
  cidade?: string
  uf?: string
}

export type CreatePatientResponse = { message: string; patientId: string }

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
