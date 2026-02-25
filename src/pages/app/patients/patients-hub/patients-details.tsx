"use client"

import { useLocation, useNavigate, useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { useState, useEffect, useMemo } from "react"
import {
    FileSearch,
    AlertCircle,
    Plus,
    Download,
    MoreVertical,
    Printer,
    Trash2,
    MoveLeft,
} from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { getPatientDetails } from "@/api/get-patient-details"
import { PatientDetailsHeader } from "./components/patient-details-header"
import { useHeaderStore } from "@/hooks/use-header-store"
import { PatientInfo } from "./components/patient-Info"
import { PatientSessionsTimeline } from "./components/patient-sessions-timeline"
import { AnamnesisTab } from "./components/anamnesis-form"
import { PatientResumeTab } from "./components/patient-resume-tab"
import { PatientsDetailsLoading } from "./components/loading"
import { PatientsDataBlock } from "../components/patients-data-block"
import { PatientsPageShell } from "../components/patients-page-shell"
import { PatientNavigationControls } from "../patients-records/components/patient-navigation-controls"

const HUB_TABS = [
    { value: "clinical", label: "Dados Cadastrais" },
    { value: "anamnesis", label: "Anamnese" },
    { value: "timeline", label: "Historico" },
    { value: "docs", label: "Arquivos" },
    { value: "resume", label: "Resumo" },
] as const

function HubActions() {
    return (
        <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 gap-1.5 text-muted-foreground bg-transparent cursor-pointer">
                <Download className="size-3.5" />
                <span className="hidden md:inline">Exportar</span>
            </Button>

            <Button size="sm" className="h-8 gap-1.5 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
                <Plus className="size-3.5" />
                <span>Nova Sessao</span>
            </Button>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="size-8 p-0 cursor-pointer">
                        <MoreVertical className="size-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem className="gap-2 cursor-pointer">
                        <Printer className="size-4" /> Imprimir prontuario
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive cursor-pointer">
                        <Trash2 className="size-4" /> Arquivar paciente
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default function PatientDetails() {
    const { id } = useParams<{ id: string }>()
    const location = useLocation()
    const navigate = useNavigate()
    const { setTitle, setSubtitle } = useHeaderStore()

    const [pageIndex, setPageIndex] = useState(0)
    const [currentTab, setCurrentTab] = useState("clinical")
    const [patientQueue, setPatientQueue] = useState<string[]>([])

    const { data: result, isLoading, isError } = useQuery({
        queryKey: ["patient-details", id, pageIndex],
        queryFn: () => getPatientDetails(id!, pageIndex),
        enabled: !!id,
        staleTime: 1000 * 60 * 5,
    })

    const patientData = useMemo(() => result?.patient, [result])
    const meta = useMemo(() => result?.meta, [result])

    const isPatientActive = useMemo(() => {
        if (!patientData) return false
        const status = String(patientData.status).toLowerCase()
        return patientData.isActive === true || status === "active" || status === "ativo"
    }, [patientData])

    const patientFullName = useMemo(
        () => (patientData ? `${patientData.firstName} ${patientData.lastName}` : ""),
        [patientData]
    )

    const cameFromRecords = useMemo(() => {
        const fromState = (location.state as { from?: string } | null)?.from
        if (fromState === "patients-records") return true
        if (fromState === "patients-list") return false
        return sessionStorage.getItem("active_patient_queue_source") === "patients-records"
    }, [location.state])

    useEffect(() => {
        if (cameFromRecords) {
            setTitle("Prontuarios de Pacientes", "/patients-records")
        } else {
            setTitle("Cadastro de Pacientes", "/patients-list")
        }
        if (patientFullName) setSubtitle(patientFullName)
        return () => setSubtitle(undefined)
    }, [cameFromRecords, patientFullName, setTitle, setSubtitle])

    useEffect(() => {
        try {
            const rawQueue = sessionStorage.getItem("active_patient_queue")
            if (!rawQueue) {
                setPatientQueue([])
                return
            }

            const parsedQueue = JSON.parse(rawQueue)
            if (Array.isArray(parsedQueue)) {
                setPatientQueue(parsedQueue.filter((item): item is string => typeof item === "string"))
                return
            }

            setPatientQueue([])
        } catch {
            setPatientQueue([])
        }
    }, [id])

    const queueIndex = useMemo(() => {
        if (!id || patientQueue.length === 0) return -1
        return patientQueue.indexOf(id)
    }, [id, patientQueue])

    const prevPatientId = queueIndex > 0 ? patientQueue[queueIndex - 1] : null
    const nextPatientId =
        queueIndex >= 0 && queueIndex < patientQueue.length - 1 ? patientQueue[queueIndex + 1] : null

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center h-[400px] gap-4">
                <AlertCircle className="h-10 w-10 text-destructive/50" />
                <div className="text-center">
                    <p className="text-destructive font-medium">Erro ao carregar detalhes do paciente.</p>
                    <p className="text-muted-foreground text-sm">Verifique a conexao ou o ID informado.</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                    Tentar novamente
                </Button>
            </div>
        )
    }

    if (isLoading || !patientData || !meta) {
        return <PatientsDetailsLoading />
    }

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex w-fit items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer group"
                >
                    <MoveLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Voltar para listagem de pacientes</span>
                </button>

                {patientQueue.length > 1 && queueIndex >= 0 && (
                    <PatientNavigationControls
                        prevId={prevPatientId}
                        nextId={nextPatientId}
                        current={queueIndex + 1}
                        total={patientQueue.length}
                    />
                )}
            </div>

            <PatientsPageShell
                title="Hub do Paciente"
                description="Acompanhamento clinico, historico de sessoes e documentos em um unico lugar."
                icon={<FileSearch className="size-5 text-blue-600" />}
                headerRight={<HubActions />}
                contentClassName="border-0 bg-transparent shadow-none p-0 md:p-0 overflow-visible"
            >
                <PatientsDataBlock
                    title="Prontuario e acompanhamento"
                    description="Navegue entre dados cadastrais, anamnese, historico, arquivos e resumo clinico."
                    className="w-full rounded-2xl bg-card px-5 py-5 md:px-6 md:py-6 shadow-sm space-y-6"
                >
                <div className="pb-5 border-b border-border/60">
                    <PatientDetailsHeader
                        patient={{
                            ...patientData,
                            status: isPatientActive ? "active" : "inactive",
                        }}
                    />
                </div>

                <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
                    <TabsList className="bg-muted/40 p-1 rounded-xl w-full lg:w-auto flex flex-wrap h-auto gap-1">
                        {HUB_TABS.map((tab) => (
                            <TabsTrigger key={tab.value} value={tab.value} className="cursor-pointer rounded-md px-4 py-1.5 text-xs">
                                {tab.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    <TabsContent value="clinical" className="mt-4">
                        <PatientInfo
                            patient={{
                                dateOfBirth: patientData.dateOfBirth,
                                cpf: patientData.cpf,
                                email: patientData.email,
                                phoneNumber: patientData.phoneNumber,
                            }}
                        />
                    </TabsContent>

                    <TabsContent value="anamnesis" className="mt-4">
                        <AnamnesisTab patientId={id!} />
                    </TabsContent>

                    <TabsContent value="timeline" className="mt-4">
                        <PatientSessionsTimeline
                            sessions={patientData.sessions}
                            meta={meta}
                            pageIndex={pageIndex}
                            onPageChange={setPageIndex}
                            patientName={patientFullName}
                        />
                    </TabsContent>

                    <TabsContent value="docs" className="mt-4">
                        <div className="flex flex-col items-center py-10 text-center border border-dashed rounded-xl bg-muted/5">
                            <FileSearch className="size-8 text-muted-foreground/50 mb-3" />
                            <p className="text-sm font-semibold text-foreground">Repositorio de Documentos</p>
                            <p className="text-xs text-muted-foreground mt-1">Upload de exames e laudos em breve.</p>
                        </div>
                    </TabsContent>

                    <TabsContent value="resume" className="mt-4">
                        <PatientResumeTab meta={meta} />
                    </TabsContent>
                </Tabs>
                </PatientsDataBlock>
            </PatientsPageShell>
        </div>
    )
}
