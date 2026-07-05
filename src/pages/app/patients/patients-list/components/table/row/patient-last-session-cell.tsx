import { format, formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { TableCell } from '@/components/ui/table'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface PatientLastSessionCellProps {
  lastSessionAt: string | null | undefined
}

export function PatientLastSessionCell({
  lastSessionAt,
}: PatientLastSessionCellProps) {
  if (!lastSessionAt) {
    return (
      <TableCell className="ptr-cell-last-session">
        <span className="ptr-last-session-empty">sem sessões</span>
      </TableCell>
    )
  }

  const date = new Date(lastSessionAt)
  const relative = formatDistanceToNow(date, { addSuffix: true, locale: ptBR })
  const exact = format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })

  return (
    <TableCell className="ptr-cell-last-session">
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="ptr-last-session-value">{relative}</span>
        </TooltipTrigger>
        <TooltipContent className="ptr-tooltip-text">{exact}</TooltipContent>
      </Tooltip>
    </TableCell>
  )
}
