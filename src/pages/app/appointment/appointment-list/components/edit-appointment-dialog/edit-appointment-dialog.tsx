import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  CalendarClock,
  Trash2,
  User,
  Clock,
  AlertCircle,
  Loader2,
} from 'lucide-react'

import {
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { IconBox } from '@/components/icon-box/icon-box'
import { TextInput } from '@/components/form-fields/text-input/text-input'
import { TextareaInput } from '@/components/form-fields/textarea-input/textarea-input'
import { Time } from '@/utils/time'
import { AppointmentStatus } from '@/types/appointment/appointment-status'

import type { IAppointmentListItem } from '@/api/appointments/get-appointments'
import {
  updateAppointmentSchema,
  type UpdateAppointmentData,
} from '@/validators/appointments/form/update-appointment-schema'
import { useUpdateAppointment } from '../../hooks/use-update-appointment'

import './edit-appointment-dialog.css'

export type IEditAppointmentTriggers = {
  onCancel: () => void
  onReschedule: () => void
}

type IEditAppointment = {
  appointment: IAppointmentListItem
  onClose: () => void
  triggers: IEditAppointmentTriggers
}

function buildDefaultValues(
  appointment: IAppointmentListItem,
): UpdateAppointmentData {
  return {
    diagnosis: appointment.diagnosis ?? '',
    content: appointment.content ?? '',
  }
}

export function EditAppointment({
  appointment,
  onClose,
  triggers,
}: IEditAppointment) {
  const isCanceled = appointment.status === AppointmentStatus.CANCELED
  const scheduledAtLabel =
    Time.toReadableDateTime(appointment.scheduledAt) || 'Não definido'

  const form = useForm<UpdateAppointmentData>({
    resolver: zodResolver(updateAppointmentSchema),
    mode: 'onTouched',
    defaultValues: buildDefaultValues(appointment),
  })

  const {
    handleSubmit,
    formState: { isDirty, isValid },
  } = form

  const { mutateAsync: updateAppointmentFn, isPending } = useUpdateAppointment()

  async function onSubmit(data: UpdateAppointmentData) {
    await updateAppointmentFn({ id: appointment.id, ...data })
    onClose()
  }

  return (
    <DialogContent className="ea-dialog">
      <div className="ea-header">
        <div className="ea-header-row">
          <IconBox icon={CalendarClock} variant="primary" size="md" />
          <div className="flex flex-col">
            <DialogTitle className="ea-title">
              Detalhes do Agendamento
            </DialogTitle>
            <DialogDescription className="ea-subtitle">
              Sessão agendada com:{' '}
              <span className="ea-subtitle-name">
                {appointment.patientName}
              </span>
            </DialogDescription>
          </div>
        </div>
      </div>

      <div className="ea-actions">
        {isCanceled && (
          <div className="ea-canceled-alert">
            <AlertCircle className="size-4" />
            Agendamento cancelado. Apenas a remarcação está disponível.
          </div>
        )}
        <div className="ea-actions-grid">
          <Button
            type="button"
            variant="outline"
            className="ea-action-btn ea-action-btn--primary"
            onClick={triggers.onReschedule}
          >
            <Clock data-icon="inline-start" />
            Remarcar Horário
          </Button>

          <Button
            type="button"
            variant="outline"
            disabled={isCanceled}
            className="ea-action-btn ea-action-btn--destructive"
            onClick={triggers.onCancel}
          >
            <Trash2 data-icon="inline-start" />
            Cancelar Sessão
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="ea-form">
          <div className="ea-scroll-area">
            <div className="ea-fields">
              <div>
                <span className="ea-field-label">Paciente</span>
                <div className="ea-readonly-display">
                  <User className="size-4 text-primary/60" />
                  {appointment.patientName}
                </div>
              </div>

              <div>
                <span className="ea-field-label">Data e Horário</span>
                <div className="ea-readonly-display">
                  <Clock className="size-4 text-primary/60" />
                  {scheduledAtLabel}
                </div>
              </div>

              <TextInput<UpdateAppointmentData>
                name="diagnosis"
                label="Diagnóstico Identificado"
                placeholder="Nenhum diagnóstico registrado"
              />

              <TextareaInput<UpdateAppointmentData>
                name="content"
                label="Notas Internas"
                placeholder="Sem observações para esta sessão."
                rows={4}
              />
            </div>
          </div>

          <div className="ea-footer">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="ea-footer-btn"
            >
              Fechar
            </Button>
            <Button
              type="submit"
              disabled={isPending || !isDirty || !isValid}
              className="ea-submit-btn"
            >
              {isPending ? (
                <>
                  <Loader2 data-icon="inline-start" className="animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar Alterações'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  )
}
