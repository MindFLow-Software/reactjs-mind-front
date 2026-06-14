'use client'

import type { ReactNode } from 'react'
import {
  CalendarCheck2,
  CheckCircle2,
  Timer,
  DollarSign,
  CalendarClock,
  Plus,
  AlertTriangle,
  type LucideIcon,
} from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Area,
  AreaChart,
} from 'recharts'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { cn } from '@/lib/utils'

import './patient-resume-tab.css'

// ─── Mock data ────────────────────────────────────────────────
const FREQUENCY_DATA = [
  { month: 'NOV', sessions: 1 },
  { month: 'DEZ', sessions: 3 },
  { month: 'JAN', sessions: 4 },
  { month: 'FEV', sessions: 2 },
  { month: 'MAR', sessions: 1 },
  { month: 'ABR', sessions: 0 },
]

const HUMOR_DATA = [
  { date: '03/01', score: 6 },
  { date: '17/01', score: 5.5 },
  { date: '07/02', score: 7 },
  { date: '21/02', score: 4 },
  { date: '07/03', score: 5.5 },
  { date: '21/03', score: 6.5 },
  { date: '28/03', score: 6 },
  { date: '04/04', score: 5 },
]

const HUMOR_AVG = (
  HUMOR_DATA.reduce((acc, d) => acc + d.score, 0) / HUMOR_DATA.length
).toFixed(1)

// ─── Chart configs ────────────────────────────────────────────
const frequencyConfig = {
  sessions: { label: 'Sessões', color: '#3b82f6' },
} satisfies ChartConfig

const humorConfig = {
  score: { label: 'Humor', color: '#3b82f6' },
} satisfies ChartConfig

// ─── Stat card ────────────────────────────────────────────────
interface StatCardProps {
  icon: LucideIcon
  iconColor: string
  borderColor: string
  label: string
  value: ReactNode
  footer: ReactNode
  valueClassName?: string
}

function StatCard({
  icon: Icon,
  iconColor,
  borderColor,
  label,
  value,
  footer,
  valueClassName,
}: StatCardProps) {
  return (
    <Card className={cn('border-l-4', borderColor)}>
      <CardContent className="pt-5 pb-4">
        <p
          className={cn(
            'flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3',
            iconColor,
          )}
        >
          <Icon className="size-3" />
          {label}
        </p>
        <div
          className={cn(
            'text-[28px] font-bold leading-none tabular-nums',
            valueClassName ?? 'text-foreground',
          )}
        >
          {value}
        </div>
        <div className="mt-2">{footer}</div>
      </CardContent>
    </Card>
  )
}

// ─── Alert row ────────────────────────────────────────────────
type AlertType = 'warning' | 'neutral' | 'ok'

interface AlertRowProps {
  type: AlertType
  tag: string
  title: string
  description: string
}

const ALERT_STYLES: Record<AlertType, { row: string; tag: string }> = {
  warning: {
    row: 'bg-amber-50 dark:bg-amber-950/20 border-amber-200/60 dark:border-amber-800/30',
    tag: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-400 border-0',
  },
  neutral: {
    row: 'bg-muted/40 border-border/50',
    tag: 'bg-muted text-muted-foreground border-0',
  },
  ok: {
    row: 'bg-green-50 dark:bg-green-950/20 border-green-200/60 dark:border-green-800/30',
    tag: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400 border-0',
  },
}

function AlertRow({ type, tag, title, description }: AlertRowProps) {
  const s = ALERT_STYLES[type]
  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-lg border px-3 py-2.5',
        s.row,
      )}
    >
      <Badge
        className={cn('mt-0.5 shrink-0 text-[10px] font-bold px-2 h-5', s.tag)}
      >
        {tag}
      </Badge>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-foreground">{title}</p>
        <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">
          {description}
        </p>
      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────

interface PatientResumeTabProps {
  meta: {
    totalCount: number
    averageDuration: number | null
  }
}

// eslint-disable-next-line
export function PatientResumeTab(_props: PatientResumeTabProps) {
  return (
    <div className="space-y-4 mt-4">
      {/* ── Stat cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          icon={CalendarCheck2}
          iconColor="text-blue-600"
          borderColor="border-l-blue-500"
          label="Sessões Realizadas"
          value="14"
          footer={
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] text-muted-foreground">
                desde 14/10/2025
              </span>
              <Badge className="bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400 border-0 text-[10px] px-1.5 h-4 font-semibold">
                +3 vs trim. anterior
              </Badge>
            </div>
          }
        />

        <StatCard
          icon={CheckCircle2}
          iconColor="text-green-600"
          borderColor="border-l-green-500"
          label="Presença"
          value={
            <>
              92
              <span className="text-xl font-semibold text-muted-foreground">
                {' '}
                %
              </span>
            </>
          }
          footer={
            <span className="text-[11px] text-muted-foreground">
              12 de 13 compromissos
            </span>
          }
        />

        <StatCard
          icon={Timer}
          iconColor="text-amber-600"
          borderColor="border-l-amber-500"
          label="Sem Sessão Há"
          valueClassName="text-amber-500 dark:text-amber-400"
          value={
            <>
              42
              <span className="text-xl font-semibold"> dias</span>
            </>
          }
          footer={
            <span className="text-[11px] text-muted-foreground">
              última em 04/04/2026
            </span>
          }
        />

        <StatCard
          icon={DollarSign}
          iconColor="text-emerald-600"
          borderColor="border-l-emerald-500"
          label="Receita"
          value={
            <>
              <span className="text-lg font-semibold text-muted-foreground">
                R${' '}
              </span>
              2.520
            </>
          }
          footer={
            <span className="text-[11px] text-muted-foreground">
              acumulado · R$ 180/sessão
            </span>
          }
        />
      </div>

      {/* ── Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-sm font-semibold">
                  Frequência por mês
                </CardTitle>
                <CardDescription className="text-[11px]">
                  Sessões nos últimos 6 meses
                </CardDescription>
              </div>
              <button className="text-[11px] font-medium text-blue-600 hover:underline shrink-0">
                Ver detalhes
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={frequencyConfig}
              className="h-[200px] w-full"
            >
              <BarChart
                data={FREQUENCY_DATA}
                margin={{ top: 16, left: 0, right: 0, bottom: 0 }}
              >
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 3"
                  stroke="var(--border)"
                />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  fontSize={11}
                  stroke="var(--muted-foreground)"
                />
                <YAxis hide />
                <ChartTooltip
                  cursor={{ fill: 'var(--muted)', opacity: 0.2, radius: 6 }}
                  content={<ChartTooltipContent indicator="dashed" />}
                />
                <Bar
                  dataKey="sessions"
                  fill="#3b82f6"
                  radius={[6, 6, 0, 0]}
                  label={{
                    position: 'top',
                    fontSize: 11,
                    fill: 'hsl(var(--muted-foreground))',
                    formatter: (v: number) => (v > 0 ? v : ''),
                  }}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle className="text-sm font-semibold">
                  Humor — últimas 8 sessões
                </CardTitle>
                <CardDescription className="text-[11px]">
                  Escala 0-10 reportada pelo paciente
                </CardDescription>
              </div>
              <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border-0 text-[10px] font-semibold shrink-0 h-5">
                Média: {HUMOR_AVG}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={humorConfig} className="h-[200px] w-full">
              <AreaChart
                data={HUMOR_DATA}
                margin={{ top: 10, left: 0, right: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="humorGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 3"
                  stroke="var(--border)"
                />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  fontSize={11}
                  stroke="var(--muted-foreground)"
                />
                <YAxis hide domain={[0, 10]} />
                <ChartTooltip
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#humorGradient)"
                  dot={{ r: 3, fill: '#3b82f6', strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* ── Bottom row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/30">
                  <CalendarClock className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-sm font-semibold">
                    Próximos eventos
                  </CardTitle>
                  <CardDescription className="text-[11px]">
                    Agendamentos confirmados
                  </CardDescription>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 gap-1 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/30 cursor-pointer"
              >
                <Plus className="h-3 w-3" />
                Agendar
              </Button>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="pt-0">
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted/40">
                <CalendarClock className="h-5 w-5 text-muted-foreground/40" />
              </div>
              <p className="text-sm font-semibold text-foreground">
                Sem próximos agendamentos
              </p>
              <p className="mt-1 text-xs text-muted-foreground max-w-[220px]">
                Agende uma nova sessão para retomar o acompanhamento.
              </p>
              <Button
                size="sm"
                className="mt-4 h-8 gap-1.5 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                Agendar agora
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-950/30">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold">
                  Alertas clínicos
                </CardTitle>
                <CardDescription className="text-[11px]">
                  Pontos de atenção do prontuário
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="pt-3 space-y-2">
            <AlertRow
              type="warning"
              tag="Atenção"
              title="Status marcado como Arquivado"
              description="Considere entrar em contato — sem sessões há 42 dias."
            />
            <AlertRow
              type="neutral"
              tag="CPF"
              title="CPF não informado"
              description="Necessário para emissão de recibos e nota fiscal."
            />
            <AlertRow
              type="ok"
              tag="✓ OK"
              title="Termo de consentimento assinado"
              description="Vigente desde 14/10/2025."
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
