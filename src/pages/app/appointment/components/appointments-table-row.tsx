"use client"

import { useState } from "react"
import { Trash2, Pen } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Dialog,
} from "@/components/ui/dialog"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { deleteAppointment } from "@/api/delete-appointment"
import { EditAppointment } from "./edit-appointment-dialog"
import type { Appointment } from "@/api/get-appointment"
import { DeleteAppointmentDialog } from "./delete-appointment-dialog"

interface AppointmentsTableProps {
    appointments: Appointment[]
    isLoading: boolean
    perPage?: number
}

export function AppointmentsTable({
    appointments,
    isLoading,
    perPage = 10,
}: AppointmentsTableProps) {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Paciente</TableHead>
                        <TableHead>Serviço</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[120px]">Opções</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {isLoading ? (
                        Array.from({ length: perPage }).map((_, i) => (
                            <TableRow key={i}>
                                <TableCell colSpan={7}>
                                    <Skeleton className="h-8 w-full" />
                                </TableCell>
                            </TableRow>
                        ))
                    ) : appointments.length > 0 ? (
                        appointments.map((a) => (
                            <AppointmentsRowItem key={a.id} appointment={a} />
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={7}
                                className="text-center text-muted-foreground py-6"
                            >
                                Nenhum agendamento encontrado.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

function AppointmentsRowItem({ appointment }: { appointment: Appointment }) {
    const { id, scheduledAt, status, patient } = appointment

    const patientName = `${patient.firstName} ${patient.lastName}`

    const serviceName = "Serviço" // ⚠️ ajuste conforme seu model

    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)

    const queryClient = useQueryClient()

    const { mutateAsync: deleteFn, isPending: isDeleting } = useMutation({
        mutationFn: deleteAppointment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["appointments"] })
        },
    })

    return (
        <TableRow>
            <TableCell>{patientName}</TableCell>

            <TableCell>{serviceName}</TableCell>

            <TableCell>
                {new Date(scheduledAt).toLocaleDateString("pt-BR")}
            </TableCell>

            <TableCell>{status}</TableCell>

            <TableCell>
                <div className="flex items-center gap-2">
                    {/* EDITAR */}
                    <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                        {isEditOpen && (
                            <EditAppointment
                                appointment={appointment}
                                onClose={() => setIsEditOpen(false)}
                            />
                        )}
                    </Dialog>

                    {/* EXCLUIR */}
                    <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                        {isDeleteOpen && (
                            <DeleteAppointmentDialog
                                isDeleting={isDeleting}
                                onClose={() => setIsDeleteOpen(false)}
                                onDelete={async () => await deleteFn(id)}
                            />
                        )}
                    </Dialog>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => setIsEditOpen(true)}
                                    className="cursor-pointer h-7 w-7 hover:bg-blue-100 hover:text-blue-600"
                                >
                                    <Pen className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Editar</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => setIsDeleteOpen(true)}
                                    className="cursor-pointer h-7 w-7 hover:bg-red-100 hover:text-red-600"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Excluir</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </TableCell>
        </TableRow>
    )
}
