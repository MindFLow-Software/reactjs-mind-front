import { memo, useMemo } from 'react'
import { CalendarOff, ChartLine } from 'lucide-react'

import {
  ChartCard,
  type IChartCardSeries,
} from '@/components/chart-card/chart-card'
import { IconBadge, IconBadgeTone } from '@/components/icon-badge/icon-badge'
import { PERIOD_DAYS } from '@/pages/app/dashboard/shared/constants'
import type { IDashboardPeriod } from '@/pages/app/dashboard/shared/types'

import { SessionsChartMeta } from './sessions-chart-meta/sessions-chart-meta'
import { mergeSessionsVolume } from './helpers'
import type {
  ISessionsStats,
  ISessionsVolume,
  ISessionsVolumePoint,
} from './types'

export const SESSIONS_SERIES: readonly IChartCardSeries<ISessionsVolumePoint>[] =
  [
    {
      dataKey: 'completed',
      color: 'var(--chart-sessions-green)',
      label: 'Concluídas',
    },
    {
      dataKey: 'cancelled',
      color: 'var(--chart-sessions-red)',
      label: 'Canceladas',
    },
    {
      dataKey: 'rescheduled',
      color: 'var(--chart-sessions-amber)',
      label: 'Remarcadas',
    },
  ]

type ISessionsBarChart = {
  period: IDashboardPeriod
  sessionsVolume: ISessionsVolume
  sessionsStats: ISessionsStats
}

function getSubtitleLabel(period: IDashboardPeriod): string {
  if (period === 'year') return 'Último ano'
  return `Últimos ${PERIOD_DAYS[period]} dias`
}

export const SessionsBarChart = memo(function SessionsBarChart({
  period,
  sessionsVolume,
  sessionsStats,
}: ISessionsBarChart) {
  const chartData = useMemo(
    () => mergeSessionsVolume(sessionsVolume),
    [sessionsVolume],
  )

  const isEmpty = useMemo(
    () => sessionsVolume.completed.every((point) => point.value === 0),
    [sessionsVolume],
  )

  return (
    <ChartCard state={{ isLoading: false, isError: false, isEmpty }}>
      <ChartCard.Header
        icon={
          <IconBadge tone={IconBadgeTone.EMERALD}>
            <ChartLine className="size-4" />
          </IconBadge>
        }
        title="Volume de sessões"
        description={`${getSubtitleLabel(period)} · sessões concluídas, canceladas e remarcadas`}
      >
        <SessionsChartMeta stats={sessionsStats} series={SESSIONS_SERIES} />
      </ChartCard.Header>

      <ChartCard.Body>
        <ChartCard.TimeSeriesBar data={chartData} series={SESSIONS_SERIES} />
      </ChartCard.Body>

      <ChartCard.Empty
        icon={<CalendarOff className="size-5 text-muted-foreground/50" />}
        title="Nenhuma sessão"
        subtitle="Sem atendimentos neste período"
      />
    </ChartCard>
  )
})
