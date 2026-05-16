import { Loader2, Search, SlidersHorizontal, X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { usePatientFilters } from '@/hooks/use-patient-filters'

interface PatientsTableFiltersProps {
  totalCount: number
  isFetching?: boolean
}

export function PatientsTableFilters({
  totalCount,
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

  const hasFilters = !!filters.filter

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            {isFetching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </span>
          <Input
            {...register('filter')}
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

        <span className="text-xs text-muted-foreground tabular-nums hidden sm:block">
          {totalCount} paciente{totalCount !== 1 ? 's' : ''}
        </span>

        <div className="flex items-center gap-2 sm:ml-auto">
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
    </div>
  )
}
