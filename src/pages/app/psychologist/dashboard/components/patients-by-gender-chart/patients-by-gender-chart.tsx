import { memo, useMemo } from 'react'
import { Users } from 'lucide-react'

import {
  ChartCard,
  CHART_CARD_PIE_KEYS,
  type IChartCardPieDatum,
} from '@/components/chart-card/chart-card'
import { IconBadge, IconBadgeTone } from '@/components/icon-badge/icon-badge'
import { GENDER_CONFIG, GENDER_SLICE_COLOR } from '@/constants/gender-config'
import { sumDailyCounts } from '@/pages/app/dashboard/shared/helpers'
import type { IGenderItem } from '@/types/dashboard/gender-item'

type IPatientsByGenderChart = {
  gender: IGenderItem[]
}

export const PatientsByGenderChart = memo(function PatientsByGenderChart({
  gender,
}: IPatientsByGenderChart) {
  const { slices, colors } = useMemo(() => {
    const items = gender ?? []

    return {
      slices: items.map<IChartCardPieDatum>((item) => ({
        name: GENDER_CONFIG[item.gender]?.label ?? item.gender,
        count: item.count,
      })),
      colors: items.map((item) => GENDER_SLICE_COLOR[item.gender]),
    }
  }, [gender])

  const total = sumDailyCounts(slices)
  const centerLabel = total === 1 ? 'Paciente' : 'Pacientes'

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
        title="Perfil dos pacientes"
        description="Distribuição por gênero"
      />

      <ChartCard.Body>
        <ChartCard.Pie data={slices} colors={colors} keys={CHART_CARD_PIE_KEYS}>
          <ChartCard.Total label={centerLabel} value={total} />
        </ChartCard.Pie>
        <ChartCard.Legend
          data={slices}
          colors={colors}
          keys={CHART_CARD_PIE_KEYS}
        />
      </ChartCard.Body>

      <ChartCard.Empty
        icon={<Users className="size-5 text-muted-foreground/50" />}
        title="Sem dados de gênero"
        subtitle="Nenhum paciente neste período"
      />
    </ChartCard>
  )
})
