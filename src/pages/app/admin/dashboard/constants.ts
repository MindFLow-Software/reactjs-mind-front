import { Gender } from '@/types/shared/enums'
import type { IChartCardKeys } from '@/components/chart-card/chart-card'

export enum AdminAnalyticsSubject {
  PATIENTS = 'PATIENTS',
  PSYCHOLOGISTS = 'PSYCHOLOGISTS',
}

export const ADMIN_CHART_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
]

export const GENDER_SLICE_COLOR: Record<Gender, string> = {
  [Gender.FEMININE]: 'var(--gender-feminine)',
  [Gender.MASCULINE]: 'var(--gender-masculine)',
  [Gender.OTHER]: 'var(--gender-other)',
}

export type IAdminPieDatum = {
  name: string
  count: number
}

export const ADMIN_PIE_KEYS: IChartCardKeys<IAdminPieDatum> = {
  name: 'name',
  value: 'count',
}
