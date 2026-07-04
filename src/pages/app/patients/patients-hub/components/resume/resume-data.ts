import type { ChartConfig } from '@/components/ui/chart'

export const FREQUENCY_DATA = [
  { month: 'NOV', sessions: 1 },
  { month: 'DEZ', sessions: 3 },
  { month: 'JAN', sessions: 4 },
  { month: 'FEV', sessions: 2 },
  { month: 'MAR', sessions: 1 },
  { month: 'ABR', sessions: 0 },
]

export const HUMOR_DATA = [
  { date: '03/01', score: 6 },
  { date: '17/01', score: 5.5 },
  { date: '07/02', score: 7 },
  { date: '21/02', score: 4 },
  { date: '07/03', score: 5.5 },
  { date: '21/03', score: 6.5 },
  { date: '28/03', score: 6 },
  { date: '04/04', score: 5 },
]

export const HUMOR_AVG = (
  HUMOR_DATA.reduce((acc, entry) => acc + entry.score, 0) / HUMOR_DATA.length
).toFixed(1)

export const frequencyConfig = {
  sessions: { label: 'Sessões', color: 'var(--chart-blue)' },
} satisfies ChartConfig

export const humorConfig = {
  score: { label: 'Humor', color: 'var(--chart-blue)' },
} satisfies ChartConfig
