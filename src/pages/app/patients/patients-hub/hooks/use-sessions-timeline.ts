import { createElement, useCallback, useMemo, useState } from 'react'

import type { ISessionItem } from '@/types/patient/session-item'
import { SessionPDFTemplate } from '@/templates/pdf/session-pdf-template'
import { usePdfExport } from './use-pdf-export'
import { Normalizer } from '@/utils/normalizer'
import { Time } from '@/utils/time'

const STATUS_MATCH: Record<string, (status: string) => boolean> = {
  all: () => true,
  FINISHED: (status) => status === 'FINISHED' || status === 'DONE',
  CANCELED: (status) => status === 'CANCELED',
  NOT_ATTEND: (status) => status === 'NOT_ATTEND',
}

interface UseSessionsTimelineReturn {
  search: string
  statusFilter: string
  filteredSessions: ISessionItem[]
  isExporting: boolean
  setSearch: (query: string) => void
  setStatusFilter: (s: string) => void
  exportToPdf: () => Promise<void>
}

export function useSessionsTimeline(
  sessions: ISessionItem[],
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
    const dateFormatted = Time.toReadableDateTime(
      first.sessionDate ?? first.createdAt,
    )
    await exportPdfDoc(
      createElement(SessionPDFTemplate, {
        psychologist: { name: '', crp: '' },
        record: {
          patientName,
          date: dateFormatted,
          content: first?.content ?? 'Nenhuma nota registrada.',
          diagnosis: first?.theme ?? '',
        },
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
