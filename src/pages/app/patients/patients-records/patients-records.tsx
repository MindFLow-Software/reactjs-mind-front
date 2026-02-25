"use client"

import { useState, useMemo, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { Clock, ChevronRight, ClipboardList, FilterX } from "lucide-react"
import { Helmet } from "react-helmet-async"
import { formatDistanceToNow, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getPatients } from "@/api/get-patients"
import { useHeaderStore } from "@/hooks/use-header-store"
import { PatientsRecordsTableFilters } from "./components/patients-records-table-filters"
import { UserAvatar } from "@/components/user-avatar"

export default function PatientsRecords() {
    const navigate = useNavigate()
    const [search, setSearch] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const [status, setStatus] = useState("all")
    const [gender, setGender] = useState("all")
    const [order, setOrder] = useState("all")
    const { setTitle } = useHeaderStore()

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search)
        }, 400)
        return () => clearTimeout(handler)
    }, [search])

    const { data: result, isLoading, isFetching } = useQuery({
        queryKey: ["patients-records-list", debouncedSearch, status, gender, order],
        queryFn: () => getPatients({
            pageIndex: 0,
            perPage: 100,
            filter: debouncedSearch,
            status: status,
            gender: gender,
            order: order
        }),
        placeholderData: (previousData) => previousData,
    })

    useEffect(() => {
        setTitle('Prontuários de Pacientes')
    }, [setTitle])

    const patients = useMemo(() => result?.patients ?? [], [result])

    const handleOpenRecord = (patientId: string) => {
        const queueIds = patients.map(p => p.id)
        sessionStorage.setItem("active_patient_queue", JSON.stringify(queueIds))
        navigate(`/patients/${patientId}/details`)
    }

    const handleClearFilters = () => {
        setSearch("")
        setStatus("all")
        setGender("all")
        setOrder("all")
    }

    return (
        <>
            <Helmet title="Prontuários de Pacientes" />

            <div className="flex flex-col gap-4">
                <header className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <ClipboardList className="size-6 text-blue-600" />
                        Prontuários Eletrônicos
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        Busque e acesse rapidamente o histórico clínico de seus pacientes.
                    </p>
                </header>

                <PatientsRecordsTableFilters
                    search={search}
                    onSearchChange={setSearch}
                    status={status}
                    onStatusChange={setStatus}
                    gender={gender}
                    onGenderChange={setGender}
                    order={order}
                    onOrderChange={setOrder}
                    onClearFilters={handleClearFilters}
                    isFetching={isFetching}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {isLoading ? (
                        <RecordSkeleton />
                    ) : patients.length > 0 ? (
                        patients.map((patient) => (
                            <Card
                                key={patient.id}
                                className="group hover:border-blue-500/50 transition-all cursor-pointer bg-card shadow-sm min-w-0 overflow-hidden"
                                onClick={() => handleOpenRecord(patient.id)}
                            >
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <UserAvatar
                                            src={patient.profileImageUrl}
                                            name={patient.name}
                                            className="size-10 border-blue-100 shadow-sm"
                                        />

                                        <div className="flex flex-col">
                                            <span className="font-semibold text-sm group-hover:text-blue-600 transition-colors line-clamp-1">
                                                {patient.name}
                                            </span>
                                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase font-bold">
                                                <Clock className="size-3 text-blue-500/70" />
                                                {patient.lastSessionAt ? (
                                                    `Última sessão: ${formatDistanceToNow(parseISO(patient.lastSessionAt), {
                                                        addSuffix: true,
                                                        locale: ptBR,
                                                    })}`
                                                ) : (
                                                    "Sem sessões registradas"
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <ChevronRight className="size-4 text-muted-foreground group-hover:text-blue-500 transition-transform group-hover:translate-x-1" />
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-full py-20 flex flex-col items-center text-muted-foreground border-2 border-dashed rounded-2xl">
                            <FilterX className="size-10 mb-2 opacity-20" />
                            <p className="text-sm">Nenhum prontuário encontrado.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

function RecordSkeleton() {
    return (
        <>
            {[1, 2, 3, 4, 5, 6].map(i => (
                <Skeleton key={i} className="h-[72px] w-full rounded-xl" />
            ))}
        </>
    )
}