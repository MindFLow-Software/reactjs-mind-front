'use client'

import { Dialog, DialogContent } from '@/components/ui/dialog'
import { EditAppointment } from './edit-appointment-dialog'
import { RegisterAppointment } from './register-appointment'
import { CancelAppointmentDialog } from './cancel-appointment-dialog'
import { RescheduleAppointmentDialog } from './reschedule-appointment-dialog'

import type { IAppointmentListItem } from '@/api/appointments/get-appointments'
import type { RescheduleAppointmentRequest } from '@/api/appointments/reschedule-appointment'

export interface AppointmentDialogManagerDialogs {
  isCreateOpen: boolean
  isEditOpen: boolean
  isCancelOpen: boolean
  isRescheduleOpen: boolean
  onCreateOpenChange: (open: boolean) => void
  onEditOpenChange: (open: boolean) => void
  onCancelOpenChange: (open: boolean) => void
  onRescheduleOpenChange: (open: boolean) => void
}

export interface AppointmentDialogManagerSelection {
  selectedDate?: Date
  selectedAppointment: IAppointmentListItem | null
}

export interface AppointmentDialogManagerActions {
  onCancel: (appointmentId: string) => Promise<unknown>
  isCancelling: boolean
  onReschedule: (data: RescheduleAppointmentRequest) => Promise<unknown>
  isRescheduling: boolean
}

interface AppointmentDialogManagerProps {
  dialogs: AppointmentDialogManagerDialogs
  selection: AppointmentDialogManagerSelection
  actions: AppointmentDialogManagerActions
}

export function AppointmentDialogManager({
  dialogs,
  selection,
  actions,
}: AppointmentDialogManagerProps) {
  const { selectedDate, selectedAppointment } = selection

  async function handleCancel() {
    if (!selectedAppointment) return
    await actions.onCancel(selectedAppointment.id)
    dialogs.onCancelOpenChange(false)
    dialogs.onEditOpenChange(false)
  }

  async function handleReschedule(newDate: Date) {
    if (!selectedAppointment) return
    await actions.onReschedule({
      appointmentId: selectedAppointment.id,
      newDate,
    })
    dialogs.onRescheduleOpenChange(false)
    dialogs.onEditOpenChange(false)
  }

  return (
    <>
      <Dialog
        open={dialogs.isCreateOpen}
        onOpenChange={dialogs.onCreateOpenChange}
      >
        <RegisterAppointment
          initialDate={selectedDate}
          onSuccess={() => dialogs.onCreateOpenChange(false)}
        />
      </Dialog>

      <Dialog open={dialogs.isEditOpen} onOpenChange={dialogs.onEditOpenChange}>
        {selectedAppointment && (
          <EditAppointment
            appointment={selectedAppointment}
            onClose={() => dialogs.onEditOpenChange(false)}
            onCancelTrigger={() => dialogs.onCancelOpenChange(true)}
            onRescheduleTrigger={() => dialogs.onRescheduleOpenChange(true)}
          />
        )}
      </Dialog>

      <Dialog
        open={dialogs.isCancelOpen}
        onOpenChange={dialogs.onCancelOpenChange}
      >
        <DialogContent className="p-0 border-none max-w-[400px] rounded-xl shadow-2xl bg-card">
          {selectedAppointment && (
            <CancelAppointmentDialog
              patientName={selectedAppointment.patientName}
              isCancelling={actions.isCancelling}
              onClose={() => dialogs.onCancelOpenChange(false)}
              onCancel={handleCancel}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={dialogs.isRescheduleOpen}
        onOpenChange={dialogs.onRescheduleOpenChange}
      >
        <DialogContent className="p-0 border-none max-w-md rounded-xl shadow-2xl bg-card">
          {selectedAppointment && (
            <RescheduleAppointmentDialog
              patientName={selectedAppointment.patientName}
              isRescheduling={actions.isRescheduling}
              onClose={() => dialogs.onRescheduleOpenChange(false)}
              onReschedule={handleReschedule}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
