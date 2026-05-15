"use client"

import { XCircle, VenusAndMars, Mars, Venus, History, ClockArrowUp, ClockArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { PatientsSearchInput } from "../../components/patients-search-input"

interface PatientsRecordsTableFiltersProps {
    search: string
    onSearchChange: (value: string) => void
    gender: string
    onGenderChange: (value: string) => void
    sessionOrder: "high" | "low" | "all"
    onSessionOrderChange: (value: "high" | "low" | "all") => void
    onClearFilters: () => void
    isFetching?: boolean
}

export function PatientsRecordsTableFilters({
    search,
    onSearchChange,
    gender,
    onGenderChange,
    sessionOrder,
    onSessionOrderChange,
    onClearFilters,
}: PatientsRecordsTableFiltersProps) {

    const hasAnyFilter = search !== "" || gender !== "all" || sessionOrder !== "all"

    return (
        <div className="flex flex-col lg:flex-row gap-2 lg:items-center w-full overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            <div className="flex flex-col lg:flex-row gap-2 items-start lg:items-center min-w-max lg:min-w-0">

                <PatientsSearchInput
                    placeholder="Buscar por Nome"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    wrapperClassName="w-full lg:w-[300px]"
                />

                <div className="flex flex-row gap-2 items-center">
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

                    {/* Sessões */}
                    <Select value={sessionOrder} onValueChange={(v) => onSessionOrderChange(v as "high" | "low" | "all")}>
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
