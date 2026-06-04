export const PopupType = {
  MODAL: 'MODAL',
  SLIDE_IN: 'SLIDE_IN',
  BAR: 'BAR',
  TOAST: 'TOAST',
} as const
export type PopupType = (typeof PopupType)[keyof typeof PopupType]

export const PopupStatus = {
  DRAFT: 'DRAFT',
  ACTIVE: 'ACTIVE',
  PAUSED: 'PAUSED',
  ARCHIVED: 'ARCHIVED',
} as const
export type PopupStatus = (typeof PopupStatus)[keyof typeof PopupStatus]

export interface PopupHTTP {
  id: string
  internalName: string
  title: string | null
  body: string | null
  imageUrl: string | null
  ctaText: string | null
  ctaUrl: string | null
  type: PopupType
  status: PopupStatus
  styleConfig: Record<string, unknown> | null
  triggerConfig: Record<string, unknown> | null
  displayRules: Record<string, unknown> | null
  startsAt: string | null
  endsAt: string | null
  psychologistId: string | null
}
