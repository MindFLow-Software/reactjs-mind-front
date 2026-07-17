import { useCallback, useMemo, useState } from 'react'

import {
  CHIPS,
  groupByMonth,
  SessionStatusFilter,
  type ITimelineSessionItem,
} from '../timeline.helpers'

type IUseTimelineFiltersOptions = {
  sessions: ITimelineSessionItem[]
}

type IUseTimelineFiltersReturn = {
  statusFilter: SessionStatusFilter
  searchText: string
  filtered: ITimelineSessionItem[]
  chipCounts: Record<string, number>
  grouped: [string, ITimelineSessionItem[]][]
  setStatusFilter: (filter: SessionStatusFilter) => void
  setSearchText: (text: string) => void
}

export function useTimelineFilters({
  sessions,
}: IUseTimelineFiltersOptions): IUseTimelineFiltersReturn {
  const [statusFilter, setStatusFilterState] = useState<SessionStatusFilter>(
    SessionStatusFilter.ALL,
  )
  const [searchText, setSearchTextState] = useState('')

  const filtered = useMemo(() => {
    const chip = CHIPS.find((chip) => chip.key === statusFilter)

    return sessions.filter((session) => {
      if (!chip?.matchFn(session.status)) return false
      if (!searchText.trim()) return true

      const query = searchText.toLowerCase()

      return (
        session.content?.toLowerCase().includes(query) ||
        session.theme?.toLowerCase().includes(query)
      )
    })
  }, [sessions, statusFilter, searchText])

  const chipCounts = useMemo(
    () =>
      Object.fromEntries(
        CHIPS.map((chip) => [
          chip.key,
          sessions.filter((session) => chip.matchFn(session.status)).length,
        ]),
      ),
    [sessions],
  )

  const grouped = useMemo(() => groupByMonth(filtered), [filtered])

  const setStatusFilter = useCallback((filter: SessionStatusFilter) => {
    setStatusFilterState(filter)
  }, [])

  const setSearchText = useCallback((text: string) => {
    setSearchTextState(text)
  }, [])

  return {
    statusFilter,
    searchText,
    filtered,
    chipCounts,
    grouped,
    setStatusFilter,
    setSearchText,
  }
}
