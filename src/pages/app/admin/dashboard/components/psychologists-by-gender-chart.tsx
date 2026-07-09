'use client'

import * as React from 'react'
import { useQuery } from '@tanstack/react-query'
import { subDays, startOfDay, endOfDay } from 'date-fns'
import { Users2 } from 'lucide-react'

import { type ChartConfig } from '@/components/ui/chart'
import { getPsychologistsGenderStats } from '@/api/psychologists/get-psychologists-gender-stats'
import { DemographicsPieChartCard } from './demographics-pie-chart-card'

const GENDER_TRANSLATIONS: Record<string, string> = {
  FEMININE: 'Feminino',
  MASCULINE: 'Masculino',
  OTHER: 'Outros',
}

const CHART_COLORS = ['var(--chart-6)', 'var(--chart-2)', 'var(--chart-1)']

const chartConfig = {
  psychologists: {
    label: 'Psicólogos',
  },
} satisfies ChartConfig

interface PsychologistsGenderChartProps {
  endDate: Date | undefined
}

export function PsychologistsGenderChart({
  endDate,
}: PsychologistsGenderChartProps) {
  const [timeRange] = React.useState('30d')

  const { startDateToFetch, endDateToFetch } = React.useMemo(() => {
    const referenceDate = endDate ? new Date(endDate) : new Date()
    let daysToSubtract = 30

    if (timeRange === '90d') daysToSubtract = 90
    if (timeRange === '7d') daysToSubtract = 7

    return {
      startDateToFetch: startOfDay(subDays(referenceDate, daysToSubtract)),
      endDateToFetch: endOfDay(referenceDate),
    }
  }, [timeRange, endDate])

  const {
    data: rawData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: [
      'admin',
      'psychologists-gender-stats',
      startDateToFetch,
      endDateToFetch,
    ],
    queryFn: () => getPsychologistsGenderStats(),
    enabled: !!startDateToFetch && !!endDateToFetch,
    staleTime: 1000 * 60 * 5,
  })

  const { chartData, totalPsychologists, isEmpty } = React.useMemo(() => {
    if (!rawData) return { chartData: [], totalPsychologists: 0, isEmpty: true }

    const translatedData = rawData.map((item) => ({
      ...item,
      gender: GENDER_TRANSLATIONS[item.gender] || item.gender,
    }))

    const total = translatedData.reduce((sum, item) => sum + item.count, 0)

    return {
      chartData: translatedData,
      totalPsychologists: total,
      isEmpty: translatedData.length === 0 || total === 0,
    }
  }, [rawData])

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
        onRetry: refetch,
        label: 'Profissionais'
      }}
      empty={{
        icon: <Users2 className="size-5 text-muted-foreground/50" />,
        title: 'Sem dados de gênero',
        subtitle: 'Nenhum psicólogo identificado',
      }}
    />
  )
}
