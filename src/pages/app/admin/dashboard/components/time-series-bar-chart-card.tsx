import type { ReactNode } from 'react'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Loader2 } from 'lucide-react'

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from '@/components/ui/select'
import './time-series-bar-chart-card.css'

interface TimeSeriesBarChartCardProps<
  T extends { date: string | number } & object,
> {
  header: {
    title: string
    description: string
    totalLabel: string
    total: number
  }
  timeRange: {
    value: string
    onChange: (value: string) => void
  }
  chart: {
    config: ChartConfig
    dataKey: keyof T & string
    color: string
    data: T[] | undefined
    isLoading: boolean
    isEmpty: boolean
  }
  empty: {
    icon: ReactNode
    title: string
    subtitle: string
  }
}

export function TimeSeriesBarChartCard<
  T extends { date: string | number } & object,
>({ header, timeRange, chart, empty }: TimeSeriesBarChartCardProps<T>) {
  return (
    <Card className="adb-tschart-card">
      <CardHeader className="adb-tschart-header">
        <div className="adb-tschart-header-main">
          <div>
            <CardTitle className="adb-tschart-title">{header.title}</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              {header.description}
            </CardDescription>
          </div>
          <Select value={timeRange.value} onValueChange={timeRange.onChange}>
            <SelectTrigger
              className="adb-tschart-select-trigger"
              aria-label="Selecionar período"
            >
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent className="adb-tschart-select-content">
              <SelectGroup>
                <SelectItem value="90d" className="adb-tschart-select-item">
                  90 dias
                </SelectItem>
                <SelectItem value="30d" className="adb-tschart-select-item">
                  30 dias
                </SelectItem>
                <SelectItem value="7d" className="adb-tschart-select-item">
                  7 dias
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="adb-tschart-header-aside">
          <div className="adb-tschart-total-block">
            <span className="adb-tschart-total-label">{header.totalLabel}</span>
            <span className="adb-tschart-total-value">
              {header.total.toLocaleString()}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="adb-tschart-content">
        {chart.isLoading ? (
          <div className="flex h-[250px] w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : chart.isEmpty ? (
          <div className="adb-tschart-state">
            <div className="adb-tschart-state-icon">{empty.icon}</div>
            <p className="text-sm font-medium text-foreground">{empty.title}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {empty.subtitle}
            </p>
          </div>
        ) : (
          <ChartContainer
            config={chart.config}
            className="aspect-auto h-[250px] w-full"
          >
            <BarChart
              accessibilityLayer
              data={chart.data}
              margin={{ left: 12, right: 12 }}
            >
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                stroke="var(--border)"
              />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                stroke="var(--muted-foreground)"
                fontSize={12}
                tickFormatter={(value) =>
                  format(new Date(value), 'dd MMM', { locale: ptBR })
                }
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) =>
                      format(new Date(value), "dd 'de' MMMM", {
                        locale: ptBR,
                      })
                    }
                    indicator="dashed"
                  />
                }
              />
              <Bar
                dataKey={chart.dataKey}
                fill={chart.color}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
