import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'

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
} from '@/components/ui/chart'

import { FREQUENCY_DATA, frequencyConfig } from './resume-data'

export function ResumeFrequencyChart() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-sm font-semibold">
              Frequência por mês
            </CardTitle>
            <CardDescription className="text-[11px]">
              Sessões nos últimos 6 meses
            </CardDescription>
          </div>
          <button className="shrink-0 text-[11px] font-medium text-blue-600 hover:underline">
            Ver detalhes
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={frequencyConfig} className="h-[200px] w-full">
          <BarChart
            data={FREQUENCY_DATA}
            margin={{ top: 16, left: 0, right: 0, bottom: 0 }}
          >
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              stroke="var(--border)"
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              fontSize={11}
              stroke="var(--muted-foreground)"
            />
            <YAxis hide />
            <ChartTooltip
              cursor={{ fill: 'var(--muted)', opacity: 0.2, radius: 6 }}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar
              dataKey="sessions"
              fill="var(--chart-blue)"
              radius={[6, 6, 0, 0]}
              label={{
                position: 'top',
                fontSize: 11,
                fill: 'hsl(var(--muted-foreground))',
                formatter: (v: number) => (v > 0 ? v : ''),
              }}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
