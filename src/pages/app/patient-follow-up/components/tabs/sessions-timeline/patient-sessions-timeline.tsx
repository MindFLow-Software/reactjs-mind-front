'use client'

import { History } from 'lucide-react'

import { Pagination } from '@/components/pagination/pagination'

import { TabCard } from '../tab-card/tab-card'

import { MonthGroup } from './month-group'
import { TimelineFilterBar } from './timeline-filter-bar'
import { useTimelineFilters } from './hooks/use-timeline-filters'
import type { ITimelineSessionItem } from './timeline.helpers'
import './patient-sessions-timeline.css'

type IPatientSessionsTimelinePagination = {
  meta: {
    totalCount: number
    perPage: number
  }
  pageIndex: number
  onPageChange: (newIndex: number) => void
}

type IPatientSessionsTimeline = {
  sessions: ITimelineSessionItem[]
  patientName: string
  pagination: IPatientSessionsTimelinePagination
}

export function PatientSessionsTimeline({
  sessions,
  patientName,
  pagination,
}: IPatientSessionsTimeline) {
  const { meta, pageIndex, onPageChange } = pagination
  const {
    statusFilter,
    searchText,
    filtered,
    chipCounts,
    grouped,
    setStatusFilter,
    setSearchText,
  } = useTimelineFilters({ sessions })

  function renderBody() {
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

  return (
    <TabCard
      title="Sessões"
      description="Histórico de atendimentos e evolução do paciente"
    >
      {renderBody()}
    </TabCard>
  )
}
