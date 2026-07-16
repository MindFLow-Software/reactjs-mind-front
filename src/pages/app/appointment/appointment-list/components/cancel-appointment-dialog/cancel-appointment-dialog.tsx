import { AlertTriangle, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import './cancel-appointment-dialog.css'

type ICancelAppointmentDialog = {
  patientName: string
  isCancelling: boolean
  onClose: () => void
  onCancel: () => Promise<void>
}

export function CancelAppointmentDialog({
  patientName,
  isCancelling,
  onClose,
  onCancel,
}: ICancelAppointmentDialog) {
  return (
    <DialogContent className="cad-dialog">
      <DialogHeader>
        <div className="cad-title-row">
          <AlertTriangle className="size-5" />
          <DialogTitle>Cancelar Sessão</DialogTitle>
        </div>
        <DialogDescription>
          Você tem certeza que deseja cancelar o agendamento de{' '}
          <strong>{patientName}</strong>? O horário será liberado imediatamente
          no calendário.
        </DialogDescription>
      </DialogHeader>

      <DialogFooter className="gap-2 sm:gap-0">
        <Button variant="ghost" onClick={onClose} disabled={isCancelling}>
          Voltar
        </Button>
        <Button
          variant="destructive"
          onClick={onCancel}
          disabled={isCancelling}
          className="cad-confirm-btn"
        >
          {isCancelling ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            'Confirmar Cancelamento'
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}
