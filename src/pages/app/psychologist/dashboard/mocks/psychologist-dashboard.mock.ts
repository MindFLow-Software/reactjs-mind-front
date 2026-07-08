import { subDays, startOfDay, formatISO } from 'date-fns'
import type { DailySessionMetric } from '@/api/metrics/get-daily-sessions-metrics'
import {
  InsightSeverity,
  type IDashboardInsight,
} from '@/pages/app/dashboard/shared/types'
import { PERIOD_DAYS } from '../constants'
import type {
  IPsychologistDashboardAttendance,
  IPsychologistDashboardSessionsVolume,
} from '../types'
import type { DashboardPeriod } from '../constants'

export interface IPsychologistGoalTargets {
  sessions: number
  hours: number
  activePatients: number
}

export interface IPsychologistDashboardMock {
  sessionsVolume: Pick<
    IPsychologistDashboardSessionsVolume,
    'cancelled' | 'rescheduled'
  >
  insights: IDashboardInsight[]
  attendance: IPsychologistDashboardAttendance
  weeklyOccupancyPercent: number
  retentionPercent: number
  goalTargets: IPsychologistGoalTargets
}

function buildDailySeries(
  days: number,
  seed: number,
  amplitude: number,
): DailySessionMetric[] {
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

const INSIGHTS: IDashboardInsight[] = [
  {
    id: 'insight-cancellations',
    severity: InsightSeverity.WARNING,
    title: 'Cancelamentos em alta',
    description:
      'Taxa de cancelamentos acima da média das últimas semanas. Considere revisar lembretes de agenda.',
    actionLabel: 'Revisar agenda',
  },
  {
    id: 'insight-retention',
    severity: InsightSeverity.INFO,
    title: 'Retenção estável',
    description:
      'A retenção de pacientes se manteve estável no período selecionado.',
  },
  {
    id: 'insight-occupancy',
    severity: InsightSeverity.CRITICAL,
    title: 'Ociosidade semanal',
    description: 'Horários vagos na semana estão acima do limite recomendado.',
    actionLabel: 'Ver horários livres',
  },
]

export function buildPsychologistMock(
  period: DashboardPeriod,
): IPsychologistDashboardMock {
  const days = PERIOD_DAYS[period]

  return {
    sessionsVolume: {
      cancelled: buildDailySeries(days, 1, 2),
      rescheduled: buildDailySeries(days, 2, 1.5),
    },
    insights: INSIGHTS,
    attendance: {
      attendedCount: 42,
      cancelledCount: 6,
      rescheduledCount: 4,
    },
    weeklyOccupancyPercent: 78,
    retentionPercent: 86,
    goalTargets: {
      sessions: 60,
      hours: 80,
      activePatients: 35,
    },
  }
}
