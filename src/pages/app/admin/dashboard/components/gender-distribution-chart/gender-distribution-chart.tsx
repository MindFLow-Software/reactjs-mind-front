import { useMemo } from 'react'
import { Users2 } from 'lucide-react'

import { ChartCard } from '@/components/chart-card/chart-card'
import { GENDER_CONFIG } from '@/constants/gender-config'
import { sumDailyCounts } from '@/pages/app/dashboard/shared/helpers'
import type { IGenderItem } from '@/types/dashboard/gender-item'

import {
  ADMIN_PIE_KEYS,
  AdminAnalyticsSubject,
  GENDER_SLICE_COLOR,
  type IAdminPieDatum,
} from '../../constants'

type IGenderChartCopy = {
  title: string
  description: string
  centerLabel: string
  emptySubtitle: string
}

const COPY: Record<AdminAnalyticsSubject, IGenderChartCopy> = {
  [AdminAnalyticsSubject.PATIENTS]: {
    title: 'Gênero',
    description: 'Distribuição dos pacientes por gênero',
    centerLabel: 'Pacientes',
    emptySubtitle: 'Nenhum paciente identificado',
  },
  [AdminAnalyticsSubject.PSYCHOLOGISTS]: {
    title: 'Gênero Profissional',
    description: 'Distribuição dos psicólogos ativos',
    centerLabel: 'Profissionais',
    emptySubtitle: 'Nenhum psicólogo identificado',
  },
}

type IGenderDistributionChart = {
  subject: AdminAnalyticsSubject
  data: IGenderItem[]
}

export function GenderDistributionChart({
  subject,
  data,
}: IGenderDistributionChart) {
  const copy = COPY[subject]

  const { slices, colors } = useMemo(() => {
    const items = data ?? []

    return {
      slices: items.map<IAdminPieDatum>((item) => ({
        name: GENDER_CONFIG[item.gender]?.label ?? item.gender,
        count: item.count,
      })),
      colors: items.map((item) => GENDER_SLICE_COLOR[item.gender]),
    }
  }, [data])

  const total = sumDailyCounts(slices)

  return (
    <ChartCard
      state={{ isLoading: false, isError: false, isEmpty: total === 0 }}
    >
      <ChartCard.Header title={copy.title} description={copy.description} />
      <ChartCard.Total label="Total Geral" value={total} />

      <ChartCard.Body>
        <ChartCard.Pie data={slices} colors={colors} keys={ADMIN_PIE_KEYS}>
          <ChartCard.Total label={copy.centerLabel} value={total} />
        </ChartCard.Pie>
        <ChartCard.Legend data={slices} colors={colors} keys={ADMIN_PIE_KEYS} />
      </ChartCard.Body>

      <ChartCard.Empty
        icon={<Users2 className="size-5 text-muted-foreground/50" />}
        title="Sem dados de gênero"
        subtitle={copy.emptySubtitle}
      />
    </ChartCard>
  )
}
