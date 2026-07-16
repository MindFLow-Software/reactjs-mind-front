import type { Expertise, Honorific, Languages } from '@/types/shared/enums'

export type IPsychologistProfile = {
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
