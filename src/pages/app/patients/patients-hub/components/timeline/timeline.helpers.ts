import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export interface Session {
  id: string
  sessionDate?: string | Date | null
  createdAt: string | Date
  status: string
  theme?: string | null
  content?: string | null
  duration?: string | number | null
}

export type StatusFilter = 'all' | 'FINISHED' | 'CANCELED' | 'NOT_ATTEND'

export const STATUS_DOT: Record<string, string> = {
  FINISHED: 'bg-blue-500',
  DONE: 'bg-blue-500',
  CANCELED: 'bg-red-500',
  SCHEDULED: 'bg-gray-400',
  ATTENDING: 'bg-green-500',
  NOT_ATTEND: 'bg-amber-400',
  RESCHEDULED: 'bg-purple-400',
}

export const CHIPS: {
  key: StatusFilter
  label: string
  matchFn: (status: string) => boolean
}[] = [
  { key: 'all', label: 'Todas', matchFn: () => true },
  {
    key: 'FINISHED',
    label: 'Realizadas',
    matchFn: (status) => status === 'FINISHED' || status === 'DONE',
  },
  {
    key: 'CANCELED',
    label: 'Canceladas',
    matchFn: (status) => status === 'CANCELED',
  },
  {
    key: 'NOT_ATTEND',
    label: 'Faltas',
    matchFn: (status) => status === 'NOT_ATTEND',
  },
]

export function getSessionDate(session: Session): Date {
  return new Date(session.sessionDate ?? session.createdAt)
}

export function groupByMonth(sessions: Session[]): [string, Session[]][] {
  const sessionsMap = new Map<string, Session[]>()

  for (const session of sessions) {
    const key = format(getSessionDate(session), 'MMMM yyyy', {
      locale: ptBR,
    }).toUpperCase()

    const existingSessions = sessionsMap.get(key) ?? []
    sessionsMap.set(key, [...existingSessions, session])
  }

  return Array.from(sessionsMap.entries())
}
