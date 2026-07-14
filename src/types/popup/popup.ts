import type { PopupStatus } from '@/types/popup/popup-status'
import type { PopupType } from '@/types/popup/popup-type'

export type IPopup = {
  id: string
  internalName: string
  title: string | null
  body: string | null
  imageUrl: string | null
  ctaText: string | null
  ctaUrl: string | null
  type: PopupType
  status: PopupStatus
  styleConfig: unknown
  triggerConfig: unknown
  displayRules: unknown
  startsAt: string | null
  endsAt: string | null
  psychologistId: string | null
}
