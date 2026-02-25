"use client"

import { useEffect, useMemo } from "react"
import { Helmet } from "react-helmet-async"
import { useQuery } from "@tanstack/react-query"
import { UsersRound } from "lucide-react"

import { Pagination } from "@/components/pagination"
import { PatientsTableFilters } from "./components/patients-table-filters"
import { PatientsTable } from "./components/patients-table"

import { useHeaderStore } from "@/hooks/use-header-store"
import { usePatientFilters } from "@/hooks/use-patient-filters"
import { getPatients } from "@/api/get-patients"
import { PatientsDataBlock } from "../components/patients-data-block"
import { PatientsPageShell } from "../components/patients-page-shell"

export function PatientsList() {
    const { setTitle } = useHeaderStore()
    const { filters, setPage } = usePatientFilters()

    useEffect(() => {
        setTitle("Cadastro de Pacientes")
    }, [setTitle])

    const { data: result, isLoading, isError } = useQuery({
        queryKey: ["patients", filters.pageIndex, filters.filter, filters.status],
        queryFn: () =>
            getPatients({
                pageIndex: filters.pageIndex,
                perPage: filters.perPage,
                filter: filters.filter,
                status: filters.status,
            }),
        staleTime: 1000 * 10,
        refetchOnWindowFocus: true,
        placeholderData: (previousData) => previousData,
    })

    const patients = useMemo(() => result?.patients ?? [], [result])
    const meta = useMemo(
        () =>
            result?.meta ?? {
                pageIndex: filters.pageIndex,
                perPage: filters.perPage,
                totalCount: 0,
            },
        [result, filters]
    )

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center h-[400px] gap-4">
                <p className="text-destructive font-medium">Erro ao carregar pacientes.</p>
                <button
                    onClick={() => window.location.reload()}
                    className="text-sm underline text-muted-foreground hover:text-foreground"
                >
                    Tentar novamente
                </button>
            </div>
        )
    }

    return (
        <>
            <Helmet title="Cadastro de Pacientes" />

            <PatientsPageShell
                title="Cadastro de Pacientes"
                description="Gerencie a base de pacientes e acesse detalhes rapidamente."
                icon={<UsersRound className="size-6 text-blue-600" />}
                contentClassName="p-4"
            >
                <PatientsDataBlock
                    title="Lista de pacientes"
                    description="Pesquise, filtre e mantenha a base atualizada."
                    toolbar={<PatientsTableFilters />}
                    footer={
                        meta.totalCount > 0 ? (
                            <Pagination
                                pageIndex={meta.pageIndex}
                                totalCount={meta.totalCount}
                                perPage={meta.perPage}
                                onPageChange={setPage}
                            />
                        ) : null
                    }
                >
                    <PatientsTable patients={patients} isLoading={isLoading} perPage={filters.perPage} />
                </PatientsDataBlock>
            </PatientsPageShell>
        </>
    )
}
