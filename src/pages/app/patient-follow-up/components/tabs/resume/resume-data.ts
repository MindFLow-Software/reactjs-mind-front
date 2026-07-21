import type { ChartConfig } from '@/components/ui/chart'

export type IRecentDocument = {
  id: string
  title: string
  type: string
  date: string
}

export const RECENT_DOCUMENTS: IRecentDocument[] = [
  {
    id: 'doc-1',
    title: 'Relatório psicológico — 1º semestre',
    type: 'Relatório',
    date: '02 jun 2026',
  },
  {
    id: 'doc-2',
    title: 'Laudo psicológico — Avaliação inicial',
    type: 'Laudo',
    date: '18 mai 2026',
  },
  {
    id: 'doc-3',
    title: 'Anotação de sessão — Sessão 12',
    type: 'Anotação',
    date: '05 mai 2026',
  },
  {
    id: 'doc-4',
    title: 'Encaminhamento — Avaliação psiquiátrica',
    type: 'Encaminhamento',
    date: '22 abr 2026',
  },
  {
    id: 'doc-5',
    title: 'Termo de consentimento informado',
    type: 'Termo',
    date: '10 abr 2026',
  },
]

export const FREQUENCY_DATA = [
  { month: 'JAN', sessions: 4 },
  { month: 'FEV', sessions: 2 },
  { month: 'MAR', sessions: 1 },
  { month: 'ABR', sessions: 4 },
  { month: 'MAI', sessions: 7 },
  { month: 'JUN', sessions: 6 },
  { month: 'JUL', sessions: 2 },
  { month: 'AGO', sessions: 3 },
  { month: 'SET', sessions: 9 },
  { month: 'OUT', sessions: 5 },
  { month: 'NOV', sessions: 1 },
  { month: 'DEZ', sessions: 3 },
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
