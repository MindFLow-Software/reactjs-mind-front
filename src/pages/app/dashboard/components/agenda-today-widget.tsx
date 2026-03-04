"use client"

import { useMemo } from "react"
import { format, isToday, parseISO } from "date-fns"
import { useNavigate, Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, ArrowRight, Video, FileText, Calendar } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import {
    getActiveAppointmentsGrouped,
    AppointmentStatus,
} from "@/api/get-active-appointments-grouped"

const MAX_ITEMS = 5

export function AgendaTodayWidget() {
    const navigate = useNavigate()

    const { data, isLoading } = useQuery({
        queryKey: ["dashboard", "agenda-today"],
        queryFn: getActiveAppointmentsGrouped,
        staleTime: 1000 * 60 * 2,
    })

    const { todaysAppointments, totalToday } = useMemo(() => {
        if (!data) return { todaysAppointments: [], totalToday: 0 }

        const todayAppointments = Object.values(data.grouped)
            .flat()
            .filter(
                (app) =>
                    app.scheduledAt &&
                    isToday(parseISO(app.scheduledAt)) &&
                    app.status !== AppointmentStatus.CANCELED,
            )
            .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())

        return {
            todaysAppointments: todayAppointments.slice(0, MAX_ITEMS),
            totalToday: todayAppointments.length,
        }
    }, [data])

    const handleStartSession = (appointmentId: string) => {
        navigate("/video-room", { state: { appointmentId } })
    }

    return (
        <div className="relative group overflow-hidden rounded-[2rem] border border-zinc-200 bg-white p-1 shadow-xl shadow-zinc-200/50">
            {/* Background Texture & Effects - Suavizados para tema claro */}
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-100/50 blur-[100px] rounded-full" />

            <div className="relative bg-white/40 backdrop-blur-xl rounded-[1.8rem] p-6 h-full flex flex-col">
                {/* Header: Editorial Style (Cores Escuras) */}
                <header className="flex justify-between items-end mb-8 px-2">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-blue-600 mb-2">
                            <Calendar className="size-4" />
                            <span className="text-[10px] font-bold tracking-[0.3em] uppercase">Status do Dia</span>
                        </div>
                        <h2 className="text-3xl font-light tracking-tight text-zinc-900 italic">
                            Agenda <span className="font-serif font-normal not-italic text-blue-600">Hoje</span>
                        </h2>
                    </div>
                    <div className="text-right">
                        <span className="text-4xl font-serif text-zinc-900 leading-none">{totalToday}</span>
                        <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Sessões</p>
                    </div>
                </header>

                <div className="flex-1 space-y-4">
                    {isLoading ? (
                        <div className="flex h-64 items-center justify-center">
                            <Loader2 className="size-8 animate-spin text-zinc-300" />
                        </div>
                    ) : todaysAppointments.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                            <div className="size-12 rounded-full border border-zinc-100 bg-zinc-50 flex items-center justify-center">
                                <Calendar className="size-5 text-zinc-300" />
                            </div>
                            <p className="text-zinc-400 font-serif italic">Nenhum compromisso agendado.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <AnimatePresence mode="popLayout">
                                {todaysAppointments.map((app, index) => (
                                    <motion.div
                                        key={app.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1, ease: "circOut" }}
                                        className="relative group/item"
                                    >
                                        <div className="relative flex items-center justify-between p-4 rounded-2xl bg-zinc-50/50 border border-zinc-100 hover:border-blue-200 transition-all duration-500 hover:bg-white hover:shadow-sm">
                                            <div className="flex items-center gap-5">
                                                {/* Time Display */}
                                                <div className="flex flex-col items-center border-r border-zinc-200 pr-5">
                                                    <span className="text-lg font-medium text-zinc-900 tabular-nums leading-none">
                                                        {format(parseISO(app.scheduledAt), "HH:mm")}
                                                    </span>
                                                    <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-tighter">Horário</span>
                                                </div>

                                                <div className="space-y-1">
                                                    <p className="text-sm font-semibold text-zinc-800 group-hover/item:text-blue-600 transition-colors">
                                                        {app.patientName || "Paciente Anônimo"}
                                                    </p>
                                                    <div className="flex gap-2">
                                                        <Badge className="bg-white text-[9px] text-zinc-500 border-zinc-200 border px-2 py-0 h-4 uppercase tracking-widest font-bold">
                                                            {app.status}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Bar - Reveals on Hover */}
                                            <div className="flex gap-1 opacity-0 group-hover/item:opacity-100 transition-all duration-300 translate-x-4 group-hover/item:translate-x-0">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="cursor-pointer size-8 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all"
                                                    onClick={() => handleStartSession(app.id)}
                                                    disabled={app.status !== AppointmentStatus.SCHEDULED}
                                                >
                                                    <Video className="size-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="size-8 rounded-full bg-zinc-100 text-zinc-500 hover:bg-zinc-900 hover:text-white transition-all"
                                                    asChild
                                                >
                                                    <Link to={`/patients/${app.patientId}/details`}>
                                                        <FileText className="size-4" />
                                                    </Link>
                                                </Button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>

                {/* Footer Link */}
                <footer className="mt-8 pt-4 border-t border-zinc-100">
                    <Button variant="link" className="text-zinc-400 hover:text-blue-600 group/btn p-0 h-auto no-underline cursor-pointer">
                        <span className="text-xs uppercase tracking-[0.2em] font-black">Ver agenda completa</span>
                        <ArrowRight className="ml-2 size-3 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                </footer>
            </div>
        </div>
    )
}