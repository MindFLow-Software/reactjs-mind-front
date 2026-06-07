import { createElement, useCallback, useMemo, useState } from 'react'

import type { SessionItem } from '@/types/patient'
import { SessionPDFTemplate } from '@/utils/session-pdf-template'
import { usePdfExport } from './use-pdf-export'
import { Normalizer } from '@/utils/normalizer'
import { Time } from '@/utils/time'

const STATUS_MATCH: Record<string, (status: string) => boolean> = {
  all: () => true,
  FINISHED: (status) => status === 'FINISHED' || status === 'DONE',
  CANCELED: (status) => status === 'CANCELED',
  NOT_ATTEND: (status) => status === 'NOT_ATTEND',
}

function getSessionDate(session: SessionItem): Date {
  return new Date(session.sessionDate ?? session.createdAt)
}

interface UseSessionsTimelineReturn {
  search: string
  statusFilter: string
  filteredSessions: SessionItem[]
  isExporting: boolean
  setSearch: (query: string) => void
  setStatusFilter: (s: string) => void
  exportToPdf: () => Promise<void>
}

export function useSessionsTimeline(
  sessions: SessionItem[],
  patientName: string,
): UseSessionsTimelineReturn {
  const [search, setSearchState] = useState('')
  const [statusFilter, setStatusFilterState] = useState('all')

  const filteredSessions = useMemo(() => {
    const matchFn = STATUS_MATCH[statusFilter] ?? STATUS_MATCH.all
    return sessions.filter((s) => {
      if (!matchFn(s.status)) return false
      if (!search.trim()) return true
      const q = search.toLowerCase()
      return (
        s.content?.toLowerCase().includes(q) ||
        s.theme?.toLowerCase().includes(q)
      )
    })
  }, [sessions, statusFilter, search])

  const { isExporting, exportToPdf: exportPdfDoc } = usePdfExport({
    receivedFilename: `Sessoes-${Normalizer.toSnakeCase(patientName)}.pdf`,
  })

  const setSearch = useCallback((query: string) => setSearchState(query), [])

  const setStatusFilter = useCallback(
    (s: string) => setStatusFilterState(s),
    [],
  )

  const exportToPdf = useCallback(async () => {
    const first = filteredSessions[0]
    if (!first) return
    const dateFormatted = Time.toReadableDateTime(getSessionDate(first))
    await exportPdfDoc(
      createElement(SessionPDFTemplate, {
        psychologist: { name: '', crp: '' },
        patientName,
        date: dateFormatted,
        content: first?.content ?? 'Nenhuma nota registrada.',
        diagnosis: first?.theme ?? '',
      }),
    )
  }, [filteredSessions, exportPdfDoc, patientName])

  return {
    search,
    statusFilter,
    filteredSessions,
    isExporting,
    setSearch,
    setStatusFilter,
    exportToPdf,
  }
}
