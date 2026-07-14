import type { Honorific } from '@/types/enums'
import type { Expertise, Languages } from '@/types/shared/enums'

export const translatedLanguages = {
  PORTUGUESE: 'Português',
  ENGLISH: 'Inglês',
  SPANISH: 'Espanhol',
  SIGNS: 'Linguagem de Sinais',
}

export interface IPsychologistProfile {
  id: string
  userId: string
  crp: string
  expertise: Expertise
  honorific: Honorific
  professionalName: string
  languages: Languages[]
  professionalBio: string | null
  status: string
  isActive: boolean
  createdAt: string
}

export interface CreatePsychologistProfileBody {
  crp: string
  expertise: string
  professionalBio?: string | null
  professionalName: string
  honorific: Honorific
  languages: Languages[]
}

export enum ContextType {
  'CLINIC' = 'CLINIC',
  'INDIVIDUAL' = 'INDIVIDUAL',
}

export enum SessionFormat {
  'ONLINE' = 'ONLINE',
  'HYBRID' = 'HYBRID',
  'IN_PERSON' = 'IN_PERSON',
}

export const translatedSessionFormat = {
  ONLINE: 'Online',
  HYBRID: 'Híbrido',
  IN_PERSON: 'Presencial',
}

export interface IPsychologistPracticeContext {
  id: string
  psychologistProfileId: string
  contextType: ContextType
  clinicId: string | null
  clinicBranchId: string | null
  consultationFee: number | null
  nickname: string | null
  sessionFormat: SessionFormat
  isActive: boolean
  createdAt: string
}

export interface CreatePracticeContextBody {
  contextType: 'INDIVIDUAL' | 'CLINIC'
  clinicId?: string | null
  clinicBranchId?: string | null
  consultationFee?: number | null
  nickname?: string | null
}
