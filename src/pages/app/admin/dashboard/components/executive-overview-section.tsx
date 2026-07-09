import {
  Gift,
  Crown,
  Users,
  Percent,
  Building2,
  UserRound,
  DollarSign,
  CalendarCheck,
} from 'lucide-react'

import { Currency } from '@/utils/currency'
import type { IAdminDashboardExecutive } from '../types'

import { AdminStatCard } from './admin-stat-card'
import { DashboardSection } from '@/pages/app/dashboard/shared/components/dashboard-section'

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
      <div>
        
      </div>
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
        <AdminStatCard
          icon={<DollarSign className="size-4" />}
          accent="amber"
          title="MRR"
          subtitle="No período selecionado"
          query={{
            value: Currency.toBRL(executive.mrr),
            isLoading: false,
            isError: false,
          }}
        />
        <AdminStatCard
          icon={<Percent className="size-4" />}
          accent="blue"
          title="Taxa de conversão"
          subtitle="No período selecionado"
          query={{
            value: `${executive.conversionPercent}%`,
            isLoading: false,
            isError: false,
          }}
        />
      </div>
    </DashboardSection>
  )
}
