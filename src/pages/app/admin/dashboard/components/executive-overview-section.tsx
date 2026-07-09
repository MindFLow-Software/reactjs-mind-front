import {
  Users,
  UserRound,
  CalendarCheck,
  Building2,
  Crown,
  Gift,
  DollarSign,
  Percent,
} from 'lucide-react'

import { DashboardSection } from '@/pages/app/dashboard/shared/components/dashboard-section'
import { MetricCard } from '@/components/metric-card'
import { Currency } from '@/utils/currency'
import { AdminStatCard } from './admin-stat-card'
import type { IAdminDashboardExecutive } from '../types'
import './executive-overview-section.css'

interface ExecutiveOverviewSectionProps {
  executive: IAdminDashboardExecutive
  isLoading: boolean
  isError: boolean
}

export function ExecutiveOverviewSection({
  executive,
  isLoading,
  isError,
}: ExecutiveOverviewSectionProps) {
  return (
    <DashboardSection
      index="01"
      title="Visão executiva"
      description="Indicadores principais da plataforma no período selecionado"
    >
      <div></div>
      <div className="adb-exec-content">
        <AdminStatCard
          icon={<Users className="size-4" />}
          accent="blue"
          title="Psicólogos ativos"
          subtitle="Cadastrados na plataforma"
          query={{ value: executive.psychologists, isLoading, isError }}
        />
        <AdminStatCard
          icon={<UserRound className="size-4" />}
          accent="blue"
          title="Pacientes ativos"
          subtitle="Cadastrados na plataforma"
          query={{ value: executive.patients, isLoading, isError }}
        />
        <AdminStatCard
          icon={<CalendarCheck className="size-4" />}
          accent="amber"
          title="Sessões realizadas"
          subtitle="No período selecionado"
          query={{
            value: executive.sessions,
            isLoading: false,
            isError: false,
          }}
        />
        <AdminStatCard
          icon={<Building2 className="size-4" />}
          accent="blue"
          title="Clínicas parceiras"
          subtitle="Ativas na plataforma"
          query={{ value: executive.clinics, isLoading: false, isError: false }}
        />
        <AdminStatCard
          icon={<Crown className="size-4" />}
          accent="amber"
          title="Assinantes premium"
          subtitle="Contas pagantes"
          query={{ value: executive.premium, isLoading: false, isError: false }}
        />
        <AdminStatCard
          icon={<Gift className="size-4" />}
          accent="red"
          title="Contas freemium"
          subtitle="Uso gratuito da plataforma"
          query={{
            value: executive.freemium,
            isLoading: false,
            isError: false,
          }}
        />
        <MetricCard variant="stacked" accentColor="emerald" size="md">
          <MetricCard.Header
            icon={<DollarSign className="size-4 text-emerald-600" />}
            label="MRR"
            accentColor="emerald"
          />
          <MetricCard.Value>{Currency.toBRL(executive.mrr)}</MetricCard.Value>
        </MetricCard>
        <MetricCard variant="stacked" accentColor="violet" size="md">
          <MetricCard.Header
            icon={<Percent className="size-4 text-violet-600" />}
            label="Taxa de conversão"
            accentColor="violet"
          />
          <MetricCard.Value>{executive.conversionPercent}%</MetricCard.Value>
        </MetricCard>
      </div>
    </DashboardSection>
  )
}
