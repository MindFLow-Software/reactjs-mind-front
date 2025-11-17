"use client"

import { Helmet } from "react-helmet-async"
import { useQuery } from "@tanstack/react-query"
import { useSearchParams, useLocation, useNavigate } from "react-router-dom" 

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
// 🔑 CORREÇÃO: Usando o nome correto do arquivo de API
import { getAppointments, type GetAppointmentsResponse } from "@/api/get-appointment" 
import { Skeleton } from "@/components/ui/skeleton"

export function AppointmentsPage() {
    const [searchParams] = useSearchParams()
    const location = useLocation()
    const navigate = useNavigate()
    
    const pageIndex = Number(searchParams.get('pageIndex') ?? 0)
    const statusFilter = searchParams.get('status')
    const orderByFilter = searchParams.get('orderBy')
    const perPage = Number(searchParams.get('perPage') ?? 10) 

    const { data: result, isLoading, isError } = useQuery<GetAppointmentsResponse, Error, GetAppointmentsResponse, (string | number | null)[]>({
        queryKey: ["appointments", pageIndex, statusFilter, orderByFilter],
        queryFn: () => getAppointments({
            pageIndex,
            perPage,
            status: statusFilter,
        }),
        staleTime: 1000 * 60 * 5,
    })
    
    const appointments = result?.appointments ?? []
    const meta = result?.meta ?? { pageIndex: 0, perPage: 10, totalCount: 0 }


    const handlePaginate = (newPageIndex: number) => {
        const newSearchParams = new URLSearchParams(searchParams)
        newSearchParams.set('pageIndex', String(newPageIndex))
        navigate({
            pathname: location.pathname,
            search: newSearchParams.toString(),
        })
    }

    if (isError) {
        return <p className="text-red-500">Erro ao carregar agendamentos 😕</p>
    }

    return (
        <>
            <Helmet title="Agendamentos" />

            <div className="flex flex-col gap-4 mt-4">
                <h1 className="text-3xl font-bold tracking-tight">Agendamentos</h1>

                <div className="space-y-2.5">
                    <AppointmentsTableFilters /> 

                    {isLoading ? (
                        <div className="rounded-md border p-4 space-y-2">
                            {Array.from({ length: 10 }).map((_, i) => (
                                <Skeleton key={i} className="h-8 w-full" />
                            ))}
                        </div>
                    ) : (
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
                                    {appointments.length > 0 ? (
                                        appointments.map((appt: any) => (
                                            <AppointmentsTableRow
                                                key={appt.id}
                                                appointment={appt}
                                            />
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableHead
                                                colSpan={6}
                                                className="text-center text-muted-foreground py-6"
                                            >
                                                Nenhum agendamento encontrado.
                                            </TableHead>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                    
                    {result && (
                        <Pagination 
                            pageIndex={meta.pageIndex} 
                            totalCount={meta.totalCount} 
                            perPage={meta.perPage}
                            onPageChange={handlePaginate} 
                        />
                    )}
                </div>
            </div>
        </>
    )
}