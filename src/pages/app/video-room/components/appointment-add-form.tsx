"use client"

import { useMemo } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { format, parseISO, isToday, differenceInMinutes } from "date-fns"
import { ptBR } from "date-fns/locale"
import { User, Loader2, Clock, Calendar, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select"

import { startAppointmentSession } from "@/api/start-appointment-session"
import { finishAppointmentSession } from "@/api/finish-appointment-session"
import { getActiveAppointmentsGrouped } from "@/api/get-active-appointments-grouped"

interface AppointmentAddFormProps {
  onSelectPatient: (appointmentId: string) => void
  currentAppointmentId: string
  currentSessionId: string | null
  onSessionStarted: (sessionId: string) => void
  onSessionFinished: () => void
  isSessionActive: boolean
  content?: string // ✅ Unificado
}

export function AppointmentAddForm({
  onSelectPatient,
  currentAppointmentId,
  currentSessionId,
  onSessionStarted,
  onSessionFinished,
  isSessionActive,
  content,
}: AppointmentAddFormProps) {
  const queryClient = useQueryClient()

  const { data: groupedData, isLoading: isAppointmentsLoading } = useQuery({
    queryKey: ["active-appointments-grouped"],
    queryFn: getActiveAppointmentsGrouped,
    staleTime: 1000 * 60,
  })

  // ✅ Performance: Memoização da lógica de validação de horário
  const startStatus = useMemo(() => {
    if (isSessionActive || !currentAppointmentId || !groupedData) return { canStart: true, message: "" }

    const allAppointments = Object.values(groupedData.grouped).flat()
    const selectedApp = allAppointments.find((app) => app.id === currentAppointmentId)

    if (!selectedApp) return { canStart: false, message: "" }

    const diff = differenceInMinutes(parseISO(selectedApp.scheduledAt), new Date())

    return {
      canStart: diff <= 10,
      message: diff > 10 ? `Disponível em ${diff - 10} min` : "",
    }
  }, [currentAppointmentId, groupedData, isSessionActive])

  // Mutação: Iniciar Atendimento
  const { mutateAsync: startSessionFn, isPending: isStarting } = useMutation({
    mutationFn: startAppointmentSession,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["active-appointments-grouped"] })
      onSessionStarted(data.sessionId)
      toast.success("Atendimento iniciado")
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Erro ao iniciar")
  })

  // Mutação: Finalizar Atendimento (Com o campo content corrigido)
  const { mutateAsync: finishSessionFn, isPending: isFinishing } = useMutation({
    mutationFn: finishAppointmentSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["active-appointments-grouped"] })
      queryClient.invalidateQueries({ queryKey: ["patient-details"] })
      onSessionFinished()
      toast.success("Atendimento finalizado e prontuário salvo")
    },
    onError: () => toast.error("Erro ao finalizar atendimento")
  })

  const handleAction = async () => {
    try {
      if (isSessionActive) {
        if (!currentSessionId) return toast.error("ID da sessão não encontrado")
        await finishSessionFn({ sessionId: currentSessionId, content }) // ✅ Enviando 'content'
      } else {
        if (!currentAppointmentId) return toast.error("Selecione um paciente")
        await startSessionFn({ appointmentId: currentAppointmentId })
      }
    } catch { }
  }

  const isPending = isStarting || isFinishing

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2.5">
          {isSessionActive ? (
            <div className="flex items-center gap-2 text-green-700">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Sessão em Andamento
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary/70" />
              Atendimento
            </div>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="space-y-2.5">
          <label className="text-sm font-medium text-foreground/80 flex items-center gap-2">
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
              {Object.entries(groupedData?.grouped || {}).map(([date, appointments]) => (
                <SelectGroup key={date}>
                  <SelectLabel className="cursor-pointer text-xs font-semibold text-primary uppercase tracking-wide py-2 sticky top-0 backdrop-blur bg-white/80 z-10">
                    {format(parseISO(date), "EEEE, dd/MM", { locale: ptBR })}
                    {isToday(parseISO(date)) && (
                      <span className="ml-2 text-[10px] bg-primary/10 px-1.5 py-0.5 rounded-full normal-case">
                        Hoje
                      </span>
                    )}
                  </SelectLabel>
                  {appointments.map((app) => (
                    <SelectItem key={app.id} value={app.id} className="py-3 cursor-pointer">
                      <div className="flex items-center justify-between w-full gap-4">
                        <span className="font-medium truncate">{app.patientName}</span>
                        <div className="flex items-center gap-1.5 text-muted-foreground shrink-0">
                          <Clock className="w-3.5 h-3.5" />
                          <span className="font-mono text-sm font-semibold">
                            {format(parseISO(app.scheduledAt), "HH:mm")}
                          </span>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))}
              {(!groupedData || Object.keys(groupedData.grouped).length === 0) && !isAppointmentsLoading && (
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
          <div className="flex items-center gap-2.5 p-3 bg-amber-50 border border-amber-200/60 rounded-lg animate-in fade-in zoom-in duration-200">
            <Clock className="w-4 h-4 text-amber-600 shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-amber-900">{startStatus.message}</p>
              <p className="text-xs text-amber-700/80">Liberação 10 minutos antes do horário</p>
            </div>
          </div>
        )}

        <Button
          onClick={handleAction}
          disabled={isPending || (!isSessionActive && (!currentAppointmentId || !startStatus.canStart))}
          className={`cursor-pointer w-full h-11 font-medium transition-all ${isSessionActive ? "bg-green-600 hover:bg-green-700 text-white" : "shadow-sm"
            }`}
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : isSessionActive ? (
            <><CheckCircle2 className="w-4 h-4 mr-2" /> Finalizar Atendimento</>
          ) : (
            "Iniciar Atendimento"
          )}
        </Button>
      </CardContent>
    </Card>
  )
}