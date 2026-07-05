export const AccountStatus = {
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
  REJECTED: 'REJECTED',
  BLOCKED: 'BLOCKED',
} as const
export type AccountStatus = (typeof AccountStatus)[keyof typeof AccountStatus]
