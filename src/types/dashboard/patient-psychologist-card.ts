import type { Expertise } from '@/types/shared/enums'

export type IPatientPsychologistCard = {
  psychologistProfileId: string
  psychologistPracticeContextId: string | null
  professionalName: string
  avatarUrl: string | null
  specialty: Expertise
  pricePerSession: number
  rating: number
  isLinked: boolean
}
