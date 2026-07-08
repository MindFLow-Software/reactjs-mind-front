import { UserCheck, UserX, MapPin, Layers } from 'lucide-react'

import { DashboardSection } from '@/pages/app/dashboard/shared/components/dashboard-section'
import { MetricCard } from '@/components/metric-card'
import { type ChartConfig } from '@/components/ui/chart'
import { PsychologistsAgeRangeChart } from './psychologists-by-age-chart'
import { PsychologistsGenderChart } from './psychologists-by-gender-chart'
import { DemographicsPieChartCard } from './demographics-pie-chart-card'
import type { IAdminDashboardPsychologists } from '../types'
import './psychologists-analytics-section.css'

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

const noop = () => {}

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

  return (
    <DashboardSection
      index="05"
      title="Análise de psicólogos"
      description="Perfil demográfico, atividade e especialidades dos profissionais"
    >
      <div className="adb-psy-analytics-metrics">
        <MetricCard variant="stacked" accentColor="emerald">
          <MetricCard.Header
            icon={<UserCheck className="size-4 text-emerald-600" />}
            label="Psicólogos ativos"
            accentColor="emerald"
          />
          <MetricCard.Value>
            {psychologists.active.toLocaleString('pt-BR')}
          </MetricCard.Value>
        </MetricCard>

        <MetricCard variant="stacked" accentColor="violet">
          <MetricCard.Header
            icon={<UserX className="size-4 text-violet-600" />}
            label="Psicólogos inativos"
            accentColor="violet"
          />
          <MetricCard.Value>
            {psychologists.inactive.toLocaleString('pt-BR')}
          </MetricCard.Value>
        </MetricCard>
      </div>

      <div className="adb-psy-analytics-charts">
        <PsychologistsAgeRangeChart />
        <PsychologistsGenderChart endDate={undefined} />

        <DemographicsPieChartCard
          header={{
            title: 'Distribuição por estado',
            description: 'Psicólogos ativos por unidade federativa',
            totalLabel: 'Total Geral',
            total: stateTotal,
          }}
          chart={{
            config: distributionChartConfig,
            data: psychologists.byState,
            nameKey: 'region',
            valueKey: 'count',
            colors: CHART_COLORS,
            isLoading: false,
            isError: false,
            isEmpty: stateTotal === 0,
            onRetry: noop,
          }}
          empty={{
            icon: <MapPin className="h-5 w-5 text-muted-foreground/50" />,
            title: 'Sem dados regionais',
            subtitle: 'Nenhum psicólogo localizado por estado',
          }}
        />

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
          }}
          empty={{
            icon: <Layers className="h-5 w-5 text-muted-foreground/50" />,
            title: 'Sem dados de especialidade',
            subtitle: 'Nenhuma especialidade registrada',
          }}
        />
      </div>
    </DashboardSection>
  )
}
