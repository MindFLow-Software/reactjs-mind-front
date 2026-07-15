import { useMemo } from 'react'
import { UserRound, Users2, MapPin } from 'lucide-react'

import { DashboardSection } from '@/pages/app/dashboard/shared/components/dashboard-section/dashboard-section'
import { ChartContainer, type ChartConfig } from '@/components/ui/chart'
import { AdminStatCard } from './admin-stat-card'
import { DemographicsPieChartCard } from './demographics-pie-chart-card'
import type { IAdminDashboardData } from '@/types/dashboard/admin-dashboard-data'
import './patients-analytics-section.css'
import { PatientsByGenderChart } from './patients-by-age-chart'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Bar, BarChart, XAxis, YAxis } from 'recharts'

type IAdminDashboardPatients = IAdminDashboardData['patients']

const CHART_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
]

const GENDER_TRANSLATIONS: Record<string, string> = {
  FEMININE: 'Feminino',
  MASCULINE: 'Masculino',
  OTHER: 'Outros',
}

const distributionChartConfig = {
  count: {
    label: 'Pacientes',
  },
} satisfies ChartConfig

const noop = () => {}

interface PatientsAnalyticsSectionProps {
  patients: IAdminDashboardPatients
}

export function PatientsAnalyticsSection({
  patients,
}: PatientsAnalyticsSectionProps) {
  const genderData = useMemo(
    () =>
      patients.byGender.map((item) => ({
        ...item,
        gender: GENDER_TRANSLATIONS[item.gender] ?? item.gender,
      })),
    [patients.byGender],
  )

  const genderTotal = genderData.reduce((sum, item) => sum + item.count, 0)
  const regionTotal = patients.byRegion.reduce(
    (sum, item) => sum + item.count,
    0,
  )

  return (
    <DashboardSection
      header={{
        index: '06',
        title: 'Pacientes',
        description:
          'Total ativo na plataforma e perfil demográfico dos pacientes',
      }}
    >
      <div className="adb-pat-analytics-metric">
        <AdminStatCard
          icon={<UserRound className="size-4" />}
          accent="blue"
          title="Pacientes ativos"
          subtitle="Cadastrados na plataforma"
          query={{ value: patients.total, isLoading: false, isError: false }}
        />
      </div>

      <div className="adb-pat-analytics-charts">
        <PatientsByGenderChart
          isError={false}
          isLoading={false}
          patientsByAge={patients.byAge}
          onRetry={noop}
        />

        <DemographicsPieChartCard
          header={{
            title: 'Gênero',
            description: 'Distribuição dos pacientes por gênero',
            totalLabel: 'Total Geral',
            total: genderTotal,
          }}
          chart={{
            config: distributionChartConfig,
            data: genderData,
            nameKey: 'gender',
            valueKey: 'count',
            colors: CHART_COLORS,
            isLoading: false,
            isError: false,
            isEmpty: genderTotal === 0,
            onRetry: noop,
            label: 'Pacientes',
          }}
          empty={{
            icon: <Users2 className="size-5 text-muted-foreground/50" />,
            title: 'Sem dados de gênero',
            subtitle: 'Nenhum paciente identificado',
          }}
        />

        <Card className="flex-1">
          <CardHeader className="flex justify-between">
            <div>
              <CardTitle>Distribuição por estado</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Psicólogos ativos por unidade federativa
              </CardDescription>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Total Geral
              </span>
              <span className="text-2xl font-bold">{regionTotal} </span>
            </div>
          </CardHeader>
          <CardContent className="pl-0!">
            <ChartContainer
              config={distributionChartConfig}
              className="mx-auto aspect-square h-[300px] w-full"
            >
              <BarChart
                data={[
                  { region: 'SP', count: 25 },
                  { region: 'RJ', count: 18 },
                  { region: 'MG', count: 12 },
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
            title: 'Geografia',
            description: 'Distribuição dos pacientes por estado',
            totalLabel: 'Total Geral',
            total: regionTotal,
          }}
          chart={{
            config: distributionChartConfig,
            data: patients.byRegion,
            nameKey: 'region',
            valueKey: 'count',
            colors: CHART_COLORS,
            isLoading: false,
            isError: false,
            isEmpty: regionTotal === 0,
            onRetry: noop,
            label: 'Pacientes',
          }}
          empty={{
            icon: <MapPin className="h-5 w-5 text-muted-foreground/50" />,
            title: 'Sem dados regionais',
            subtitle: 'Nenhum paciente localizado por estado',
          }}
        />
      </div>
    </DashboardSection>
  )
}
