import {
  Gift,
  Crown,
  Users,
  Percent,
  Calendar,
  Building2,
  UserRound,
  CreditCard,
  DollarSign,
  CalendarCheck,
} from 'lucide-react'

import { Currency } from '@/utils/currency'
import { DashboardSection } from '@/pages/app/dashboard/shared/components/dashboard-section/dashboard-section'
import type { IAdminDashboardData } from '@/types/dashboard/admin-dashboard-data'

import {
  AdminStatCard,
  AdminStatAccent,
} from '../admin-stat-card/admin-stat-card'
import {
  ExecutiveHighlightCard,
  ExecutiveHighlightAccent,
  ExecutiveTrendDirection,
} from '../executive-highlight-card/executive-highlight-card'

import './executive-overview-section.css'

type IAdminDashboardExecutive = IAdminDashboardData['executive']

type IExecutiveOverviewSection = {
  executive: IAdminDashboardExecutive
}

// Backend exposes no daily series for the highlight cards yet.
const PLACEHOLDER_SERIES = [
  { date: '2024-04-01', value: 150 },
  { date: '2024-04-02', value: 180 },
  { date: '2024-04-03', value: 120 },
  { date: '2024-04-04', value: 260 },
  { date: '2024-04-05', value: 290 },
  { date: '2024-04-06', value: 340 },
  { date: '2024-04-07', value: 180 },
  { date: '2024-04-08', value: 320 },
  { date: '2024-04-09', value: 110 },
]

export function ExecutiveOverviewSection({
  executive,
}: IExecutiveOverviewSection) {
  return (
    <DashboardSection
      header={{
        index: '01',
        title: 'Visão executiva',
        description:
          'Indicadores principais da plataforma no período selecionado',
      }}
    >
      <div className="adb-exec-highlights">
        <ExecutiveHighlightCard
          accent={ExecutiveHighlightAccent.BLUE}
          series={PLACEHOLDER_SERIES}
        >
          <ExecutiveHighlightCard.Body>
            <ExecutiveHighlightCard.Header
              icon={<Calendar size={16} />}
              label="Sessões realizadas"
            />
            <ExecutiveHighlightCard.Value
              trend={{ direction: ExecutiveTrendDirection.DOWN, label: '1.6%' }}
            >
              48.392
            </ExecutiveHighlightCard.Value>
          </ExecutiveHighlightCard.Body>
          <ExecutiveHighlightCard.Stats>
            <ExecutiveHighlightCard.Stat label="Hoje" value="1284" />
            <ExecutiveHighlightCard.Stat label="Semana" value="8940" />
            <ExecutiveHighlightCard.Stat label="Concluídas" value="92.1%" />
          </ExecutiveHighlightCard.Stats>
        </ExecutiveHighlightCard>

        <ExecutiveHighlightCard
          accent={ExecutiveHighlightAccent.GREEN}
          series={PLACEHOLDER_SERIES}
        >
          <ExecutiveHighlightCard.Body>
            <ExecutiveHighlightCard.Header
              icon={<CreditCard size={16} />}
              label="Receita recorrente mensal"
            />
            <ExecutiveHighlightCard.Value
              trend={{ direction: ExecutiveTrendDirection.UP, label: '9.3%' }}
            >
              R$ 187.430
            </ExecutiveHighlightCard.Value>
          </ExecutiveHighlightCard.Body>
          <ExecutiveHighlightCard.Stats>
            <ExecutiveHighlightCard.Stat label="Premium" value="3842" />
            <ExecutiveHighlightCard.Stat label="Conversão" value="14.6%" />
            <ExecutiveHighlightCard.Stat label="Churn" value="2.1%" />
          </ExecutiveHighlightCard.Stats>
        </ExecutiveHighlightCard>
      </div>

      <div className="adb-exec-content">
        <AdminStatCard accent={AdminStatAccent.BLUE}>
          <AdminStatCard.Header
            icon={<Users className="size-4" />}
            title="Psicólogos ativos"
            subtitle="Cadastrados na plataforma"
          />
          <AdminStatCard.Value>
            {executive.psychologists.toLocaleString('pt-BR')}
          </AdminStatCard.Value>
        </AdminStatCard>

        <AdminStatCard accent={AdminStatAccent.BLUE}>
          <AdminStatCard.Header
            icon={<UserRound className="size-4" />}
            title="Pacientes ativos"
            subtitle="Cadastrados na plataforma"
          />
          <AdminStatCard.Value>
            {executive.patients.toLocaleString('pt-BR')}
          </AdminStatCard.Value>
        </AdminStatCard>

        <AdminStatCard accent={AdminStatAccent.AMBER}>
          <AdminStatCard.Header
            icon={<CalendarCheck className="size-4" />}
            title="Sessões realizadas"
            subtitle="No período selecionado"
          />
          <AdminStatCard.Value>
            {executive.sessions.toLocaleString('pt-BR')}
          </AdminStatCard.Value>
        </AdminStatCard>

        <AdminStatCard accent={AdminStatAccent.BLUE}>
          <AdminStatCard.Header
            icon={<Building2 className="size-4" />}
            title="Clínicas parceiras"
            subtitle="Ativas na plataforma"
          />
          <AdminStatCard.Value>
            {executive.clinics.toLocaleString('pt-BR')}
          </AdminStatCard.Value>
        </AdminStatCard>

        <AdminStatCard accent={AdminStatAccent.AMBER}>
          <AdminStatCard.Header
            icon={<Crown className="size-4" />}
            title="Assinantes premium"
            subtitle="Contas pagantes"
          />
          <AdminStatCard.Value>
            {executive.premium.toLocaleString('pt-BR')}
          </AdminStatCard.Value>
        </AdminStatCard>

        <AdminStatCard accent={AdminStatAccent.RED}>
          <AdminStatCard.Header
            icon={<Gift className="size-4" />}
            title="Contas freemium"
            subtitle="Uso gratuito da plataforma"
          />
          <AdminStatCard.Value>
            {executive.freemium.toLocaleString('pt-BR')}
          </AdminStatCard.Value>
        </AdminStatCard>

        <AdminStatCard accent={AdminStatAccent.AMBER}>
          <AdminStatCard.Header
            icon={<DollarSign className="size-4" />}
            title="MRR"
            subtitle="No período selecionado"
          />
          <AdminStatCard.Value>
            {Currency.toBRL(executive.mrr)}
          </AdminStatCard.Value>
        </AdminStatCard>

        <AdminStatCard accent={AdminStatAccent.BLUE}>
          <AdminStatCard.Header
            icon={<Percent className="size-4" />}
            title="Taxa de conversão"
            subtitle="No período selecionado"
          />
          <AdminStatCard.Value>
            {executive.conversionPercent}%
          </AdminStatCard.Value>
        </AdminStatCard>
      </div>
    </DashboardSection>
  )
}
