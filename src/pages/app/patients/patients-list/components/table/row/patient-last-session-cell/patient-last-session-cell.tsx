import '../../patients-columns.css'
import './patient-last-session-cell.css'
import { TableCell } from '@/components/ui/table'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Time } from '@/utils/time'

type IPatientLastSessionCell = {
  lastSessionAt: string | null | undefined
}

export function PatientLastSessionCell({
  lastSessionAt,
}: IPatientLastSessionCell) {
  if (!lastSessionAt) {
    return (
      <TableCell className="ptc-last-session">
        <span className="ptr-last-session-empty">sem sessões</span>
      </TableCell>
    )
  }

  return (
    <TableCell className="ptc-last-session">
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="ptr-last-session-value">
            {Time.toRelativeFromNow(lastSessionAt)}
          </span>
        </TooltipTrigger>
        <TooltipContent className="ptr-tooltip-text">
          {Time.toReadableDateTime(lastSessionAt)}
        </TooltipContent>
      </Tooltip>
    </TableCell>
  )
}
