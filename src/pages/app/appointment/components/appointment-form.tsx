"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { mutate } from "swr"
import { registerAppointment } from "@/api/register-appointment"

export function AppointmentForm() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [date, setDate] = useState<Date>()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError("")
        setSuccess("")
        setIsSubmitting(true)

        const formData = new FormData(e.currentTarget)

        try {
            if (!date) {
                setError("Selecione uma data e hora para a consulta.")
                setIsSubmitting(false)
                return
            }

            await registerAppointment({
                patientId: formData.get("patientId") as string,
                psychologistId: formData.get("psychologistId") as string,
                diagnosis: formData.get("diagnosis") as string,
                notes: formData.get("notes") as string,
                scheduledAt: date,
                status: "SCHEDULED",
            })

            setSuccess("Agendamento criado com sucesso!")
            e.currentTarget.reset()
            setDate(undefined)
            mutate("appointments")
        } catch (err) {
            setError("Erro ao criar agendamento. Tente novamente.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Novo Agendamento</CardTitle>
                <CardDescription>
                    Crie um novo agendamento de consulta
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                ID do Paciente
                            </label>
                            <Input
                                name="patientId"
                                placeholder="ex: patient-123"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                ID do Psicólogo
                            </label>
                            <Input
                                name="psychologistId"
                                placeholder="ex: psych-456"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Diagnóstico
                        </label>
                        <Input
                            name="diagnosis"
                            placeholder="ex: Ansiedade"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Data e Hora da Consulta
                        </label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !date && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date ? (
                                        format(date, "dd 'de' MMMM 'de' yyyy, HH:mm", {
                                            locale: ptBR,
                                        })
                                    ) : (
                                        <span>Selecione data e hora</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    initialFocus
                                    locale={ptBR}
                                />
                                <div className="p-3 border-t border-muted flex items-center gap-2">
                                    <Input
                                        type="time"
                                        className="w-full"
                                        onChange={(e) => {
                                            if (date) {
                                                const [hours, minutes] = e.target.value.split(":")
                                                const newDate = new Date(date)
                                                newDate.setHours(Number(hours))
                                                newDate.setMinutes(Number(minutes))
                                                setDate(newDate)
                                            }
                                        }}
                                    />
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Notas (opcional)
                        </label>
                        <Textarea
                            name="notes"
                            placeholder="Adicione anotações sobre a consulta..."
                            rows={3}
                        />
                    </div>

                    {error && <div className="text-red-500 text-sm">{error}</div>}
                    {success && <div className="text-green-500 text-sm">{success}</div>}

                    <Button type="submit" disabled={isSubmitting} className="w-full">
                        {isSubmitting ? "Criando..." : "Criar Agendamento"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
