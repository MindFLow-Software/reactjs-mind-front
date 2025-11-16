"use client"

import { Helmet } from "react-helmet-async"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"

import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { AppointmentsTableRow } from "./components/appointments-table-row"
import { AppointmentsTableFilters } from "./components/appointments-table-filters"
import { Pagination } from "@/components/pagination"
import { getAppointments } from "@/api/get-appointment"
import { Skeleton } from "@/components/ui/skeleton"

export function AppointmentsPage() {
    const [pageIndex, setPageIndex] = useState(0)

    const { data, isLoading, isError } = useQuery({
        queryKey: ["appointments"],
        queryFn: getAppointments,
        staleTime: 1000,
    })

    // data é um array, não objeto com appointments
    const appointments = data ?? []

    // Paginação básica
    const perPage = 10
    const start = pageIndex * perPage
    const end = start + perPage
    const paginatedAppointments = appointments.slice(start, end)

    return (
        <>
            <Helmet title="Agendamentos" />

            <div className="flex flex-col gap-4 mt-4">
                <h1 className="text-3xl font-bold tracking-tight">Agendamentos</h1>

                {isLoading ? (
                    <div className="space-y-2.5">
                        <AppointmentsTableFilters />
                        <div className="rounded-md border p-4 space-y-2">
                            {Array.from({ length: 10 }).map((_, i) => (
                                <Skeleton key={i} className="h-8 w-full" />
                            ))}
                        </div>
                    </div>
                ) : isError ? (
                    <p className="text-red-500">Erro ao carregar agendamentos 😕</p>
                ) : (
                    <div className="space-y-2.5">
                        <AppointmentsTableFilters />

                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[140px]">Paciente</TableHead>
                                        <TableHead className="w-[140px]">Notas</TableHead>
                                        <TableHead className="w-[180px]">Diagnóstico</TableHead>
                                        <TableHead className="w-[180px]">Data/Hora</TableHead>
                                        <TableHead className="w-[120px]">Status</TableHead>
                                        <TableHead className="w-[140px]">Opções</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {paginatedAppointments.length > 0 ? (
                                        paginatedAppointments.map((appt: any) => (
                                            <AppointmentsTableRow
                                                key={appt.id}
                                                appointment={appt}
                                            />
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableHead
                                                colSpan={7}
                                                className="text-center text-muted-foreground py-6"
                                            >
                                                Nenhum agendamento encontrado.
                                            </TableHead>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        <Pagination
                            pageIndex={pageIndex}
                            totalCount={appointments.length}
                            perPage={perPage}
                            onPageChange={setPageIndex}
                        />
                    </div>
                )}
            </div>
        </>
    )
}
