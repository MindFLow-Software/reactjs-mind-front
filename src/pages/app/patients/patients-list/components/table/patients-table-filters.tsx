import { Loader2, Search, SlidersHorizontal, X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { usePatientFilters } from '@/hooks/use-patient-filters'
import { cn } from '@/lib/utils'
import type { StatusPillOption } from '../../patients-list.types'
import '../../patients-list.css'

interface PatientsTableFiltersProps {
  isFetching?: boolean
}

const STATUS_PILLS: readonly StatusPillOption[] = [
  { value: null,      label: 'Todos',      dot: null,             activeCls: 'border border-blue-500 bg-background text-foreground'                                                    },
  { value: 'ACTIVE',  label: 'Ativos',     dot: 'bg-emerald-500', activeCls: 'border border-emerald-500 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
  { value: 'BLOCKED', label: 'Arquivados', dot: 'bg-red-500',     activeCls: 'border border-red-500 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'                     },
]

export function PatientsTableFilters({ isFetching }: PatientsTableFiltersProps) {
  const { filters, setFilters, clearFilters } = usePatientFilters()
  const isFirstRender = useRef(true)
  const setFiltersRef = useRef(setFilters)
  setFiltersRef.current = setFilters

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
      setFiltersRef.current({ filter: watchedFilter })
    }, 400)

    return () => clearTimeout(timeout)
  }, [watchedFilter, filters.filter])

  function handleClearSearch() {
    setValue('filter', '')
    setFilters({ filter: '' })
  }

  function handleClearAll() {
    clearFilters()
    setValue('filter', '')
  }

  const hasFilters = !!filters.filter || filters.status !== null

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="ptf-search-wrapper">
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

      <div className="ptf-status-pills">
        {STATUS_PILLS.map((pill) => {
          const isActive = filters.status === pill.value
          return (
            <button
              key={pill.value ?? 'all'}
              type="button"
              onClick={() => setFilters({ status: pill.value })}
              className={cn(
                'ptf-pill',
                isActive ? pill.activeCls : 'ptf-pill--inactive',
              )}
            >
              {pill.dot && (
                <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', pill.dot)} />
              )}
              {pill.label}
            </button>
          )
        })}
      </div>

      <div className="ptf-right-actions">
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
          disabled
          className="h-8 gap-1.5 text-xs opacity-50 cursor-not-allowed"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Filtros avançados
        </Button>
      </div>
    </div>
  )
}
