"use client"

import { Search, Filter, Users, CheckCircle2, XCircle, VenusAndMars, Mars, Venus, Phone, ArrowDownWideNarrow, ArrowUpNarrowWide } from "lucide-react"
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
    onClearFilters,
}: PatientsRecordsTableFiltersProps) {

    const hasAnyFilter = search !== "" || status !== "all" || gender !== "all" || order !== "all"

    return (
        <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
            <div className="flex flex-col lg:flex-row gap-2 flex-1 lg:items-center">
                <div className="relative w-full lg:w-auto">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                        placeholder="Buscar por Nome"
                        className="h-8 w-full lg:w-[320px] pl-9 bg-background"
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>

                <Select value={status} onValueChange={onStatusChange}>
                    <SelectTrigger
                        className="cursor-pointer h-9 min-w-[180px] w-auto bg-background
                        border-muted-foreground/20 hover:border-primary/30 transition-all
                        shadow-sm px-3"
                    >
                        <div className="flex items-center gap-2 whitespace-nowrap">
                            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                            <SelectValue placeholder="Status" />
                        </div>
                    </SelectTrigger>

                    <SelectContent className="min-w-[220px]">
                        <SelectItem value="all" className="cursor-pointer py-2.5">
                            <div className="flex items-center gap-2 whitespace-nowrap">
                                <Users className="h-4 w-4 text-slate-500" />
                                <span className="text-sm font-medium">Todos os Pacientes</span>
                            </div>
                        </SelectItem>
                        <SelectItem value="active" className="cursor-pointer py-2.5">
                            <div className="flex items-center gap-2 whitespace-nowrap">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                <span className="text-sm font-medium">Pacientes Ativos</span>
                            </div>
                        </SelectItem>
                        <SelectItem value="inactive" className="cursor-pointer py-2.5">
                            <div className="flex items-center gap-2 whitespace-nowrap">
                                <XCircle className="h-4 w-4 text-rose-500" />
                                <span className="text-sm font-medium">Pacientes Inativos</span>
                            </div>
                        </SelectItem>
                    </SelectContent>
                </Select>

                <Select value={gender} onValueChange={onGenderChange}>
                    <SelectTrigger
                        className="cursor-pointer h-9 min-w-[180px] w-auto bg-background
                        border-muted-foreground/20 hover:border-primary/30 transition-all
                        shadow-sm px-3"
                    >
                        <div className="flex items-center gap-2 whitespace-nowrap">
                            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                            <SelectValue placeholder="Gênero" />
                        </div>
                    </SelectTrigger>

                    <SelectContent className="min-w-[220px]">
                        <SelectItem value="all" className="cursor-pointer py-2.5">
                            <div className="flex items-center gap-2 whitespace-nowrap">
                                <VenusAndMars className="h-4 w-4 text-slate-500" />
                                <span className="text-sm font-medium">Todos os Gêneros</span>
                            </div>
                        </SelectItem>
                        <SelectItem value="MASCULINE" className="cursor-pointer py-2.5">
                            <div className="flex items-center gap-2 whitespace-nowrap">
                                <Mars className="h-4 w-4 text-blue-500" />
                                <span className="text-sm font-medium">Masculinos</span>
                            </div>
                        </SelectItem>
                        <SelectItem value="FEMININE" className="cursor-pointer py-2.5">
                            <div className="flex items-center gap-2 whitespace-nowrap">
                                <Venus className="h-4 w-4 text-rose-500" />
                                <span className="text-sm font-medium">Feminino</span>
                            </div>
                        </SelectItem>
                    </SelectContent>
                </Select>

                <Select value={order} onValueChange={onOrderChange}>
                    <SelectTrigger
                        className="cursor-pointer h-9 min-w-[180px] w-auto bg-background
                        border-muted-foreground/20 hover:border-primary/30 transition-all
                        shadow-sm px-3"
                    >
                        <div className="flex items-center gap-2 whitespace-nowrap">
                            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                            <SelectValue placeholder="Ordenação" />
                        </div>
                    </SelectTrigger>

                    <SelectContent className="min-w-[220px]">
                        <SelectItem value="all" className="cursor-pointer py-2.5">
                            <div className="flex items-center gap-2 whitespace-nowrap">
                                <Phone className="h-4 w-4 text-slate-500" />
                                <span className="text-sm font-medium">Todos Atendimentos</span>
                            </div>
                        </SelectItem>
                        <SelectItem value="asc" className="cursor-pointer py-2.5">
                            <div className="flex items-center gap-2 whitespace-nowrap">
                                <ArrowDownWideNarrow className="h-4 w-4 text-emerald-500" />
                                <span className="text-sm font-medium">Atendimentos Antigos</span>
                            </div>
                        </SelectItem>
                        <SelectItem value="desc" className="cursor-pointer py-2.5">
                            <div className="flex items-center gap-2 whitespace-nowrap">
                                <ArrowUpNarrowWide className="h-4 w-4 text-rose-500" />
                                <span className="text-sm font-medium">Atendimentos Recentes</span>
                            </div>
                        </SelectItem>
                    </SelectContent>
                </Select>

                {hasAnyFilter && (
                    <Button
                        variant="ghost"
                        size="sm"
                        type="button"
                        onClick={onClearFilters}
                        className="cursor-pointer h-8 px-2 lg:px-3 text-muted-foreground hover:text-destructive gap-2 transition-colors"
                    >
                        <XCircle className="h-4 w-4" />
                        Limpar filtros
                    </Button>
                )}
            </div>
        </div>
    )
}