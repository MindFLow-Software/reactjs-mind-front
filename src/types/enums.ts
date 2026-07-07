export enum PlatformRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  SUPPORT = 'SUPPORT',
}

export enum Gender {
  OTHER = 'OTHER',
  FEMININE = 'FEMININE',
  MASCULINE = 'MASCULINE',
}

export enum Expertise {
  OTHER = 'OTHER',
  SOCIAL = 'SOCIAL',
  INFANT = 'INFANT',
  CLINICAL = 'CLINICAL',
  JURIDICAL = 'JURIDICAL',
  EDUCATIONAL = 'EDUCATIONAL',
  ORGANIZATIONAL = 'ORGANIZATIONAL',
  PSYCHOTHERAPIST = 'PSYCHOTHERAPIST',
  NEUROPSYCHOLOGY = 'NEUROPSYCHOLOGY',
}

export enum Honorific {
  MASC_DR = 'MASC_DR',
  FEMININE_DR = 'FEMININE_DR',
  MSC = 'MSC',
  PHD = 'PHD',
}

export const Languages = {
  PORTUGUESE: 'PORTUGUESE',
  ENGLISH: 'ENGLISH',
  SPANISH: 'SPANISH',
  SIGNS: 'SIGNS',
} as const
export type Languages = (typeof Languages)[keyof typeof Languages]

export const AppointmentStatus = {
  SCHEDULED: 'SCHEDULED',
  ATTENDING: 'ATTENDING',
  FINISHED: 'FINISHED',
  CANCELED: 'CANCELED',
  NOT_ATTEND: 'NOT_ATTEND',
  RESCHEDULED: 'RESCHEDULED',
} as const
export type AppointmentStatus =
  (typeof AppointmentStatus)[keyof typeof AppointmentStatus]

export const PatientProfileStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  ARCHIVED: 'ARCHIVED',
} as const
export type PatientProfileStatus =
  (typeof PatientProfileStatus)[keyof typeof PatientProfileStatus]

export const PatientInviteStatus = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
} as const
export type PatientInviteStatus =
  (typeof PatientInviteStatus)[keyof typeof PatientInviteStatus]

export const ClaimRequestStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
} as const
export type ClaimRequestStatus =
  (typeof ClaimRequestStatus)[keyof typeof ClaimRequestStatus]

export const SuggestionCategory = {
  UI_UX: 'UI_UX',
  SCHEDULING: 'SCHEDULING',
  REPORTS: 'REPORTS',
  PRIVACY_LGPD: 'PRIVACY_LGPD',
  INTEGRATIONS: 'INTEGRATIONS',
  OTHERS: 'OTHERS',
} as const
export type SuggestionCategory =
  (typeof SuggestionCategory)[keyof typeof SuggestionCategory]

export const SuggestionStatus = {
  PENDING: 'PENDING',
  OPEN: 'OPEN',
  UNDER_REVIEW: 'UNDER_REVIEW',
  PLANNED: 'PLANNED',
  IMPLEMENTED: 'IMPLEMENTED',
  REJECTED: 'REJECTED',
} as const
export type SuggestionStatus =
  (typeof SuggestionStatus)[keyof typeof SuggestionStatus]

export const PopupType = {
  MODAL: 'MODAL',
  SLIDE_IN: 'SLIDE_IN',
  BAR: 'BAR',
  TOAST: 'TOAST',
} as const
export type PopupType = (typeof PopupType)[keyof typeof PopupType]
