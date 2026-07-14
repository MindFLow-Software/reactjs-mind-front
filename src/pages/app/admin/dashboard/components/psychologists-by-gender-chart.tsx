'use client'

import * as React from 'react'
import { Users2 } from 'lucide-react'

import { type ChartConfig } from '@/components/ui/chart'
import { Gender } from '@/types/shared/enums'
import type { IGenderItem } from '@/types/dashboard/gender-item'
import { DemographicsPieChartCard } from './demographics-pie-chart-card'

const GENDER_TRANSLATIONS: Record<Gender, string> = {
  [Gender.FEMININE]: 'Feminino',
  [Gender.MASCULINE]: 'Masculino',
  [Gender.OTHER]: 'Outros',
}

const CHART_COLORS = ['var(--chart-6)', 'var(--chart-2)', 'var(--chart-1)']

const chartConfig = {
  psychologists: {
    label: 'Psicólogos',
  },
} satisfies ChartConfig

interface PsychologistsGenderChartProps {
  isError: boolean
  onRetry: () => void
  isLoading: boolean
  psychologistsByGender: IGenderItem[]
}

export function PsychologistsGenderChart({
  isError,
  onRetry,
  isLoading,
  psychologistsByGender,
}: PsychologistsGenderChartProps) {
  const { chartData, totalPsychologists, isEmpty } = React.useMemo(() => {
    const translatedData = (psychologistsByGender ?? []).map((item) => ({
      ...item,
      gender: GENDER_TRANSLATIONS[item.gender] ?? item.gender,
    }))

    const total = translatedData.reduce((sum, item) => sum + item.count, 0)

    return {
      chartData: translatedData,
      totalPsychologists: total,
      isEmpty: translatedData.length === 0 || total === 0,
    }
  }, [psychologistsByGender])

  return (
    <DemographicsPieChartCard
      header={{
        title: 'Gênero Profissional',
        description: 'Distribuição dos psicólogos ativos',
        totalLabel: 'Total Geral',
        total: totalPsychologists,
      }}
      chart={{
        config: chartConfig,
        data: chartData,
        nameKey: 'gender',
        valueKey: 'count',
        colors: CHART_COLORS,
        isLoading,
        isError,
        isEmpty,
        onRetry,
        label: 'Profissionais',
      }}
      empty={{
        icon: <Users2 className="size-5 text-muted-foreground/50" />,
        title: 'Sem dados de gênero',
        subtitle: 'Nenhum psicólogo identificado',
      }}
    />
  )
}
