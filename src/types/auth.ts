export const UserType = {
  PATIENT: 'PATIENT',
  PSYCHOLOGIST: 'PSYCHOLOGIST',
  ADMIN: 'ADMIN',
  DEV: 'DEV',
  CLINIC: 'CLINIC',
} as const
export type UserType = (typeof UserType)[keyof typeof UserType]

export const AccountStatus = {
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
  REJECTED: 'REJECTED',
  BLOCKED: 'BLOCKED',
} as const
export type AccountStatus = (typeof AccountStatus)[keyof typeof AccountStatus]
