import { UserPlus } from 'lucide-react'

import { ChartCard } from '@/components/chart-card/chart-card'
import { ADMIN_PERIODS } from '@/pages/app/dashboard/shared/constants'
import type { IDashboardPeriod } from '@/pages/app/dashboard/shared/types'
import type { ITimeSeriesPoint } from '@/types/dashboard/time-series-point'

import { ADMIN_CHART_COLORS } from '../../constants'

type IGrowthFlowChart = {
  data: ITimeSeriesPoint[]
  total: number
  period: {
    value: IDashboardPeriod
    onChange: (period: IDashboardPeriod) => void
  }
}

export function GrowthFlowChart({ data, total, period }: IGrowthFlowChart) {
  return (
    <ChartCard
      state={{ isLoading: false, isError: false, isEmpty: total === 0 }}
    >
      <ChartCard.Header
        title="Fluxo de psicólogos"
        description="Novos profissionais integrados à plataforma"
      >
        <ChartCard.TimeRange
          value={period.value}
          onChange={period.onChange}
          options={ADMIN_PERIODS}
        />
      </ChartCard.Header>
      <ChartCard.Total label="Novos cadastros" value={total} />

      <ChartCard.Body>
        <ChartCard.TimeSeriesBar
          data={data}
          dataKey="value"
          color={ADMIN_CHART_COLORS[0]}
        />
      </ChartCard.Body>

      <ChartCard.Empty
        icon={<UserPlus className="size-5 text-muted-foreground/50" />}
        title="Nenhum psicólogo"
        subtitle="Sem adesões no intervalo selecionado"
      />
    </ChartCard>
  )
}
