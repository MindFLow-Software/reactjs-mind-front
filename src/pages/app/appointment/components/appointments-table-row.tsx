"use client"

import { TableCell, TableRow } from "@/components/ui/table"

interface AppointmentProps {
    appointment: {
        id: string
        patientId: string
        psychologistId: string
        diagnosis: string
        notes?: string
        scheduledAt: string
        startedAt?: string
        endedAt?: string
        status: string
    }
}

function traduzirStatus(status: string): { texto: string; estilo: string } {
    switch (status) {
        case "SCHEDULED":
            return { texto: "Agendado", estilo: "bg-blue-100 text-blue-700" }
        case "IN_PROGRESS":
            return { texto: "Em andamento", estilo: "bg-yellow-100 text-yellow-700" }
        case "COMPLETED":
        case "FINISHED":
            return { texto: "Concluído", estilo: "bg-green-100 text-green-700" }
        case "CANCELLED":
        case "CANCELED":
            return { texto: "Cancelado", estilo: "bg-red-100 text-red-700" }
        default:
            return { texto: "Desconhecido", estilo: "bg-gray-100 text-gray-700" }
    }
}

export function AppointmentsTableRow({ appointment }: AppointmentProps) {
    const { patientId, psychologistId, diagnosis, notes, scheduledAt, status } = appointment
    const { texto, estilo } = traduzirStatus(status)

    return (
        <TableRow>
            <TableCell className="text-muted-foreground">{patientId}</TableCell>
            <TableCell className="text-muted-foreground">{psychologistId}</TableCell>
            <TableCell className="text-muted-foreground">{diagnosis}</TableCell>
            <TableCell className="text-muted-foreground">{notes || "—"}</TableCell>
            <TableCell className="text-muted-foreground">
                {new Date(scheduledAt).toLocaleString("pt-BR", {
                    dateStyle: "short",
                    timeStyle: "short",
                })}
            </TableCell>
            <TableCell>
                <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${estilo}`}
                >
                    {texto}
                </span>
            </TableCell>
        </TableRow>
    )
}
