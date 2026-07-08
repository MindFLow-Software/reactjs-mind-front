import { useMemo } from 'react'
import { UserRound, CalendarRange, Users2, MapPin } from 'lucide-react'

import { DashboardSection } from '@/pages/app/dashboard/shared/components/dashboard-section'
import { type ChartConfig } from '@/components/ui/chart'
import { AdminStatCard } from './admin-stat-card'
import { DemographicsPieChartCard } from './demographics-pie-chart-card'
import type { IAdminDashboardPatients } from '../types'
import './patients-analytics-section.css'

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
  isLoading: boolean
  isError: boolean
}

export function PatientsAnalyticsSection({
  patients,
  isLoading,
  isError,
}: PatientsAnalyticsSectionProps) {
  const genderData = useMemo(
    () =>
      patients.byGender.map((item) => ({
        ...item,
        gender: GENDER_TRANSLATIONS[item.gender] ?? item.gender,
      })),
    [patients.byGender],
  )

  const ageTotal = patients.byAge.reduce((sum, item) => sum + item.count, 0)
  const genderTotal = genderData.reduce((sum, item) => sum + item.count, 0)
  const regionTotal = patients.byRegion.reduce(
    (sum, item) => sum + item.count,
    0,
  )

  return (
    <DashboardSection
      index="06"
      title="Pacientes"
      description="Total ativo na plataforma e perfil demográfico dos pacientes"
    >
      <div className="adb-pat-analytics-metric">
        <AdminStatCard
          icon={<UserRound className="size-4" />}
          accent="blue"
          title="Pacientes ativos"
          subtitle="Cadastrados na plataforma"
          query={{ value: patients.total, isLoading, isError }}
        />
      </div>

      <div className="adb-pat-analytics-charts">
        <DemographicsPieChartCard
          header={{
            title: 'Perfil etário',
            description: 'Distribuição dos pacientes por faixa de idade',
            totalLabel: 'Total Geral',
            total: ageTotal,
          }}
          chart={{
            config: distributionChartConfig,
            data: patients.byAge,
            nameKey: 'range',
            valueKey: 'count',
            colors: CHART_COLORS,
            isLoading: false,
            isError: false,
            isEmpty: ageTotal === 0,
            onRetry: noop,
          }}
          empty={{
            icon: (
              <CalendarRange className="h-5 w-5 text-muted-foreground/50" />
            ),
            title: 'Sem dados etários',
            subtitle: 'Nenhum paciente com idade registrada',
          }}
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
          }}
          empty={{
            icon: <Users2 className="h-5 w-5 text-muted-foreground/50" />,
            title: 'Sem dados de gênero',
            subtitle: 'Nenhum paciente identificado',
          }}
        />

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
