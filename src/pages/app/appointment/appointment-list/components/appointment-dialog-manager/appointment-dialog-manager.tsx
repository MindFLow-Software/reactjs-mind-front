import { Dialog, DialogContent } from '@/components/ui/dialog'
import { ConfirmDialog } from '@/components/confirm-dialog/confirm-dialog'

import type { RescheduleAppointmentRequest } from '@/api/appointments/reschedule-appointment'

import { EditAppointment } from '../edit-appointment-dialog/edit-appointment-dialog'
import { RegisterAppointment } from '../register-appointment/register-appointment'
import { RescheduleAppointmentDialog } from '../reschedule-appointment-dialog/reschedule-appointment-dialog'
import type { IUseAppointmentDialogs } from '../../hooks/use-appointment-dialogs'

import './appointment-dialog-manager.css'

export type IAppointmentDialogActions = {
  onCancel: (appointmentId: string) => Promise<unknown>
  isCancelling: boolean
  onReschedule: (data: RescheduleAppointmentRequest) => Promise<unknown>
  isRescheduling: boolean
}

type IAppointmentDialogManager = {
  dialogs: IUseAppointmentDialogs
  actions: IAppointmentDialogActions
}

export function AppointmentDialogManager({
  dialogs,
  actions,
}: IAppointmentDialogManager) {
  const { selectedDate, selectedAppointment } = dialogs.selection

  async function handleCancel() {
    if (!selectedAppointment) return

    await actions.onCancel(selectedAppointment.id)
    dialogs.cancel.close()
    dialogs.edit.close()
  }

  async function handleReschedule(newDate: Date) {
    if (!selectedAppointment) return

    await actions.onReschedule({
      appointmentId: selectedAppointment.id,
      newDate,
    })
    dialogs.reschedule.close()
    dialogs.edit.close()
  }

  return (
    <>
      <Dialog
        open={dialogs.create.isOpen}
        onOpenChange={dialogs.create.onOpenChange}
      >
        <RegisterAppointment
          initialDate={selectedDate}
          onSuccess={dialogs.create.close}
        />
      </Dialog>

      <Dialog
        open={dialogs.edit.isOpen}
        onOpenChange={dialogs.edit.onOpenChange}
      >
        {selectedAppointment && (
          <EditAppointment
            appointment={selectedAppointment}
            onClose={dialogs.edit.close}
            triggers={{
              onCancel: dialogs.cancel.open,
              onReschedule: dialogs.reschedule.open,
            }}
          />
        )}
      </Dialog>

      <ConfirmDialog
        open={dialogs.cancel.isOpen}
        onOpenChange={dialogs.cancel.onOpenChange}
        variant="destructive"
        title="Cancelar Sessão"
        description={
          <>
            Você tem certeza que deseja cancelar o agendamento de{' '}
            <strong>{selectedAppointment?.patientName}</strong>? O horário será
            liberado imediatamente no calendário.
          </>
        }
        confirmLabel="Confirmar Cancelamento"
        cancelLabel="Voltar"
        pending={actions.isCancelling}
        onConfirm={handleCancel}
      />

      <Dialog
        open={dialogs.reschedule.isOpen}
        onOpenChange={dialogs.reschedule.onOpenChange}
      >
        <DialogContent className="adm-dialog adm-dialog--md">
          {selectedAppointment && (
            <RescheduleAppointmentDialog
              patientName={selectedAppointment.patientName}
              isRescheduling={actions.isRescheduling}
              onClose={dialogs.reschedule.close}
              onReschedule={handleReschedule}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
