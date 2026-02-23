"use client"

import { Search, Filter, Users, CheckCircle2, XCircle } from "lucide-react"
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
    onClearFilters: () => void
    isFetching?: boolean
}

export function PatientsRecordsTableFilters({
    search,
    onSearchChange,
    status,
    onStatusChange,
    onClearFilters,
    isFetching
}: PatientsRecordsTableFiltersProps) {
    return (
        <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
            <div className="flex flex-col lg:flex-row gap-2 flex-1 lg:items-center">
                <div className="relative w-full lg:w-auto">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                        placeholder="Buscar por CPF, Nome e Email"
                        className="h-8 w-full lg:w-[320px] pl-9 bg-background"
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                    {isFetching}
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

                {(search || status !== "all") && (
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