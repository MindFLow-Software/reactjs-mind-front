import type { PlanInterval } from '@/types/plan/plan-interval'

export type ISubscriptionPlan = {
  id: string
  name: string
  description: string[]
  priceInCents: number
  interval: PlanInterval
  createdAt: string
  updatedAt: string
}
