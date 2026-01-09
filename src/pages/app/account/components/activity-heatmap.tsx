"use client"

import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import {
    format,
    startOfToday,
    eachDayOfInterval,
    isSameDay,
    startOfWeek,
    endOfWeek,
    startOfYear,
    endOfYear,
    getYear,
    isAfter,
    isBefore,
    startOfDay,
} from "date-fns"
import { ptBR } from "date-fns/locale"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { getDailySessionsMetrics, type DailySessionMetric } from "@/api/get-daily-sessions-metrics"
import { getProfile } from "@/api/get-profile"

export function ActivityHeatmap() {
    const today = startOfToday()
    const currentYear = getYear(today)

    const [selectedYear, setSelectedYear] = useState(currentYear)
    const [hoveredDay, setHoveredDay] = useState<{ day: DailySessionMetric; x: number; y: number } | null>(null)

    const { data: profile } = useQuery({
        queryKey: ["psychologist-profile"],
        queryFn: getProfile,
    })

    // Garante que o intervalo seja SEMPRE o ano inteiro (Jan a Dez)
    const dateRange = useMemo(() => {
        const firstDay = startOfYear(new Date(selectedYear, 0, 1))
        const lastDay = endOfYear(new Date(selectedYear, 0, 1))
        return {
            start: startOfWeek(firstDay), // Começa no domingo da primeira semana
            end: endOfWeek(lastDay),     // Termina no sábado da última semana
            apiStart: firstDay.toISOString(),
            apiEnd: lastDay.toISOString(),
        }
    }, [selectedYear])

    const { data: serverData, isLoading } = useQuery({
        queryKey: ["appointment-metrics-heatmap", selectedYear],
        queryFn: () => getDailySessionsMetrics(dateRange.apiStart, dateRange.apiEnd),
    })

    const availableYears = useMemo(() => {
        if (!profile?.createdAt) return [currentYear]
        const creationYear = getYear(new Date(profile.createdAt))
        const years = []
        for (let y = currentYear; y >= creationYear; y--) {
            years.push(y)
        }
        return years
    }, [profile?.createdAt, currentYear])

    const { weeks, months } = useMemo(() => {
        const allDays = eachDayOfInterval({ start: dateRange.start, end: dateRange.end })
        const weeksArray: DailySessionMetric[][] = []
        const monthsArray: { name: string; colStart: number }[] = []

        let currentWeek: DailySessionMetric[] = []
        let lastMonth = -1

        allDays.forEach((date) => {
            const metric = serverData?.find((d) => isSameDay(new Date(d.date), date))
            const dayData: DailySessionMetric = {
                date: date.toISOString(),
                count: metric?.count || 0,
            }

            // Marcar posição dos meses
            if (date.getMonth() !== lastMonth && getYear(date) === selectedYear) {
                monthsArray.push({
                    name: format(date, "MMM", { locale: ptBR }),
                    colStart: weeksArray.length,
                })
                lastMonth = date.getMonth()
            }

            currentWeek.push(dayData)

            if (date.getDay() === 6) {
                weeksArray.push(currentWeek)
                currentWeek = []
            }
        })

        return { weeks: weeksArray, months: monthsArray }
    }, [serverData, dateRange, selectedYear])

    const getColor = (count: number, dateStr: string) => {
        const date = new Date(dateStr)
        const isFuture = isAfter(date, today)
        const isOutsideSelectedYear = getYear(date) !== selectedYear
        const isBeforeCreation = profile?.createdAt && isBefore(date, startOfDay(new Date(profile.createdAt)))

        if (isFuture || isOutsideSelectedYear || isBeforeCreation) return "bg-slate-100/50 dark:bg-slate-800/20"
        if (count === 0) return "bg-slate-100 dark:bg-slate-800"

        // Escala de azul conforme o seu print
        if (count <= 2) return "bg-blue-200 dark:bg-blue-900/40"
        if (count <= 4) return "bg-blue-400 dark:bg-blue-700/60"
        if (count <= 6) return "bg-blue-500"
        return "bg-blue-600"
    }

    if (isLoading) return <Skeleton className="h-[220px] w-full rounded-xl" />

    return (
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm w-full">
            <div className="flex flex-col gap-8">
                {/* Header: Título e Seletor de Ano */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-1">
                        <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-muted-foreground/70">
                            Atividade de Sessões
                        </h3>
                        <p className="text-xs text-muted-foreground font-medium">
                            Frequência diária de atendimentos no ano de {selectedYear}
                        </p>
                    </div>

                    <div className="flex bg-muted/40 p-1 rounded-lg border border-border/50">
                        {availableYears.map((year) => (
                            <button
                                key={year}
                                onClick={() => setSelectedYear(year)}
                                className={cn(
                                    "px-4 py-1.5 text-[11px] font-bold rounded-md transition-all duration-200 uppercase tracking-tighter cursor-pointer",
                                    selectedYear === year
                                        ? "bg-white text-blue-600 shadow-sm ring-1 ring-black/5 dark:bg-slate-950"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {year}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Heatmap Grid */}
                <div className="w-full overflow-hidden">
                    <div className="overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-muted-foreground/10 scrollbar-track-transparent">
                        <div className="min-w-max flex flex-col gap-2">
                            {/* Meses */}
                            <div className="flex h-5 relative ml-8">
                                {months.map((month, i) => (
                                    <span
                                        key={i}
                                        className="text-[10px] absolute font-bold text-muted-foreground/40 uppercase tracking-widest select-none"
                                        style={{ left: `${month.colStart * 15}px` }}
                                    >
                                        {month.name}
                                    </span>
                                ))}
                            </div>

                            <div className="flex gap-4">
                                {/* Dias da Semana */}
                                <div className="flex flex-col gap-[5px] text-[9px] font-bold text-muted-foreground/20 w-6 pt-[2px] select-none uppercase">
                                    <div className="h-[11px]">Dom</div>
                                    <div className="h-[11px]" />
                                    <div className="h-[11px]">Ter</div>
                                    <div className="h-[11px]" />
                                    <div className="h-[11px]">Qui</div>
                                    <div className="h-[11px]" />
                                    <div className="h-[11px]">Sáb</div>
                                </div>

                                {/* Grid de Células */}
                                <div className="flex gap-[5px]">
                                    {weeks.map((week, weekIndex) => (
                                        <div key={weekIndex} className="flex flex-col gap-[5px]">
                                            {week.map((day, dayIndex) => {
                                                const date = new Date(day.date)
                                                const isInactive = isAfter(date, today) || getYear(date) !== selectedYear

                                                return (
                                                    <div
                                                        key={dayIndex}
                                                        className={cn(
                                                            "w-[11px] h-[11px] rounded-[2px] transition-colors shrink-0",
                                                            getColor(day.count, day.date),
                                                            !isInactive && "cursor-crosshair hover:outline-2 hover:outline-blue-500/50 hover:outline-offset-1"
                                                        )}
                                                        onMouseEnter={(e) => {
                                                            if (isInactive) return
                                                            const rect = e.currentTarget.getBoundingClientRect()
                                                            setHoveredDay({
                                                                day,
                                                                x: rect.left + rect.width / 2,
                                                                y: rect.top
                                                            })
                                                        }}
                                                        onMouseLeave={() => setHoveredDay(null)}
                                                    />
                                                )
                                            })}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer: Legenda */}
                <div className="flex items-center justify-between pt-4 border-t border-border/40">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-muted-foreground/30 uppercase tracking-tighter">Menos</span>
                            <div className="flex gap-1">
                                {[0, 2, 4, 6, 8].map((v) => (
                                    <div key={v} className={cn("w-2.5 h-2.5 rounded-[2px]", getColor(v, today.toISOString()))} />
                                ))}
                            </div>
                            <span className="text-[10px] font-bold text-muted-foreground/30 uppercase tracking-tighter">Mais</span>
                        </div>
                    </div>
                    <p className="text-[10px] font-medium text-muted-foreground/30 italic uppercase tracking-tighter">
                        * Dados sincronizados em tempo real
                    </p>
                </div>
            </div>

            {/* Tooltip (Fixed Portal Style) */}
            {hoveredDay && (
                <div
                    className="fixed z-50 pointer-events-none transition-transform duration-75"
                    style={{
                        left: hoveredDay.x,
                        top: hoveredDay.y - 12,
                        transform: "translate(-50%, -100%)",
                    }}
                >
                    <div className="bg-slate-950/90 dark:bg-slate-50/95 backdrop-blur-md text-white dark:text-slate-950 px-3 py-2 rounded-lg shadow-2xl border border-white/10 animate-in fade-in zoom-in-95 duration-100">
                        <p className="text-[11px] font-bold whitespace-nowrap leading-none mb-1">
                            {hoveredDay.day.count} {hoveredDay.day.count === 1 ? "sessão" : "sessões"}
                        </p>
                        <p className="text-[10px] opacity-60 capitalize whitespace-nowrap leading-none font-medium">
                            {format(new Date(hoveredDay.day.date), "EEEE, d 'de' MMMM", { locale: ptBR })}
                        </p>
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-slate-950/90 dark:bg-slate-50/95 rotate-45 border-r border-b border-white/10" />
                    </div>
                </div>
            )}
        </div>
    )
}