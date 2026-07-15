import { useMemo } from 'react'
import { Layers } from 'lucide-react'

import {
  ChartCard,
  CHART_CARD_PIE_KEYS,
  type IChartCardPieDatum,
} from '@/components/chart-card/chart-card'
import { sumDailyCounts } from '@/pages/app/dashboard/shared/helpers'
import type { ISpecialtyStat } from '@/types/dashboard/specialty-stat'

import { ADMIN_CHART_COLORS } from '../../constants'

type ISpecialtiesChart = {
  data: ISpecialtyStat[]
}

export function SpecialtiesChart({ data }: ISpecialtiesChart) {
  const slices = useMemo(
    () =>
      (data ?? []).map<IChartCardPieDatum>((item) => ({
        name: item.specialty,
        count: item.count,
      })),
    [data],
  )

  const total = sumDailyCounts(slices)

  return (
    <ChartCard
      state={{ isLoading: false, isError: false, isEmpty: total === 0 }}
    >
      <ChartCard.Header
        title="Especialidades"
        description="Abordagens terapêuticas mais frequentes"
      />
      <ChartCard.Total label="Total Geral" value={total} />

      <ChartCard.Body>
        <ChartCard.Pie
          data={slices}
          colors={ADMIN_CHART_COLORS}
          keys={CHART_CARD_PIE_KEYS}
        >
          <ChartCard.Total label="Abordagens" value={total} />
        </ChartCard.Pie>
        <ChartCard.Legend
          data={slices}
          colors={ADMIN_CHART_COLORS}
          keys={CHART_CARD_PIE_KEYS}
        />
      </ChartCard.Body>

      <ChartCard.Empty
        icon={<Layers className="size-5 text-muted-foreground/50" />}
        title="Sem dados de especialidade"
        subtitle="Nenhuma especialidade registrada"
      />
    </ChartCard>
  )
}
