import {
  Archive,
  CalendarPlus,
  ClipboardList,
  MoreVertical,
  Pencil,
  RotateCcw,
  Search,
  Video,
} from 'lucide-react'
import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { TableCell } from '@/components/ui/table'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { PatientProfileStatus } from '@/types/enums'
import type { IPatient } from '@/types/patient'
import { usePatientQueueStore } from '@/store/use-patient-queue-store'

import { EditPatientModal } from '../../dialogs/edit-patient-modal'
import { PatientDetailsDialog } from '../../details/patient-details-dialog'
import { usePatientStatusGuard } from '../../../hooks/use-patient-status-guard'

interface PatientsRowActionsProps {
  patient: Pick<IPatient, 'id' | 'firstName' | 'lastName' | 'status'>
}

export function PatientsRowActions({ patient }: PatientsRowActionsProps) {
  const navigate = useNavigate()
  const { isToggleDisabled, disabledReason } = usePatientStatusGuard()
  const clearQueue = usePatientQueueStore((state) => state.clearQueue)

  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)

  const { id, firstName, lastName, status } = patient
  const fullName = `${firstName} ${lastName}`
  const isActive = status === PatientProfileStatus.ACTIVE

  const handleOpenDetails = useCallback(() => setIsDetailsOpen(true), [])
  const handleOpenEdit = useCallback(() => setIsEditOpen(true), [])

  const handleNavigate = useCallback(() => {
    clearQueue()
    navigate(`/patients/${id}/details`, { state: { from: 'patients-list' } })
  }, [clearQueue, navigate, id])

  const handleScheduleSession = useCallback(() => {
    navigate(`/appointment?patientId=${id}`)
  }, [navigate, id])

  return (
    <TableCell className="ptr-cell-actions">
      <div className="ptr-actions">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="ptr-action-btn"
              onClick={handleNavigate}
              aria-label="Prontuário completo"
            >
              <ClipboardList className="ptr-action-icon" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="ptr-tooltip-text">
            Prontuário
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="ptr-action-btn"
              onClick={handleOpenDetails}
              aria-label="Ver sessões do paciente"
            >
              <Video className="ptr-action-icon" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="ptr-tooltip-text">Sessões</TooltipContent>
        </Tooltip>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="ptr-action-btn"
              aria-label={`Mais ações — ${fullName}`}
            >
              <MoreVertical className="ptr-action-icon" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem
              className="ptr-menu-item"
              onSelect={handleOpenDetails}
            >
              <Search className="mr-2 size-4" /> Ver detalhes
            </DropdownMenuItem>
            <DropdownMenuItem
              className="ptr-menu-item"
              onSelect={handleScheduleSession}
            >
              <CalendarPlus className="mr-2 size-4" /> Agendar sessão
            </DropdownMenuItem>
            <DropdownMenuItem
              className="ptr-menu-item"
              onSelect={handleOpenEdit}
            >
              <Pencil className="mr-2 size-4" /> Editar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  {isActive ? (
                    <DropdownMenuItem
                      disabled={isToggleDisabled}
                      className="ptr-menu-item-archive"
                    >
                      <Archive className="mr-2 size-4" /> Arquivar paciente
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      disabled={isToggleDisabled}
                      className="ptr-menu-item-reactivate"
                    >
                      <RotateCcw className="mr-2 size-4" /> Reativar paciente
                    </DropdownMenuItem>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent className="ptr-tooltip-text">
                {disabledReason}
              </TooltipContent>
            </Tooltip>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        {isDetailsOpen && <PatientDetailsDialog patientId={id} />}
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        {isEditOpen && <EditPatientModal patientId={id} />}
      </Dialog>
    </TableCell>
  )
}
