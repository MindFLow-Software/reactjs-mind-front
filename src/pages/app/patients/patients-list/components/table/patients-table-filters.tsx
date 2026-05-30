import { Loader2, Search, SlidersHorizontal, X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { usePatientFilters } from '@/hooks/use-patient-filters'
import { cn } from '@/lib/utils'

interface PatientsTableFiltersProps {
  isFetching?: boolean
}

const STATUS_PILLS = [
  { value: 'all',      label: 'Todos',    dot: null,             activeCls: 'border border-blue-500 bg-background text-foreground'                                                                  },
  { value: 'active',   label: 'Ativos',   dot: 'bg-emerald-500', activeCls: 'border border-emerald-500 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'               },
  { value: 'inactive', label: 'Arquivados', dot: 'bg-red-500',   activeCls: 'border border-red-500 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'                                   },
] as const

export function PatientsTableFilters({
  isFetching,
}: PatientsTableFiltersProps) {
  const { filters, setFilters, clearFilters } = usePatientFilters()
  const isFirstRender = useRef(true)

  const { register, watch, setValue } = useForm({
    values: { filter: filters.filter },
  })

  const watchedFilter = watch('filter')

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    if (watchedFilter === filters.filter) return

    const timeout = setTimeout(() => {
      setFilters({ filter: watchedFilter })
    }, 400)

    return () => clearTimeout(timeout)
  }, [watchedFilter, filters.filter, setFilters])

  function handleClearSearch() {
    setValue('filter', '')
    setFilters({ filter: '' })
  }

  function handleClearAll() {
    clearFilters()
    setValue('filter', '')
  }

  const hasFilters = !!filters.filter || filters.status !== 'all'
  const activeStatus = filters.status ?? 'all'

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Search */}
      <div className="relative w-90 shrink-0">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
          {isFetching ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </span>
        <Input
          {...register('filter')}
          placeholder="Buscar por nome, CPF, e-mail ou telefone"
          autoComplete="off"
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

      {/* Status pills */}
      <div className="flex items-center gap-1">
        {STATUS_PILLS.map((pill) => {
          const isActive = activeStatus === pill.value
          return (
            <button
              key={pill.value}
              type="button"
              onClick={() => setFilters({ status: pill.value })}
              className={cn(
                "flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium transition-colors cursor-pointer",
                isActive
                  ? pill.activeCls
                  : "bg-muted text-muted-foreground hover:bg-muted/70 hover:text-foreground",
              )}
            >
              {pill.dot && (
                <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", pill.dot)} />
              )}
              {pill.label}
            </button>
          )
        })}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 ml-auto">
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            className="h-8 gap-1.5 text-muted-foreground hover:text-destructive text-xs cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
            Limpar filtros
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 text-xs cursor-pointer"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Filtros avançados
        </Button>
      </div>
    </div>
  )
}
