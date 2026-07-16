import type { Honorific, Languages } from '@/types/shared/enums'

export type ICreatePsychologistProfileBody = {
  crp: string
  expertise: string
  professionalBio?: string | null
  professionalName: string
  honorific: Honorific
  languages: Languages[]
}
