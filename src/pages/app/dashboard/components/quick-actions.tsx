import { UserPlus, CalendarPlus, FileText, Video, Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const ACTIONS = [
  {
    icon: UserPlus,
    title: 'Novo paciente',
    subtitle: 'Cadastrar',
    href: '/patients-list',
    iconClass: 'text-blue-500',
  },
  {
    icon: CalendarPlus,
    title: 'Agendar',
    subtitle: 'Nova sessão',
    href: '/appointment',
    iconClass: 'text-blue-500',
  },
  {
    icon: FileText,
    title: 'Anamnese',
    subtitle: 'Nova',
    href: '/patients-docs',
    iconClass: 'text-blue-500',
  },
  {
    icon: Video,
    title: 'Sala',
    subtitle: 'Iniciar',
    href: '/video-room',
    iconClass: 'text-blue-500',
  },
] as const

export function QuickActions() {
  const navigate = useNavigate()

  return (
    <Card className="border-border bg-card shadow-sm rounded-xl">
      <CardHeader className="pb-4 px-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-500/10 ring-1 ring-violet-500/20">
            <Zap className="size-4 text-violet-600" />
          </div>
          <div>
            <p className="text-base font-semibold text-foreground leading-tight">
              Ações rápidas
            </p>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mt-0.5">
              Atalhos
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <div className="grid grid-cols-2 gap-2">
          {ACTIONS.map(({ icon: Icon, title, subtitle, href, iconClass }) => (
            <button
              key={title}
              onClick={() => navigate(href)}
              className={cn(
                'flex items-center gap-3 rounded-lg border border-border bg-background p-3.5 cursor-pointer',
                'text-left transition-colors hover:bg-muted/50 active:bg-muted',
              )}
            >
              <Icon className={cn('size-5 shrink-0', iconClass)} />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground leading-tight">
                  {title}
                </p>
                <p className="text-xs text-muted-foreground">{subtitle}</p>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
