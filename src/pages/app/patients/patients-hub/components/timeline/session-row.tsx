import { createElement, useCallback } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Clock,
  Copy,
  Download,
  Loader2,
  MoreHorizontal,
  Pencil,
} from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SessionPDFTemplate } from '@/utils/session-pdf-template'
import { Normalizer } from '@/utils/normalizer'
import { cn } from '@/lib/utils'

import { usePdfExport } from '../../hooks/use-pdf-export'
import { STATUS_DOT, getSessionDate, type Session } from './timeline.helpers'

interface SessionRowProps {
  session: Session
  patientName: string
}

export function SessionRow({ session, patientName }: SessionRowProps) {
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

  const handleCopyNotes = useCallback(() => {
    navigator.clipboard.writeText(session.content ?? '')
    toast.success('Notas copiadas.')
  }, [session.content])

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
                onClick={handleCopyNotes}
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
