import { format, isValid, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
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
import {
  FINISHED_SESSION_STATUSES,
  getSessionStatusLabel,
} from '@/utils/mappers'
import type { ISessionItem } from '@/types/patient/session-item'

interface SessionHistoryTableProps {
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
}: SessionHistoryTableProps) {
  const totalFinished = sessions.filter((session) =>
    isFinishedSession(session.status),
  ).length

  return (
    <div className="pdd-history">
      <h3 className="pdd-history-title">
        <Info className="size-4 text-primary" />
        Histórico de Atendimentos
      </h3>

      <div className="pdd-history-table">
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
          <TableBody>
            {sessions.length ? (
              sessions.map((session) => {
                const status = getSessionStatusLabel(session.status)
                const isFinished = isFinishedSession(session.status)

                return (
                  <TableRow key={session.id} className="group">
                    <TableCell className="pdd-history-date">
                      {session.date && isValid(parseISO(session.date))
                        ? format(parseISO(session.date), 'dd/MM/yy HH:mm', {
                            locale: ptBR,
                          })
                        : '—'}
                    </TableCell>
                    <TableCell className="pdd-history-theme">
                      {session.theme || 'Sem tema definido'}
                    </TableCell>
                    <TableCell className={`pdd-history-status ${status.color}`}>
                      {status.label}
                    </TableCell>
                    <TableCell className="text-right">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 cursor-pointer"
                              disabled={!isFinished}
                              onClick={() => onSelectSession(session)}
                            >
                              <Eye size={14} className="text-primary" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="left">
                            Abrir Documento
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="pdd-history-empty">
                  Nenhum registro encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
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
      </div>

      <Pagination pagination={pagination} totalLabel="registro(s)" />
    </div>
  )
}
