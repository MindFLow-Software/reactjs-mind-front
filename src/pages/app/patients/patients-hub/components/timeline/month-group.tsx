import { SessionRow } from './session-row'
import type { ITimelineSessionItem } from './timeline.helpers'

type MonthGroupProps = {
  month: string
  sessions: ITimelineSessionItem[]
  patientName: string
}

export function MonthGroup({ month, sessions, patientName }: MonthGroupProps) {
  return (
    <div>
      <div className="pst-month-header">
        <span className="pst-month-dot" />
        <h3 className="pst-month-label">{month}</h3>
        <span className="pst-month-count">
          {sessions.length} {sessions.length === 1 ? 'sessão' : 'sessões'}
        </span>
      </div>

      <div className="pst-month-sessions">
        {sessions.map((session) => (
          <SessionRow
            key={session.id}
            session={session}
            patientName={patientName}
          />
        ))}
      </div>
    </div>
  )
}
