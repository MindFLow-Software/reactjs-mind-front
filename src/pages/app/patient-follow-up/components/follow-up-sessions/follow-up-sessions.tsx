import { Calendar } from 'lucide-react'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import './follow-up-sessions.css'

export function FollowUpSessions() {
  return (
    <>
      <Card className="pfu-next-session-card">
        <CardHeader className="pfu-next-session-card-header">
          <CardTitle className="pfu-next-session-card-title">
            <Calendar size={14} />
            Próxima Sessão
          </CardTitle>
          <span className="pfu-next-session-card-date">20 jul 2026 às 10:55</span>
          <CardDescription className="pfu-next-session-card-description">
            Presencial · 50min
          </CardDescription>
        </CardHeader>
      </Card>
      <div className="pfu-sessions-container">
        <Card className="pfu-sessions-card">
          <CardHeader className="pfu-sessions-card-header">
            <CardDescription className="pfu-sessions-card-description">
              Realizadas
            </CardDescription>
            <CardTitle className="pfu-sessions-card-title--primary">18</CardTitle>
          </CardHeader>
        </Card>
        <Card className="pfu-sessions-card">
          <CardHeader className="pfu-sessions-card-header">
            <CardDescription className="pfu-sessions-card-description">Faltas</CardDescription>
            <CardTitle className="pfu-sessions-card-title--secondary">1</CardTitle>
          </CardHeader>
        </Card>
      </div>
    </>
  )
}