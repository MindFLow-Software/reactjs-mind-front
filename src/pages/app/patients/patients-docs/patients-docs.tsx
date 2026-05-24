"use client"

import { useEffect, useMemo, useState } from "react"
import { Helmet } from "react-helmet-async"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { FolderOpen, HardDrive, Clock, Archive, Download, Upload } from "lucide-react"
import { toast } from "sonner"

import { PaginationDocsPatients } from "@/components/pagination-docs-patients"

import { useHeaderStore } from "@/hooks/use-header-store"
import { getAllAttachments, deleteAttachment } from "@/api/attachments/attachments"
import { PatientsDataBlock } from "../components/patients-data-block"
import { PatientsPageShell } from "../components/patients-page-shell"
import { AttachmentsTableFilters } from "./components/attachments-table-filters"
import { AttachmentsTable } from "./components/attachments-table"
import { PreviewDrawer } from "./components/preview-drawer"
import { UploadModal } from "./components/upload-modal"
import type { DateRange } from "react-day-picker"
import type { Attachment } from "@/api/attachments/attachments"
import { cn } from "@/lib/utils"

function formatBytes(bytes: number | undefined | null) {
    const value = Number(bytes)
    if (isNaN(value) || value <= 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.min(Math.floor(Math.log(value) / Math.log(k)), sizes.length - 1)
    return `${parseFloat((value / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

interface MetricCardProps {
    icon: React.ReactNode
    iconBg: string
    value: string | number
    label: string
    sub?: string
}

function MetricCard({ icon, iconBg, value, label, sub }: MetricCardProps) {
    return (
        <div className="flex items-center gap-4 rounded-xl border bg-card px-5 py-4 shadow-sm">
            <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full", iconBg)}>
                {icon}
            </div>
            <div className="flex flex-col gap-0.5">
                <span className="text-2xl font-bold tabular-nums leading-none">{value}</span>
                <span className="text-xs text-muted-foreground font-medium">{label}</span>
                {sub && <span className="text-[11px] text-muted-foreground font-medium">{sub}</span>}
            </div>
        </div>
    )
}

export function PatientDocuments() {
    const { setTitle } = useHeaderStore()
    const queryClient = useQueryClient()

    const [pageIndex, setPageIndex] = useState(0)
    const [search, setSearch] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const [patientId, setPatientId] = useState("all")
    const [date, setDate] = useState<DateRange | undefined>()
    const [contentType, setContentType] = useState<string | undefined>()
    const [previewDoc, setPreviewDoc] = useState<Attachment | null>(null)
    const [uploadOpen, setUploadOpen] = useState(false)

    useEffect(() => {
        setTitle("Gestão de Documentos")
    }, [setTitle])

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search)
            setPageIndex(0)
        }, 220)
        return () => clearTimeout(handler)
    }, [search])

    const { data: result, isLoading, isError } = useQuery({
        queryKey: ["all-attachments", pageIndex, debouncedSearch, patientId, date, contentType],
        queryFn: () => getAllAttachments({
            page:        pageIndex,
            filter:      debouncedSearch || undefined,
            patientId:   patientId === "all" ? undefined : patientId,
            from:        date?.from?.toISOString(),
            to:          date?.to?.toISOString(),
            contentType: contentType || undefined,
        }),
        staleTime: 1000 * 60 * 5,
        placeholderData: (prev) => prev,
    })

    const { mutateAsync: deleteFn } = useMutation({
        mutationFn: deleteAttachment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["all-attachments"] })
            queryClient.invalidateQueries({ queryKey: ["patients-with-attachments"] })
            toast.success("Documento removido.")
        },
    })

    const attachments = useMemo(() => result?.attachments ?? [], [result])
    const meta = useMemo(() => result?.meta ?? {
        pageIndex,
        perPage: 10,
        totalCount: 0,
        totalStorageSize: 0,
    }, [result, pageIndex])

    const handleClearFilters = () => {
        setSearch("")
        setPatientId("all")
        setDate(undefined)
        setContentType(undefined)
        setPageIndex(0)
    }

    const btnSecondary = cn(
        "flex h-9 cursor-pointer items-center gap-2 rounded-xl px-4",
        "border border-border bg-background text-[13px] font-medium",
        "shadow-sm transition-all hover:bg-muted hover:-translate-y-px active:scale-[0.98]",
    )

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center h-[400px] gap-4">
                <p className="text-destructive font-medium">Erro ao carregar documentos.</p>
                <button onClick={() => window.location.reload()} className="text-sm underline text-muted-foreground hover:text-foreground">
                    Tentar novamente
                </button>
            </div>
        )
    }

    const headerRight = (
        <div className="flex items-center gap-2">
            <button type="button" className={btnSecondary}>
                <Download className="h-4 w-4" />
                Exportar tudo
            </button>
            <button
                type="button"
                onClick={() => setUploadOpen(true)}
                className={cn(
                    "flex h-9 cursor-pointer items-center gap-2 rounded-xl px-4",
                    "bg-blue-600 text-[13px] font-medium text-white",
                    "shadow-[0_2px_8px_rgba(37,99,235,0.25)] transition-all",
                    "hover:bg-blue-700 hover:-translate-y-px active:scale-[0.98]",
                )}
            >
                <Upload className="h-4 w-4" />
                Enviar documento
            </button>
        </div>
    )

    return (
        <>
            <Helmet title="Documentos - MindFlush" />

            <PatientsPageShell
                title="Gestão de Documentos"
                description="Gerencie os anexos clínicos — busque, filtre, visualize e mantenha tudo organizado."
                icon={<FolderOpen className="size-6 text-blue-600" />}
                headerRight={headerRight}
                contentClassName="p-0"
            >
                {/* Metric cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 px-6 pt-2 pb-0">
                    <MetricCard
                        icon={<FolderOpen className="h-5 w-5 text-blue-600" />}
                        iconBg="bg-blue-500/10"
                        value={meta.totalCount}
                        label="Total de arquivos"
                    />
                    <MetricCard
                        icon={<HardDrive className="h-5 w-5 text-emerald-600" />}
                        iconBg="bg-emerald-500/10"
                        value={formatBytes(meta.totalStorageSize)}
                        label="Armazenamento usado"
                    />
                    <MetricCard
                        icon={<Clock className="h-5 w-5 text-amber-600" />}
                        iconBg="bg-amber-500/10"
                        value="—"
                        label="Pendentes de revisão"
                    />
                    <MetricCard
                        icon={<Archive className="h-5 w-5 text-slate-500" />}
                        iconBg="bg-slate-500/10"
                        value="—"
                        label="Arquivados (90+ dias)"
                    />
                </div>

                {/* Table section */}
                <div className="px-6 py-4">
                    <PatientsDataBlock
                        title="Documentos anexados"
                        description={`Mostrando ${meta.totalCount > 0 ? Math.min(meta.perPage, meta.totalCount) : 0} de ${meta.totalCount} documentos`}
                        toolbar={
                            <AttachmentsTableFilters
                                search={search}
                                onSearchChange={setSearch}
                                patientId={patientId}
                                onPatientChange={(val) => { setPatientId(val); setPageIndex(0) }}
                                date={date}
                                onDateChange={(val) => { setDate(val); setPageIndex(0) }}
                                contentType={contentType}
                                onContentTypeChange={(val) => { setContentType(val); setPageIndex(0) }}
                                onClearFilters={handleClearFilters}
                            />
                        }
                        footer={meta.totalCount > 0 ? (
                            <PaginationDocsPatients
                                pageIndex={meta.pageIndex}
                                totalCount={meta.totalCount}
                                perPage={meta.perPage}
                                onPageChange={setPageIndex}
                            />
                        ) : null}
                    >
                        <AttachmentsTable
                            attachments={attachments}
                            isLoading={isLoading}
                            onDelete={deleteFn}
                            onPreview={setPreviewDoc}
                            previewDocId={previewDoc?.id}
                        />
                    </PatientsDataBlock>
                </div>
            </PatientsPageShell>

            <PreviewDrawer
                doc={previewDoc}
                onClose={() => setPreviewDoc(null)}
                onDelete={(id) => {
                    deleteFn(id)
                    setPreviewDoc(null)
                }}
            />

            <UploadModal
                open={uploadOpen}
                onClose={() => setUploadOpen(false)}
                onSuccess={() => {
                    queryClient.invalidateQueries({ queryKey: ["all-attachments"] })
                    queryClient.invalidateQueries({ queryKey: ["patients-with-attachments"] })
                }}
            />
        </>
    )
}
