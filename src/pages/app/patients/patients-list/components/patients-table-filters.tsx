import { useEffect, useRef } from "react"
import { Search, X, SlidersHorizontal, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { usePatientFilters } from "@/hooks/use-patient-filters"

interface PatientsTableFiltersProps {
    totalCount: number
    activeCount: number
    inactiveCount: number
    isFetching?: boolean
}

type StatusTab = "all" | "active" | "inactive"

const TABS: { value: StatusTab; label: string; dotClass: string }[] = [
    { value: "all",      label: "Todos",    dotClass: "" },
    { value: "active",   label: "Ativos",   dotClass: "bg-emerald-500" },
    { value: "inactive", label: "Inativos", dotClass: "bg-zinc-400" },
]

export function PatientsTableFilters({
    totalCount,
    activeCount,
    inactiveCount,
    isFetching,
}: PatientsTableFiltersProps) {
    const { filters, setFilters, clearFilters } = usePatientFilters()
    const isFirstRender = useRef(true)

    const { register, watch, setValue } = useForm({
        values: { filter: filters.filter },
    })

    const watchedFilter = watch("filter")

    useEffect(() => {
        if (isFirstRender.current) { isFirstRender.current = false; return }
        if (watchedFilter === filters.filter) return

        const timeout = setTimeout(() => {
            setFilters({ filter: watchedFilter })
        }, 400)

        return () => clearTimeout(timeout)
    }, [watchedFilter, filters.filter, setFilters])

    function handleClearSearch() {
        setValue("filter", "")
        setFilters({ filter: "" })
    }

    function handleClearAll() {
        clearFilters()
        setValue("filter", "")
    }

    const tabCount = (tab: StatusTab) => {
        if (tab === "all")      return totalCount
        if (tab === "active")   return activeCount
        return inactiveCount
    }

    const hasFilters = !!filters.filter || filters.status !== "all"

    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                {/* Search */}
                <div className="relative flex-1 max-w-sm">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                        {isFetching
                            ? <Loader2 className="h-4 w-4 animate-spin" />
                            : <Search className="h-4 w-4" />
                        }
                    </span>
                    <Input
                        {...register("filter")}
                        placeholder="Buscar por nome, CPF, e-mail ou telefone..."
                        className="pl-9 pr-8 h-9 text-sm"
                    />
                    {watchedFilter && (
                        <button
                            type="button"
                            onClick={handleClearSearch}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            aria-label="Limpar busca"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    )}
                </div>

                {/* Status tabs */}
                <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
                    {TABS.map((tab) => (
                        <button
                            key={tab.value}
                            type="button"
                            onClick={() => setFilters({ status: tab.value })}
                            className={cn(
                                "flex items-center gap-1.5 h-7 px-3 rounded-md text-xs font-medium transition-all cursor-pointer",
                                filters.status === tab.value
                                    ? "bg-background text-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {tab.dotClass && (
                                <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", tab.dotClass)} />
                            )}
                            {tab.label}
                            <span className={cn(
                                "text-[10px] font-semibold tabular-nums",
                                filters.status === tab.value ? "text-muted-foreground" : "text-muted-foreground/60"
                            )}>
                                {tabCount(tab.value)}
                            </span>
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-2 sm:ml-auto">
                    {hasFilters && (
                        <Button
                            variant="ghost" size="sm"
                            onClick={handleClearAll}
                            className="h-8 gap-1.5 text-muted-foreground hover:text-destructive text-xs"
                        >
                            <X className="h-3.5 w-3.5" />
                            Limpar filtros
                        </Button>
                    )}
                    <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs cursor-pointer">
                        <SlidersHorizontal className="h-3.5 w-3.5" />
                        Filtros avançados
                    </Button>
                </div>
            </div>
        </div>
    )
}
