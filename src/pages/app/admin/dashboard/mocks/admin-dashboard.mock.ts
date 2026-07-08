import { subDays, startOfDay, formatISO } from 'date-fns'

import {
  InsightSeverity,
  type DashboardPeriod,
  type IDashboardInsight,
} from '@/pages/app/dashboard/shared/types'
import { PERIOD_DAYS } from '@/pages/app/dashboard/shared/constants'
import { Gender } from '@/types/enums'
import type {
  IAdminDashboardActivity,
  IAdminDashboardPatients,
  IAdminDashboardPsychologists,
  IAdminDashboardRevenue,
  IRegionStat,
  ISpecialtyStat,
  ITimeSeriesPoint,
} from '../types'

export interface IAdminExecutiveMock {
  sessions: number
  mrr: number
  clinics: number
  premium: number
  freemium: number
  conversionPercent: number
}

export interface IAdminGrowthMock {
  clinics: ITimeSeriesPoint[]
}

export type IAdminPsychologistsMock = Pick<
  IAdminDashboardPsychologists,
  'active' | 'inactive' | 'byState' | 'specialties'
>

export type IAdminPatientsMock = Pick<
  IAdminDashboardPatients,
  'byAge' | 'byGender' | 'byRegion'
>

export interface IAdminDashboardMock {
  executive: IAdminExecutiveMock
  growth: IAdminGrowthMock
  revenue: IAdminDashboardRevenue
  activity: IAdminDashboardActivity
  psychologists: IAdminPsychologistsMock
  patients: IAdminPatientsMock
  insights: IDashboardInsight[]
}

function buildDailySeries(
  days: number,
  seed: number,
  amplitude: number,
): ITimeSeriesPoint[] {
  const referenceDate = startOfDay(new Date())
  return Array.from({ length: days }, (_, index) => {
    const date = subDays(referenceDate, days - index - 1)
    const wave = Math.sin((index + seed) / 3)
    const count = Math.max(0, Math.round(amplitude + wave * amplitude))
    return {
      date: formatISO(date, { representation: 'date' }),
      count,
    }
  })
}

const BY_STATE: IRegionStat[] = [
  { region: 'SP', count: 128 },
  { region: 'RJ', count: 74 },
  { region: 'MG', count: 51 },
  { region: 'RS', count: 33 },
  { region: 'Outros', count: 42 },
]

const SPECIALTIES: ISpecialtyStat[] = [
  { specialty: 'Terapia cognitivo-comportamental', count: 96 },
  { specialty: 'Psicanálise', count: 58 },
  { specialty: 'Terapia sistêmica', count: 34 },
  { specialty: 'Terapia humanista', count: 27 },
]

const PATIENTS_BY_REGION: IRegionStat[] = [
  { region: 'SP', count: 412 },
  { region: 'RJ', count: 231 },
  { region: 'MG', count: 168 },
  { region: 'RS', count: 97 },
  { region: 'Outros', count: 140 },
]

const INSIGHTS: IDashboardInsight[] = [
  {
    id: 'insight-inactive-psychologists',
    severity: InsightSeverity.WARNING,
    title: 'Psicólogos inativos',
    description:
      'Um grupo de psicólogos está sem atividade há mais de 30 dias. Considere reengajamento.',
    actionLabel: 'Ver lista',
  },
  {
    id: 'insight-expiring-subscriptions',
    severity: InsightSeverity.CRITICAL,
    title: 'Assinaturas expirando',
    description:
      'Assinaturas premium expirando nos próximos 7 dias sem renovação confirmada.',
    actionLabel: 'Ver assinaturas',
  },
  {
    id: 'insight-inactive-clinics',
    severity: InsightSeverity.WARNING,
    title: 'Clínicas sem atividade',
    description:
      'Clínicas cadastradas sem nenhuma sessão registrada no período selecionado.',
    actionLabel: 'Ver clínicas',
  },
  {
    id: 'insight-conversion-drop',
    severity: InsightSeverity.CRITICAL,
    title: 'Queda na conversão',
    description:
      'A taxa de conversão freemium → premium caiu em relação ao período anterior.',
    actionLabel: 'Ver funil',
  },
  {
    id: 'insight-cancellations',
    severity: InsightSeverity.WARNING,
    title: 'Cancelamentos acima da média',
    description:
      'O volume de sessões canceladas está acima da média histórica da plataforma.',
  },
  {
    id: 'insight-sla',
    severity: InsightSeverity.INFO,
    title: 'SLA de suporte estável',
    description:
      'O tempo médio de resposta do suporte se manteve dentro da meta no período.',
  },
]

export function buildAdminMock(period: DashboardPeriod): IAdminDashboardMock {
  const days = PERIOD_DAYS[period]

  return {
    executive: {
      sessions: 1842,
      mrr: 4865000,
      clinics: 37,
      premium: 214,
      freemium: 526,
      conversionPercent: 29,
    },
    growth: {
      clinics: buildDailySeries(days, 3, 1),
    },
    revenue: {
      mrr: 4865000,
      premium: 214,
      freemium: 526,
      conversionPercent: 29,
      growthPercent: 12,
      churnPercent: 4,
    },
    activity: {
      completed: 1568,
      rescheduled: 187,
      canceled: 122,
      activeUsers: 892,
    },
    psychologists: {
      active: 168,
      inactive: 24,
      byState: BY_STATE,
      specialties: SPECIALTIES,
    },
    patients: {
      byAge: [
        { range: '0-17', count: 62 },
        { range: '18-25', count: 214 },
        { range: '26-35', count: 318 },
        { range: '36-50', count: 246 },
        { range: '51+', count: 108 },
      ],
      byGender: [
        { gender: Gender.FEMININE, count: 528 },
        { gender: Gender.MASCULINE, count: 372 },
        { gender: Gender.OTHER, count: 48 },
      ],
      byRegion: PATIENTS_BY_REGION,
    },
    insights: INSIGHTS,
  }
}
