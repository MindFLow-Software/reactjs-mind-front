"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AppointmentsTableRow } from "./appointments-table-row"
import { getAppointments, type Appointment } from "@/api/get-appointment"

export function AppointmentsTable() {
    const [appointments, setAppointments] = useState<Appointment[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function loadAppointments() {
            try {
                const data = await getAppointments()

                // garante compatibilidade com retorno do backend
                const list = Array.isArray(data)
                    ? data
                    : (data as any).appointments ?? []

                setAppointments(list)
            } catch (err) {
                console.error("❌ Erro ao carregar agendamentos:", err)
                setError("Erro ao buscar agendamentos. Tente novamente mais tarde.")
            } finally {
                setLoading(false)
            }
        }

        loadAppointments()
    }, [])

    if (loading)
        return (
            <p className="text-center text-muted-foreground">
                Carregando agendamentos...
            </p>
        )

    if (error)
        return (
            <p className="text-center text-red-500">
                {error}
            </p>
        )

    if (appointments.length === 0)
        return (
            <p className="text-center text-muted-foreground">
                Nenhum agendamento encontrado.
            </p>
        )

    return (
        <div className="rounded-lg border shadow-sm">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Paciente</TableHead>
                        <TableHead>Psicólogo</TableHead>
                        <TableHead>Diagnóstico</TableHead>
                        <TableHead>Notas</TableHead>
                        <TableHead>Data / Hora</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {appointments.map((appointment) => (
                        <AppointmentsTableRow
                            key={appointment.id}
                            appointment={appointment}
                        />
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
