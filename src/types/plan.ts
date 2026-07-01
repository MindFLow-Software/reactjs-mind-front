export const PlanInterval = {
  MONTHLY: 'MONTHLY',
  YEARLY: 'YEARLY',
} as const
export type PlanInterval = (typeof PlanInterval)[keyof typeof PlanInterval]

export interface ISubscriptionPlan {
  id: string
  name: string
  description: string[]
  priceInCents: number
  interval: PlanInterval
  createdAt: string
  updatedAt: string
}
