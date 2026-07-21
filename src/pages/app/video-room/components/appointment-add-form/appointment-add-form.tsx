'use client'

import { useMemo, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { format, parseISO, isToday, differenceInMinutes } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { User, Loader2, Clock, Calendar, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from '@/components/ui/select'
import { ConfirmDialog } from '@/components/confirm-dialog/confirm-dialog'

import { startAppointmentSession } from '@/api/appointments/start-appointment-session'
import { finishAppointmentSession } from '@/api/appointments/finish-appointment-session'
import { getActiveAppointmentsGrouped } from '@/api/appointments/get-active-appointments-grouped'
import './appointment-add-form.css'

export type AppointmentAddFormSession = {
  currentAppointmentId: string
  currentSessionId: string | null
  isSessionActive: boolean
  content?: string
}

export type AppointmentAddFormHandlers = {
  onSelectPatient: (appointmentId: string) => void
  onSessionStarted: (sessionId: string) => void
  onSessionFinished: () => void
}

type AppointmentAddFormProps = {
  session: AppointmentAddFormSession
  handlers: AppointmentAddFormHandlers
}

export function AppointmentAddForm({
  session,
  handlers,
}: AppointmentAddFormProps) {
  const { currentAppointmentId, currentSessionId, isSessionActive, content } =
    session
  const { onSelectPatient, onSessionStarted, onSessionFinished } = handlers

  const [isFinishConfirmOpen, setIsFinishConfirmOpen] = useState(false)

  const queryClient = useQueryClient()

  const { data: groupedData, isLoading: isAppointmentsLoading } = useQuery({
    queryKey: ['active-appointments-grouped'],
    queryFn: getActiveAppointmentsGrouped,
    staleTime: 1000 * 60,
  })

  // ✅ Performance: Memoização da lógica de validação de horário
  const startStatus = useMemo(() => {
    if (isSessionActive || !currentAppointmentId || !groupedData)
      return { canStart: true, message: '' }

    const allAppointments = Object.values(groupedData.grouped).flat()
    const selectedApp = allAppointments.find(
      (app) => app.id === currentAppointmentId,
    )

    if (!selectedApp) return { canStart: false, message: '' }

    const diff = differenceInMinutes(
      parseISO(selectedApp.scheduledAt),
      new Date(),
    )

    return {
      canStart: diff <= 10,
      message: diff > 10 ? `Disponível em ${diff - 10} min` : '',
    }
  }, [currentAppointmentId, groupedData, isSessionActive])

  // Mutação: Iniciar Atendimento
  const { mutateAsync: startSessionFn, isPending: isStarting } = useMutation({
    mutationFn: startAppointmentSession,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['active-appointments-grouped'],
      })
      onSessionStarted(data.sessionId)
      toast.success('Atendimento iniciado')
    },
    onError: (err) => toast.error(err?.message || 'Erro ao iniciar'),
  })

  // Mutação: Finalizar Atendimento (Com o campo content corrigido)
  const { mutateAsync: finishSessionFn, isPending: isFinishing } = useMutation({
    mutationFn: finishAppointmentSession,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['active-appointments-grouped'],
      })
      queryClient.invalidateQueries({ queryKey: ['patient-details'] })
      onSessionFinished()
      toast.success('Atendimento finalizado e prontuário salvo')
    },
    onError: () => toast.error('Erro ao finalizar atendimento'),
  })

  const handleFinish = async () => {
    if (!currentSessionId) {
      setIsFinishConfirmOpen(false)
      return toast.error('ID da sessão não encontrado')
    }
    try {
      await finishSessionFn({ sessionId: currentSessionId, content })
      setIsFinishConfirmOpen(false)
    } catch {}
  }

  const handleAction = async () => {
    if (isSessionActive) {
      setIsFinishConfirmOpen(true)
      return
    }
    if (!currentAppointmentId) return toast.error('Selecione um paciente')
    try {
      await startSessionFn({ appointmentId: currentAppointmentId })
    } catch {}
  }

  const isPending = isStarting || isFinishing

  function renderActionLabel() {
    if (isPending) return <Loader2 className="w-4 h-4 animate-spin" />
    if (isSessionActive) {
      return (
        <>
          <CheckCircle2 className="w-4 h-4 mr-2" /> Finalizar Atendimento
        </>
      )
    }
    return 'Iniciar Atendimento'
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2.5">
          {isSessionActive ? (
            <div className="vr-add-form-status-live">
              <div className="vr-add-form-status-live-dot" />
              Sessão em Andamento
            </div>
          ) : (
            <div className="vr-add-form-status-idle">
              <Calendar className="w-5 h-5 text-primary/70" />
              Atendimento
            </div>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-5">
        <div className="flex flex-col gap-2.5">
          <label className="vr-add-form-field-label">
            <User className="w-4 h-4" /> Paciente
          </label>
          <Select
            value={currentAppointmentId}
            onValueChange={onSelectPatient}
            disabled={isAppointmentsLoading || isPending || isSessionActive}
          >
            <SelectTrigger className="cursor-pointer h-11 border-border/60 hover:border-border transition-colors">
              <SelectValue placeholder="Selecione o paciente..." />
            </SelectTrigger>
            <SelectContent className="max-h-[320px]">
              {Object.entries(groupedData?.grouped || {}).map(
                ([date, appointments]) => (
                  <SelectGroup key={date}>
                    <SelectLabel className="cursor-pointer text-xs font-semibold text-primary uppercase tracking-wide py-2 sticky top-0 backdrop-blur bg-white/80 z-10">
                      {format(parseISO(date), 'EEEE, dd/MM', { locale: ptBR })}
                      {isToday(parseISO(date)) && (
                        <span className="ml-2 text-[10px] bg-primary/10 px-1.5 py-0.5 rounded-full normal-case">
                          Hoje
                        </span>
                      )}
                    </SelectLabel>
                    {appointments.map((app) => (
                      <SelectItem
                        key={app.id}
                        value={app.id}
                        className="py-3 cursor-pointer"
                      >
                        <div className="flex items-center justify-between w-full gap-4">
                          <span className="font-medium truncate">
                            {app.patientName}
                          </span>
                          <div className="flex items-center gap-1.5 text-muted-foreground shrink-0">
                            <Clock className="w-3.5 h-3.5" />
                            <span className="font-mono text-sm font-semibold">
                              {format(parseISO(app.scheduledAt), 'HH:mm')}
                            </span>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ),
              )}
              {(!groupedData ||
                Object.keys(groupedData.grouped).length === 0) &&
                !isAppointmentsLoading && (
                  <div className="p-8 text-center">
                    <p className="text-sm text-muted-foreground font-medium">
                      Nenhum agendamento marcado.
                    </p>
                    <p className="text-[10px] text-muted-foreground/60 mt-1">
                      Agende uma sessão para iniciar o atendimento.
                    </p>
                  </div>
                )}
            </SelectContent>
          </Select>
        </div>

        {!isSessionActive && currentAppointmentId && !startStatus.canStart && (
          <div className="vr-add-form-warning">
            <Clock className="w-4 h-4 text-warning shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-warning">{startStatus.message}</p>
              <p className="text-xs text-warning/80">
                Liberação 10 minutos antes do horário
              </p>
            </div>
          </div>
        )}

        <Button
          onClick={handleAction}
          disabled={
            isPending ||
            (!isSessionActive &&
              (!currentAppointmentId || !startStatus.canStart))
          }
          className={`cursor-pointer w-full h-11 font-medium transition-all ${
            isSessionActive
              ? 'bg-success hover:bg-success/90 text-white'
              : 'shadow-sm'
          }`}
        >
          {renderActionLabel()}
        </Button>
      </CardContent>

      <ConfirmDialog
        open={isFinishConfirmOpen}
        onOpenChange={setIsFinishConfirmOpen}
        variant="warning"
        title="Finalizar atendimento?"
        description="A sessão será encerrada e o prontuário será salvo com as anotações atuais."
        confirmLabel="Finalizar"
        pending={isFinishing}
        onConfirm={handleFinish}
      />
    </Card>
  )
}
