import { UserPlus, CalendarPlus, FileText, Video, Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { IconBadge, IconBadgeTone } from '@/components/icon-badge/icon-badge'
import { cn } from '@/lib/utils'
import './quick-actions.css'

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
    <Card className="dsh-actions-card">
      <CardHeader className="dsh-actions-header">
        <div className="dsh-actions-header-row">
          <IconBadge tone={IconBadgeTone.VIOLET}>
            <Zap className="size-4" />
          </IconBadge>
          <div>
            <p className="dsh-actions-title">Ações rápidas</p>
            <p className="dsh-actions-subtitle">Atalhos</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="dsh-actions-content">
        <div className="dsh-actions-grid">
          {ACTIONS.map(({ icon: Icon, title, subtitle, href, iconClass }) => (
            <button
              key={title}
              onClick={() => navigate(href)}
              className="dsh-actions-btn"
            >
              <Icon className={cn('size-5 shrink-0', iconClass)} />
              <div className="min-w-0">
                <p className="dsh-actions-btn-title">{title}</p>
                <p className="dsh-actions-btn-subtitle">{subtitle}</p>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
