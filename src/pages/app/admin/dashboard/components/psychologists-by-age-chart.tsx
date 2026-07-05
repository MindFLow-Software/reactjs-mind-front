'use client'

import * as React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Users2 } from 'lucide-react'

import { type ChartConfig } from '@/components/ui/chart'
import {
  getPsychologistsAgeStats,
  type IPsychologistAgeStats,
} from '@/api/metrics/get-psychologists-age-stats'
import { DemographicsPieChartCard } from './demographics-pie-chart-card'

const chartConfig = {
  psychologists: {
    label: 'Psicólogos',
  },
} satisfies ChartConfig

const CHART_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
]

export function PsychologistsAgeRangeChart() {
  const { data, isLoading, isError, refetch } = useQuery<
    IPsychologistAgeStats[]
  >({
    queryKey: ['admin', 'psychologists-age-stats'],
    queryFn: getPsychologistsAgeStats,
    staleTime: 1000 * 60 * 5,
  })

  const { totalPsychologists, isEmpty } = React.useMemo(() => {
    const total = data?.reduce((sum, item) => sum + item.count, 0) ?? 0
    return {
      totalPsychologists: total,
      isEmpty: !data || data.length === 0 || total === 0,
    }
  }, [data])

  return (
    <DemographicsPieChartCard
      header={{
        title: 'Perfil Etário',
        description: 'Distribuição dos psicólogos ativos',
        totalLabel: 'Total Geral',
        total: totalPsychologists,
      }}
      chart={{
        config: chartConfig,
        data,
        nameKey: 'ageRange',
        valueKey: 'count',
        colors: CHART_COLORS,
        isLoading,
        isError,
        isEmpty,
        onRetry: refetch,
      }}
      empty={{
        icon: <Users2 className="h-5 w-5 text-muted-foreground/50" />,
        title: 'Sem dados demográficos',
        subtitle: 'Nenhum psicólogo cadastrado no sistema',
      }}
    />
  )
}
