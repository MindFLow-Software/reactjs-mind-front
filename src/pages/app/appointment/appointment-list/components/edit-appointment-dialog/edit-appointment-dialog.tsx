import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  CalendarClock,
  Trash2,
  User,
  FileText,
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
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { cn } from '@/lib/utils'
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
    control,
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
          <div className="ea-header-icon">
            <CalendarClock className="size-6" />
          </div>
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
            <Clock className="h-3.5 w-3.5" />
            Remarcar Horário
          </Button>

          <Button
            type="button"
            variant="outline"
            disabled={isCanceled}
            className="ea-action-btn ea-action-btn--destructive"
            onClick={triggers.onCancel}
          >
            <Trash2 className="h-3.5 w-3.5" />
            Cancelar Sessão
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="ea-form">
          <div className="ea-scroll-area">
            <div className="ea-fields">
              {/* Paciente não é editável — vínculo fixo do agendamento */}
              <div>
                <span className="ea-field-label">Paciente</span>
                <div className="ea-readonly-display">
                  <User className="size-4 text-primary/60" />
                  {appointment.patientName}
                </div>
              </div>

              {/* DATA E HORÁRIO (editar via Remarcar Horário) */}
              <div>
                <span className="ea-field-label">Data e Horário</span>
                <div className="ea-readonly-display">
                  <Clock className="size-4 text-primary/60" />
                  {scheduledAtLabel}
                </div>
              </div>

              {/* DIAGNÓSTICO */}
              <FormField
                control={control}
                name="diagnosis"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="ea-field-label">
                      Diagnóstico Identificado
                    </FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Nenhum diagnóstico registrado"
                          className={cn(
                            'ea-input pl-10',
                            fieldState.invalid &&
                              'border-red-600 focus-visible:ring-red-600/20',
                          )}
                        />
                      </FormControl>
                      <FileText className="ea-input-icon" />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* NOTAS */}
              <FormField
                control={control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="ea-field-label">
                      Notas Internas
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Sem observações para esta sessão."
                        rows={4}
                        className="ea-textarea"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
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
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
