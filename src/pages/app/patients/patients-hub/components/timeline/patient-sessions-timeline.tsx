"use client"

import { useState, useMemo } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
    History, Search, Pencil, Copy, MoreHorizontal,
    Download, Loader2, Clock, CalendarDays, ListFilter,
} from "lucide-react"
import { pdf } from "@react-pdf/renderer"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Pagination } from "./sessions-pagination"
import { SessionPDFTemplate } from "@/utils/session-pdf-template"
import { cn } from "@/lib/utils"

interface Session {
    id: string
    sessionDate?: string | Date | null
    createdAt: string | Date
    status: string
    theme?: string | null
    content?: string | null
    duration?: string | number | null
}

interface PatientSessionsTimelineProps {
    sessions: Session[]
    patientName: string
    meta: {
        totalCount: number
        perPage: number
    }
    pageIndex: number
    onPageChange: (newIndex: number) => void
}

type StatusFilter = "all" | "Concluída" | "Cancelada" | "Falta"

const STATUS_DOT: Record<string, string> = {
    Concluída: "bg-blue-500",
    Cancelada: "bg-red-500",
    Pendente: "bg-gray-400",
    Falta: "bg-amber-400",
}

const CHIPS: { key: StatusFilter; label: string; matchFn: (s: string) => boolean }[] = [
    { key: "all", label: "Todas", matchFn: () => true },
    { key: "Concluída", label: "Realizadas", matchFn: (s) => s === "Concluída" },
    { key: "Cancelada", label: "Canceladas", matchFn: (s) => s === "Cancelada" },
    { key: "Falta", label: "Faltas", matchFn: (s) => s === "Falta" },
]

function getSessionDate(session: Session): Date {
    return new Date(session.sessionDate ?? session.createdAt)
}

function groupByMonth(sessions: Session[]): [string, Session[]][] {
    const map = new Map<string, Session[]>()
    for (const s of sessions) {
        const key = format(getSessionDate(s), "MMMM yyyy", { locale: ptBR }).toUpperCase()
        if (!map.has(key)) map.set(key, [])
        map.get(key)!.push(s)
    }
    return Array.from(map.entries())
}

export function PatientSessionsTimeline({
    sessions,
    patientName,
    meta,
    pageIndex,
    onPageChange,
}: PatientSessionsTimelineProps) {
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
    const [searchText, setSearchText] = useState("")

    const filtered = useMemo(() => {
        const chip = CHIPS.find((c) => c.key === statusFilter)!
        return sessions.filter((s) => {
            if (!chip.matchFn(s.status)) return false
            if (!searchText.trim()) return true
            const q = searchText.toLowerCase()
            return s.content?.toLowerCase().includes(q) || s.theme?.toLowerCase().includes(q)
        })
    }, [sessions, statusFilter, searchText])

    const chipCounts = useMemo(
        () => Object.fromEntries(CHIPS.map((c) => [c.key, sessions.filter((s) => c.matchFn(s.status)).length])),
        [sessions],
    )

    const grouped = useMemo(() => groupByMonth(filtered), [filtered])

    if (sessions.length === 0) {
        return (
            <div className="flex flex-col items-center py-24 text-muted-foreground border border-dashed rounded-2xl bg-muted/10">
                <History className="h-10 w-10 opacity-20 mb-3" />
                <p className="text-sm font-semibold">Sem histórico de sessões</p>
                <p className="text-xs">As sessões realizadas aparecerão aqui.</p>
            </div>
        )
    }

    return (
        <div className="space-y-5">
            {/* Filter bar */}
            <div className="flex flex-wrap items-center gap-3 justify-between rounded-xl border border-border/60 bg-card px-4 py-2.5">
                <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                    <Input
                        placeholder="Buscar nas anotações..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="pl-8 h-8 text-sm w-52 border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                </div>

                <div className="flex flex-wrap gap-1.5">
                    {CHIPS.map((chip) => {
                        const active = statusFilter === chip.key
                        return (
                            <button
                                key={chip.key}
                                type="button"
                                onClick={() => setStatusFilter(chip.key)}
                                className={cn(
                                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors cursor-pointer",
                                    active
                                        ? "border-blue-600 bg-blue-600 text-white"
                                        : "border-border bg-transparent text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                                )}
                            >
                                {chip.label}
                                <span
                                    className={cn(
                                        "rounded-full px-1.5 py-0.5 text-[10px] tabular-nums font-semibold",
                                        active ? "bg-white/25 text-white" : "bg-muted text-muted-foreground",
                                    )}
                                >
                                    {chipCounts[chip.key]}
                                </span>
                            </button>
                        )
                    })}
                </div>

                <div className="flex items-center gap-1.5">
                    <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs text-muted-foreground font-medium cursor-not-allowed opacity-70">
                        <CalendarDays className="h-3.5 w-3.5" />
                        Período: 6 meses
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs text-muted-foreground font-medium cursor-not-allowed opacity-70">
                        <ListFilter className="h-3.5 w-3.5" />
                        Ordenar
                    </Button>
                </div>
            </div>

            {filtered.length === 0 ? (
                <div className="flex flex-col items-center py-16 text-muted-foreground border border-dashed rounded-2xl bg-muted/5">
                    <History className="h-10 w-10 opacity-20 mb-3" />
                    <p className="text-sm font-semibold text-foreground">Nenhuma sessão encontrada</p>
                    <p className="text-xs">Tente outro filtro ou termo de busca.</p>
                </div>
            ) : (
                <div className="space-y-8 py-1">
                    {grouped.map(([month, monthSessions]) => (
                        <MonthGroup
                            key={month}
                            month={month}
                            sessions={monthSessions}
                            patientName={patientName}
                        />
                    ))}
                </div>
            )}

            <div className="pt-4 border-t">
                <Pagination
                    pageIndex={pageIndex}
                    totalCount={meta.totalCount}
                    perPage={meta.perPage}
                    onPageChange={onPageChange}
                />
            </div>
        </div>
    )
}

function MonthGroup({
    month,
    sessions,
    patientName,
}: {
    month: string
    sessions: Session[]
    patientName: string
}) {
    return (
        <div>
            {/* Month header — circle center at x=8px from parent */}
            <div className="flex items-center gap-3 mb-4">
                <span className="h-4 w-4 flex-shrink-0 rounded-full border-2 border-muted-foreground/30 bg-background" />
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground flex-1">
                    {month}
                </h3>
                <span className="text-[11px] text-muted-foreground">
                    {sessions.length} {sessions.length === 1 ? "sessão" : "sessões"}
                </span>
            </div>

            {/* Sessions — border-l center aligned with month circle (ml-2 = 8px) */}
            <div className="relative ml-2 border-l border-border/50 space-y-3">
                {sessions.map((session) => (
                    <SessionRow key={session.id} session={session} patientName={patientName} />
                ))}
            </div>
        </div>
    )
}

function SessionRow({
    session,
    patientName,
}: {
    session: Session
    patientName: string
}) {
    const [isExporting, setIsExporting] = useState(false)

    const date = getSessionDate(session)
    const dotColor = STATUS_DOT[session.status] ?? "bg-gray-400"
    const isCancelled = session.status === "Cancelada"
    const isCompleted = session.status === "Concluída"
    const isFalta = session.status === "Falta"

    const handleExportPDF = async () => {
        setIsExporting(true)
        try {
            const dateFormatted = format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
            const blob = await pdf(
                <SessionPDFTemplate
                    psychologist={{ name: "Seu Nome Profissional", crp: "06/12345-X" }}
                    patientName={patientName}
                    date={dateFormatted}
                    content={session.content || "Nenhuma nota registrada."}
                    diagnosis={session.theme || ""}
                />,
            ).toBlob()
            const url = URL.createObjectURL(blob)
            const link = document.createElement("a")
            link.href = url
            link.download = `Evolucao-${patientName.replace(/\s/g, "_")}-${session.id.substring(0, 5)}.pdf`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(url)
            toast.success("PDF baixado com sucesso!")
        } catch {
            toast.error("Erro ao gerar PDF.")
        } finally {
            setIsExporting(false)
        }
    }

    return (
        <div className="relative pl-8">
            {/* Dot on timeline line — left-0 + -translate-x-1/2 centers it on the border-l */}
            <span
                className={cn(
                    "absolute left-0 top-[18px] h-2.5 w-2.5 -translate-x-1/2 rounded-full ring-2 ring-background z-10",
                    dotColor,
                )}
            />

            <div className="group rounded-xl border border-border/50 bg-card p-4 transition-shadow hover:shadow-sm">
                {/* Top row */}
                <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="text-sm font-bold text-foreground tabular-nums">
                            {format(date, "dd/MM")}
                        </span>
                        <span className="text-sm text-muted-foreground tabular-nums">
                            {format(date, "HH:mm")}
                        </span>
                        {session.duration && (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {session.duration}min
                            </span>
                        )}
                        {isCancelled && (
                            <span className="text-xs font-medium text-red-600 dark:text-red-400">
                                × Cancelada
                            </span>
                        )}
                        {isFalta && (
                            <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                                Falta
                            </span>
                        )}
                        {session.theme && (
                            <span className="rounded-md bg-violet-100 dark:bg-violet-950/40 px-2 py-0.5 text-[11px] font-medium text-violet-700 dark:text-violet-400">
                                {session.theme}
                            </span>
                        )}
                        {isFalta && (
                            <span className="rounded-md bg-orange-100 dark:bg-orange-950/40 px-2 py-0.5 text-[11px] font-medium text-orange-700 dark:text-orange-400">
                                No-show
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                        <div className="hidden group-hover:flex items-center gap-1">
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer"
                            >
                                <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer"
                                onClick={() => {
                                    navigator.clipboard.writeText(session.content ?? "")
                                    toast.success("Notas copiadas.")
                                }}
                            >
                                <Copy className="h-3.5 w-3.5" />
                            </Button>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer"
                                >
                                    <MoreHorizontal className="h-3.5 w-3.5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                    onClick={handleExportPDF}
                                    disabled={isExporting}
                                    className="cursor-pointer"
                                >
                                    {isExporting ? (
                                        <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                                    ) : (
                                        <Download className="mr-2 h-3.5 w-3.5" />
                                    )}
                                    Exportar PDF
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {isCompleted && (
                    <div className="mt-3 space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
                            Notas da sessão
                        </p>
                        {session.content ? (
                            <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                                {session.content}
                            </p>
                        ) : (
                            <p className="text-sm italic text-muted-foreground">
                                Nenhuma nota registrada.
                            </p>
                        )}
                    </div>
                )}

                {isCancelled && (
                    <div className="mt-3 space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
                            Motivo
                        </p>
                        <p className="text-sm text-foreground/80 leading-relaxed">
                            {session.content || "—"}
                        </p>
                    </div>
                )}

                {isFalta && session.content && (
                    <div className="mt-3">
                        <p className="text-sm text-foreground/80 leading-relaxed">
                            {session.content}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
