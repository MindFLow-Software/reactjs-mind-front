import { UserPlus } from 'lucide-react'

import {
  ChartCard,
  type IChartCardSeries,
} from '@/components/chart-card/chart-card'
import { ADMIN_PERIODS } from '@/pages/app/dashboard/shared/constants'
import type { IDashboardPeriod } from '@/pages/app/dashboard/shared/types'
import type { ITimeSeriesPoint } from '@/types/dashboard/time-series-point'

import { ADMIN_CHART_COLORS } from '../../constants'

const GROWTH_SERIES: readonly IChartCardSeries<ITimeSeriesPoint>[] = [
  { dataKey: 'value', color: ADMIN_CHART_COLORS[0], label: 'Novos cadastros' },
]

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
        className="flex"
        title="Fluxo de psicólogos"
        description="Novos profissionais integrados à plataforma"
      >
          <ChartCard.TimeRange
            value={period.value}
            onChange={period.onChange}
            options={ADMIN_PERIODS}
          />
      </ChartCard.Header>
      <ChartCard.Total label="Novos cadastros" value={total} className="self-start text-left" />

      <ChartCard.Body>
        <ChartCard.TimeSeriesBar data={data} series={GROWTH_SERIES} />
      </ChartCard.Body>

      <ChartCard.Empty
        icon={<UserPlus className="size-5 text-muted-foreground/50" />}
        title="Nenhum psicólogo"
        subtitle="Sem adesões no intervalo selecionado"
      />
    </ChartCard>
  )
}
