import type { ReactNode } from 'react'
import { Cell, Pie, PieChart } from 'recharts'
import { Loader2, AlertCircle, RefreshCcw } from 'lucide-react'

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
import './demographics-pie-chart-card.css'

interface DemographicsPieChartCardProps<T extends object> {
  header: {
    title: string
    description: string
    totalLabel: string
    total: number
  }
  chart: {
    config: ChartConfig
    data: T[] | undefined
    nameKey: keyof T & string
    valueKey: keyof T & string
    colors: string[]
    isLoading: boolean
    isError: boolean
    isEmpty: boolean
    onRetry: () => void
    label: string
  }
  empty: {
    icon: ReactNode
    title: string
    subtitle: string
  }
}

export function DemographicsPieChartCard<T extends object>({
  header,
  chart,
  empty,
}: DemographicsPieChartCardProps<T>) {
  return (
    <Card className="adb-pie-card">
      <CardHeader className="adb-pie-header">
        <div className="adb-pie-header-main">
          <CardTitle className="adb-pie-title">{header.title}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            {header.description}
          </CardDescription>
        </div>
        <div className="adb-pie-header-aside">
          <div className="adb-pie-total-block">
            <span className="adb-pie-total-label">{header.totalLabel}</span>
            <span className="adb-pie-total-value">
              {header.total.toLocaleString()}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="adb-pie-content">
        {chart.isLoading ? (
          <div className="flex h-[300px] w-full items-center justify-center">
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
          </div>
        ) : chart.isError ? (
          <div className="adb-pie-state">
            <div className="adb-pie-state-icon bg-red-500/10 text-red-500">
              <AlertCircle className="size-6" />
            </div>
            <p className="text-sm font-medium text-foreground">
              Erro ao carregar dados
            </p>
            <button onClick={chart.onRetry} className="adb-pie-retry-btn">
              <RefreshCcw size={12} /> Tentar novamente
            </button>
          </div>
        ) : chart.isEmpty ? (
          <div className="adb-pie-state">
            <div className="adb-pie-state-icon">{empty.icon}</div>
            <p className="text-sm font-medium text-foreground">{empty.title}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {empty.subtitle}
            </p>
          </div>
        ) : (
          <>
            <div className="adb-pie-chart-wrap">
              <ChartContainer
                config={chart.config}
                className="mx-auto aspect-square h-[250px] w-full"
              >
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={chart.data}
                    dataKey={chart.valueKey}
                    nameKey={chart.nameKey}
                    innerRadius={65}
                    outerRadius={90}
                    stroke="var(--card)"
                    paddingAngle={2}
                  >
                    {chart.data?.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={chart.colors[index % chart.colors.length]}
                        className="hover:opacity-80 transition-opacity cursor-pointer outline-none"
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-semibold text-foreground">
                  {header.total}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {chart.label}
                </span>
              </div>
            </div>

            <div className="adb-pie-legend">
              {chart.data?.map((item, index) => {
                const percentage = (
                  (Number(item[chart.valueKey]) / (header.total || 1)) *
                  100
                ).toFixed(1)
                return (
                  <div
                    key={String(item[chart.nameKey])}
                    className="group adb-pie-legend-item"
                  >
                    <div className="flex items-center gap-x-2.5">
                      <div
                        className="adb-pie-legend-dot"
                        style={{
                          backgroundColor:
                            chart.colors[index % chart.colors.length],
                        }}
                      />
                      <span className="adb-pie-legend-label">
                        {String(item[chart.nameKey])}
                      </span>
                    </div>
                    <span className="adb-pie-legend-value">{percentage}%</span>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
