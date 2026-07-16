'use client'

import { useMemo, useState } from 'react'
import { History } from 'lucide-react'

import { Pagination } from '@/components/pagination/pagination'

import { MonthGroup } from './month-group'
import { TimelineFilterBar } from './timeline-filter-bar'
import {
  CHIPS,
  groupByMonth,
  type ITimelineSessionItem,
  type StatusFilter,
} from './timeline.helpers'
import './patient-sessions-timeline.css'

type PatientSessionsTimelinePagination = {
  meta: {
    totalCount: number
    perPage: number
  }
  pageIndex: number
  onPageChange: (newIndex: number) => void
}

type PatientSessionsTimelineProps = {
  sessions: ITimelineSessionItem[]
  patientName: string
  pagination: PatientSessionsTimelinePagination
}

export function PatientSessionsTimeline({
  sessions,
  patientName,
  pagination,
}: PatientSessionsTimelineProps) {
  const { meta, pageIndex, onPageChange } = pagination
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [searchText, setSearchText] = useState('')

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

  if (sessions.length === 0) {
    return (
      <div className="pst-empty-state">
        <History className="pst-empty-state-icon" />
        <p className="pst-empty-state-title">Sem histórico de sessões</p>
        <p className="pst-empty-state-subtitle">
          As sessões realizadas aparecerão aqui.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <TimelineFilterBar
        search={{ value: searchText, onChange: setSearchText }}
        status={{
          value: statusFilter,
          onChange: setStatusFilter,
          counts: chipCounts,
        }}
      />

      {filtered.length === 0 ? (
        <div className="pst-no-results">
          <History className="pst-no-results-icon" />
          <p className="pst-no-results-title">Nenhuma sessão encontrada</p>
          <p className="pst-no-results-subtitle">
            Tente outro filtro ou termo de busca.
          </p>
        </div>
      ) : (
        <div className="pst-groups-container">
          {grouped.map(([month, monthSessions]) => (
            <MonthGroup
              key={month}
              month={month}
              sessions={monthSessions}
              patientName={patientName}
            />
          ))}
        </div>
      )}

      <div className="pst-pagination-wrapper">
        <Pagination
          pagination={{
            pageIndex,
            totalCount: meta.totalCount,
            perPage: meta.perPage,
            onPageChange,
          }}
          totalLabel="Sessões"
        />
      </div>
    </div>
  )
}
