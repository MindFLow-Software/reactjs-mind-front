import { Time } from '@/utils/time'
import type { ISessionItem } from '@/types/patient/session-item'

// Status is widened to `string`: the timeline filters/badges match against
// English status codes (FINISHED/CANCELED/...) while `ISessionItem.status`
// is currently typed as the PT-BR display labels. Flagged for a product
// decision on the real contract; kept identical to prior behavior here.
export type ITimelineSessionItem = Omit<ISessionItem, 'status'> & {
  status: string
}

export enum SessionStatusFilter {
  ALL = 'all',
  FINISHED = 'FINISHED',
  CANCELED = 'CANCELED',
  NOT_ATTEND = 'NOT_ATTEND',
}

export const STATUS_DOT: Record<string, string> = {
  FINISHED: 'bg-blue-500',
  DONE: 'bg-blue-500',
  CANCELED: 'bg-red-500',
  SCHEDULED: 'bg-gray-400',
  ATTENDING: 'bg-green-500',
  NOT_ATTEND: 'bg-amber-400',
  RESCHEDULED: 'bg-purple-400',
}

export const STATUS_BADGE: Record<
  string,
  { label: string; className: string }
> = {
  FINISHED: {
    label: 'Realizada',
    className:
      'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300',
  },
  DONE: {
    label: 'Realizada',
    className:
      'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300',
  },
  CANCELED: {
    label: 'Cancelada',
    className: 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-300',
  },
  SCHEDULED: {
    label: 'Agendada',
    className:
      'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300',
  },
  ATTENDING: {
    label: 'Em andamento',
    className:
      'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300',
  },
  NOT_ATTEND: {
    label: 'Faltou',
    className:
      'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300',
  },
  RESCHEDULED: {
    label: 'Reagendada',
    className:
      'bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-300',
  },
}

export const CHIPS: {
  key: SessionStatusFilter
  label: string
  matchFn: (status: string) => boolean
}[] = [
  { key: SessionStatusFilter.ALL, label: 'Todas', matchFn: () => true },
  {
    key: SessionStatusFilter.FINISHED,
    label: 'Realizadas',
    matchFn: (status) => status === 'FINISHED' || status === 'DONE',
  },
  {
    key: SessionStatusFilter.CANCELED,
    label: 'Canceladas',
    matchFn: (status) => status === 'CANCELED',
  },
  {
    key: SessionStatusFilter.NOT_ATTEND,
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
