"use client"

import { useMemo, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { ClipboardList } from "lucide-react"
import { Helmet } from "react-helmet-async"

import { getPatients, type GetPatientsFilters } from "@/api/patients/get-patients"
import { useHeaderStore } from "@/hooks/use-header-store"
import { PatientsDataBlock } from "../components/patients-data-block"
import { PatientsPageShell } from "../components/patients-page-shell"
import { usePatientRecordsFilters } from "@/hooks/use-patient-records-filters"
import { PatientCard } from "./components/patient-card"
import { RecordsSkeleton } from "./components/records-skeleton"
import { RecordsEmptyState } from "./components/records-empty-state"
import { PatientsRecordsTableFilters } from "./components/patients-records-table-filters"

export default function PatientsRecords() {
    const navigate = useNavigate()
    const { setTitle } = useHeaderStore()

    const {
        search,
        debouncedSearch,
        gender,
        sessionOrder,
        setSearch,
        setGender,
        setSessionOrder,
        clearFilters,
    } = usePatientRecordsFilters()

    const { data: result, isLoading, isFetching } = useQuery({
        queryKey: ["patients-records-list", debouncedSearch, gender, sessionOrder],
        queryFn: () => getPatients({
            pageIndex: 0,
            perPage: 100,
            filter: debouncedSearch || undefined,
            gender: gender as GetPatientsFilters["gender"],
            sessionVolume: sessionOrder,
        }),
        placeholderData: (previousData) => previousData,
    })

    useEffect(() => {
        setTitle("Prontuarios de Pacientes")
    }, [setTitle])

    const patients = useMemo(() => result?.patients ?? [], [result])

    const handleOpenRecord = (patientId: string) => {
        const queueIds = patients.map((p) => p.id)
        sessionStorage.setItem("active_patient_queue", JSON.stringify(queueIds))
        sessionStorage.setItem("active_patient_queue_source", "patients-records")
        navigate(`/patients/${patientId}/details`, { state: { from: "patients-records" } })
    }

    return (
        <>
            <Helmet title="Prontuarios de Pacientes" />

            <PatientsPageShell
                title="Prontuarios Eletronicos"
                description="Busque e acesse rapidamente o historico clinico de seus pacientes."
                icon={<ClipboardList className="size-6 text-blue-600" />}
                contentClassName="p-4"
            >
                <PatientsDataBlock
                    title="Pacientes com prontuario"
                    description="Filtre por status, genero, cadastro e volume de sessoes."
                    toolbar={
                        <PatientsRecordsTableFilters
                            search={search}
                            onSearchChange={setSearch}
                            gender={gender}
                            onGenderChange={setGender}
                            sessionOrder={sessionOrder}
                            onSessionOrderChange={setSessionOrder}
                            onClearFilters={clearFilters}
                            isFetching={isFetching}
                        />
                    }
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {isLoading ? (
                            <RecordsSkeleton />
                        ) : patients.length > 0 ? (
                            patients.map((patient) => (
                                <PatientCard
                                    key={patient.id}
                                    patient={patient}
                                    onOpen={handleOpenRecord}
                                />
                            ))
                        ) : (
                            <RecordsEmptyState />
                        )}
                    </div>
                </PatientsDataBlock>
            </PatientsPageShell>
        </>
    )
}
