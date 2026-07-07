import { AlertTriangle } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

type AlertType = 'warning' | 'neutral' | 'ok'

interface AlertData {
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

const ALERTS: AlertData[] = [
  {
    type: 'warning',
    tag: 'Atenção',
    title: 'Status marcado como Arquivado',
    description: 'Considere entrar em contato — sem sessões há 42 dias.',
  },
  {
    type: 'neutral',
    tag: 'CPF',
    title: 'CPF não informado',
    description: 'Necessário para emissão de recibos e nota fiscal.',
  },
  {
    type: 'ok',
    tag: '✓ OK',
    title: 'Termo de consentimento assinado',
    description: 'Vigente desde 14/10/2025.',
  },
]

function AlertRow({ type, tag, title, description }: AlertData) {
  const style = ALERT_STYLES[type]

  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-lg border px-3 py-2.5',
        style.row,
      )}
    >
      <Badge
        className={cn(
          'mt-0.5 h-5 shrink-0 px-2 text-[10px] font-bold',
          style.tag,
        )}
      >
        {tag}
      </Badge>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-foreground">{title}</p>
        <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  )
}

export function ResumeClinicalAlerts() {
  return (
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
      <CardContent className="flex flex-col gap-2 pt-3">
        {ALERTS.map((alert) => (
          <AlertRow key={alert.title} {...alert} />
        ))}
      </CardContent>
    </Card>
  )
}
