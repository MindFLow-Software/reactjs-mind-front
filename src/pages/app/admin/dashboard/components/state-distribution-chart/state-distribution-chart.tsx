import { MapPin } from 'lucide-react'

import {
  ChartCard,
  ChartCardBarLayout,
} from '@/components/chart-card/chart-card'

import { ADMIN_CHART_COLORS } from '../../constants'

// Backend has no per-state breakdown endpoint yet; bars are placeholder values.
const PLACEHOLDER_STATES = [
  { region: 'SP', count: 25 },
  { region: 'RJ', count: 18 },
  { region: 'MG', count: 12 },
]

type IStateDistributionChart = {
  description: string
  total: number
}

export function StateDistributionChart({
  description,
  total,
}: IStateDistributionChart) {
  return (
    <ChartCard state={{ isLoading: false, isError: false, isEmpty: false }}>
      <ChartCard.Header
        title="Distribuição por estado"
        description={description}
      >
        <ChartCard.Total label="Total Geral" value={total} />
      </ChartCard.Header>

      <ChartCard.Body>
        <ChartCard.Bar<{ region: string, count: number }>
          data={PLACEHOLDER_STATES}
          keys={{
            name: 'region',
            value: 'count',
          }}
          bar={{
            color: ADMIN_CHART_COLORS[0],
            layout: ChartCardBarLayout.HORIZONTAL,
          }}
        />
      </ChartCard.Body>

      <ChartCard.Empty
        icon={<MapPin className="size-5 text-muted-foreground/50" />}
        title="Sem dados regionais"
        subtitle="Nenhum estado localizado"
      />
    </ChartCard>
  )
}
