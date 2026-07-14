import type { SessionModality } from '@/types/shared/enums'

export type IPatientNextSession = {
  id: string
  scheduledAt: string
  psychologistName: string
  psychologistAvatarUrl: string | null
  durationMinutes: number
  modality: SessionModality
}
