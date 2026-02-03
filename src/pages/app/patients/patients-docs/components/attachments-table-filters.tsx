"use client"

import { Search, XCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface AttachmentsTableFiltersProps {
    search: string
    onSearchChange: (value: string) => void
    onClearFilters: () => void
}

export function AttachmentsTableFilters({
    search,
    onSearchChange,
    onClearFilters
}: AttachmentsTableFiltersProps) {
    return (
        <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
            <div className="flex flex-col lg:flex-row gap-2 flex-1 lg:items-center">
                <div className="relative w-full lg:w-auto">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                        placeholder="Buscar por nome do arquivo ou paciente"
                        className="h-8 w-full lg:w-[320px] pl-9"
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>

                {search && (
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
