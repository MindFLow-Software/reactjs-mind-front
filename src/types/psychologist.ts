import type { Expertise } from './expertise'

export enum Honorific {
  'MASC_DR' = 'MASC_DR',
  'FEMININE_DR' = 'FEMININE_DR',
  'MSC' = 'MSC',
  'PHD' = 'PHD',
}

export enum Languages {
  'PORTUGUESE' = 'PORTUGUESE',
  'ENGLISH' = 'ENGLISH',
  'SPANISH' = 'SPANISH',
  'SIGNS' = 'SIGNS',
}

export const translatedLanguages = {
  PORTUGUESE: 'Português',
  ENGLISH: 'Inglês',
  SPANISH: 'Espanhol',
  SIGNS: 'Linguagem de Sinais',
}

export interface PsychologistProfile {
  id: string
  userId: string
  crp: string
  expertise: Expertise
  honorific: Honorific
  professionalName: string
  professionalBio: string | null
  status: string
  isActive: boolean
  languages: Languages[]
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

export interface PsychologistPracticeContext {
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
