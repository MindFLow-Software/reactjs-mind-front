"use client"

import { XCircle, Users, User } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { getPatientsWithAttachments } from "@/api/patient-with-attachment"
import { DatePickerWithRange } from "./date-picker-with-range"
import { type DateRange } from "react-day-picker"
import { PatientsSearchInput } from "../../components/patients-search-input"

interface AttachmentsTableFiltersProps {
    search: string
    onSearchChange: (value: string) => void
    patientId: string
    onPatientChange: (value: string) => void
    date: DateRange | undefined
    onDateChange: (date: DateRange | undefined) => void
    onClearFilters: () => void
}

export function AttachmentsTableFilters({
    search,
    onSearchChange,
    patientId,
    onPatientChange,
    date,
    onDateChange,
    onClearFilters
}: AttachmentsTableFiltersProps) {

    const { data: patients, isLoading } = useQuery({
        queryKey: ["patients-with-attachments"],
        queryFn: getPatientsWithAttachments,
        staleTime: 1000 * 60 * 5,
    })

    return (
        <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
            <div className="flex flex-col lg:flex-row gap-2 flex-1 lg:items-center">
                <PatientsSearchInput
                    placeholder="Buscar arquivo..."
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                />

                <Select value={patientId} onValueChange={onPatientChange}>
                    <SelectTrigger className="h-8 w-full lg:w-[250px] cursor-pointer text-left overflow-hidden">
                        <SelectValue placeholder={isLoading ? "Carregando..." : "Filtrar por paciente"} />
                    </SelectTrigger>

                    <SelectContent>
                        <SelectItem value="all" className="cursor-pointer py-2.5">
                            <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-slate-500" />
                                <span className="text-sm font-medium">Todos os Pacientes</span>
                            </div>
                        </SelectItem>

                        {patients?.map((patient) => (
                            <SelectItem key={patient.id} value={patient.id} className="cursor-pointer py-2.5 max-w-[400px]">
                                <div className="flex items-center gap-2 overflow-hidden">
                                    <User className="h-4 w-4 text-blue-500 shrink-0" />
                                    <span className="text-sm font-medium truncate">
                                        {patient.name}
                                    </span>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <DatePickerWithRange date={date} onDateChange={onDateChange} />

                {(search || (patientId && patientId !== "all") || date?.from) && (
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
