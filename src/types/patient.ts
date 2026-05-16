export const Gender = {
  OTHER:     'OTHER',
  FEMININE:  'FEMININE',
  MASCULINE: 'MASCULINE',
} as const
export type Gender = (typeof Gender)[keyof typeof Gender]

export type PatientStatus = 'active' | 'inactive' | 'pending' | 'archived'

export interface PatientHTTP {
  id:              string
  firstName:       string
  lastName:        string
  name:            string
  email:           string | null
  cpf:             string | null
  phoneNumber:     string | null
  gender:          Gender
  dateOfBirth:     string | null
  profileImageUrl: string | null
  createdAt:       string
  lastSessionAt:   string | null
  isActive:        boolean
}

export interface SessionItem {
  id:          string
  date:        string
  sessionDate: string
  createdAt:   string
  theme:       string
  duration:    string
  status:      'Concluída' | 'Pendente'
  content:     string | null
}

export interface PatientDetailsData {
  id:              string
  firstName:       string
  lastName:        string
  cpf:             string | null
  email:           string | null
  profileImageUrl: string | null
  phoneNumber:     string | null
  dateOfBirth:     string | null
  gender:          Gender
  sessions:        SessionItem[]
}

export interface PatientDetailsMeta {
  pageIndex:       number
  perPage:         number
  totalCount:      number
  averageDuration: number | null
}

export interface CreatePatientBody {
  firstName:        string
  lastName:         string
  phoneNumber?:     string
  profileImageUrl?: string
  dateOfBirth?:     string
  cpf?:             string
  gender?:          Gender
}

export type CreatePatientResponse = PatientHTTP

export interface UpdatePatientBody {
  firstName?:       string
  lastName?:        string
  phoneNumber?:     string
  dateOfBirth?:     string
  cpf?:             string
  gender?:          Gender
  profileImageUrl?: string
  attachmentIds?:   string[]
}

// POST /invites/:hash/register — senha: mín. 8 chars, maiúscula, minúscula, número, especial
export interface RegisterPatientBody {
  firstName:    string
  lastName:     string
  email:        string
  password:     string
  gender:       Gender
  phoneNumber?: string
  dateOfBirth?: string
  cpf?:         string
}

export type RegisterPatientViaInviteBody     = RegisterPatientBody
export type RegisterPatientViaInviteResponse = { message: string }

export type FetchPatientsParams = {
  pageIndex?:     number
  perPage?:       number
  filter?:        string
  status?:        'active' | 'inactive'
  gender?:        Gender
  order?:         'asc' | 'desc'
  sessionVolume?: 'high' | 'low'
}
