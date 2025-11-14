"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle2, User, Loader2 } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { getPatients } from "@/api/get-patients"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { startAppointment } from "@/api/start-appointment"

// ❌ Removido availableProcedures e props/lógica de procedimento

interface AppointmentAddFormProps {
  selectedPatientId: string
  onSelectPatient: (patientId: string) => void

  currentAppointmentId: string
  onFinishSession: () => void
  
  onSessionStarted: () => void 
  isSessionActive: boolean 
}

export function AppointmentAddForm({
  selectedPatientId,
  onSelectPatient,
  currentAppointmentId,
  onFinishSession,
  onSessionStarted, 
  isSessionActive,  
}: AppointmentAddFormProps) {

  const queryClient = useQueryClient()

  const startSessionMutation = useMutation({
    mutationFn: startAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] }) 
      onSessionStarted() 
    },
    onError: (error) => {
      console.error("Erro ao iniciar sessão:", error);
    },
  })

  // 🖱️ Handler para o botão INICIAR SESSÃO
  const handleStartSession = () => {
    if (selectedPatientId && currentAppointmentId) { 
      startSessionMutation.mutate(currentAppointmentId)
    }
  }

  // Busca de Pacientes
  const { data: responseData, isLoading: isPatientsLoading, isError: isPatientsError } = useQuery({
    queryKey: ['all-psychologist-patients'],
    queryFn: getPatients,
    staleTime: 1000 * 60 * 5,
  })

  const patientOptions = useMemo(() => {
    const patients = responseData?.patients || responseData || [];
    if (!Array.isArray(patients)) return [];

    return patients.map((patient: any) => ({
      id: patient.id,
      name: `${patient.firstName} ${patient.lastName}`,
    }));
  }, [responseData]);

  const loadingOrErrorState = isPatientsLoading || isPatientsError;
  const isMutationPending = startSessionMutation.isPending;
  
  const isSessionStarted = isSessionActive; 


  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Selecionar Paciente
        </CardTitle>
        <CardDescription>Selecione o paciente para iniciar a sessão.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">

        {/* 🔑 Select de Pacientes */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Paciente</label>
          <Select
            value={selectedPatientId}
            onValueChange={onSelectPatient}
            // Não permite trocar de paciente se a sessão já estiver ativa
            disabled={loadingOrErrorState || isSessionStarted} 
          >
            <SelectTrigger>
              {isPatientsLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              <SelectValue placeholder={isPatientsLoading ? "Carregando pacientes..." : "Selecione um paciente..."} />
            </SelectTrigger>
            <SelectContent>
              {patientOptions.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.name}
                </SelectItem>
              ))}
              {isPatientsError && (
                <SelectItem value="error" disabled>Erro ao carregar</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="my-4 border-t" />

        {/* 🔑 Botão INICIAR/FINALIZAR SESSÃO */}
        <Button
          onClick={isSessionStarted ? onFinishSession : handleStartSession}
          // Lógica: Desabilita se estiver pendente OU se a sessão não começou E (não há paciente OU não há ID de agendamento)
          disabled={
            isMutationPending || 
            (!isSessionStarted && (!selectedPatientId || !currentAppointmentId))
          }
          size="sm"
          className="gap-2 w-full shrink-0 cursor-pointer"
          // Muda a aparência para indicar o estado finalização
          variant={isSessionStarted ? "outline" : "default"}
        >
          {isMutationPending ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <CheckCircle2 className="w-4 h-4 mr-2" />
          )}
          {isSessionStarted ? 'Finalizar Sessão' : 'Iniciar à Sessão'}
        </Button>
      </CardContent>
    </Card>
  )
}