import {
  Gift,
  Crown,
  Users,
  Percent,
  Building2,
  UserRound,
  DollarSign,
  CalendarCheck,
  TrendingDown,
  Calendar,
  CreditCard,
  TrendingUp,
} from 'lucide-react'

import { Currency } from '@/utils/currency'
import type { IAdminDashboardData } from '@/types/dashboard'

import { AdminStatCard } from './admin-stat-card'
import { DashboardSection } from '@/pages/app/dashboard/shared/components/dashboard-section'

import './executive-overview-section.css'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChartContainer, type ChartConfig } from '@/components/ui/chart'
import { Area, AreaChart } from 'recharts'

type IAdminDashboardExecutive = IAdminDashboardData['executive']

interface ExecutiveOverviewSectionProps {
  executive: IAdminDashboardExecutive
}

const chartData = [
  { date: "2024-04-01", desktop: 222, mobile: 150 },
  { date: "2024-04-02", desktop: 97, mobile: 180 },
  { date: "2024-04-03", desktop: 167, mobile: 120 },
  { date: "2024-04-04", desktop: 242, mobile: 260 },
  { date: "2024-04-05", desktop: 373, mobile: 290 },
  { date: "2024-04-06", desktop: 301, mobile: 340 },
  { date: "2024-04-07", desktop: 245, mobile: 180 },
  { date: "2024-04-08", desktop: 409, mobile: 320 },
  { date: "2024-04-09", desktop: 59, mobile: 110 },
]

const chartConfig = {} satisfies ChartConfig

export function ExecutiveOverviewSection({
  executive,
}: ExecutiveOverviewSectionProps) {
  return (
    <DashboardSection
      index="01"
      title="Visão executiva"
      description="Indicadores principais da plataforma no período selecionado"
    >
      <div className="flex gap-4">
        <Card className="relative flex flex-row! gap-2 w-full max-w-1/2 pb-0">
          <div className="absolute top-0 left-0 bg-blue-500 w-full h-1" />

          <div className="flex flex-col gap-8 flex-1 max-w-3/5 px-4">
            <CardHeader className="pb-2 px-0!">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center bg-blue-200 rounded-full w-fit p-1.5">
                  <Calendar size={16} className="text-blue-500" />
                </div>
                <span className="text-muted-foreground font-medium text-xs">
                  Sessões realizadas
                </span>
              </div>
              <div>
                <div className="flex gap-2 items-baseline">
                  <CardTitle className="text-3xl">48.392</CardTitle>
                  <Badge className="bg-red-100 text-red-500 text-[10px] p-1 py-0.5">
                    <TrendingDown size={14} />
                    1.6%
                  </Badge>
                </div>
                <CardDescription className="text-[10px]">
                  vs. período anterior
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-3 border-t border-border pt-2 px-0!">
              <div className="flex flex-col">
                <span className="text-muted-foreground text-[11px] tracking-wider uppercase">Hoje</span>
                <span className="text-sm font-medium">1284</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground text-[11px] tracking-wider uppercase">Semana</span>
                <span className="text-sm font-medium">8940</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground text-[11px] tracking-wider uppercase">Concluídas</span>
                <span className="text-sm font-medium">92.1%</span>
              </div>
            </CardContent>
          </div>

          <ChartContainer
            config={chartConfig}
            className="aspect-square h-[200px] w-full max-w-2/5"
          >
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="fillDesktop1" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="#3b82f6"
                    stopOpacity={1.0}
                  />
                  <stop
                    offset="95%"
                    stopColor="#3b82f6"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <Area
                dataKey="mobile"
                type="natural"
                fill="url(#fillDesktop1)"
                stroke="#3b82f6"
              />
            </AreaChart>
          </ChartContainer>
        </Card>

        <Card className="relative flex flex-row! gap-2 w-full max-w-1/2 pb-0">
          <div className="absolute top-0 left-0 bg-green-500 w-full h-1" />

          <div className="flex flex-col gap-8 flex-1 max-w-3/5 px-4">
            <CardHeader className="pb-2 px-0!">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center bg-green-200 rounded-full w-fit p-1.5">
                  <CreditCard size={16} className="text-green-500" />
                </div>
                <span className="text-muted-foreground font-medium text-xs">
                  Receita recorrente mensal
                </span>
              </div>
              <div>
                <div className="flex gap-2 items-baseline">
                  <CardTitle className="text-3xl">R$ 187.430</CardTitle>
                  <Badge className="bg-green-100 text-green-500 text-[10px] p-1 py-0.5">
                    <TrendingUp size={14} />
                    9.3%
                  </Badge>
                </div>
                <CardDescription className="text-[10px]">
                  vs. período anterior
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-3 border-t border-border pt-2 px-0!">
              <div className="flex flex-col">
                <span className="text-muted-foreground text-[11px] tracking-wider uppercase">Premium</span>
                <span className="text-sm font-medium">3842</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground text-[11px] tracking-wider uppercase">Conversão</span>
                <span className="text-sm font-medium">14.6%</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground text-[11px] tracking-wider uppercase">Churn</span>
                <span className="text-sm font-medium">2.1%</span>
              </div>
            </CardContent>
          </div>

          <ChartContainer
            config={chartConfig}
            className="aspect-square h-[200px] w-full max-w-2/5"
          >
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="#bbf7d0"
                    stopOpacity={1.0}
                  />
                  <stop
                    offset="95%"
                    stopColor="#bbf7d0"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <Area
                dataKey="mobile"
                type="natural"
                fill="url(#fillDesktop)"
                stroke="#22c55e"
              />
            </AreaChart>
          </ChartContainer>
        </Card>
      </div>
      <div className="adb-exec-content">
        <AdminStatCard
          icon={<Users className="size-4" />}
          accent="blue"
          title="Psicólogos ativos"
          subtitle="Cadastrados na plataforma"
          query={{
            value: executive.psychologists,
            isLoading: false,
            isError: false,
          }}
        />
        <AdminStatCard
          icon={<UserRound className="size-4" />}
          accent="blue"
          title="Pacientes ativos"
          subtitle="Cadastrados na plataforma"
          query={{
            value: executive.patients,
            isLoading: false,
            isError: false,
          }}
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
