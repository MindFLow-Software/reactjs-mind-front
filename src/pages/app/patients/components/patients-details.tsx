"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Loader2, ClockIcon } from "lucide-react"
import { getPatientDetails } from "@/api/get-patient-details"

import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item"

import { formatCPF } from "@/utils/formatCPF"
import { formatPhone } from "@/utils/formatPhone"
import { PaginationDetailsPatients } from "@/components/pagination-details-patients"

interface PatientsDetailsProps {
    patientId: string
}

export function PatientsDetails({ patientId }: PatientsDetailsProps) {
    const [pageIndex, setPageIndex] = useState(0)

    const { data, isLoading } = useQuery({
        queryKey: ["patient-details", patientId, pageIndex],
        queryFn: () => getPatientDetails(patientId, pageIndex),
        enabled: !!patientId,
    })

    if (isLoading || !data) {
        return (
            <DialogContent className="flex items-center justify-center p-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </DialogContent>
        )
    }

    const { patient, meta } = data

    const getStatusLabel = (status: string) => {
        const s = status?.toUpperCase()
        const statuses: Record<string, { label: string; color: string }> = {
            SCHEDULED: { label: "Agendado", color: "text-blue-500" },
            ATTENDING: { label: "Em andamento", color: "text-amber-500" },
            FINISHED: { label: "Concluída", color: "text-green-500" },
            CONCLUÍDA: { label: "Concluída", color: "text-green-500" }, // Garantia para tradução
            CANCELED: { label: "Cancelado", color: "text-red-500" },
            NOT_ATTEND: { label: "Não compareceu", color: "text-orange-500" },
            RESCHEDULED: { label: "Remarcado", color: "text-purple-500" },
        }
        return statuses[s] || { label: status, color: "text-yellow-500" }
    }

    // 🔑 LÓGICA CORRIGIDA: Filtra por qualquer variação de "Concluída" ou "FINISHED"
    const totalFinished = patient.sessions.filter((session: any) => {
        const s = session.status?.toUpperCase()
        return s === "FINISHED" || s === "CONCLUÍDA" || s === "CONCLUIDO"
    }).length

    return (
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>
                    Paciente: {patient.firstName} {patient.lastName}
                </DialogTitle>
                <DialogDescription>
                    Detalhes do paciente e histórico de sessões
                </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell className="text-muted-foreground">Nome completo</TableCell>
                            <TableCell className="flex justify-end font-medium">
                                {patient.firstName} {patient.lastName}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="text-muted-foreground">CPF</TableCell>
                            <TableCell className="flex justify-end font-medium tabular-nums">
                                {formatCPF(patient.cpf)}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="text-muted-foreground">E-mail</TableCell>
                            <TableCell className="flex justify-end font-medium lowercase">
                                {patient.email}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="text-muted-foreground">Telefone</TableCell>
                            <TableCell className="flex justify-end font-medium tabular-nums">
                                {formatPhone(patient.phoneNumber)}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

                <Item
                    variant="outline"
                    className="bg-sky-50/50 border-sky-200 dark:bg-sky-950/10 dark:border-sky-900"
                >
                    <ItemMedia variant="icon" className="text-sky-600 dark:text-sky-500">
                        <ClockIcon className="h-5 w-5" />
                    </ItemMedia>
                    <ItemContent>
                        <ItemTitle>Tempo médio de atendimento</ItemTitle>
                        <ItemDescription>
                            Média baseada em atendimentos concluídos
                        </ItemDescription>
                    </ItemContent>
                    <ItemActions>
                        <div className="text-right">
                            <span className="text-lg font-semibold text-sky-700 dark:text-sky-400">
                                {meta.averageDuration} min
                            </span>
                            <p className="text-xs text-muted-foreground">em sessão</p>
                        </div>
                    </ItemActions>
                </Item>

                <div className="space-y-4">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Data</TableHead>
                                <TableHead>Tema da Sessão</TableHead>
                                <TableHead className="text-right">Duração</TableHead>
                                <TableHead className="text-right">Status</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {patient.sessions.length > 0 ? (
                                patient.sessions.map((session: any) => {
                                    const statusInfo = getStatusLabel(session.status)
                                    return (
                                        <TableRow key={session.id}>
                                            <TableCell className="whitespace-nowrap">{session.date}</TableCell>
                                            <TableCell className="max-w-[200px] truncate italic text-muted-foreground">
                                                {session.theme || "Sem tema definido"}
                                            </TableCell>
                                            <TableCell
                                                className={`text-right tabular-nums ${session.duration.includes('Aguardando')
                                                        ? 'text-muted-foreground italic text-[11px]'
                                                        : 'font-medium'
                                                    }`}
                                            >
                                                {session.duration}
                                            </TableCell>
                                            <TableCell className={`text-right font-bold ${statusInfo.color}`}>
                                                {statusInfo.label}
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                        Nenhuma sessão registrada.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>

                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={3} className="font-medium text-muted-foreground">
                                    Total de sessões realizadas
                                </TableCell>
                                <TableCell className="text-right font-bold text-foreground">
                                    {totalFinished}
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>

                    <PaginationDetailsPatients
                        pageIndex={meta.pageIndex}
                        totalCount={meta.totalCount}
                        perPage={meta.perPage}
                        onPageChange={setPageIndex}
                    />
                </div>
            </div>
        </DialogContent>
    )
}