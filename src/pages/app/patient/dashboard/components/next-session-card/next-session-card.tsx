import { useCallback } from 'react'
import { Clock, MapPin, Play, Video } from 'lucide-react'

import { toast } from 'sonner'

import { Time } from '@/utils/time'
import { SessionModality } from '@/types/shared/enums'
import type { IPatientNextSession } from '@/types/dashboard/patient-next-session'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import './next-session-card.css'

type INextSessionCard = {
  session: IPatientNextSession | null
}

export function NextSessionCard({ session }: INextSessionCard) {
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
    <Card className="ptd-next-session-card">
      <span className="ptd-next-session-label">Próxima sessão</span>

      <div className="ptd-next-session-main">
        <div className="ptd-next-session-info">
          <span className="ptd-next-session-datetime">
            {Time.toExtensiveReadableDateTime(session.scheduledAt)}
          </span>
          <div className="flex items-center gap-1">
            <span className="ptd-next-session-details">
              {session.psychologistName}
              {' ·'}
            </span>
            <div className="ptd-next-session-meta">
              <Badge className="ptd-next-session-badge">
                <Clock className="size-3" />
                {session.durationMinutes} min
              </Badge>
              <Badge className="ptd-next-session-badge">
                {isOnline ? (
                  <Video className="size-3" />
                ) : (
                  <MapPin className="size-3" />
                )}
                {isOnline ? 'Online' : 'Presencial'}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="ptd-next-session-actions">
        <Button
          size="sm"
          variant="secondary"
          className="ptd-next-session-action-btn"
        >
          <Play size={16} />
          Entrar na sessão
        </Button>
        <Button
          size="sm"
          onClick={handleReschedule}
          className="ptd-next-session-action-btn--secondary"
        >
          Reagendar
        </Button>
      </div>
    </Card>
  )
}
