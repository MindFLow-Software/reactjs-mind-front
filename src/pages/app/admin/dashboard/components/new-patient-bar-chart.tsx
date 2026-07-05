'use client'

import * as React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Users } from 'lucide-react'

import { type ChartConfig } from '@/components/ui/chart'
import { getTotalPatientsAdminChart } from '@/api/metrics/get-total-patients-admin-chart'
import { useAdminChartTimeRange } from '../hooks/use-admin-chart-time-range'
import { TimeSeriesBarChartCard } from './time-series-bar-chart-card'

interface NewPatientsBarChartProps {
  endDate: Date | undefined
}

const chartConfig = {
  newPatients: {
    label: 'Pacientes',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig

export function NewPatientsBarChart({ endDate }: NewPatientsBarChartProps) {
  const { timeRange, setTimeRange, startDateToFetch, endDateToFetch } =
    useAdminChartTimeRange({ endDate })

  const { data: chartData, isLoading } = useQuery({
    queryKey: ['admin-patients-chart', startDateToFetch, endDateToFetch],
    queryFn: () =>
      getTotalPatientsAdminChart({
        startDate: startDateToFetch,
        endDate: endDateToFetch,
      }),
    enabled: !!startDateToFetch && !!endDateToFetch,
  })

  const { total, isEmpty } = React.useMemo(() => {
    const totalCount = Array.isArray(chartData)
      ? chartData.reduce((acc, curr) => acc + (curr.newPatients || 0), 0)
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
        title: 'Fluxo de Pacientes',
        description: 'Novos pacientes registrados na plataforma',
        totalLabel: 'Total de Pacientes',
        total,
      }}
      timeRange={{ value: timeRange, onChange: setTimeRange }}
      chart={{
        config: chartConfig,
        dataKey: 'newPatients',
        color: chartConfig.newPatients.color,
        data: chartData,
        isLoading,
        isEmpty,
      }}
      empty={{
        icon: <Users className="h-5 w-5 text-muted-foreground/50" />,
        title: 'Nenhum paciente',
        subtitle: 'Sem novos registros no intervalo selecionado',
      }}
    />
  )
}
