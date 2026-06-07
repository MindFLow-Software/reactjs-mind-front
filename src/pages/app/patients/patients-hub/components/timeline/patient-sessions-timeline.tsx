'use client'

import { useState, useMemo, createElement, useCallback } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  History,
  Search,
  Pencil,
  Copy,
  MoreHorizontal,
  Download,
  Loader2,
  Clock,
  CalendarDays,
  ListFilter,
} from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Pagination } from './sessions-pagination'
import { SessionPDFTemplate } from '@/utils/session-pdf-template'
import { cn } from '@/lib/utils'
import { usePdfExport } from '../../hooks/use-pdf-export'
import { Normalizer } from '@/utils/normalizer'
import './patient-sessions-timeline.css'

interface Session {
  id: string
  sessionDate?: string | Date | null
  createdAt: string | Date
  status: string
  theme?: string | null
  content?: string | null
  duration?: string | number | null
}

interface PatientSessionsTimelineProps {
  sessions: Session[]
  patientName: string
  meta: {
    totalCount: number
    perPage: number
  }
  pageIndex: number
  onPageChange: (newIndex: number) => void
}

type StatusFilter = 'all' | 'FINISHED' | 'CANCELED' | 'NOT_ATTEND'

const STATUS_DOT: Record<string, string> = {
  FINISHED: 'bg-blue-500',
  DONE: 'bg-blue-500',
  CANCELED: 'bg-red-500',
  SCHEDULED: 'bg-gray-400',
  ATTENDING: 'bg-green-500',
  NOT_ATTEND: 'bg-amber-400',
  RESCHEDULED: 'bg-purple-400',
}

const CHIPS: {
  key: StatusFilter
  label: string
  matchFn: (s: string) => boolean
}[] = [
  { key: 'all', label: 'Todas', matchFn: () => true },
  {
    key: 'FINISHED',
    label: 'Realizadas',
    matchFn: (s) => s === 'FINISHED' || s === 'DONE',
  },
  { key: 'CANCELED', label: 'Canceladas', matchFn: (s) => s === 'CANCELED' },
  { key: 'NOT_ATTEND', label: 'Faltas', matchFn: (s) => s === 'NOT_ATTEND' },
]

function getSessionDate(session: Session): Date {
  return new Date(session.sessionDate ?? session.createdAt)
}

function groupByMonth(sessions: Session[]): [string, Session[]][] {
  const sessionsMap = new Map<string, Session[]>()

  for (const session of sessions) {
    const key = format(getSessionDate(session), 'MMMM yyyy', {
      locale: ptBR,
    }).toUpperCase()

    if (!sessionsMap.has(key)) sessionsMap.set(key, [])

    const existinSessions = sessionsMap.get(key) ?? []
    sessionsMap.set(key, [...existinSessions, session])
  }

  return Array.from(sessionsMap.entries())
}

export function PatientSessionsTimeline({
  sessions,
  patientName,
  meta,
  pageIndex,
  onPageChange,
}: PatientSessionsTimelineProps) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [searchText, setSearchText] = useState('')

  const filtered = useMemo(() => {
    const chip = CHIPS.find((chip) => chip.key === statusFilter)

    return sessions.filter((session) => {
      if (!chip?.matchFn(session.status)) return false
      if (!searchText.trim()) return true

      const q = searchText.toLowerCase()

      return (
        session.content?.toLowerCase().includes(q) ||
        session.theme?.toLowerCase().includes(q)
      )
    })
  }, [sessions, statusFilter, searchText])

  const chipCounts = useMemo(
    () =>
      Object.fromEntries(
        CHIPS.map((c) => [
          c.key,
          sessions.filter((s) => c.matchFn(s.status)).length,
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
    <div className="space-y-5">
      <div className="pst-filter-bar">
        <div className="pst-search-wrapper">
          <Search className="pst-search-icon" />
          <Input
            placeholder="Buscar nas anotações..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="pst-search-input"
          />
        </div>

        <div className="pst-chips-row">
          {CHIPS.map((chip) => {
            const active = statusFilter === chip.key
            return (
              <button
                key={chip.key}
                type="button"
                onClick={() => setStatusFilter(chip.key)}
                className={cn(
                  'pst-chip',
                  active ? 'pst-chip--active' : 'pst-chip--inactive',
                )}
              >
                {chip.label}
                <span
                  className={cn(
                    'pst-chip-count',
                    active
                      ? 'pst-chip-count--active'
                      : 'pst-chip-count--inactive',
                  )}
                >
                  {chipCounts[chip.key]}
                </span>
              </button>
            )
          })}
        </div>

        <div className="pst-filter-actions">
          <Button variant="outline" size="sm" className="pst-filter-btn">
            <CalendarDays className="pst-filter-btn-icon" />
            Período: 6 meses
          </Button>
          <Button variant="outline" size="sm" className="pst-filter-btn">
            <ListFilter className="pst-filter-btn-icon" />
            Ordenar
          </Button>
        </div>
      </div>

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
          pageIndex={pageIndex}
          totalCount={meta.totalCount}
          perPage={meta.perPage}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  )
}

function MonthGroup({
  month,
  sessions,
  patientName,
}: {
  month: string
  sessions: Session[]
  patientName: string
}) {
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

function SessionRow({
  session,
  patientName,
}: {
  session: Session
  patientName: string
}) {
  const { isExporting, setFilename, exportToPdf } = usePdfExport()

  const date = getSessionDate(session)
  const dotColor = STATUS_DOT[session.status] ?? 'bg-gray-400'
  const isCancelled = session.status === 'CANCELED'
  const isCompleted = session.status === 'FINISHED' || session.status === 'DONE'
  const isMissed = session.status === 'NOT_ATTEND'

  const handleExportPDF = useCallback(async () => {
    const dateFormatted = format(date, "dd/MM/yyyy 'às' HH:mm", {
      locale: ptBR,
    })

    const filename = `Evolucao-${Normalizer.toSnakeCase(patientName)}-${session.id.substring(0, 5)}.pdf`
    setFilename(filename)

    exportToPdf(
      createElement(SessionPDFTemplate, {
        psychologist: { name: 'Seu Nome Profissional', crp: '06/12345-X' },
        patientName,
        date: dateFormatted,
        content: session?.content ?? 'Nenhuma nota registrada.',
        diagnosis: session?.theme ?? '',
      }),
    )
  }, [date, exportToPdf, patientName, session, setFilename])

  return (
    <div className="pst-session-row">
      <span className={cn('pst-session-dot', dotColor)} />

      <div className="pst-session-card group">
        <div className="pst-session-top-row">
          <div className="pst-session-meta">
            <span className="pst-session-date">{format(date, 'dd/MM')}</span>
            <span className="pst-session-time">{format(date, 'HH:mm')}</span>
            {session.duration && (
              <span className="pst-session-duration">
                <Clock className="pst-session-duration-icon" />
                {session.duration}min
              </span>
            )}
            {isCancelled && (
              <span className="pst-session-cancelled-badge">× Cancelada</span>
            )}
            {isMissed && (
              <span className="pst-session-missed-badge">Não compareceu</span>
            )}
            {session.theme && (
              <span className="pst-session-theme-badge">{session.theme}</span>
            )}
          </div>

          <div className="pst-session-actions">
            <div className="pst-session-hover-actions">
              <Button
                size="icon"
                variant="ghost"
                className="pst-session-action-btn"
              >
                <Pencil className="size-3.5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="pst-session-action-btn"
                onClick={() => {
                  navigator.clipboard.writeText(session.content ?? '')
                  toast.success('Notas copiadas.')
                }}
              >
                <Copy className="size-3.5" />
              </Button>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="pst-session-action-btn"
                >
                  <MoreHorizontal className="size-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={handleExportPDF}
                  disabled={isExporting}
                  className="cursor-pointer"
                >
                  {isExporting ? (
                    <Loader2 className="mr-2 size-3.5 animate-spin" />
                  ) : (
                    <Download className="mr-2 size-3.5" />
                  )}
                  Exportar PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {isCompleted && (
          <div className="pst-session-content-block">
            <p className="pst-session-content-label">Notas da sessão</p>
            {session.content ? (
              <p className="pst-session-content-text">{session.content}</p>
            ) : (
              <p className="pst-session-content-empty">
                Nenhuma nota registrada.
              </p>
            )}
          </div>
        )}

        {isCancelled && (
          <div className="pst-session-content-block">
            <p className="pst-session-content-label">Motivo</p>
            <p className="pst-session-content-text">{session.content || '—'}</p>
          </div>
        )}

        {isMissed && session.content && (
          <div className="mt-3">
            <p className="pst-session-content-text">{session.content}</p>
          </div>
        )}
      </div>
    </div>
  )
}
