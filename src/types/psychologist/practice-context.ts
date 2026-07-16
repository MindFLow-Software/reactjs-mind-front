import type { ContextType } from '@/types/psychologist/context-type'
import type { SessionFormat } from '@/types/psychologist/session-format'

export type IPsychologistPracticeContext = {
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
