import type { InsightSeverity } from '@/types/shared/enums'

export type IDashboardInsight = {
  severity: InsightSeverity
  title: string
  description: string
}
