import type { ReactNode } from 'react'
import { CalendarRange, Users2 } from 'lucide-react'

import { ChartCard } from '@/components/chart-card/chart-card'
import { sumDailyCounts } from '@/pages/app/dashboard/shared/helpers'
import type { IAgeRangeItem } from '@/types/dashboard/age-range-item'

import { AdminAnalyticsSubject, ADMIN_CHART_COLORS } from '../../constants'

type IAgeRangeChartCopy = {
  totalLabel: string
  color: string
  empty: {
    icon: ReactNode
    title: string
    subtitle: string
  }
}

const COPY: Record<AdminAnalyticsSubject, IAgeRangeChartCopy> = {
  [AdminAnalyticsSubject.PATIENTS]: {
    totalLabel: 'Total de Pacientes',
    color: ADMIN_CHART_COLORS[0],
    empty: {
      icon: <CalendarRange />,
      title: 'Sem dados etários',
      subtitle: 'Nenhum paciente com idade registrada',
    },
  },
  [AdminAnalyticsSubject.PSYCHOLOGISTS]: {
    totalLabel: 'Total de Psicólogos',
    color: ADMIN_CHART_COLORS[1],
    empty: {
      icon: <Users2 />,
      title: 'Sem dados demográficos',
      subtitle: 'Nenhum psicólogo cadastrado no sistema',
    },
  },
}

const AGE_RANGE_KEYS = { name: 'range', value: 'count' } as const

type IAgeRangeChart = {
  subject: AdminAnalyticsSubject
  data: IAgeRangeItem[]
}

export function AgeRangeChart({ subject, data }: IAgeRangeChart) {
  const copy = COPY[subject]
  const total = sumDailyCounts(data ?? [])

  return (
    <ChartCard
      state={{ isLoading: false, isError: false, isEmpty: total === 0 }}
    >
      <ChartCard.Header
        title="Faixa Etária"
        description="Distribuição por idade"
      >
        <ChartCard.Total label={copy.totalLabel} value={total} />
      </ChartCard.Header>

      <ChartCard.Body>
        <ChartCard.Bar
          data={data}
          keys={AGE_RANGE_KEYS}
          bar={{ color: copy.color }}
        />
      </ChartCard.Body>

      <ChartCard.Empty
        icon={copy.empty.icon}
        title={copy.empty.title}
        subtitle={copy.empty.subtitle}
      />
    </ChartCard>
  )
}
