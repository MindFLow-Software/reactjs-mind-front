'use client';

import { useNavigate, useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { useState, useEffect, useMemo } from "react"
import {
    Activity, DollarSign, ShieldCheck, Lock, FileSearch,
    AlertCircle, Loader2, Plus, Download, MoreVertical, Printer, Trash2, MoveLeft
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { MetricCard } from "./components/metric-card"
import { PatientInfo } from "./components/patient-Info"
import { PatientSessionsTimeline } from "./components/patient-sessions-timeline"

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
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer group"
                    >
                        <MoveLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs font-medium uppercase tracking-wider">Voltar para listagem</span>
                    </button>

                    <div className="flex items-center gap-2">
                        <div className="hidden sm:flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-1.5 text-muted-foreground bg-transparent cursor-pointer"
                            >
                                <Download className="size-3.5" />
                                <span className="hidden md:inline">Exportar</span>
                            </Button>
                        </div>

                        <Button
                            size="sm"
                            className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                        >
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <MetricCard
                    title="Sessões Totais"
                    value={meta.totalCount}
                    subLabel="Duração média"
                    subValue={meta.averageDuration}
                    icon={Activity}
                />

                <Card className="shadow-sm border-border">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[11px] uppercase text-muted-foreground flex items-center gap-2 font-semibold tracking-wide">
                            <div className="flex items-center justify-center size-5 rounded bg-emerald-100 text-emerald-600">
                                <DollarSign className="size-3" />
                            </div>
                            Financeiro
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-foreground tabular-nums">R$ --</p>
                        <p className="text-xs text-emerald-600 font-medium mt-1">Regularizado</p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-border sm:col-span-2 lg:col-span-1">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[11px] uppercase text-muted-foreground flex items-center gap-2 font-semibold tracking-wide">
                            <div className="flex items-center justify-center size-5 rounded bg-amber-100 text-amber-600">
                                <ShieldCheck className="size-3" />
                            </div>
                            Segurança
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-between items-end">
                        <div>
                            <p className="text-sm font-semibold text-foreground">Dados Criptografados</p>
                            <p className="text-xs text-muted-foreground mt-0.5">Conformidade LGPD ativa</p>
                        </div>
                        <Lock className="size-5 text-amber-400/40" />
                    </CardContent>
                </Card>
            </div>

            <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
                <TabsList className="bg-muted/60 p-1 rounded-lg w-full sm:w-auto">
                    <TabsTrigger value="clinical" className="cursor-pointer rounded-md px-6 text-sm">Prontuário</TabsTrigger>
                    <TabsTrigger value="timeline" className="cursor-pointer rounded-md px-6 text-sm">Histórico</TabsTrigger>
                    <TabsTrigger value="docs" className="cursor-pointer rounded-md px-6 text-sm">Arquivos</TabsTrigger>
                </TabsList>

                <TabsContent value="clinical" className="mt-6">
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

                <TabsContent value="timeline" className="mt-6">
                    <PatientSessionsTimeline
                        sessions={patientData.sessions}
                        meta={meta}
                        pageIndex={pageIndex}
                        onPageChange={setPageIndex}
                        patientName={patientFullName}
                    />
                </TabsContent>

                <TabsContent value="docs" className="mt-6">
                    <div className="flex flex-col items-center py-20 text-center border border-dashed rounded-xl bg-muted/5">
                        <div className="flex items-center justify-center size-12 rounded-full bg-muted mb-4">
                            <FileSearch className="size-5 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-semibold text-foreground">Repositório de Documentos</p>
                        <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                            Upload de exames, laudos e outros documentos em breve.
                        </p>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}