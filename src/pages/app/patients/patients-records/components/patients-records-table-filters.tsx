"use client"

import { Search, Users, CheckCircle2, XCircle, VenusAndMars, Mars, Venus, History, ArrowDownWideNarrow, ArrowUpNarrowWide, CalendarDays, ClockArrowUp, ClockArrowDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface PatientsRecordsTableFiltersProps {
    search: string
    onSearchChange: (value: string) => void
    status: string
    onStatusChange: (value: string) => void
    gender: string
    onGenderChange: (value: string) => void
    order: string
    onOrderChange: (value: string) => void
    sessionVolume: string
    onSessionVolumeChange: (value: string) => void
    onClearFilters: () => void
    isFetching?: boolean
}

export function PatientsRecordsTableFilters({
    search,
    onSearchChange,
    status,
    onStatusChange,
    gender,
    onGenderChange,
    order,
    onOrderChange,
    sessionVolume,
    onSessionVolumeChange,
    onClearFilters,
}: PatientsRecordsTableFiltersProps) {

    const hasAnyFilter = search !== "" || status !== "all" || gender !== "all" || order !== "all" || sessionVolume !== "all"

    return (
        <div className="flex flex-col lg:flex-row gap-2 lg:items-center w-full overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            <div className="flex flex-col lg:flex-row gap-2 items-start lg:items-center min-w-max lg:min-w-0">

                <div className="relative w-full lg:w-[300px] shrink-0">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                        placeholder="Buscar por Nome"
                        className="h-8 w-full pl-9 bg-background focus-visible:ring-1"
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>

                <div className="flex flex-row gap-2 items-center">
                    {/* Status */}
                    <Select value={status} onValueChange={onStatusChange}>
                        <SelectTrigger className="cursor-pointer h-9 min-w-[150px] w-auto bg-background border-muted-foreground/20 hover:border-primary/30 transition-all shadow-sm px-3 text-sm font-medium">
                            <div className="flex items-center gap-2 whitespace-nowrap">
                                <SelectValue placeholder="Status" />
                            </div>
                        </SelectTrigger>
                        <SelectContent className="min-w-[200px]">
                            <SelectItem value="all" className="cursor-pointer py-2.5">
                                <div className="flex items-center gap-2 whitespace-nowrap"><Users className="h-4 w-4 text-slate-500" /><span>Todos Status</span></div>
                            </SelectItem>
                            <SelectItem value="active" className="cursor-pointer py-2.5">
                                <div className="flex items-center gap-2 whitespace-nowrap"><CheckCircle2 className="h-4 w-4 text-emerald-500" /><span>Ativos</span></div>
                            </SelectItem>
                            <SelectItem value="inactive" className="cursor-pointer py-2.5">
                                <div className="flex items-center gap-2 whitespace-nowrap"><XCircle className="h-4 w-4 text-rose-500" /><span>Inativos</span></div>
                            </SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Gênero */}
                    <Select value={gender} onValueChange={onGenderChange}>
                        <SelectTrigger className="cursor-pointer h-9 min-w-[150px] w-auto bg-background border-muted-foreground/20 hover:border-primary/30 transition-all shadow-sm px-3 text-sm font-medium">
                            <div className="flex items-center gap-2 whitespace-nowrap">
                                <SelectValue placeholder="Gênero" />
                            </div>
                        </SelectTrigger>
                        <SelectContent className="min-w-[200px]">
                            <SelectItem value="all" className="cursor-pointer py-2.5">
                                <div className="flex items-center gap-2 whitespace-nowrap"><VenusAndMars className="h-4 w-4 text-slate-500" /><span>Todos Gêneros</span></div>
                            </SelectItem>
                            <SelectItem value="MASCULINE" className="cursor-pointer py-2.5">
                                <div className="flex items-center gap-2 whitespace-nowrap"><Mars className="h-4 w-4 text-blue-500" /><span>Masculinos</span></div>
                            </SelectItem>
                            <SelectItem value="FEMININE" className="cursor-pointer py-2.5">
                                <div className="flex items-center gap-2 whitespace-nowrap"><Venus className="h-4 w-4 text-rose-500" /><span>Femininos</span></div>
                            </SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Cadastro */}
                    <Select value={order} onValueChange={onOrderChange}>
                        <SelectTrigger className="cursor-pointer h-9 min-w-[150px] w-auto bg-background border-muted-foreground/20 hover:border-primary/30 transition-all shadow-sm px-3 text-sm font-medium">
                            <div className="flex items-center gap-2 whitespace-nowrap">
                                <SelectValue placeholder="Cadastro" />
                            </div>
                        </SelectTrigger>
                        <SelectContent className="min-w-[200px]">
                            <SelectItem value="all" className="cursor-pointer py-2.5">
                                <div className="flex items-center gap-2 whitespace-nowrap"><CalendarDays className="h-4 w-4 text-slate-500" /><span>Data Cadastro</span></div>
                            </SelectItem>
                            <SelectItem value="desc" className="cursor-pointer py-2.5">
                                <div className="flex items-center gap-2 whitespace-nowrap"><ArrowUpNarrowWide className="h-4 w-4 text-emerald-500" /><span>Mais Recentes</span></div>
                            </SelectItem>
                            <SelectItem value="asc" className="cursor-pointer py-2.5">
                                <div className="flex items-center gap-2 whitespace-nowrap"><ArrowDownWideNarrow className="h-4 w-4 text-rose-500" /><span>Mais Antigos</span></div>
                            </SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Sessões */}
                    <Select value={sessionVolume} onValueChange={onSessionVolumeChange}>
                        <SelectTrigger className="cursor-pointer h-9 min-w-[150px] w-auto bg-background border-muted-foreground/20 hover:border-primary/30 transition-all shadow-sm px-3 text-sm font-medium">
                            <div className="flex items-center gap-2 whitespace-nowrap">
                                <SelectValue placeholder="Sessões" />
                            </div>
                        </SelectTrigger>
                        <SelectContent className="min-w-[200px]">
                            <SelectItem value="all" className="cursor-pointer py-2.5">
                                <div className="flex items-center gap-2 whitespace-nowrap"><History className="h-4 w-4 text-slate-500" /><span>Total Sessões</span></div>
                            </SelectItem>
                            <SelectItem value="high" className="cursor-pointer py-2.5">
                                <div className="flex items-center gap-2 whitespace-nowrap"><ClockArrowUp className="h-4 w-4 text-emerald-500" /><span>Mais Sessões</span></div>
                            </SelectItem>
                            <SelectItem value="low" className="cursor-pointer py-2.5">
                                <div className="flex items-center gap-2 whitespace-nowrap"><ClockArrowDown className="h-4 w-4 text-rose-500" /><span>Menos Sessões</span></div>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Botão Limpar */}
                {hasAnyFilter && (
                    <Button
                        variant="ghost"
                        size="sm"
                        type="button"
                        onClick={onClearFilters}
                        className="cursor-pointer h-8 px-2 text-muted-foreground hover:text-destructive gap-2 transition-colors font-bold text-xs uppercase shrink-0"
                    >
                        <XCircle className="h-4 w-4" />
                        Limpar
                    </Button>
                )}
            </div>
        </div>
    )
}