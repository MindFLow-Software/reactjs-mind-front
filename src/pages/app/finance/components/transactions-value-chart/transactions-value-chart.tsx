'use client'

import * as React from 'react'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { Currency } from '@/utils/currency'
import './transactions-value-chart.css'

const chartData = [
  { date: '2024-06-01', amount: 1250.5 },
  { date: '2024-06-02', amount: 800.0 },
  { date: '2024-06-03', amount: 2100.0 },
  { date: '2024-06-04', amount: 450.25 },
  { date: '2024-06-05', amount: 1800.0 },
  { date: '2024-06-06', amount: 950.0 },
  { date: '2024-06-07', amount: 1400.75 },
  { date: '2024-06-08', amount: 3200.0 },
  { date: '2024-06-09', amount: 1100.0 },
  { date: '2024-06-10', amount: 1900.5 },
]

const chartConfig = {
  amount: {
    label: 'Valor Recebido',
    color: 'var(--chart-transactions-green)',
  },
} satisfies ChartConfig

export function TransactionsValueChart() {
  const activeChart = 'amount'

  const totalAmount = React.useMemo(
    () => chartData.reduce((acc, curr) => acc + curr.amount, 0),
    [],
  )

  return (
    <Card className="fin-value-card">
      <CardHeader className="fin-value-header">
        <div className="fin-value-header-main">
          <CardTitle className="fin-value-title">Total de Transações</CardTitle>
          <CardDescription className="text-xs">
            Volume financeiro recebido no período selecionado
          </CardDescription>
        </div>
        <div className="flex">
          <div className="fin-value-total-block">
            <span className="fin-value-total-label">
              {chartConfig.amount.label}
            </span>
            <span className="fin-value-total-amount">
              {Currency.formatBRL(totalAmount)}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              top: 20,
            }}
          >
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              strokeOpacity={0.4}
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              minTickGap={32}
              tickFormatter={(value) =>
                format(new Date(value), 'dd MMM', { locale: ptBR })
              }
              fontSize={11}
              className="fill-muted-foreground font-medium uppercase"
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="fin-value-tooltip"
                  labelFormatter={(value) => {
                    return format(new Date(value), "dd 'de' MMMM 'de' yyyy", {
                      locale: ptBR,
                    })
                  }}
                  formatter={(value) => (
                    <div className="fin-value-tooltip-row">
                      <span className="fin-value-tooltip-label">Recebido:</span>
                      <span className="fin-value-tooltip-value">
                        {Currency.formatBRL(Number(value))}
                      </span>
                    </div>
                  )}
                />
              }
            />
            <Bar
              dataKey={activeChart}
              fill={chartConfig.amount.color}
              radius={[4, 4, 0, 0]}
              barSize={32}
              className="fin-value-bar"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
