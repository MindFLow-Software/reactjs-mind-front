import { useCallback } from 'react'
import { toast } from 'sonner'
import { Clock, MapPin, Video } from 'lucide-react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Time } from '@/utils/time'
import { SessionModality, type IPatientNextSession } from '../types'
import './next-session-card.css'

export interface NextSessionCardProps {
  session: IPatientNextSession | null
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

export function NextSessionCard({ session }: NextSessionCardProps) {
  const handleReschedule = useCallback(() => {
    toast.info('Reagendamento ainda não disponível nesta versão.')
  }, [])

  if (!session) {
    return (
      <Card className="ptd-next-session ptd-next-session--empty">
        <p className="ptd-next-session-empty-text">
          Nenhuma sessão agendada no momento.
        </p>
      </Card>
    )
  }

  const isOnline = session.modality === SessionModality.ONLINE

  return (
    <Card className="ptd-next-session">
      <span className="ptd-next-session-label">Próxima sessão</span>

      <div className="ptd-next-session-main">
        <Avatar className="ptd-next-session-avatar">
          <AvatarFallback>
            {getInitials(session.psychologistName)}
          </AvatarFallback>
        </Avatar>

        <div className="ptd-next-session-info">
          <span className="ptd-next-session-psychologist">
            {session.psychologistName}
          </span>
          <span className="ptd-next-session-datetime">
            {Time.toReadableDateTime(new Date(session.date))}
          </span>
        </div>
      </div>

      <div className="ptd-next-session-meta">
        <Badge variant="secondary" className="ptd-next-session-badge">
          <Clock className="size-3" />
          {session.durationMinutes} min
        </Badge>
        <Badge variant="secondary" className="ptd-next-session-badge">
          {isOnline ? (
            <Video className="size-3" />
          ) : (
            <MapPin className="size-3" />
          )}
          {isOnline ? 'Online' : 'Presencial'}
        </Badge>
      </div>

      <div className="ptd-next-session-actions">
        <Button className="ptd-next-session-action" disabled>
          Entrar na sessão
        </Button>
        <Button
          variant="outline"
          className="ptd-next-session-action"
          onClick={handleReschedule}
        >
          Reagendar
        </Button>
      </div>
    </Card>
  )
}
