import { Layers } from 'lucide-react'

import { ChartContainer, type ChartConfig } from '@/components/ui/chart'
import type { IAdminDashboardData } from '@/types/dashboard'

import { DashboardSection } from '@/pages/app/dashboard/shared/components/dashboard-section'
import { PsychologistsGenderChart } from './psychologists-by-gender-chart'
import { DemographicsPieChartCard } from './demographics-pie-chart-card'
import { PsychologistsAgeRangeChart } from './psychologists-by-age-chart'

import './psychologists-analytics-section.css'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Bar, BarChart, XAxis, YAxis } from 'recharts'

type IAdminDashboardPsychologists = IAdminDashboardData['psychologists']

const CHART_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
]

const distributionChartConfig = {
  count: {
    label: 'Psicólogos',
  },
} satisfies ChartConfig

const noop = () => { }

interface PsychologistsAnalyticsSectionProps {
  psychologists: IAdminDashboardPsychologists
}

export function PsychologistsAnalyticsSection({
  psychologists,
}: PsychologistsAnalyticsSectionProps) {
  const stateTotal = psychologists.byState.reduce(
    (sum, item) => sum + item.count,
    0,
  )
  const specialtyTotal = psychologists.specialties.reduce(
    (sum, item) => sum + item.count,
    0,
  )

  const total = psychologists.inactive + psychologists.active || 0
  const active = psychologists.active || 0
  const inactive = psychologists.inactive || 0

  return (
    <DashboardSection
      index="05"
      title="Análise de psicólogos"
      description="Perfil demográfico, atividade e especialidades dos profissionais"
    >
      <div className="adb-psy-analytics-charts">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Atividade</CardTitle>
              <CardDescription>Ativos vs. inativos</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="py-2">
            <div className="flex h-3 w-full overflow-hidden rounded-full bg-red-500">
              <div
                className="h-full bg-green-600"
                style={{ width: `${(active / total) * 100}%` }}
              />
            </div>
            <ul className="mt-4 space-y-2.5">
              <li className="flex items-center justify-between text-sm">
                <span className="inline-flex items-center gap-2 text-foreground">
                  <span className="size-2.5 rounded-full bg-green-600" />
                  Ativos
                </span>
                <span className="tabular-nums font-medium text-foreground">{active}</span>
              </li>
              <li className="flex items-center justify-between text-sm">
                <span className="inline-flex items-center gap-2 text-foreground">
                  <span className="size-2.5 rounded-full bg-red-500" />
                  Sem atividade (30d)
                </span>
                <span className="tabular-nums font-medium text-foreground">{inactive}</span>
              </li>
            </ul>
            <p className="mt-3 text-xs text-muted-foreground">
              Base total: <span className="font-medium text-foreground">{total}</span>
            </p>
          </CardContent>
        </Card>
        <PsychologistsAgeRangeChart
          onRetry={() => { }}
          isError={false}
          isLoading={false}
          psychologistsByAge={psychologists.byAge}
        />
        <PsychologistsGenderChart endDate={undefined} />
      </div>

      <div className="flex gap-4">
        <Card className="flex-1">
          <CardHeader className="flex justify-between">
            <div>
              <CardTitle>Distribuição por estado</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Psicólogos ativos por unidade federativa
              </CardDescription>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Total Geral</span>
              <span className="text-2xl font-bold">{stateTotal} </span>
            </div>
          </CardHeader>
          <CardContent className="pl-0!">
            <ChartContainer
              config={distributionChartConfig}
              className="mx-auto aspect-square h-[300px] w-full"
            >
              <BarChart
                data={[
                  { region: "SP", count: 25 },
                  { region: "RJ", count: 18 },
                  { region: "MG", count: 12 },
                ]}
                layout="vertical"
              >
                <XAxis dataKey="count" type="number" allowDecimals={false} />
                <YAxis type="category" dataKey="region" />

                <Bar
                  dataKey="count"
                  fill={CHART_COLORS[0]}
                  radius={[0, 10, 10, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <DemographicsPieChartCard
          header={{
            title: 'Especialidades',
            description: 'Abordagens terapêuticas mais frequentes',
            totalLabel: 'Total Geral',
            total: specialtyTotal,
          }}
          chart={{
            config: distributionChartConfig,
            data: psychologists.specialties,
            nameKey: 'specialty',
            valueKey: 'count',
            colors: CHART_COLORS,
            isLoading: false,
            isError: false,
            isEmpty: specialtyTotal === 0,
            onRetry: noop,
            label: 'Abordagens'
          }}
          empty={{
            icon: <Layers className="size-5 text-muted-foreground/50" />,
            title: 'Sem dados de especialidade',
            subtitle: 'Nenhuma especialidade registrada',
          }}
        />
      </div>
    </DashboardSection>
  )
}
