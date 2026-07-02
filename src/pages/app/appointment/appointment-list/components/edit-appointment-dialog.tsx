'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
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

import type { IAppointmentListItem } from '@/api/appointments/get-appointments'
import {
  updateAppointmentSchema,
  type UpdateAppointmentData,
} from '@/validators/appointments/form/update-appointment-schema'
import { useUpdateAppointment } from '../hooks/use-update-appointment'

import './edit-appointment-dialog.css'

interface EditAppointmentProps {
  appointment: IAppointmentListItem
  onClose: () => void
  onCancelTrigger: () => void
  onRescheduleTrigger: () => void
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
  onCancelTrigger,
  onRescheduleTrigger,
}: EditAppointmentProps) {
  const isCanceled = appointment.status === 'CANCELED'
  const scheduledAt = appointment.scheduledAt
    ? new Date(appointment.scheduledAt)
    : undefined

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
    <DialogContent className="max-h-[95vh] max-w-2xl p-0 flex flex-col overflow-hidden border-none shadow-2xl bg-card rounded-xl">
      {/* HEADER */}
      <div className="px-8 pt-8 pb-6 border-b border-border/40 bg-card shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-inner">
            <CalendarClock className="size-6" />
          </div>
          <div className="flex flex-col">
            <DialogTitle className="text-xl font-bold tracking-tight text-foreground/90">
              Detalhes do Agendamento
            </DialogTitle>
            <DialogDescription className="text-xs font-medium text-muted-foreground/80 uppercase tracking-wider">
              Sessão agendada com:{' '}
              <span className="text-black font-extrabold">
                {appointment.patientName}
              </span>
            </DialogDescription>
          </div>
        </div>
      </div>

      {/* AÇÕES CRÍTICAS */}
      <div className="px-8 py-5 bg-muted/20 border-b border-border/40 shrink-0">
        {isCanceled && (
          <div className="flex items-center gap-2 mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-xs font-semibold">
            <AlertCircle className="size-4" />
            Agendamento cancelado. Apenas a remarcação está disponível.
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <Button
            type="button"
            variant="outline"
            className="ea-action-btn ea-action-btn--primary"
            onClick={onRescheduleTrigger}
          >
            <Clock className="h-3.5 w-3.5" />
            Remarcar Horário
          </Button>

          <Button
            type="button"
            variant="outline"
            disabled={isCanceled}
            className="ea-action-btn ea-action-btn--destructive"
            onClick={onCancelTrigger}
          >
            <Trash2 className="h-3.5 w-3.5" />
            Cancelar Sessão
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-1 flex-col min-h-0"
        >
          {/* ÁREA DE CONTEÚDO COM SCROLL */}
          <div className="flex-1 overflow-y-auto px-8 pb-8 pt-6 min-h-0">
            <div className="grid grid-cols-1 gap-6">
              {/* PACIENTE (não editável — vínculo fixo do agendamento) */}
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
                  {scheduledAt
                    ? format(scheduledAt, "dd/MM/yyyy 'às' HH:mm", {
                        locale: ptBR,
                      })
                    : 'Não definido'}
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
                      <FileText className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/40" />
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

          {/* FOOTER */}
          <div className="px-8 py-5 border-t border-border/40 bg-muted/10 flex items-center justify-end gap-3 shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="cursor-pointer w-full sm:w-auto min-w-[120px] font-bold"
            >
              Fechar
            </Button>
            <Button
              type="submit"
              disabled={isPending || !isDirty || !isValid}
              className="cursor-pointer bg-blue-600 hover:bg-blue-700 w-full sm:w-auto min-w-[150px] font-bold"
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
