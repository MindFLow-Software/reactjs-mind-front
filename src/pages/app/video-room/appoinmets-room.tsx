"use client"

import { useState, useCallback } from "react"
import { Helmet } from "react-helmet-async"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { AppointmentAddForm } from "./components/appointment-add-form"
import { VideoRoomMock } from "./components/video-room"
import { useQuery } from "@tanstack/react-query"
import { getScheduledAppointment } from "@/api/get-scheduled-appointment"


export interface SessionItem {
    id: number
    procedure: string
    duration: string
    status: "Concluído" | "Em Andamento" | "Pendente"
}

export function AppointmentsRoom() {
    const [selectedPatientId, setSelectedPatientId] = useState("")
    const [notes, setNotes] = useState("")

    const { data: activeAppointmentData, isLoading: isAppointmentLoading } = useQuery({
        queryKey: ['activeAppointment', selectedPatientId],
        queryFn: () => getScheduledAppointment(selectedPatientId),
        enabled: !!selectedPatientId,
        retry: false,
    })

    const currentAppointmentId = activeAppointmentData?.appointmentId || "";



    const handleFinishSession = useCallback(() => {
        if (!currentAppointmentId) {
            console.error("ERRO: Agendamento não ativo.");
            return;
        }
        // 🚨 Lógica futura: Chamar a API de Finalizar Sessão (PATCH /appointments/:id/end)
        console.log(`Sessão finalizada para o Agendamento ID: ${currentAppointmentId}.`);

    }, [currentAppointmentId, notes])

    const MAX_LENGTH = 8000;
    const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        let value = e.target.value;
        if (value.length > MAX_LENGTH) {
            value = value.substring(0, MAX_LENGTH);
        }
        setNotes(value);
    };

    const handleSelectPatient = useCallback((patientId: string) => {
        setSelectedPatientId(patientId);
        // O useQuery (passo 1) é acionado automaticamente aqui.
    }, [])


    return (
        <>
            <Helmet title="Sala de Atendimento" />

            <div className="flex flex-col gap-4 mt-4">
                <h1 className="text-3xl font-bold tracking-tight">
                    Sala de Atendimento
                </h1>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-1">
                    <div className="lg:col-span-1">
                        <VideoRoomMock />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-1">
                    <div className="lg:col-span-1">
                        <AppointmentAddForm
                            onFinishSession={handleFinishSession}
                            selectedPatientId={selectedPatientId}
                            onSelectPatient={handleSelectPatient}
                            // 🔑 Passa o ID real para o componente filho
                            currentAppointmentId={currentAppointmentId} onSessionStarted={function (): void {
                                throw new Error("Function not implemented.")
                            } } isSessionActive={false}                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    <div className="lg:col-span-1 hidden lg:block">
                    </div>
                </div>


                <Card className="mt-2">
                    <CardHeader>
                        <CardTitle>Anotações e Evolução</CardTitle>
                        <CardDescription>Registre a evolução e observações do paciente.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">

                        <div className="space-y-2">
                            <label htmlFor="notes" className="text-sm font-medium">
                                Notas (opcional)
                            </label>
                            <Textarea
                                id="notes"
                                name="notes"
                                placeholder="Adicione observações..."
                                value={notes}
                                onChange={handleNotesChange}
                                maxLength={MAX_LENGTH}
                                rows={4}
                                className="w-full resize-none overflow-y-auto"
                                style={{
                                    wordBreak: "break-all",
                                    overflowWrap: "break-word",
                                    whiteSpace: "pre-wrap",
                                }}
                            />
                            <div className="text-xs text-muted-foreground text-right">
                                {notes.length}/{MAX_LENGTH} caracteres
                            </div>
                        </div>

                        <Button
                            // Habilita apenas se houver notas e um ID de consulta válido
                            disabled={!notes.trim() || !currentAppointmentId || isAppointmentLoading}
                            className="w-full sm:w-auto"
                        >
                            Salvar Anotações
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}