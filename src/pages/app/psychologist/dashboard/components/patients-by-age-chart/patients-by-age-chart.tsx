import { memo } from 'react'
import { Users } from 'lucide-react'

import {
  ChartCard,
  ChartCardBarLayout,
  type IChartCardKeys,
} from '@/components/chart-card/chart-card'
import { IconBadge, IconBadgeTone } from '@/components/icon-badge/icon-badge'
import { sumDailyCounts } from '@/pages/app/dashboard/shared/helpers'
import type { IAgeRangeItem } from '@/types/dashboard/age-range-item'

const AGE_RANGE_KEYS: IChartCardKeys<IAgeRangeItem> = {
  name: 'range',
  value: 'count',
}

type IPatientsByAgeChart = {
  ageRange: IAgeRangeItem[]
}

export const PatientsByAgeChart = memo(function PatientsByAgeChart({
  ageRange,
}: IPatientsByAgeChart) {
  const total = sumDailyCounts(ageRange ?? [])

  return (
    <ChartCard
      state={{ isLoading: false, isError: false, isEmpty: total === 0 }}
    >
      <ChartCard.Header
        icon={
          <IconBadge tone={IconBadgeTone.BLUE}>
            <Users className="size-4" />
          </IconBadge>
        }
        title="Pacientes por faixa etária"
        description="Distribuição atual"
      />

      <ChartCard.Body>
        <ChartCard.Bar
          data={ageRange}
          keys={AGE_RANGE_KEYS}
          bar={{
            color: 'var(--chart-blue)',
            layout: ChartCardBarLayout.HORIZONTAL,
          }}
        />
      </ChartCard.Body>

      <ChartCard.Empty
        icon={<Users className="size-5 text-muted-foreground/50" />}
        title="Sem dados"
        subtitle="Nenhum paciente neste período"
      />
    </ChartCard>
  )
})
