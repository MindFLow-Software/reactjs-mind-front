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

// Dados mockados focados apenas em valor (amount)
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
    color: '#63d72a',
  },
} satisfies ChartConfig

export function TransactionsValueChart() {
  const activeChart = 'amount'

  const totalAmount = React.useMemo(
    () => chartData.reduce((acc, curr) => acc + curr.amount, 0),
    [],
  )

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  return (
    <Card className="col-span-6 bg-card rounded-xl overflow-hidden">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-4 sm:py-6">
          <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
            Total de Transações
          </CardTitle>
          <CardDescription className="text-xs">
            Volume financeiro recebido no período selecionado
          </CardDescription>
        </div>
        <div className="flex">
          <div className="relative z-30 flex flex-1 flex-col justify-center gap-1 bg-muted/30 px-6 py-4 text-left sm:border-l sm:px-8 sm:py-6">
            <span className="text-[10px] font-bold uppercase tracking-tight text-muted-foreground">
              {chartConfig.amount.label}
            </span>
            <span className="text-xl font-bold leading-none sm:text-3xl">
              {formatCurrency(totalAmount)}
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
                  className="w-[200px] rounded-lg border-none shadow-2xl bg-slate-950 text-white"
                  labelFormatter={(value) => {
                    return format(new Date(value), "dd 'de' MMMM 'de' yyyy", {
                      locale: ptBR,
                    })
                  }}
                  formatter={(value) => (
                    <div className="flex items-center justify-between w-full gap-4">
                      <span className="text-xs text-slate-400 font-medium">
                        Recebido:
                      </span>
                      <span className="font-bold text-emerald-500">
                        {formatCurrency(Number(value))}
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
              className="opacity-90 hover:opacity-100 transition-opacity"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
