import type { ContextType } from '@/types/psychologist/context-type'

export type ICreatePracticeContextBody = {
  contextType: ContextType
  clinicId?: string | null
  clinicBranchId?: string | null
  consultationFee?: number | null
  nickname?: string | null
}
