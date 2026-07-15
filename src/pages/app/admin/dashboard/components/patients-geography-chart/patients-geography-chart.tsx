import { useMemo } from 'react'
import { MapPin } from 'lucide-react'

import { ChartCard } from '@/components/chart-card/chart-card'
import { sumDailyCounts } from '@/pages/app/dashboard/shared/helpers'
import type { IRegionStat } from '@/types/dashboard/region-stat'

import {
  ADMIN_CHART_COLORS,
  ADMIN_PIE_KEYS,
  type IAdminPieDatum,
} from '../../constants'

type IPatientsGeographyChart = {
  data: IRegionStat[]
}

export function PatientsGeographyChart({ data }: IPatientsGeographyChart) {
  const slices = useMemo(
    () =>
      (data ?? []).map<IAdminPieDatum>((item) => ({
        name: item.region,
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
        title="Geografia"
        description="Distribuição dos pacientes por estado"
      />
      <ChartCard.Total label="Total Geral" value={total} />

      <ChartCard.Body>
        <ChartCard.Pie
          data={slices}
          colors={ADMIN_CHART_COLORS}
          keys={ADMIN_PIE_KEYS}
        >
          <ChartCard.Total label="Pacientes" value={total} />
        </ChartCard.Pie>
        <ChartCard.Legend
          data={slices}
          colors={ADMIN_CHART_COLORS}
          keys={ADMIN_PIE_KEYS}
        />
      </ChartCard.Body>

      <ChartCard.Empty
        icon={<MapPin className="size-5 text-muted-foreground/50" />}
        title="Sem dados regionais"
        subtitle="Nenhum paciente localizado por estado"
      />
    </ChartCard>
  )
}
