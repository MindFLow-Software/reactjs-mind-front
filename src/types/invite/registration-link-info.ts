import type { Honorific } from '@/types/shared/enums'

export type IRegistrationLinkInfo = {
  expiresAt: string
  psychologistCrp: string
  professionalName: string
  psychologistProfileId: string
  psychologistHonorific: Honorific
  psychologistPracticeContextId: string
}
