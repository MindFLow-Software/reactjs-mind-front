"use client"

import { Search, XCircle, Users, User } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { getPatientsWithAttachments } from "@/api/patient-with-attachment"

interface AttachmentsTableFiltersProps {
    search: string
    onSearchChange: (value: string) => void
    patientId: string
    onPatientChange: (value: string) => void
    onClearFilters: () => void
}

export function AttachmentsTableFilters({
    search,
    onSearchChange,
    patientId,
    onPatientChange,
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
                <div className="relative w-full lg:w-auto">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                        placeholder="Buscar arquivo..."
                        className="h-8 w-full lg:w-[320px] pl-9"
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>

                <Select value={patientId} onValueChange={onPatientChange}>
                    {/* 🟢 Adicionado 'max-w' e 'text-left' para conter nomes gigantes no botão do Select */}
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
                                    {/* 🟢 'truncate' garante os pontinhos se o nome for longo demais */}
                                    <span className="text-sm font-medium truncate">
                                        {patient.name}
                                    </span>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {(search || (patientId && patientId !== "all")) && (
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