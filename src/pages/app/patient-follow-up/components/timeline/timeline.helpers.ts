import { Time } from '@/utils/time'
import type { ISessionItem } from '@/types/patient/session-item'

// Status is widened to `string`: the timeline filters/badges match against
// English status codes (FINISHED/CANCELED/...) while `ISessionItem.status`
// is currently typed as the PT-BR display labels. Flagged for a product
// decision on the real contract; kept identical to prior behavior here.
export type ITimelineSessionItem = Omit<ISessionItem, 'status'> & {
  status: string
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

export function getSessionDate(session: ITimelineSessionItem): Date | null {
  return Time.parse(session.sessionDate ?? session.createdAt)
}

export function groupByMonth(
  sessions: ITimelineSessionItem[],
): [string, ITimelineSessionItem[]][] {
  const sessionsMap = new Map<string, ITimelineSessionItem[]>()

  for (const session of sessions) {
    const key = Time.toMonthYearUppercase(getSessionDate(session))

    const existingSessions = sessionsMap.get(key) ?? []
    sessionsMap.set(key, [...existingSessions, session])
  }

  return Array.from(sessionsMap.entries())
}
