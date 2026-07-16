import { Area, AreaChart, XAxis, YAxis } from 'recharts'

import { Card } from '@/components/ui/card'
import { ChartContainer } from '@/components/ui/chart'

import './revenue-trend-chart.css'

// Backend exposes no revenue time series yet; the curve is a placeholder.
const PLACEHOLDER_REVENUE = [
  { date: '2024-04-01', revenue: 970 },
  { date: '2024-04-02', revenue: 1050 },
  { date: '2024-04-03', revenue: 2420 },
  { date: '2024-04-04', revenue: 2420 },
  { date: '2024-04-05', revenue: 3500 },
  { date: '2024-04-06', revenue: 7000 },
  { date: '2024-04-07', revenue: 9000 },
  { date: '2024-04-08', revenue: 9500 },
  { date: '2024-04-09', revenue: 9975 },
  { date: '2024-04-10', revenue: 15023 },
  { date: '2024-04-12', revenue: 18976 },
]

export function RevenueTrendChart() {
  return (
    <Card className="adb-revenue-chart-card">
      <ChartContainer config={{}} className="adb-revenue-chart">
        <AreaChart data={PLACEHOLDER_REVENUE}>
          <defs>
            <linearGradient id="adb-revenue-fill" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--chart-sessions-green-soft)"
                stopOpacity={1}
              />
              <stop
                offset="95%"
                stopColor="var(--chart-sessions-green-soft)"
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            minTickGap={32}
          />
          <YAxis />
          <Area
            dataKey="revenue"
            type="natural"
            fill="url(#adb-revenue-fill)"
            stroke="var(--chart-sessions-green)"
          />
        </AreaChart>
      </ChartContainer>
    </Card>
  )
}
