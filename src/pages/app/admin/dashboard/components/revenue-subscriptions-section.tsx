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

import { Card } from '@/components/ui/card'
import { ChartContainer, type ChartConfig } from '@/components/ui/chart'

import { MetricCard } from '@/components/metric-card/metric-card'
import { DashboardSection } from '@/pages/app/dashboard/shared/components/dashboard-section/dashboard-section'

import './revenue-subscriptions-section.css'
import { Area, AreaChart, XAxis, YAxis } from 'recharts'

type IAdminDashboardRevenue = IAdminDashboardData['revenue']

interface IRevenueSubscriptionsSection {
  revenue: IAdminDashboardRevenue
}

const chartConfig = {} satisfies ChartConfig

const chartData = [
  { date: '2024-04-01', revenue: 970 },
  { date: '2024-04-02', revenue: 1050 },
  { date: '2024-04-03', revenue: 2420 },
  { date: '2024-04-04', revenue: 2420 },
  { date: '2024-04-05', revenue: 3500 },
  { date: '2024-04-06', revenue: 7000 },
  { date: '2024-04-07', revenue: 9000 },
  { date: '2024-04-08', revenue: 9500 },
  { date: '2024-04-09', revenue: 9975 },
  { date: '2024-04-10', revenue: 15023 },
  { date: '2024-04-12', revenue: 18976 },
]

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
        <Card className="adb-revenue-area-chart-contianer">
          <ChartContainer
            config={chartConfig}
            className="adb-revenue-area-chart"
          >
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#bbf7d0" stopOpacity={1.0} />
                  <stop offset="95%" stopColor="#bbf7d0" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                minTickGap={32}
              />

              <YAxis />
              <Area
                dataKey="revenue"
                type="natural"
                fill="url(#fillDesktop)"
                stroke="#22c55e"
              />
            </AreaChart>
          </ChartContainer>
        </Card>
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
