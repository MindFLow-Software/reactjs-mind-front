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
import { PatientsTableRow } from "./components/patients-table-row"
import { PatientsTableFilters } from "./components/patients-table-filters"
import { Pagination } from "@/components/pagination"
import { getPatients, type GetPatientsResponse } from "@/api/get-patients"
import { Skeleton } from "@/components/ui/skeleton"

export function PatientsList() {
    const [searchParams] = useSearchParams()
    const location = useLocation()
    const navigate = useNavigate()
    
    const pageIndex = Number(searchParams.get('pageIndex') ?? 0)
    const name = searchParams.get('name')
    const perPage = Number(searchParams.get('perPage') ?? 10) 

    const { data: result, isLoading, isError } = useQuery<GetPatientsResponse, Error, GetPatientsResponse, (string | number | null)[]>({
        queryKey: ["patients", pageIndex, name],
        queryFn: () => getPatients({
            pageIndex,
            perPage,
            name,
        }),
        staleTime: 1000 * 60 * 5,
    })
    
    const patients = result?.patients ?? []
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
        return <p className="text-red-500">Erro ao carregar pacientes 😕</p>
    }

    return (
        <>
            <Helmet title="Cadastro de Pacientes" />

            <div className="flex flex-col gap-4 mt-4">
                <h1 className="text-3xl font-bold tracking-tight">Cadastro de Pacientes</h1>

                <div className="space-y-2.5">
                    <PatientsTableFilters />

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
                                        <TableHead className="w-16" />
                                        <TableHead className="w-[140px]">CPF</TableHead>
                                        <TableHead className="w-40">Paciente</TableHead>
                                        <TableHead className="w-[140px]">Telefone</TableHead>
                                        <TableHead className="w-40">Data de Nascimento</TableHead>
                                        <TableHead className="w-[140px]">Email</TableHead>
                                        <TableHead className="w-[140px]">Gênero</TableHead>
                                        <TableHead className="w-[140px]">Status</TableHead>
                                        <TableHead className="w-[140px]">Opções</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {patients.length > 0 ? (
                                        patients.map((patient: any) => (
                                            <PatientsTableRow key={patient.id} patient={patient} />
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableHead
                                                colSpan={9}
                                                className="text-center text-muted-foreground py-6"
                                            >
                                                Nenhum paciente cadastrado.
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