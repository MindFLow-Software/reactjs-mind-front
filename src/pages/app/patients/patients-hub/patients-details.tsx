'use client';

import { useNavigate, useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { useState, useEffect, useMemo } from "react"
import {
    FileSearch, AlertCircle, Loader2, Plus, Download, MoreVertical, Printer, Trash2, MoveLeft
} from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
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
import { AnamnesisTab } from "@/pages/app/patients/patients-hub/components/anamnesis-form";
import { PatientResumeTab } from "./components/patient-resume-tab";

export default function PatientDetails() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { setTitle, setSubtitle } = useHeaderStore()

    const [pageIndex, setPageIndex] = useState(0)
    const [currentTab, setCurrentTab] = useState("clinical")

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
        const s = String(patientData.status).toLowerCase()
        return patientData.isActive === true || s === 'active' || s === 'ativo'
    }, [patientData])

    const patientFullName = useMemo(() =>
        patientData ? `${patientData.firstName} ${patientData.lastName}` : ""
        , [patientData])

    useEffect(() => {
        setTitle("Cadastro de Pacientes")
        if (patientFullName) {
            setSubtitle(patientFullName)
        }
        return () => setSubtitle(undefined)
    }, [patientFullName, setTitle, setSubtitle])

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center h-[400px] gap-4">
                <AlertCircle className="h-10 w-10 text-destructive/50" />
                <div className="text-center">
                    <p className="text-destructive font-medium">Erro ao carregar detalhes do paciente 😕</p>
                    <p className="text-muted-foreground text-sm">Verifique a conexão ou o ID informado.</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                    Tentar novamente
                </Button>
            </div>
        )
    }

    if (isLoading || !patientData || !meta) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer group"
                    >
                        <MoveLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Voltar para listagem</span>
                    </button>

                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="h-8 gap-1.5 text-muted-foreground bg-transparent cursor-pointer">
                            <Download className="size-3.5" />
                            <span className="hidden md:inline">Exportar</span>
                        </Button>

                        <Button size="sm" className="h-8 gap-1.5 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
                            <Plus className="size-3.5" />
                            <span>Nova Sessão</span>
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="size-8 p-0 cursor-pointer">
                                    <MoreVertical className="size-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem className="gap-2 cursor-pointer">
                                    <Printer className="size-4" /> Imprimir prontuário
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive cursor-pointer">
                                    <Trash2 className="size-4" /> Arquivar paciente
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                <Separator />
            </div>

            <PatientDetailsHeader
                patient={{
                    ...patientData,
                    status: isPatientActive ? 'active' : 'inactive'
                }}
            />

            <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
                <TabsList className="bg-muted/60 p-1 rounded-lg w-full sm:w-auto">
                    {/* Nome alterado de "Prontuário" para "Dados Cadastrais" */}
                    <TabsTrigger value="clinical" className="cursor-pointer rounded-md px-4 py-1.5 text-xs">Dados Cadastrais</TabsTrigger>
                    <TabsTrigger value="anamnesis" className="cursor-pointer rounded-md px-4 py-1.5 text-xs">Anamnese</TabsTrigger>
                    <TabsTrigger value="timeline" className="cursor-pointer rounded-md px-4 py-1.5 text-xs">Histórico</TabsTrigger>
                    <TabsTrigger value="docs" className="cursor-pointer rounded-md px-4 py-1.5 text-xs">Arquivos</TabsTrigger>
                    <TabsTrigger value="resume" className="cursor-pointer rounded-md px-4 py-1.5 text-xs">Resumo</TabsTrigger>
                </TabsList>

                <TabsContent value="clinical" className="mt-4">
                    <PatientInfo
                        patient={{
                            ...patientData,
                            name: patientFullName,
                            isActive: isPatientActive,
                            status: isPatientActive ? 'Ativo' : 'Inativo',
                            createdAt: (patientData as any).createdAt ?? new Date().toISOString(),
                            cpf: patientData.cpf ?? "",
                            email: patientData.email ?? "",
                            phoneNumber: patientData.phoneNumber ?? "",
                            dateOfBirth: patientData.dateOfBirth ?? "",
                            gender: (patientData.gender as any) ?? "OTHER",
                            totalAppointments: meta.totalCount
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
                        <p className="text-sm font-semibold text-foreground">Repositório de Documentos</p>
                        <p className="text-xs text-muted-foreground mt-1">Upload de exames e laudos em breve.</p>
                    </div>
                </TabsContent>
                <TabsContent value="resume" className="mt-4">
                    <PatientResumeTab meta={meta} />
                </TabsContent>
            </Tabs>
        </div>
    )
}