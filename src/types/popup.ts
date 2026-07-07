import type { PopupType } from '@/types/enums'

export const PopupStatus = {
  DRAFT: 'DRAFT',
  ACTIVE: 'ACTIVE',
  PAUSED: 'PAUSED',
  ARCHIVED: 'ARCHIVED',
} as const
export type PopupStatus = (typeof PopupStatus)[keyof typeof PopupStatus]

export interface IPopup {
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
