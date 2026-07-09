import {
  DollarSign,
  Crown,
  Gift,
  Percent,
  TrendingUp,
  TrendingDown,
} from 'lucide-react'

import { DashboardSection } from '@/pages/app/dashboard/shared/components/dashboard-section'
import { MetricCard } from '@/components/metric-card'
import { Currency } from '@/utils/currency'
import type { IAdminDashboardRevenue } from '../types'
import './revenue-subscriptions-section.css'
import { Card } from '@/components/ui/card'

interface RevenueSubscriptionsSectionProps {
  revenue: IAdminDashboardRevenue
}

export function RevenueSubscriptionsSection({
  revenue,
}: RevenueSubscriptionsSectionProps) {
  return (
    <DashboardSection
      index="03"
      title="Receita & Assinaturas"
      description="Indicadores financeiros e de assinatura no período selecionado"
    >
      <div className="adb-revenue-content">
        <Card className="flex-1">

        </Card>
        <div className="adb-revenue-cards">
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
