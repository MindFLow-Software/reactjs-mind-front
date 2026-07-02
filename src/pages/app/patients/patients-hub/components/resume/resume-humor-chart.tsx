import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import { Badge } from '@/components/ui/badge'
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

import { HUMOR_AVG, HUMOR_DATA, humorConfig } from './resume-data'

export function ResumeHumorChart() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-sm font-semibold">
              Humor — últimas 8 sessões
            </CardTitle>
            <CardDescription className="text-[11px]">
              Escala 0-10 reportada pelo paciente
            </CardDescription>
          </div>
          <Badge className="h-5 shrink-0 border-0 bg-blue-100 text-[10px] font-semibold text-blue-700 dark:bg-blue-950/40 dark:text-blue-400">
            Média: {HUMOR_AVG}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={humorConfig} className="h-[200px] w-full">
          <AreaChart
            data={HUMOR_DATA}
            margin={{ top: 10, left: 0, right: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="humorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
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
              fontSize={11}
              stroke="var(--muted-foreground)"
            />
            <YAxis hide domain={[0, 10]} />
            <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
            <Area
              type="monotone"
              dataKey="score"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#humorGradient)"
              dot={{ r: 3, fill: '#3b82f6', strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
