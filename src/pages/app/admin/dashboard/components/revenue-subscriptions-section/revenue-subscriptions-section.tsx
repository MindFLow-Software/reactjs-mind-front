import {
  Gift,
  Crown,
  Percent,
  DollarSign,
  TrendingUp,
  TrendingDown,
} from 'lucide-react'

import { Currency } from '@/utils/currency'
import type { IAdminDashboardData } from '@/types/dashboard/admin-dashboard-data'

import { MetricCard } from '@/components/metric-card/metric-card'
import { DashboardSection } from '@/pages/app/dashboard/shared/components/dashboard-section/dashboard-section'

import { RevenueTrendChart } from '../revenue-trend-chart/revenue-trend-chart'

import './revenue-subscriptions-section.css'

type IAdminDashboardRevenue = IAdminDashboardData['revenue']

type IRevenueSubscriptionsSection = {
  revenue: IAdminDashboardRevenue
}

export function RevenueSubscriptionsSection({
  revenue,
}: IRevenueSubscriptionsSection) {
  return (
    <DashboardSection
      header={{
        index: '03',
        title: 'Receita & Assinaturas',
        description:
          'Indicadores financeiros e de assinatura no período selecionado',
      }}
    >
      <div className="adb-revenue-content">
        <RevenueTrendChart />
        <div className="adb-revenue-side">
          <MetricCard variant="stacked" accentColor="emerald">
            <MetricCard.Header
              icon={<DollarSign className="size-4 text-emerald-600" />}
              label="MRR"
              accentColor="emerald"
            />
            <MetricCard.Value>{Currency.toBRL(revenue.mrr)}</MetricCard.Value>
          </MetricCard>

          <MetricCard variant="stacked" accentColor="emerald">
            <MetricCard.Header
              icon={<Crown className="size-4 text-emerald-600" />}
              label="Assinantes premium"
              accentColor="emerald"
            />
            <MetricCard.Value>
              {revenue.premium.toLocaleString('pt-BR')}
            </MetricCard.Value>
          </MetricCard>

          <MetricCard variant="stacked" accentColor="blue">
            <MetricCard.Header
              icon={<Gift className="size-4 text-blue-600" />}
              label="Contas freemium"
              accentColor="blue"
            />
            <MetricCard.Value>
              {revenue.freemium.toLocaleString('pt-BR')}
            </MetricCard.Value>
          </MetricCard>

          <MetricCard variant="stacked" accentColor="violet">
            <MetricCard.Header
              icon={<Percent className="size-4 text-violet-600" />}
              label="Taxa de conversão"
              accentColor="violet"
            />
            <MetricCard.Value>{revenue.conversionPercent}%</MetricCard.Value>
          </MetricCard>

          <MetricCard variant="stacked" accentColor="emerald">
            <MetricCard.Header
              icon={<TrendingUp className="size-4 text-emerald-600" />}
              label="Crescimento"
              accentColor="emerald"
            />
            <MetricCard.Value>{revenue.growthPercent}%</MetricCard.Value>
          </MetricCard>

          <MetricCard variant="stacked" accentColor="blue">
            <MetricCard.Header
              icon={<TrendingDown className="size-4 text-blue-600" />}
              label="Churn"
              accentColor="blue"
            />
            <MetricCard.Value>{revenue.churnPercent}%</MetricCard.Value>
          </MetricCard>
        </div>
      </div>
    </DashboardSection>
  )
}
