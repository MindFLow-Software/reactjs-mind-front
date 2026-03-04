"use client"

import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { Loader2, ArrowRight, AlertCircle, History } from "lucide-react"
import { format, formatDistanceToNow, formatRelative, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"

import { getAppointments, AppointmentStatus, type Appointment } from "@/api/get-appointment"
import { Button } from "@/components/ui/button"

const PREVIEW_LIMIT = 3

const formatSessionLabel = (scheduledAt?: string) => {
    if (!scheduledAt) return "Horário indefinido"
    return format(parseISO(scheduledAt), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })
}

const formatTimeSince = (scheduledAt?: string) => {
    if (!scheduledAt) return "Sem data definida"
    return formatDistanceToNow(parseISO(scheduledAt), { locale: ptBR, addSuffix: true })
}

const extractStats = (data: Awaited<ReturnType<typeof getAppointments>> | undefined) => {
    const appointments = data?.appointments ?? []
    const pendingEvolutions = appointments.filter((appointment) => !appointment.notes?.trim())
    const preview = pendingEvolutions.slice(0, PREVIEW_LIMIT)
    const latestSession = appointments[0]
    const lastSessionText = latestSession?.scheduledAt
        ? formatRelative(parseISO(latestSession.scheduledAt), new Date(), { locale: ptBR })
        : null

    const totalFinished = data?.meta?.totalCount ?? appointments.length

    return {
        preview,
        pendingCount: pendingEvolutions.length,
        totalFinished,
        lastSessionText,
    }
}

export function PendingEvolutionsWidget() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["dashboard", "pending-evolutions"],
        queryFn: () =>
            getAppointments({
                perPage: 100,
                status: AppointmentStatus.FINISHED,
                orderBy: "desc",
            }),
        staleTime: 1000 * 60 * 5,
    })

    const { preview, pendingCount, totalFinished, lastSessionText } = useMemo(
        () => extractStats(data),
        [data],
    )

    const pendingRatio = totalFinished ? Math.min(100, Math.round((pendingCount / totalFinished) * 100)) : 0
    const hasPending = pendingCount > 0

    return (
        <div className="relative group overflow-hidden rounded-[2rem] border border-zinc-200 bg-white p-1 shadow-xl shadow-zinc-200/50 h-full flex flex-col">
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />
            <div className="absolute -bottom-24 -left-12 w-56 h-56 bg-amber-100/60 blur-[120px] rounded-full" />

            <div className="relative bg-white/40 backdrop-blur-2xl rounded-[1.8rem] p-6 h-full flex flex-col">
                <header className="flex justify-between items-end mb-6 px-2">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-amber-600 mb-2">
                            <AlertCircle className="size-4" />
                            <span className="text-[10px] font-bold tracking-[0.3em] uppercase">Registros</span>
                        </div>
                        <h2 className="text-3xl font-light tracking-tight text-zinc-900 italic">
                            Evoluções <span className="font-serif font-normal not-italic text-amber-600">Pendentes</span>
                        </h2>
                    </div>
                    <div className="text-right">
                        <span className="text-4xl font-serif text-zinc-900 leading-none">{pendingCount}</span>
                        <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Total</p>
                    </div>
                </header>

                <div className="flex-1 flex flex-col gap-5">
                    <div className="rounded-2xl border border-zinc-100/70 bg-zinc-50/80 p-4 shadow-sm">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <p className="text-sm font-semibold text-zinc-800 leading-tight">
                                    {hasPending
                                        ? "Há registros finalizados aguardando notas detalhadas."
                                        : "Todos os relatos estão atualizados."}
                                </p>
                                {lastSessionText && (
                                    <div className="flex items-center gap-2 text-zinc-500 pt-2">
                                        <History className="size-3" />
                                        <span className="text-[11px] font-medium leading-none capitalize">
                                            Último registro {lastSessionText}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col items-end text-right">
                                <span className="text-[11px] uppercase tracking-[0.3em] text-zinc-400">Pendências</span>
                                <span className="text-2xl font-serif text-amber-600">{pendingRatio}%</span>
                                <p className="text-[10px] text-zinc-400">da última página</p>
                            </div>
                        </div>
                        <div className="mt-3 h-1.5 w-full rounded-full bg-zinc-100">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-600 transition-all"
                                style={{ width: `${pendingRatio}%` }}
                            />
                        </div>
                    </div>

                    <div className="flex-1">
                        {isLoading ? (
                            <div className="flex h-48 items-center justify-center">
                                <Loader2 className="size-8 animate-spin text-zinc-300" />
                            </div>
                        ) : hasPending ? (
                            <ul className="space-y-3">
                                {preview.map((appointment) => (
                                    <PendingEvolutionRow key={appointment.id} appointment={appointment} />
                                ))}
                            </ul>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-48 rounded-2xl border border-amber-50 bg-amber-50/60 text-center text-sm text-zinc-500">
                                <p className="text-base font-semibold text-amber-600">Sem pendências</p>
                                <p className="text-xs uppercase tracking-[0.3em] mt-2 text-zinc-400">
                                    Sem registros aguardando notas
                                </p>
                            </div>
                        )}
                    </div>

                    {isError && (
                        <p className="text-[10px] text-red-500 font-bold uppercase tracking-tighter bg-red-50 p-2 rounded-lg">
                            Erro ao sincronizar registros.
                        </p>
                    )}
                </div>

                <footer className="mt-6 pt-4 border-t border-zinc-100">
                    <Button variant="link" className="text-zinc-400 hover:text-amber-600 group/btn p-0 h-auto no-underline w-fit" asChild>
                        <a href="/patients-records" className="flex items-center">
                            <span className="text-xs uppercase tracking-[0.2em] font-black">Acessar prontuários</span>
                            <ArrowRight className="ml-2 size-3 group-hover/btn:translate-x-1 transition-transform" />
                        </a>
                    </Button>
                </footer>
            </div>
        </div>
    )
}

function PendingEvolutionRow({ appointment }: { appointment: Appointment }) {
    return (
        <li className="rounded-2xl border border-amber-100/60 bg-gradient-to-br from-amber-50/80 to-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-sm font-semibold text-zinc-900">{appointment.patientName || "Paciente anônimo"}</p>
                    <p className="text-[11px] uppercase tracking-[0.3em] text-amber-600">{appointment.status}</p>
                </div>
                <p className="text-[11px] font-semibold text-zinc-500">{formatSessionLabel(appointment.scheduledAt)}</p>
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] text-zinc-500">
                <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-amber-400" />
                    <span className="font-medium">Notas pendentes</span>
                </div>
                <span className="text-xs uppercase tracking-[0.3em] text-zinc-400">
                    {formatTimeSince(appointment.scheduledAt)}
                </span>
            </div>
        </li>
    )
}
