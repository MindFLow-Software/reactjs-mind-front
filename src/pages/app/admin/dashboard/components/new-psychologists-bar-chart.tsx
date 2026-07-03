'use client'

import * as React from 'react'
import { useQuery } from '@tanstack/react-query'
import { UserPlus } from 'lucide-react'

import { type ChartConfig } from '@/components/ui/chart'
import { getNewPsychologistsCount } from '@/api/psychologists/get-new-psychologists-count'
import { useAdminChartTimeRange } from '../hooks/use-admin-chart-time-range'
import { TimeSeriesBarChartCard } from './time-series-bar-chart-card'

interface NewPsychologistsBarChartProps {
  endDate: Date | undefined
}

const chartConfig = {
  newPsychologists: {
    label: 'Psicólogos',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig

export function NewPsychologistsBarChart({
  endDate,
}: NewPsychologistsBarChartProps) {
  const { timeRange, setTimeRange, startDateToFetch, endDateToFetch } =
    useAdminChartTimeRange({ endDate })

  const { data: chartData, isLoading } = useQuery({
    queryKey: ['admin-psychologists-chart', startDateToFetch, endDateToFetch],
    queryFn: () =>
      getNewPsychologistsCount({
        from: startDateToFetch,
        to: endDateToFetch,
      }),
    enabled: !!startDateToFetch && !!endDateToFetch,
  })

  const { total, isEmpty } = React.useMemo(() => {
    const totalCount = Array.isArray(chartData)
      ? chartData.reduce((acc, curr) => acc + (curr.newPsychologists || 0), 0)
      : 0

    return {
      total: totalCount,
      isEmpty:
        !chartData ||
        !Array.isArray(chartData) ||
        chartData.length === 0 ||
        totalCount === 0,
    }
  }, [chartData])

  return (
    <TimeSeriesBarChartCard
      header={{
        title: 'Fluxo de Psicólogos',
        description: 'Novos profissionais integrados à plataforma',
        totalLabel: 'Novos Cadastros',
        total,
      }}
      timeRange={{ value: timeRange, onChange: setTimeRange }}
      chart={{
        config: chartConfig,
        dataKey: 'newPsychologists',
        color: chartConfig.newPsychologists.color,
        data: chartData,
        isLoading,
        isEmpty,
      }}
      empty={{
        icon: <UserPlus className="h-5 w-5 text-muted-foreground/50" />,
        title: 'Nenhum psicólogo',
        subtitle: 'Sem adesões no intervalo selecionado',
      }}
    />
  )
}
