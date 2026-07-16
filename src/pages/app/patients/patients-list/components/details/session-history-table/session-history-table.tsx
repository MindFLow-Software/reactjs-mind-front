import './session-history-table.css'
import { Eye, Info } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Pagination,
  type IPaginationState,
} from '@/components/pagination/pagination'
import { cn } from '@/lib/utils'
import {
  FINISHED_SESSION_STATUSES,
  getSessionStatusLabel,
} from '@/utils/mappers'
import { Time } from '@/utils/time'
import type { ISessionItem } from '@/types/patient/session-item'

type ISessionHistoryTable = {
  sessions: ISessionItem[]
  pagination: IPaginationState
  onSelectSession: (session: ISessionItem) => void
}

function isFinishedSession(status: string): boolean {
  return (FINISHED_SESSION_STATUSES as readonly string[]).includes(
    status?.toUpperCase(),
  )
}

export function SessionHistoryTable({
  sessions,
  pagination,
  onSelectSession,
}: ISessionHistoryTable) {
  const totalFinished = sessions.filter((session) =>
    isFinishedSession(session.status),
  ).length

  function renderRows() {
    if (sessions.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={4} className="pdd-history-empty">
            Nenhum registro encontrado.
          </TableCell>
        </TableRow>
      )
    }

    return sessions.map((session) => {
      const status = getSessionStatusLabel(session.status)
      const isFinished = isFinishedSession(session.status)

      return (
        <TableRow key={session.id} className="group">
          <TableCell className="pdd-history-date">
            {Time.toShortDateTime(session.date) || '—'}
          </TableCell>
          <TableCell className="pdd-history-theme">
            {session.theme || 'Sem tema definido'}
          </TableCell>
          <TableCell className={cn('pdd-history-status', status.color)}>
            {status.label}
          </TableCell>
          <TableCell className="text-right">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="pdd-history-view-btn"
                  disabled={!isFinished}
                  onClick={() => onSelectSession(session)}
                >
                  <Eye size={14} className="text-primary" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">Abrir Documento</TooltipContent>
            </Tooltip>
          </TableCell>
        </TableRow>
      )
    })
  }

  return (
    <div className="pdd-history">
      <h3 className="pdd-history-title">
        <Info className="size-4 text-primary" />
        Histórico de Atendimentos
      </h3>

      <div className="pdd-history-table">
        <TooltipProvider>
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="pdd-history-head">Data</TableHead>
                <TableHead className="pdd-history-head">Tema</TableHead>
                <TableHead className="pdd-history-head text-right">
                  Status
                </TableHead>
                <TableHead className="pdd-history-head w-[60px] text-right">
                  Ver
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>{renderRows()}</TableBody>
            <TableFooter className="border-t bg-transparent">
              <TableRow>
                <TableCell colSpan={3} className="pdd-history-total-label">
                  Total de sessões finalizadas
                </TableCell>
                <TableCell className="pdd-history-total-value">
                  {totalFinished}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TooltipProvider>
      </div>

      <Pagination pagination={pagination} totalLabel="registro(s)" />
    </div>
  )
}
